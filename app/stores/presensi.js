import { defineStore } from 'pinia'

export const usePresensiStore = defineStore('presensi', {
    state: () => ({
        jadwalHariIni: [],
        jadwalHariIniResponse: null,
        presensiList: [],
        presensiPending: [],
        presensiApproved: [],
        presensiRejected: [],
        loading: false,
        error: null
    }),

    actions: {
        async getJadwalHariIni() {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch('/km/jadwal/today', {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                this.jadwalHariIniResponse = response
                this.jadwalHariIni = response.schedules || []
                this.loading = false

                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch jadwal'
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
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/km/jadwal/${jadwalId}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
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

        async createPresensi(presensiData) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch('/km/presensi', {
                    method: 'POST',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
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

                    if (message.includes('tidak lengkap')) {
                        errorMessage = 'Data tidak lengkap. Mohon isi semua field yang wajib.'
                    } else if (message.includes('foto bukti wajib')) {
                        errorMessage = 'Foto bukti wajib diupload untuk status Hadir.'
                    } else if (message.includes('status tugas wajib')) {
                        errorMessage = 'Status tugas wajib diisi untuk Tidak Hadir.'
                    } else if (message.includes('sudah ada')) {
                        errorMessage = 'Presensi untuk jadwal ini hari ini sudah ada.'
                    } else {
                        errorMessage = error.data.message
                    }
                }

                return { success: false, message: errorMessage }
            }
        },

        async getAllPresensi(filters = {}) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const queryParams = new URLSearchParams()
                if (filters.tanggal) queryParams.set('tanggal', filters.tanggal)
                if (filters.id_kelas) queryParams.set('id_kelas', filters.id_kelas)

                const queryString = queryParams.toString()
                const url = queryString ? `/presensi?${queryString}` : '/presensi'

                const response = await $fetch(url, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
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

        async getPresensiById(presensiId) {
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/presensi/${presensiId}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
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

        async approvePresensi(presensiId, statusApprove) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/presensi/${presensiId}/approve`, {
                    method: 'PUT',
                    baseURL: config.public.apiBase,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: { status_approve: statusApprove }
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
        }
    },

    getters: {
        jadwalBelumPresensi: (state) => state.jadwalHariIni.filter(j => j.status === 'belum'),
        jadwalSudahPresensi: (state) => state.jadwalHariIni.filter(j => j.status !== 'belum'),
        jadwalPending: (state) => state.jadwalHariIni.filter(j => j.status === 'Pending'),
        jadwalApproved: (state) => state.jadwalHariIni.filter(j => j.status === 'Approved'),
        jadwalRejected: (state) => state.jadwalHariIni.filter(j => j.status === 'Rejected'),

        kelasInfo: (state) => state.jadwalHariIniResponse?.kelas || null,
        totalPending: (state) => state.presensiPending.length,
        totalApproved: (state) => state.presensiApproved.length,
        totalRejected: (state) => state.presensiRejected.length
    }
})