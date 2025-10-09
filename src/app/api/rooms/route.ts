import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { redis, KEYS } from '@/lib/redis'
import { Room } from '@/types'
import { generateId } from '@/lib/utils'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const roomIds = await redis.smembers(KEYS.allRooms)
    const rooms: Room[] = []

    for (const roomId of roomIds) {
      const room = await redis.get<Room>(KEYS.room(roomId as string))
      if (room) {
        const memberCount = await redis.scard(KEYS.roomMembers(roomId as string))
        rooms.push({ ...room, memberCount })
      }
    }

    return NextResponse.json(rooms.sort((a, b) => b.createdAt - a.createdAt))
  } catch (error) {
    console.error('Get rooms error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await req.json()
    if (!name || name.trim().length === 0) {
      return NextResponse.json({ error: 'Room name is required' }, { status: 400 })
    }

    const roomId = generateId()
    const room: Room = {
      id: roomId,
      name: name.trim(),
      createdBy: userId,
      createdAt: Date.now(),
      memberCount: 0,
    }

    await redis.set(KEYS.room(roomId), room)
    await redis.sadd(KEYS.allRooms, roomId)
    await redis.sadd(KEYS.userRooms(userId), roomId)

    return NextResponse.json(room, { status: 201 })
  } catch (error) {
    console.error('Create room error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}