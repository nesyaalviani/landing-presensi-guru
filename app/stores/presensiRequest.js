import { defineStore } from 'pinia'

export const usePresensiRequestStore = defineStore('presensiRequest', {
    state: () => ({
        requests: [],
        summary: { pending: 0, approved: 0, rejected: 0, total: 0 },
        myRequestMap: {},   // { "id_jadwal_tanggal": { id, status, alasan_reject, opened_at } }
        loading: false,
        error: null
    }),

    actions: {
        // ─── KM: kirim request ────────────────────────────────────
        async createRequest(payload) {
            this.error = null
            const config = useRuntimeConfig()
            try {
                const token = process.client ? localStorage.getItem('token') : null
                const response = await $fetch('/presensi-requests', {
                    method: 'POST',
                    baseURL: config.public.apiBase,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: payload
                })
                // Update local map langsung tanpa fetch ulang
                const key = `${payload.id_jadwal}_${payload.tanggal}`
                this.myRequestMap[key] = {
                    id: response.data.id,
                    status: 'Pending',
                    alasan_reject: null,
                    opened_at: null,
                    created_at: response.data.created_at
                }
                return { success: true, data: response.data, message: response.message }
            } catch (err) {
                this.error = err.data?.message || 'Gagal mengirim request'
                return { success: false, message: err.data?.message || 'Gagal mengirim request presensi' }
            }
        },

        // ─── KM: ambil semua request miliknya ─────────────────────
        async getMyRequests() {
            this.error = null
            const config = useRuntimeConfig()
            try {
                const token = process.client ? localStorage.getItem('token') : null
                const response = await $fetch('/presensi-requests/my', {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.myRequestMap = response.map || {}
                return { success: true, data: response }
            } catch (err) {
                this.error = err.data?.message || 'Gagal mengambil data request'
                return { success: false, message: err.data?.message }
            }
        },

        // ─── Admin: ambil semua request ───────────────────────────
        async getRequests(filters = {}) {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()
            try {
                const token = process.client ? localStorage.getItem('token') : null
                const queryParams = new URLSearchParams()
                if (filters.status) queryParams.set('status', filters.status)
                if (filters.id_kelas) queryParams.set('id_kelas', filters.id_kelas)
                if (filters.tanggal_mulai) queryParams.set('tanggal_mulai', filters.tanggal_mulai)
                if (filters.tanggal_selesai) queryParams.set('tanggal_selesai', filters.tanggal_selesai)
                if (filters.search) queryParams.set('search', filters.search)

                const qs = queryParams.toString()
                const response = await $fetch(`/presensi-requests${qs ? '?' + qs : ''}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.requests = response.data || []
                this.summary = response.summary || { pending: 0, approved: 0, rejected: 0, total: 0 }
                this.loading = false
                return { success: true, data: response }
            } catch (err) {
                this.error = err.data?.message || 'Gagal mengambil data request'
                this.loading = false
                return { success: false, message: err.data?.message }
            }
        },

        // ─── Admin: approve request ───────────────────────────────
        async approveRequest(id) {
            this.error = null
            const config = useRuntimeConfig()
            try {
                const token = process.client ? localStorage.getItem('token') : null
                const response = await $fetch(`/presensi-requests/${id}/approve`, {
                    method: 'PUT',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                // Update local state
                const req = this.requests.find(r => r.id === id)
                if (req) {
                    req.status = 'Approved'
                    req.opened_at = response.data?.opened_at
                }
                this.summary.pending = Math.max(0, this.summary.pending - 1)
                this.summary.approved++
                return { success: true, data: response.data, message: response.message }
            } catch (err) {
                this.error = err.data?.message || 'Gagal menyetujui request'
                return { success: false, message: err.data?.message || 'Gagal menyetujui request' }
            }
        },

        // ─── Admin: reject request ────────────────────────────────
        async rejectRequest(id, alasan_reject) {
            this.error = null
            const config = useRuntimeConfig()
            try {
                const token = process.client ? localStorage.getItem('token') : null
                const response = await $fetch(`/presensi-requests/${id}/reject`, {
                    method: 'PUT',
                    baseURL: config.public.apiBase,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: { alasan_reject }
                })
                const req = this.requests.find(r => r.id === id)
                if (req) {
                    req.status = 'Rejected'
                    req.alasan_reject = alasan_reject
                }
                this.summary.pending = Math.max(0, this.summary.pending - 1)
                this.summary.rejected++
                return { success: true, data: response.data, message: response.message }
            } catch (err) {
                this.error = err.data?.message || 'Gagal menolak request'
                return { success: false, message: err.data?.message || 'Gagal menolak request' }
            }
        }
    },

    getters: {
        pendingRequests: (state) => state.requests.filter(r => r.status === 'Pending'),
        approvedRequests: (state) => state.requests.filter(r => r.status === 'Approved'),
        rejectedRequests: (state) => state.requests.filter(r => r.status === 'Rejected'),

        // Helper untuk KM: ambil info request berdasarkan id_jadwal + tanggal
        getRequestInfo: (state) => (id_jadwal, tanggal) => {
            const key = `${id_jadwal}_${tanggal}`
            return state.myRequestMap[key] || null
        }
    }
})