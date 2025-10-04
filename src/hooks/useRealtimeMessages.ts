'use client'

import { useEffect, useState } from 'react'
import { getPusherClient } from '@/lib/pusher'
import { Message, TypingUser, PresenceData } from '@/types'
import { EVENTS } from '@/lib/pusher'

export function useRealtimeMessages(roomId: string, initialMessages: Message[]) {
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([])
  const [onlineUsers, setOnlineUsers] = useState<PresenceData[]>([])

  useEffect(() => {
    const pusher = getPusherClient()
    const channel = pusher.subscribe(`presence-room-${roomId}`)

    // Listen for new messages
    channel.bind(EVENTS.NEW_MESSAGE, (message: Message) => {
      setMessages((prev) => [...prev, message])
    })

    // Listen for typing events
    channel.bind(EVENTS.USER_TYPING, (data: TypingUser) => {
      setTypingUsers((prev) => {
        const exists = prev.find((u) => u.userId === data.userId)
        if (exists) return prev
        return [...prev, data]
      })

      setTimeout(() => {
        setTypingUsers((prev) => prev.filter((u) => u.userId !== data.userId))
      }, 3000)
    })

    // Presence channel events
    channel.bind('pusher:subscription_succeeded', (members: any) => {
      const users: PresenceData[] = []
      members.each((member: any) => {
        users.push({
          userId: member.id,
          username: member.info.username,
        })
      })
      setOnlineUsers(users)
    })

    channel.bind('pusher:member_added', (member: any) => {
      setOnlineUsers((prev) => [
        ...prev,
        { userId: member.id, username: member.info.username },
      ])
    })

    channel.bind('pusher:member_removed', (member: any) => {
      setOnlineUsers((prev) => prev.filter((u) => u.userId !== member.id))
    })

    return () => {
      channel.unbind_all()
      channel.unsubscribe()
    }
  }, [roomId])

  return { messages, typingUsers, onlineUsers }
}