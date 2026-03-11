import { defineStore } from 'pinia'

export const useSchedulesStore = defineStore('schedules', {
    state: () => ({
        schedules: [],
        page: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 1,
        loading: false,
        error: null
    }),

    actions: {
        async getSchedules(filters = {}) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const params = new URLSearchParams()
                if (filters.hari) params.set('hari', filters.hari)
                if (filters.id_kelas) params.set('id_kelas', filters.id_kelas)
                if (filters.page) params.set('page', filters.page)
                if (filters.limit) params.set('limit', filters.limit)

                const queryString = params.toString()
                const url = queryString ? `/jadwal?${queryString}` : '/jadwal'

                const response = await $fetch(url, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                this.schedules = response.data || []
                const p = response.pagination || {}
                this.page = p.page ?? 1
                this.perPage = p.perPage ?? 10
                this.totalItems = p.totalItems ?? 0
                this.totalPages = p.totalPages ?? 1

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch schedules'
                this.loading = false

                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data jadwal.'
                }
            }
        },

        async getScheduleById(scheduleId) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/jadwal/${scheduleId}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch schedule'
                this.loading = false

                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data jadwal.'
                }
            }
        },

        async createSchedule(scheduleData) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch('/jadwal', {
                    method: 'POST',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: scheduleData
                })

                await this.getSchedules({ page: this.page })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to create schedule'
                this.loading = false

                let errorMessage = 'Gagal menambahkan jadwal. Silakan coba lagi.'

                if (error.data?.message) {
                    const message = error.data.message.toLowerCase()

                    if (message.includes('tidak lengkap')) {
                        errorMessage = 'Semua field wajib diisi.'
                    } else if (message.includes('guru tidak ditemukan')) {
                        errorMessage = 'Guru tidak ditemukan. Silakan pilih guru yang valid.'
                    } else if (message.includes('mapel tidak ditemukan')) {
                        errorMessage = 'Mata pelajaran tidak ditemukan.'
                    } else if (message.includes('tidak mengajar')) {
                        errorMessage = 'Guru tidak mengajar mata pelajaran ini. Pilih kombinasi guru dan mapel yang sesuai.'
                    } else if (message.includes('bentrok') || message.includes('conflict')) {
                        errorMessage = 'Jadwal bentrok dengan jadwal lain pada hari, jam, dan kelas yang sama.'
                    } else {
                        errorMessage = error.data.message
                    }
                }

                return {
                    success: false,
                    message: errorMessage
                }
            }
        },

        async updateSchedule(scheduleId, scheduleData) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/jadwal/${scheduleId}`, {
                    method: 'PUT',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: scheduleData
                })

                await this.getSchedules({ page: this.page })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to update schedule'
                this.loading = false

                let errorMessage = 'Gagal mengupdate jadwal. Silakan coba lagi.'

                if (error.data?.message) {
                    const message = error.data.message.toLowerCase()

                    if (message.includes('tidak lengkap')) {
                        errorMessage = 'Semua field wajib diisi.'
                    } else if (message.includes('guru tidak ditemukan')) {
                        errorMessage = 'Guru tidak ditemukan. Silakan pilih guru yang valid.'
                    } else if (message.includes('mapel tidak ditemukan')) {
                        errorMessage = 'Mata pelajaran tidak ditemukan.'
                    } else if (message.includes('tidak mengajar')) {
                        errorMessage = 'Guru tidak mengajar mata pelajaran ini. Pilih kombinasi guru dan mapel yang sesuai.'
                    } else if (message.includes('bentrok') || message.includes('conflict')) {
                        errorMessage = 'Jadwal bentrok dengan jadwal lain pada hari, jam, dan kelas yang sama.'
                    } else {
                        errorMessage = error.data.message
                    }
                }

                return {
                    success: false,
                    message: errorMessage
                }
            }
        },

        async deleteSchedule(scheduleId) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/jadwal/${scheduleId}`, {
                    method: 'DELETE',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                await this.getSchedules({ page: this.page })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to delete schedule'
                this.loading = false

                let errorMessage = 'Gagal menghapus jadwal. Silakan coba lagi.'

                if (error.data?.message) {
                    const message = error.data.message.toLowerCase()

                    if (message.includes('digunakan') || message.includes('referenced') || message.includes('constraint')) {
                        errorMessage = 'Jadwal tidak dapat dihapus karena sudah memiliki data presensi.'
                    } else {
                        errorMessage = error.data.message
                    }
                }

                return {
                    success: false,
                    message: errorMessage
                }
            }
        },

        async importSchedule(file) {
            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const formData = new FormData()
                formData.append('file', file)

                const response = await $fetch('/jadwal/import', {
                    method: 'POST',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: formData
                })

                await this.getSchedules({ page: 1 })

                return { success: true, data: response, inserted: response.inserted, errors: response.errors ?? [], total: response.inserted }
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Gagal import data jadwal.'
                }
            }
        }
    },

    getters: {
        getSchedulesByDay: (state) => (day) => {
            if (!day) return state.schedules
            return state.schedules.filter(schedule => schedule.hari === day)
        },

        getSchedulesByClass: (state) => (classId) => {
            if (!classId) return state.schedules
            return state.schedules.filter(schedule => schedule.id_kelas === classId)
        },

        searchSchedules: (state) => (searchQuery, dayFilter, classFilter) => {
            let filtered = state.schedules

            if (dayFilter) {
                filtered = filtered.filter(schedule => schedule.hari === dayFilter)
            }

            if (classFilter) {
                filtered = filtered.filter(schedule => schedule.id_kelas === parseInt(classFilter))
            }

            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                filtered = filtered.filter(schedule =>
                    schedule.nama_kelas?.toLowerCase().includes(query) ||
                    schedule.guru?.nama_guru?.toLowerCase().includes(query) ||
                    schedule.guru?.mapel?.nama_mapel?.toLowerCase().includes(query)
                )
            }

            return filtered
        }
    }
})