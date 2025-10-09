import { Redis } from '@upstash/redis'

if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
  throw new Error('Missing Upstash Redis environment variables')
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
})


export const KEYS = {
  room: (roomId: string) => `room:${roomId}`,
  roomMessages: (roomId: string) => `room:${roomId}:messages`,
  roomMembers: (roomId: string) => `room:${roomId}:members`,
  allRooms: 'rooms:all',
  userRooms: (userId: string) => `user:${userId}:rooms`,
}