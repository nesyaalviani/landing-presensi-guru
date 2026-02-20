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

                this.classrooms = response.data
                this.pagination = response.pagination
                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Gagal mengambil data kelas'
                this.loading = false
                return { success: false, message: this.error }
            }
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
        }
    }
})