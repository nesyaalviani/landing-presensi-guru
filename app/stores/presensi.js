import { defineStore } from 'pinia'

export const usePresensiStore = defineStore('presensi', {
    state: () => ({
        // Legacy state (tetap ada untuk kompatibilitas halaman KM)
        jadwalHariIni: [],
        jadwalHariIniResponse: null,

        // State lama (masih dipakai beberapa halaman lain)
        presensiList: [],
        presensiPending: [],
        presensiApproved: [],
        presensiRejected: [],

        // State baru — per-tab lazy loading
        presensiByTab: {
            pending: [],
            approved: [],
            rejected: [],
            belum: []
        },
        tabLoaded: {
            pending: false,
            approved: false,
            rejected: false,
            belum: false
        },

        // Summary count semua tab (untuk badge & totalJadwal)
        // Search TIDAK diaplikasikan ke summary agar badge count
        // tetap mencerminkan total data, bukan hasil search
        summary: {
            pending: 0,
            approved: 0,
            rejected: 0,
            belum: 0,
            total: 0
        },

        loading: false,
        error: null
    }),

    actions: {
        // ─────────────────────────────────────────────
        // SUMMARY — fetch count semua tab sekaligus (ringan)
        // ─────────────────────────────────────────────
        async getPresensiSummary(filters = {}) {
            this.error = null
            const config = useRuntimeConfig()

            try {
                const token = process.client ? localStorage.getItem('token') : null
                const queryParams = new URLSearchParams()
                if (filters.tanggal) queryParams.set('tanggal', filters.tanggal)
                if (filters.id_kelas) queryParams.set('id_kelas', filters.id_kelas)

                const qs = queryParams.toString()
                const url = qs ? `/presensi/summary?${qs}` : '/presensi/summary'

                const response = await $fetch(url, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })

                this.summary = response
                this.presensiPending = Array(response.pending).fill(null)

                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch summary'
                return { success: false, message: error.data?.message }
            }
        },

        // ─────────────────────────────────────────────
        // FETCH DATA 1 TAB (lazy)
        // filters: { tanggal, id_kelas, search }
        // tab: 'pending' | 'approved' | 'rejected' | 'belum'
        // ─────────────────────────────────────────────
        async getPresensiTab(tab, filters = {}) {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()

            const statusMap = {
                pending: 'Pending',
                approved: 'Approved',
                rejected: 'Rejected',
                belum: 'belum'
            }

            try {
                const token = process.client ? localStorage.getItem('token') : null
                const queryParams = new URLSearchParams()
                if (filters.tanggal) queryParams.set('tanggal', filters.tanggal)
                if (filters.id_kelas) queryParams.set('id_kelas', filters.id_kelas)
                if (filters.search) queryParams.set('search', filters.search)
                queryParams.set('status', statusMap[tab])

                const response = await $fetch(`/presensi?${queryParams.toString()}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })

                this.presensiByTab[tab] = response || []
                this.tabLoaded[tab] = true
                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch presensi tab'
                this.loading = false
                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data presensi.'
                }
            }
        },

        // ─────────────────────────────────────────────
        // RESET CACHE SEMUA TAB
        // Dipanggil saat filter (tanggal / kelas / search) berubah
        // atau setelah approve/reject agar data fresh
        // ─────────────────────────────────────────────
        resetTabCache() {
            this.presensiByTab = { pending: [], approved: [], rejected: [], belum: [] }
            this.tabLoaded = { pending: false, approved: false, rejected: false, belum: false }
        },

        // ─────────────────────────────────────────────
        // LEGACY: getAllPresensi (masih dipakai halaman lain)
        // ─────────────────────────────────────────────
        async getAllPresensi(filters = {}) {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()

            try {
                const token = process.client ? localStorage.getItem('token') : null
                const queryParams = new URLSearchParams()
                if (filters.tanggal) queryParams.set('tanggal', filters.tanggal)
                if (filters.id_kelas) queryParams.set('id_kelas', filters.id_kelas)

                const qs = queryParams.toString()
                const url = qs ? `/presensi?${qs}` : '/presensi'

                const response = await $fetch(url, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })

                this.presensiList = response || []
                const sudahPresensi = this.presensiList.filter(p => p.id_presensi !== null)
                this.presensiPending = sudahPresensi.filter(p => p.status_approve === 'Pending')
                this.presensiApproved = sudahPresensi.filter(p => p.status_approve === 'Approved')
                this.presensiRejected = sudahPresensi.filter(p => p.status_approve === 'Rejected')
                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch presensi'
                this.loading = false
                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data presensi.'
                }
            }
        },

        // ─────────────────────────────────────────────
        // APPROVE / REJECT
        // ─────────────────────────────────────────────
        async approvePresensi(presensiId, statusApprove, alasanReject = null) {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()

            try {
                const token = process.client ? localStorage.getItem('token') : null
                const body = { status_approve: statusApprove }
                if (alasanReject) body.alasan_reject = alasanReject

                const response = await $fetch(`/presensi/${presensiId}/approve`, {
                    method: 'PUT',
                    baseURL: config.public.apiBase,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body
                })

                this.loading = false
                return {
                    success: true,
                    data: response,
                    message: response.message || 'Presensi berhasil diproses'
                }
            } catch (error) {
                this.error = error.data?.message || 'Failed to approve presensi'
                this.loading = false
                return {
                    success: false,
                    message: error.data?.message || 'Gagal memproses presensi.'
                }
            }
        },

        // ─────────────────────────────────────────────
        // KM ACTIONS (tidak berubah)
        // ─────────────────────────────────────────────
        async getJadwalHariIni() {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()

            try {
                const token = process.client ? localStorage.getItem('token') : null
                const response = await $fetch('/km/jadwal/today', {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })

                this.jadwalHariIniResponse = response
                this.jadwalHariIni = response.schedules || []
                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch jadwal'
                this.jadwalHariIni = []
                this.jadwalHariIniResponse = null
                this.loading = false
                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data jadwal hari ini.'
                }
            }
        },

        async getJadwalById(jadwalId) {
            this.error = null
            const config = useRuntimeConfig()

            try {
                const token = process.client ? localStorage.getItem('token') : null
                const response = await $fetch(`/km/jadwal/${jadwalId}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch jadwal detail'
                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil detail jadwal.'
                }
            }
        },

        async getPresensiByIdKM(presensiId) {
            this.error = null
            const config = useRuntimeConfig()

            try {
                const token = process.client ? localStorage.getItem('token') : null
                const response = await $fetch(`/km/presensi/${presensiId}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch presensi'
                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data presensi.'
                }
            }
        },

        async createPresensi(presensiData) {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()

            try {
                const token = process.client ? localStorage.getItem('token') : null
                const response = await $fetch('/km/presensi', {
                    method: 'POST',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
                    body: presensiData
                })

                await this.getJadwalHariIni()
                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to create presensi'
                this.loading = false

                let errorMessage = 'Gagal menyimpan presensi. Silakan coba lagi.'
                if (error.data?.message) {
                    const message = error.data.message.toLowerCase()
                    if (message.includes('tidak lengkap')) errorMessage = 'Data tidak lengkap. Mohon isi semua field yang wajib.'
                    else if (message.includes('foto bukti wajib')) errorMessage = 'Foto bukti wajib diupload untuk status Hadir.'
                    else if (message.includes('status tugas wajib')) errorMessage = 'Status tugas wajib diisi untuk Tidak Hadir.'
                    else if (message.includes('sudah ada')) errorMessage = 'Presensi untuk jadwal ini hari ini sudah ada.'
                    else errorMessage = error.data.message
                }
                return { success: false, message: errorMessage }
            }
        },

        async resubmitPresensi(presensiId, presensiData) {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()

            try {
                const token = process.client ? localStorage.getItem('token') : null
                const response = await $fetch(`/km/presensi/${presensiId}/resubmit`, {
                    method: 'PUT',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
                    body: presensiData
                })

                await this.getJadwalHariIni()
                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to resubmit presensi'
                this.loading = false

                let errorMessage = 'Gagal mengirim ulang presensi. Silakan coba lagi.'
                if (error.data?.message) {
                    const message = error.data.message.toLowerCase()
                    if (message.includes('tidak ditemukan')) errorMessage = 'Data presensi tidak ditemukan.'
                    else if (message.includes('foto bukti wajib')) errorMessage = 'Foto bukti wajib diupload untuk status Hadir.'
                    else if (message.includes('status tugas wajib')) errorMessage = 'Status tugas wajib diisi untuk Tidak Hadir.'
                    else if (message.includes('bukan rejected')) errorMessage = 'Hanya presensi dengan status Ditolak yang dapat dikirim ulang.'
                    else errorMessage = error.data.message
                }
                return { success: false, message: errorMessage }
            }
        },

        async getPresensiById(presensiId) {
            this.error = null
            const config = useRuntimeConfig()

            try {
                const token = process.client ? localStorage.getItem('token') : null
                const response = await $fetch(`/presensi/${presensiId}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch presensi detail'
                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil detail presensi.'
                }
            }
        },

        async getRiwayatPresensiKM(filters = {}) {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()

            try {
                const token = process.client ? localStorage.getItem('token') : null
                const queryParams = new URLSearchParams()
                if (filters.page) queryParams.set('page', filters.page)
                if (filters.limit) queryParams.set('limit', filters.limit)
                if (filters.status) queryParams.set('status', filters.status)
                if (filters.tanggal) queryParams.set('tanggal', filters.tanggal)

                const qs = queryParams.toString()
                const url = qs ? `/km/riwayat?${qs}` : '/km/riwayat'

                const response = await $fetch(url, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch riwayat'
                this.loading = false
                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil riwayat presensi.'
                }
            }
        }
    },

    getters: {
        // KM getters
        jadwalBelumPresensi: (state) => state.jadwalHariIni.filter(j => j.status === 'belum'),
        jadwalSudahPresensi: (state) => state.jadwalHariIni.filter(j => j.status !== 'belum'),
        jadwalPending: (state) => state.jadwalHariIni.filter(j => j.status === 'Pending'),
        jadwalApproved: (state) => state.jadwalHariIni.filter(j => j.status === 'Approved'),
        jadwalRejected: (state) => state.jadwalHariIni.filter(j => j.status === 'Rejected'),
        kelasInfo: (state) => state.jadwalHariIniResponse?.kelas || null,

        // Count getters — dari summary
        totalPending: (state) => state.summary.pending,
        totalApproved: (state) => state.summary.approved,
        totalRejected: (state) => state.summary.rejected
    }
})