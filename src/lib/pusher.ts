import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Server-side Pusher 
export const pusherServer = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

// Client-side Pusher instance factory
export const getPusherClient = () => {
  return new PusherClient(process.env.NEXT_PUBLIC_PUSHER_APP_KEY!, {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    authEndpoint: '/api/pusher-auth',
  })
}


export const EVENTS = {
  NEW_MESSAGE: 'new-message',
  USER_TYPING: 'user-typing',
  USER_JOINED: 'user-joined',
  USER_LEFT: 'user-left',
}