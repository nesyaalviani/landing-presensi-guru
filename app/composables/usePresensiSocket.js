// composables/usePresensiSocket.js
import { onMounted, onUnmounted } from 'vue'
import { useSocket } from './useSocket'

export function usePresensiSocket(handlers = {}) {
    const { connect, getSocket } = useSocket()

    onMounted(() => {
        const socket = connect()
        if (!socket) return

        socket.on('presensi:new', (payload) => {
            handlers.onNew?.(payload)
        })

        socket.on('presensi:resubmit', (payload) => {
            handlers.onResubmit?.(payload)
        })
    })

    onUnmounted(() => {
        const socket = getSocket()
        if (!socket) return
        socket.off('presensi:new')
        socket.off('presensi:resubmit')
    })
}