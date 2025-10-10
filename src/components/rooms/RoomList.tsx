'use client'

import Link from 'next/link'
import { Room } from '@/types'
import { formatTimestamp } from '@/lib/utils'

interface RoomListProps {
  rooms: Room[]
}

export function RoomList({ rooms }: RoomListProps) {
  if (rooms.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {/* TODO: Polish UI - add empty state illustration */}
        <p className="text-lg">No rooms yet. Create one to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* TODO: Polish UI - add hover effects, better cards, room previews */}
      {rooms.map((room) => (
        <Link
          key={room.id}
          href={`/chat/${room.id}`}
          className="p-6 border rounded-lg hover:border-blue-500 hover:shadow-lg transition-all"
        >
          <h3 className="text-xl font-semibold mb-2">{room.name}</h3>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{room.memberCount} member{room.memberCount !== 1 ? 's' : ''}</p>
            <p>Created {formatTimestamp(room.createdAt)}</p>
          </div>
        </Link>
      ))}
    </div>
  )
}