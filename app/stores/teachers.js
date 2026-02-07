import { defineStore } from 'pinia'

export const useTeachersStore = defineStore('teachers', {
    state: () => ({
        teachers: [],
        mapels: [],
        loading: false,
        error: null
    }),

    actions: {
        async getTeachers() {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch('/guru', {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                this.teachers = response
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
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const cachedTeacher = this.teachers.find(t => t.id_guru === parseInt(id))

                if (cachedTeacher) {
                    this.loading = false
                    return { success: true, data: cachedTeacher }
                }

                await this.getTeachers()
                const teacher = this.teachers.find(t => t.id_guru === parseInt(id))

                this.loading = false

                if (teacher) {
                    return { success: true, data: teacher }
                } else {
                    return { success: false, message: 'Guru tidak ditemukan' }
                }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch teacher'
                this.loading = false

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

                await this.getTeachers()

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

                return {
                    success: false,
                    message: errorMessage
                }
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

                await this.getTeachers()

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

                return {
                    success: false,
                    message: errorMessage
                }
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

                this.teachers = this.teachers.filter(t => t.id_guru !== parseInt(id))

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
            return state.teachers.find(teacher => teacher.nip === nip)
        },

        getTeachersByMapel: (state) => (mapelId) => {
            if (!mapelId) return state.teachers
            return state.teachers.filter(teacher =>
                teacher.mapel && teacher.mapel.some(m => m.id_mapel === mapelId)
            )
        }
    }
})