// stores/teachers.js
import { defineStore } from 'pinia'

export const useTeachersStore = defineStore('teachers', {
    state: () => ({
        teachers: [],
        mapels: [], // untuk menyimpan daftar mata pelajaran
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

                // Handle specific error cases
                let errorMessage = 'Gagal menambahkan guru. Silakan coba lagi.'
                
                if (error.data?.message) {
                    if (error.data.message.includes('NIP')) {
                        errorMessage = 'NIP sudah terdaftar. Gunakan NIP yang berbeda.'
                    } else if (error.data.message.includes('mapel')) {
                        errorMessage = 'Mata pelajaran tidak valid. Periksa kembali pilihan Anda.'
                    } else if (error.data.message.includes('required')) {
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
        }
    },

    getters: {
        getTeacherByNip: (state) => (nip) => {
            return state.teachers.find(teacher => teacher.nip === nip)
        },
        
        getTeachersByMapel: (state) => (mapelId) => {
            if (!mapelId) return state.teachers
            return state.teachers.filter(teacher => 
                teacher.mapel && teacher.mapel.includes(mapelId)
            )
        },

        // Getter untuk search
        searchTeachers: (state) => (searchQuery, mapelFilter) => {
            let filtered = state.teachers

            // Filter by mapel
            if (mapelFilter) {
                filtered = filtered.filter(teacher => 
                    teacher.mapel && teacher.mapel.includes(mapelFilter)
                )
            }

            // Filter by search query
            if (searchQuery) {
                const query = searchQuery.toLowerCase()
                filtered = filtered.filter(teacher => 
                    teacher.nama_guru?.toLowerCase().includes(query) ||
                    teacher.nip?.includes(query)
                )
            }

            return filtered
        }
    }
})