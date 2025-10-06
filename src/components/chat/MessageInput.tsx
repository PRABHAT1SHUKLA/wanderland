'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPusherClient } from '@/lib/pusher'
import { EVENTS } from '@/lib/pusher'
import { FileUpload } from './FileUpload'
import { useUser } from '@clerk/nextjs'

interface MessageInputProps {
  roomId: string
}

export function MessageInput({ roomId }: MessageInputProps) {
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const router = useRouter()
  const { user } = useUser()

  const handleTyping = () => {
    const pusher = getPusherClient()
    const channel = pusher.channel(`presence-room-${roomId}`)
    if (channel) {
      channel.trigger(EVENTS.USER_TYPING, {
        userId: user?.id,
        username: user?.emailAddresses[0]?.emailAddress || 'Anonymous',
      })
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || sending) return

    setSending(true)
    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId,
          content: message,
        }),
      })

      setMessage('')
      router.refresh()
    } catch (error) {
      console.error('Send message error:', error)
    } finally {
      setSending(false)
    }
  }

  return (
    <form onSubmit={handleSend} className="p-4 border-t bg-white">
      {/* TODO: Polish UI - add emoji picker, better input styling, send button animation */}
      <div className="flex gap-2 items-center">
        <FileUpload roomId={roomId} onUploadComplete={() => router.refresh()} />
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            handleTyping()
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={sending}
        />
        <button
          type="submit"
          disabled={!message.trim() || sending}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  )
}