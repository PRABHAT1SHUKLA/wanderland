import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { redis, KEYS } from '@/lib/redis'
import { pusherServer, EVENTS } from '@/lib/pusher'
import { Message } from '@/types'
import { generateId } from '@/lib/utils'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const roomId = req.nextUrl.searchParams.get('roomId')
    if (!roomId) {
      return NextResponse.json({ error: 'Room ID is required' }, { status: 400 })
    }

    const messages = await redis.lrange<Message>(KEYS.roomMessages(roomId), 0, -1)
    return NextResponse.json(messages.reverse())
  } catch (error) {
    console.error('Get messages error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { roomId, content, fileUrl, fileName, fileType } = body

    if (!roomId || (!content && !fileUrl)) {
      return NextResponse.json({ error: 'Invalid message data' }, { status: 400 })
    }

    const message: Message = {
      id: generateId(),
      roomId,
      userId,
      username: (sessionClaims?.email as string) || 'Anonymous',
      content: content || '',
      fileUrl,
      fileName,
      fileType,
      timestamp: Date.now(),
    }

    // Save to Redis
    await redis.rpush(KEYS.roomMessages(roomId), message)
    
    // Keep only last 100 messages per room
    await redis.ltrim(KEYS.roomMessages(roomId), -100, -1)

    // Add user to room members
    await redis.sadd(KEYS.roomMembers(roomId), userId)

    // Trigger Pusher event
    await pusherServer.trigger(`presence-room-${roomId}`, EVENTS.NEW_MESSAGE, message)

    return NextResponse.json(message, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}