'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Loader2, Send } from 'lucide-react'

interface Message {
  id: string
  body: string
  senderId: string
  senderName: string
  isFromMe: boolean
  readAt: string | null
  createdAt: string
}

interface Props {
  conversationId: string
  initialMessages: Message[]
  otherPartyName: string
}

function timeLabel(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function MessageThread({ conversationId, initialMessages, otherPartyName }: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [body, setBody] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const knownIds = useRef(new Set(initialMessages.map(m => m.id)))

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  // Poll for new messages every 5 seconds
  const poll = useCallback(async () => {
    if (document.visibilityState !== 'visible') return
    try {
      const res = await fetch(`/api/messages/conversations/${conversationId}`)
      if (!res.ok) return
      const data = await res.json()
      const newMessages: Message[] = data.messages.filter((m: Message) => !knownIds.current.has(m.id))
      if (newMessages.length > 0) {
        newMessages.forEach(m => knownIds.current.add(m.id))
        setMessages(prev => [...prev, ...newMessages])
      }
    } catch {}
  }, [conversationId])

  useEffect(() => {
    const interval = setInterval(poll, 5_000)
    const onVisibility = () => { if (document.visibilityState === 'visible') poll() }
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [poll])

  async function sendMessage() {
    const trimmed = body.trim()
    if (!trimmed || sending) return

    // Optimistic insert
    const tempId = `temp-${Date.now()}`
    const optimistic: Message = {
      id: tempId,
      body: trimmed,
      senderId: 'me',
      senderName: 'You',
      isFromMe: true,
      readAt: null,
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, optimistic])
    setBody('')
    setSending(true)

    try {
      const res = await fetch(`/api/messages/conversations/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: trimmed }),
      })
      if (res.ok) {
        const real: Message = await res.json()
        knownIds.current.add(real.id)
        setMessages(prev => prev.map(m => m.id === tempId ? real : m))
      } else {
        // Remove optimistic message on failure
        setMessages(prev => prev.filter(m => m.id !== tempId))
        setBody(trimmed)
      }
    } catch {
      setMessages(prev => prev.filter(m => m.id !== tempId))
      setBody(trimmed)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      {/* Messages area */}
      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 && (
          <p className="py-8 text-center text-sm text-earth-400">
            No messages yet. Say hello to {otherPartyName}!
          </p>
        )}
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isFromMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] ${msg.isFromMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div
                className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.isFromMe
                    ? 'rounded-tr-sm bg-brand-600 text-white'
                    : 'rounded-tl-sm bg-earth-100 text-earth-900'
                }`}
              >
                {msg.body}
              </div>
              <span className="px-1 text-[10px] text-earth-400">{timeLabel(msg.createdAt)}</span>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="border-t border-earth-200 bg-white px-4 py-3">
        <div className="flex items-end gap-3">
          <textarea
            className="input min-h-[44px] flex-1 resize-none py-2.5 leading-snug"
            rows={1}
            placeholder={`Message ${otherPartyName}…`}
            value={body}
            onChange={e => setBody(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            maxLength={2000}
          />
          <button
            onClick={sendMessage}
            disabled={!body.trim() || sending}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white transition-colors hover:bg-brand-700 disabled:opacity-40"
            aria-label="Send message"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  )
}
