import { defineStore } from 'pinia'

export const usePresensiStore = defineStore('presensi', {
    state: () => ({
        jadwalHariIni: [],
        jadwalHariIniResponse: null,
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

                return {
                    success: true,
                    data: response
                }
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

                return {
                    success: true,
                    data: response
                }
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
                return {
                    success: true,
                    data: response
                }
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

                return {
                    success: false,
                    message: errorMessage
                }
            }
        }
    },

    getters: {
        jadwalBelumPresensi: (state) => {
            return state.jadwalHariIni.filter(j => j.status === 'belum')
        },

        jadwalSudahPresensi: (state) => {
            return state.jadwalHariIni.filter(j => j.status !== 'belum')
        },

        jadwalPending: (state) => {
            return state.jadwalHariIni.filter(j => j.status === 'Pending')
        },

        jadwalApproved: (state) => {
            return state.jadwalHariIni.filter(j => j.status === 'Approved')
        },

        jadwalRejected: (state) => {
            return state.jadwalHariIni.filter(j => j.status === 'Rejected')
        },

        kelasInfo: (state) => {
            return state.jadwalHariIniResponse?.kelas || null
        }
    }
})