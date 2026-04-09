import { defineStore } from 'pinia'

export const useClassroomsStore = defineStore('classrooms', {
    state: () => ({
        classrooms: [],
        jurusanList: [],
        pagination: {
            page: 1,
            perPage: 10,
            totalItems: 0,
            totalPages: 1
        },
        page: 1,
        perPage: 12,
        totalItems: 0,
        totalPages: 1,
        hasMore: false,
        loading: false,
        error: null
    }),

    actions: {
        async getClassrooms(params = {}) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')

                const response = await $fetch('/kelas', {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
                    params
                })

                const data = response.data || []
                const p = response.pagination || {}

                if (params.append) {
                    this.classrooms = [...this.classrooms, ...data]
                } else {
                    this.classrooms = data
                }

                this.pagination = p
                this.page = p.page ?? 1
                this.perPage = p.perPage ?? 12
                this.totalItems = p.totalItems ?? 0
                this.totalPages = p.totalPages ?? 1
                this.hasMore = p.hasMore ?? false

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Gagal mengambil data kelas'
                this.loading = false
                return { success: false, message: this.error }
            }
        },

        async resetAndFetch(params = {}) {
            this.classrooms = []
            this.page = 1
            this.hasMore = false
            return this.getClassrooms({ ...params, page: 1 })
        },

        async loadMore(params = {}) {
            if (!this.hasMore || this.loading) return
            const nextPage = this.page + 1
            return this.getClassrooms({ ...params, page: nextPage, append: true })
        },

        async getJurusanList() {
            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')

                const response = await $fetch('/kelas/jurusan', {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })

                this.jurusanList = response.data
                return { success: true, data: response.data }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Gagal mengambil data jurusan' }
            }
        },

        async getClassroomById(id) {
            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')

                const response = await $fetch(`/kelas/${id}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })

                return { success: true, data: response }
            } catch (error) {
                return { success: false, message: error.data?.message || 'Gagal mengambil data kelas.' }
            }
        },

        async createClassroom(classroomData) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')

                const response = await $fetch('/kelas', {
                    method: 'POST',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
                    body: classroomData
                })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to create classroom'
                this.loading = false

                let errorMessage = 'Gagal menambahkan kelas. Silakan coba lagi.'
                if (error.data?.message) {
                    if (error.data.message.includes('sudah dipakai')) {
                        errorMessage = 'Nama kelas sudah terdaftar. Gunakan nama yang berbeda.'
                    } else if (error.data.message.includes('tidak lengkap')) {
                        errorMessage = 'Semua field wajib diisi.'
                    } else {
                        errorMessage = error.data.message
                    }
                }

                return { success: false, message: errorMessage }
            }
        },

        async updateClassroom(id, classroomData) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')

                const response = await $fetch(`/kelas/${id}`, {
                    method: 'PUT',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
                    body: classroomData
                })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to update classroom'
                this.loading = false

                let errorMessage = 'Gagal mengupdate kelas. Silakan coba lagi.'
                if (error.data?.message) {
                    if (error.data.message.includes('sudah dipakai')) {
                        errorMessage = 'Nama kelas sudah terdaftar. Gunakan nama yang berbeda.'
                    } else if (error.data.message.includes('tidak lengkap')) {
                        errorMessage = 'Semua field wajib diisi.'
                    } else {
                        errorMessage = error.data.message
                    }
                }

                return { success: false, message: errorMessage }
            }
        },

        async deleteClassroom(id) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')

                const response = await $fetch(`/kelas/${id}`, {
                    method: 'DELETE',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to delete classroom'
                this.loading = false
                return { success: false, message: error.data?.message || 'Gagal menghapus kelas.' }
            }
        },

        async importClassroom(file) {
            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')

                const formData = new FormData()
                formData.append('file', file)

                const response = await $fetch('/kelas/import', {
                    method: 'POST',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) },
                    body: formData
                })

                await this.getClassrooms({ page: 1, limit: this.perPage })

                return {
                    success: true,
                    inserted: response.berhasil ?? 0,
                    skipped: response.gagal ?? 0,
                    errors: (response.skipped ?? []).map(s => s.reason ?? String(s))
                }
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Gagal import data kelas.'
                }
            }
        }
    }
})