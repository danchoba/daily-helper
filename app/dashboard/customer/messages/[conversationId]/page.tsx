import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { MessageThread } from '@/components/messages/MessageThread'

export default async function CustomerConversationPage({ params }: { params: { conversationId: string } }) {
  const session = await getServerSession()
  if (!session) redirect('/login')
  if (session.role !== 'CUSTOMER') redirect('/dashboard/' + session.role.toLowerCase())

  const conversation = await prisma.conversation.findUnique({
    where: { id: params.conversationId },
    include: {
      job: { select: { id: true, title: true, status: true, customerId: true } },
      worker: { select: { id: true, name: true } },
      messages: { orderBy: { createdAt: 'asc' }, include: { sender: { select: { id: true, name: true } } } },
    },
  })

  if (!conversation || conversation.job.customerId !== session.id) notFound()

  // Mark incoming messages as read
  await prisma.message.updateMany({
    where: { conversationId: params.conversationId, senderId: { not: session.id }, readAt: null },
    data: { readAt: new Date() },
  })

  const initialMessages = conversation.messages.map(m => ({
    id: m.id,
    body: m.body,
    senderId: m.senderId,
    senderName: m.sender.name,
    isFromMe: m.senderId === session.id,
    readAt: m.readAt?.toISOString() ?? null,
    createdAt: m.createdAt.toISOString(),
  }))

  return (
    <div className="flex h-[calc(100vh-10rem)] flex-col overflow-hidden rounded-2xl border border-earth-200 bg-white shadow-card">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-earth-200 px-4 py-3">
        <Link href="/dashboard/customer/messages" className="text-earth-400 hover:text-earth-700">
          <ChevronLeft size={20} />
        </Link>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-earth-900">{conversation.worker.name}</p>
          <p className="truncate text-xs text-earth-500">{conversation.job.title}</p>
        </div>
        <Link
          href={`/dashboard/customer/jobs/${conversation.jobId}`}
          className="shrink-0 text-xs font-semibold text-brand-600 hover:text-brand-700"
        >
          View job
        </Link>
      </div>

      <MessageThread
        conversationId={params.conversationId}
        initialMessages={initialMessages}
        otherPartyName={conversation.worker.name}
      />
    </div>
  )
}
