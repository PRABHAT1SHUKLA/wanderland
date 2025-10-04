export interface Message {
  id: string
  roomId: string
  userId: string
  username: string
  content: string
  fileUrl?: string
  fileName?: string
  fileType?: string
  timestamp: number
}

export interface Room {
  id: string
  name: string
  createdBy: string
  createdAt: number
  memberCount: number
}

export interface TypingUser {
  userId: string
  username: string
}

export interface PresenceData {
  userId: string
  username: string
}