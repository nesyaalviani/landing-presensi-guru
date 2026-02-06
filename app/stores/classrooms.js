import { defineStore } from 'pinia'

export const useClassroomsStore = defineStore('classrooms', {
    state: () => ({
        classrooms: [],
        loading: false,
        error: null
    }),

    actions: {
        async getClassrooms() {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch('/kelas', {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                this.classrooms = response
                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch classrooms'
                this.loading = false

                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data kelas.'
                }
            }
        },

        async getClassroomById(id) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/kelas/${id}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch classroom'
                this.loading = false

                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data kelas.'
                }
            }
        },

        async createClassroom(classroomData) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch('/kelas', {
                    method: 'POST',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
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

                return {
                    success: false,
                    message: errorMessage
                }
            }
        },

        async updateClassroom(id, classroomData) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/kelas/${id}`, {
                    method: 'PUT',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
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

                return {
                    success: false,
                    message: errorMessage
                }
            }
        },

        async deleteClassroom(id) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/kelas/${id}`, {
                    method: 'DELETE',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to delete classroom'
                this.loading = false

                let errorMessage = 'Gagal menghapus kelas. Silakan coba lagi.'

                if (error.data?.message) {
                    if (error.data.message.includes('masih ada')) {
                        errorMessage = error.data.message
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
        getClassroomById: (state) => (id) => {
            return state.classrooms.find(classroom => classroom.id === id)
        },

        getClassroomsByTingkat: (state) => (tingkat) => {
            if (!tingkat) return state.classrooms
            return state.classrooms.filter(classroom => classroom.tingkat === tingkat)
        },

        getClassroomsByJurusan: (state) => (jurusan) => {
            if (!jurusan) return state.classrooms
            return state.classrooms.filter(classroom => classroom.jurusan === jurusan)
        },

        searchClassrooms: (state) => (searchQuery, tingkatFilter, jurusanFilter) => {
            let filtered = state.classrooms

            if (tingkatFilter) {
                filtered = filtered.filter(classroom => classroom.tingkat === tingkatFilter)
            }

            if (jurusanFilter) {
                filtered = filtered.filter(classroom => classroom.jurusan === jurusanFilter)
            }

            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                filtered = filtered.filter(classroom =>
                    classroom.name?.toLowerCase().includes(query)
                )
            }

            return filtered
        }
    }
})