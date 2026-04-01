import { defineStore } from 'pinia'

export const useSubjectsStore = defineStore('subjects', {
    state: () => ({
        subjects: [],
        page: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 1,
        loading: false,
        error: null
    }),

    actions: {
        async getSubjects(filters = {}) {
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
                if (filters.status) params.set('status', filters.status)
                if (filters.page) params.set('page', filters.page)
                if (filters.limit) params.set('limit', filters.limit)
                if (filters.all) params.set('all', 'true')

                const queryString = params.toString()
                const url = queryString ? `/mapel?${queryString}` : '/mapel'

                const response = await $fetch(url, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                this.subjects = response.data || response
                const p = response.pagination || {}
                this.page = p.page ?? filters.page ?? 1
                this.perPage = p.perPage ?? filters.limit ?? 10
                this.totalItems = p.totalItems ?? 0
                this.totalPages = p.totalPages ?? 1

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

        async getSubjectById(subjectId) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/mapel/${subjectId}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch subject'
                this.loading = false

                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data mata pelajaran.'
                }
            }
        },

        async createSubject(subjectData) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch('/mapel', {
                    method: 'POST',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: subjectData
                })

                await this.getSubjects({ page: this.page, limit: this.perPage })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to create subject'
                this.loading = false

                let errorMessage = 'Gagal menambahkan mata pelajaran. Silakan coba lagi.'

                if (error.data?.message) {
                    const message = error.data.message.toLowerCase()

                    if (message.includes('kode') && (message.includes('sudah') || message.includes('exist') || message.includes('duplicate') || message.includes('digunakan'))) {
                        errorMessage = 'Kode mata pelajaran sudah terdaftar. Gunakan kode yang berbeda.'
                    } else if (message.includes('nama') && (message.includes('sudah') || message.includes('exist') || message.includes('duplicate'))) {
                        errorMessage = 'Nama mata pelajaran sudah ada. Gunakan nama yang berbeda.'
                    } else if (message.includes('required') || message.includes('wajib')) {
                        errorMessage = 'Semua field wajib diisi.'
                    } else if (message.includes('invalid') || message.includes('tidak valid')) {
                        errorMessage = 'Data yang dimasukkan tidak valid. Periksa kembali input Anda.'
                    } else {
                        errorMessage = error.data.message
                    }
                }

                return { success: false, message: errorMessage }
            }
        },

        async updateSubject(id, subjectData) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/mapel/${id}`, {
                    method: 'PUT',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: subjectData
                })

                await this.getSubjects({ page: this.page, limit: this.perPage })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to update subject'
                this.loading = false

                let errorMessage = 'Gagal mengubah mata pelajaran. Silakan coba lagi.'

                if (error.data?.message) {
                    const message = error.data.message.toLowerCase()

                    if (message.includes('kode') && (message.includes('sudah') || message.includes('exist') || message.includes('duplicate') || message.includes('digunakan'))) {
                        errorMessage = 'Kode mata pelajaran sudah terdaftar. Gunakan kode yang berbeda.'
                    } else if (message.includes('nama') && (message.includes('sudah') || message.includes('exist') || message.includes('duplicate'))) {
                        errorMessage = 'Nama mata pelajaran sudah ada. Gunakan nama yang berbeda.'
                    } else {
                        errorMessage = error.data.message
                    }
                }

                return { success: false, message: errorMessage }
            }
        },

        async deleteSubject(id) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/mapel/${id}`, {
                    method: 'DELETE',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                await this.getSubjects({ page: this.page, limit: this.perPage })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to delete subject'
                this.loading = false

                let errorMessage = 'Gagal menghapus mata pelajaran. Silakan coba lagi.'

                if (error.data?.message) {
                    const message = error.data.message.toLowerCase()

                    if (message.includes('digunakan') || message.includes('referenced') || message.includes('constraint')) {
                        errorMessage = 'Mata pelajaran tidak dapat dihapus karena masih digunakan oleh guru.'
                    } else {
                        errorMessage = error.data.message
                    }
                }

                return { success: false, message: errorMessage }
            }
        },

        async importSubject(file) {
            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const formData = new FormData()
                formData.append('file', file)

                const response = await $fetch('/mapel/import', {
                    method: 'POST',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: formData
                })

                await this.getSubjects({ page: 1, limit: this.perPage })

                return {
                    success: true,
                    inserted: response.berhasil ?? 0,
                    skipped: response.gagal ?? 0,
                    errors: (response.skipped ?? []).map(s => s.reason ?? String(s))
                }
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Gagal import data mata pelajaran.'
                }
            }
        }
    },

    getters: {
        getSubjectByCode: (state) => (code) => {
            return state.subjects.find(subject => subject.kode_mapel === code)
        },

        getActiveSubjects: (state) => {
            return state.subjects.filter(subject => subject.status === true)
        },

        searchSubjects: (state) => (searchQuery) => {
            if (!searchQuery) return state.subjects

            const query = searchQuery.toLowerCase()
            return state.subjects.filter(subject =>
                subject.nama_mapel?.toLowerCase().includes(query) ||
                subject.kode_mapel?.toLowerCase().includes(query)
            )
        }
    }
})