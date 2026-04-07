import { redirect } from 'next/navigation'
import { getServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'
import { ConversationList } from '@/components/messages/ConversationList'

export default async function CustomerMessagesPage() {
  const session = await getServerSession()
  if (!session) redirect('/login')
  if (session.role !== 'CUSTOMER') redirect('/dashboard/' + session.role.toLowerCase())

  const conversations = await prisma.conversation.findMany({
    where: { job: { customerId: session.id } },
    orderBy: { updatedAt: 'desc' },
    include: {
      job: { select: { id: true, title: true } },
      worker: { select: { id: true, name: true } },
      messages: { orderBy: { createdAt: 'desc' }, take: 1 },
    },
  })

  const conversationIds = conversations.map(c => c.id)
  const unreadCounts = conversationIds.length > 0
    ? await prisma.message.groupBy({
        by: ['conversationId'],
        where: { conversationId: { in: conversationIds }, senderId: { not: session.id }, readAt: null },
        _count: true,
      })
    : []
  const unreadMap = new Map(unreadCounts.map(r => [r.conversationId, r._count]))

  const data = conversations.map(conv => ({
    id: conv.id,
    jobTitle: conv.job.title,
    otherPartyName: conv.worker.name,
    lastMessage: conv.messages[0]
      ? { body: conv.messages[0].body, createdAt: conv.messages[0].createdAt.toISOString(), isFromMe: conv.messages[0].senderId === session.id }
      : null,
    unreadCount: unreadMap.get(conv.id) ?? 0,
    updatedAt: conv.updatedAt.toISOString(),
  }))

  return (
    <div className="space-y-6">
      <div>
        <p className="mb-1 text-xs font-bold uppercase tracking-widest text-brand-500">Customer dashboard</p>
        <h1 className="text-2xl font-black tracking-tight text-earth-950 md:text-3xl">Messages</h1>
        <p className="mt-1.5 text-sm text-earth-500">Conversations with your hired workers.</p>
      </div>
      <ConversationList conversations={data} basePath="/dashboard/customer" />
    </div>
  )
}
