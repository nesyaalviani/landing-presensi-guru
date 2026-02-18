import { defineStore } from 'pinia'

export const useTeachersStore = defineStore('teachers', {
    state: () => ({
        teachers: [],
        mapels: [],
        page: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 1,
        loading: false,
        error: null
    }),

    actions: {
        async getTeachers(filters = {}) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const params = new URLSearchParams()
                if (filters.search) params.set('search', filters.search)
                if (filters.id_mapel) params.set('id_mapel', filters.id_mapel)
                if (filters.page) params.set('page', filters.page)
                if (filters.limit) params.set('limit', filters.limit || 10)

                const queryString = params.toString()
                const url = queryString ? `/guru?${queryString}` : '/guru'

                const response = await $fetch(url, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                this.teachers = response.data || []
                const p = response.pagination || {}
                this.page = p.page ?? 1
                this.perPage = p.perPage ?? 10
                this.totalItems = p.totalItems ?? 0
                this.totalPages = p.totalPages ?? 1

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch teachers'
                this.loading = false

                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data guru.'
                }
            }
        },

        async getTeacherById(id) {
            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/guru/${id}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                return { success: true, data: response }
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data guru.'
                }
            }
        },

        async getMapels() {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch('/mapel', {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                this.mapels = response
                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch subjects'
                this.loading = false

                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data mata pelajaran.'
                }
            }
        },

        async createTeacher(teacherData) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch('/guru', {
                    method: 'POST',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: teacherData
                })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to create teacher'
                this.loading = false

                let errorMessage = 'Gagal menambahkan guru. Silakan coba lagi.'
                if (error.data?.message) {
                    if (error.data.message.includes('NIP')) {
                        errorMessage = 'NIP sudah terdaftar. Gunakan NIP yang berbeda.'
                    } else if (error.data.message.includes('mapel')) {
                        errorMessage = 'Mata pelajaran tidak valid. Periksa kembali pilihan Anda.'
                    } else if (error.data.message.includes('required') || error.data.message.includes('wajib')) {
                        errorMessage = 'Semua field wajib diisi.'
                    } else {
                        errorMessage = error.data.message
                    }
                }

                return { success: false, message: errorMessage }
            }
        },

        async updateTeacher(id, teacherData) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/guru/${id}`, {
                    method: 'PUT',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: teacherData
                })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to update teacher'
                this.loading = false

                let errorMessage = 'Gagal mengupdate guru. Silakan coba lagi.'
                if (error.data?.message) {
                    if (error.data.message.includes('NIP')) {
                        errorMessage = 'NIP sudah digunakan oleh guru lain.'
                    } else if (error.data.message.includes('mapel')) {
                        errorMessage = 'Mata pelajaran tidak valid.'
                    } else if (error.data.message.includes('required') || error.data.message.includes('wajib')) {
                        errorMessage = 'Semua field wajib diisi.'
                    } else {
                        errorMessage = error.data.message
                    }
                }

                return { success: false, message: errorMessage }
            }
        },

        async deleteTeacher(id) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                await $fetch(`/guru/${id}`, {
                    method: 'DELETE',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                await this.getTeachers({ page: this.page })

                this.loading = false
                return { success: true }
            } catch (error) {
                this.error = error.data?.message || 'Failed to delete teacher'
                this.loading = false

                return {
                    success: false,
                    message: error.data?.message || 'Gagal menghapus guru.'
                }
            }
        }
    },

    getters: {
        getTeacherByNip: (state) => (nip) => {
            return state.teachers.find(t => t.nip === nip)
        },

        getTeachersByMapel: (state) => (mapelId) => {
            if (!mapelId) return state.teachers
            return state.teachers.filter(t =>
                t.mapel && t.mapel.some(m => m.id_mapel === mapelId)
            )
        }
    }
})