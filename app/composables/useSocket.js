// composables/useSocket.js
import { io } from 'socket.io-client'

let socket = null

export function useSocket() {
    const config = useRuntimeConfig()

    const connect = () => {
        if (socket?.connected) return socket

        const token = process.client ? localStorage.getItem('token') : null
        if (!token) return null

        socket = io(config.public.apiBase, {
            auth: { token },
            transports: ['websocket'],
            reconnectionAttempts: 5,
            reconnectionDelay: 3000,
        })

        socket.on('connect', () => {
            console.log('[Socket] connected:', socket.id)
        })

        socket.on('connect_error', (err) => {
            console.warn('[Socket] connect error:', err.message)
        })

        return socket
    }

    const disconnect = () => {
        socket?.disconnect()
        socket = null
    }

    const getSocket = () => socket

    return { connect, disconnect, getSocket }
}