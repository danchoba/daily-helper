import { NextRequest, NextResponse } from 'next/server'
import { requireServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

// GET /api/messages/conversations — list all conversations for the current user
export async function GET(_req: NextRequest) {
  try {
    const session = await requireServerSession()

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { job: { customerId: session.id } },
          { workerId: session.id },
        ],
      },
      orderBy: { updatedAt: 'desc' },
      include: {
        job: { select: { id: true, title: true, customerId: true } },
        worker: { select: { id: true, name: true } },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    })

    const result = conversations.map(conv => {
      const lastMessage = conv.messages[0] ?? null
      const isWorker = session.id === conv.workerId
      const otherParty = isWorker
        ? { id: conv.job.customerId, name: '' } // name resolved below
        : { id: conv.workerId, name: conv.worker.name }

      return {
        id: conv.id,
        jobId: conv.jobId,
        jobTitle: conv.job.title,
        otherPartyId: isWorker ? conv.job.customerId : conv.workerId,
        otherPartyName: isWorker ? null : conv.worker.name, // customer name fetched separately
        isWorker,
        lastMessage: lastMessage
          ? {
              body: lastMessage.body,
              createdAt: lastMessage.createdAt,
              isFromMe: lastMessage.senderId === session.id,
            }
          : null,
        updatedAt: conv.updatedAt,
      }
    })

    // Fetch customer names for worker's conversations
    const customerIds = result.filter(c => c.isWorker).map(c => c.otherPartyId)
    if (customerIds.length > 0) {
      const customers = await prisma.user.findMany({
        where: { id: { in: customerIds } },
        select: { id: true, name: true },
      })
      const customerMap = new Map(customers.map(c => [c.id, c.name]))
      for (const conv of result) {
        if (conv.isWorker) conv.otherPartyName = customerMap.get(conv.otherPartyId) ?? null
      }
    }

    // Attach unread counts
    const unreadCounts = await prisma.message.groupBy({
      by: ['conversationId'],
      where: {
        conversationId: { in: result.map(c => c.id) },
        senderId: { not: session.id },
        readAt: null,
      },
      _count: true,
    })
    const unreadMap = new Map(unreadCounts.map(r => [r.conversationId, r._count]))

    return NextResponse.json(
      result.map(c => ({ ...c, unreadCount: unreadMap.get(c.id) ?? 0 }))
    )
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST /api/messages/conversations — create or fetch a conversation
export async function POST(req: NextRequest) {
  try {
    const session = await requireServerSession()
    const { jobId, workerId } = await req.json()

    if (!jobId || !workerId) {
      return NextResponse.json({ error: 'jobId and workerId are required' }, { status: 400 })
    }

    // Verify the application is SELECTED
    const application = await prisma.jobApplication.findUnique({
      where: { jobId_workerId: { jobId, workerId } },
    })
    if (!application || application.status !== 'SELECTED') {
      return NextResponse.json({ error: 'Messaging is only available for selected workers' }, { status: 403 })
    }

    // Verify the caller is a participant
    const job = await prisma.job.findUnique({ where: { id: jobId }, select: { customerId: true } })
    if (!job) return NextResponse.json({ error: 'Job not found' }, { status: 404 })
    if (session.id !== job.customerId && session.id !== workerId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const conversation = await prisma.conversation.upsert({
      where: { jobId_workerId: { jobId, workerId } },
      create: { jobId, workerId },
      update: {},
    })

    return NextResponse.json({ conversationId: conversation.id })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
