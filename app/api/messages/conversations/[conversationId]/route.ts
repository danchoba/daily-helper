import { NextRequest, NextResponse } from 'next/server'
import { requireServerSession } from '@/lib/session'
import { prisma } from '@/lib/prisma'

const PAGE_SIZE = 40

async function getConversationAndAssertAccess(conversationId: string, sessionId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { job: { select: { id: true, title: true, status: true, customerId: true } } },
  })
  if (!conversation) return null
  const isParticipant =
    conversation.job.customerId === sessionId || conversation.workerId === sessionId
  if (!isParticipant) return null
  return conversation
}

// GET /api/messages/conversations/[conversationId]
// Returns messages and marks unread ones as read
export async function GET(req: NextRequest, { params }: { params: { conversationId: string } }) {
  try {
    const session = await requireServerSession()
    const conversation = await getConversationAndAssertAccess(params.conversationId, session.id)
    if (!conversation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const { searchParams } = new URL(req.url)
    const before = searchParams.get('before') // cursor: message id

    const [messages] = await Promise.all([
      prisma.message.findMany({
        where: {
          conversationId: params.conversationId,
          ...(before ? { createdAt: { lt: (await prisma.message.findUnique({ where: { id: before }, select: { createdAt: true } }))?.createdAt } } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: PAGE_SIZE + 1,
        include: { sender: { select: { id: true, name: true } } },
      }),
      // Mark unread messages from the other party as read
      prisma.message.updateMany({
        where: { conversationId: params.conversationId, senderId: { not: session.id }, readAt: null },
        data: { readAt: new Date() },
      }),
    ])

    const hasMore = messages.length > PAGE_SIZE
    const page = hasMore ? messages.slice(0, PAGE_SIZE) : messages

    const otherPartyId = session.id === conversation.workerId ? conversation.job.customerId : conversation.workerId
    const otherParty = await prisma.user.findUnique({ where: { id: otherPartyId }, select: { id: true, name: true } })

    return NextResponse.json({
      conversation: {
        id: conversation.id,
        jobId: conversation.jobId,
        jobTitle: conversation.job.title,
        jobStatus: conversation.job.status,
        otherParty,
      },
      messages: page.reverse().map(m => ({
        id: m.id,
        body: m.body,
        senderId: m.senderId,
        senderName: m.sender.name,
        isFromMe: m.senderId === session.id,
        readAt: m.readAt,
        createdAt: m.createdAt,
      })),
      hasMore,
    })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// POST /api/messages/conversations/[conversationId]
// Send a new message
export async function POST(req: NextRequest, { params }: { params: { conversationId: string } }) {
  try {
    const session = await requireServerSession()
    const conversation = await getConversationAndAssertAccess(params.conversationId, session.id)
    if (!conversation) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Ensure the job still allows messaging (application must still be SELECTED)
    const application = await prisma.jobApplication.findUnique({
      where: { jobId_workerId: { jobId: conversation.jobId, workerId: conversation.workerId } },
    })
    if (!application || application.status !== 'SELECTED') {
      return NextResponse.json({ error: 'Messaging is no longer available for this job' }, { status: 403 })
    }

    const { body } = await req.json()
    if (!body?.trim()) return NextResponse.json({ error: 'Message body is required' }, { status: 400 })
    if (body.trim().length > 2000) return NextResponse.json({ error: 'Message too long' }, { status: 400 })

    const [message] = await Promise.all([
      prisma.message.create({
        data: { conversationId: params.conversationId, senderId: session.id, body: body.trim() },
        include: { sender: { select: { id: true, name: true } } },
      }),
      prisma.conversation.update({ where: { id: params.conversationId }, data: { updatedAt: new Date() } }),
    ])

    return NextResponse.json({
      id: message.id,
      body: message.body,
      senderId: message.senderId,
      senderName: message.sender.name,
      isFromMe: true,
      readAt: null,
      createdAt: message.createdAt,
    }, { status: 201 })
  } catch (err: any) {
    if (err.message === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
