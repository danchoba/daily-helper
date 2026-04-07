'use client'
import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

interface Conversation {
  id: string
  jobTitle: string
  otherPartyName: string | null
  lastMessage: { body: string; createdAt: string; isFromMe: boolean } | null
  unreadCount: number
  updatedAt: string
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export function ConversationList({
  conversations,
  basePath,
}: {
  conversations: Conversation[]
  basePath: string
}) {
  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-earth-200 bg-white py-16 text-center">
        <MessageSquare size={32} className="mb-3 text-earth-300" />
        <p className="text-sm font-semibold text-earth-700">No conversations yet</p>
        <p className="mt-1 text-xs text-earth-400">Messages appear here once a worker is selected for a job.</p>
      </div>
    )
  }

  return (
    <div className="divide-y divide-earth-100 overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-card">
      {conversations.map(conv => (
        <Link
          key={conv.id}
          href={`${basePath}/messages/${conv.id}`}
          className="flex items-start gap-4 px-5 py-4 transition-colors hover:bg-earth-50"
        >
          {/* Avatar */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-sm font-bold text-white">
            {(conv.otherPartyName ?? '?').charAt(0).toUpperCase()}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline justify-between gap-2">
              <p className="truncate text-sm font-bold text-earth-900">{conv.otherPartyName ?? '…'}</p>
              <span className="shrink-0 text-xs text-earth-400">
                {conv.lastMessage ? timeAgo(conv.lastMessage.createdAt) : timeAgo(conv.updatedAt)}
              </span>
            </div>
            <p className="truncate text-xs text-earth-500">{conv.jobTitle}</p>
            {conv.lastMessage && (
              <p className="mt-0.5 truncate text-xs text-earth-400">
                {conv.lastMessage.isFromMe ? 'You: ' : ''}{conv.lastMessage.body}
              </p>
            )}
          </div>

          {conv.unreadCount > 0 && (
            <span className="mt-1 flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 px-1 text-[10px] font-bold text-white">
              {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
            </span>
          )}
        </Link>
      ))}
    </div>
  )
}
