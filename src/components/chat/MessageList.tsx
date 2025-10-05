'use client'

import { useEffect, useRef } from 'react'
import { Message } from '@/types'
import { formatTimestamp, getFileType } from '@/lib/utils'
import Image from 'next/image'

interface MessageListProps {
  messages: Message[]
  currentUserId: string
}

export function MessageList({ messages, currentUserId }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* TODO: Polish UI - add message grouping, avatars, better file previews, reactions */}
      {messages.map((msg) => {
        const isOwn = msg.userId === currentUserId
        const fileType = msg.fileUrl ? getFileType(msg.fileName || '') : null

        return (
          <div
            key={msg.id}
            className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                isOwn
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-900'
              }`}
            >
              {!isOwn && (
                <p className="text-xs font-semibold mb-1">{msg.username}</p>
              )}
              
              {msg.fileUrl && fileType === 'image' && (
                <div className="mb-2">
                  <Image
                    src={msg.fileUrl}
                    alt={msg.fileName || 'Image'}
                    width={300}
                    height={200}
                    className="rounded"
                  />
                </div>
              )}

              {msg.fileUrl && fileType === 'video' && (
                <div className="mb-2">
                  <video controls className="rounded max-w-full">
                    <source src={msg.fileUrl} />
                  </video>
                </div>
              )}

              {msg.fileUrl && fileType === 'pdf' && (
                <div className="mb-2">
                  <a
                    href={msg.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    📄 {msg.fileName}
                  </a>
                </div>
              )}

              <p className="break-words">{msg.content}</p>
              <p className={`text-xs mt-1 ${isOwn ? 'text-blue-200' : 'text-gray-500'}`}>
                {formatTimestamp(msg.timestamp)}
              </p>
            </div>
          </div>
        )
      })}
      <div ref={bottomRef} />
    </div>
  )
}