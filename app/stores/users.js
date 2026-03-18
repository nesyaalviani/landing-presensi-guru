import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
    state: () => ({
        users: [],
        page: 1,
        perPage: 10,
        totalItems: 0,
        totalPages: 1,
        loading: false,
        error: null
    }),

    actions: {
        async getUsers(filters = {}) {
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
                if (filters.id_role) params.set('id_role', filters.id_role)
                if (filters.page) params.set('page', filters.page)
                if (filters.limit) params.set('limit', filters.limit)

                const queryString = params.toString()
                const url = queryString ? `/users?${queryString}` : '/users'

                const response = await $fetch(url, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                this.users = response.data || response
                const p = response.pagination || {}
                this.page = p.page ?? filters.page ?? 1
                this.perPage = p.perPage ?? filters.limit ?? 10
                this.totalItems = p.totalItems ?? 0
                this.totalPages = p.totalPages ?? 1

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch users'
                this.loading = false

                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data user.'
                }
            }
        },

        async getUserById(userId) {
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/users/${userId}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to fetch user'

                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data user.'
                }
            }
        },

        async createUser(userData) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch('/users', {
                    method: 'POST',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: userData
                })

                await this.getUsers({ page: this.page, limit: this.perPage })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to create user'
                this.loading = false

                return {
                    success: false,
                    message: error.data?.message || 'Gagal menambahkan user. Silakan coba lagi.'
                }
            }
        },

        async updateUser(userId, userData) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/users/${userId}`, {
                    method: 'PUT',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: userData
                })

                await this.getUsers({ page: this.page, limit: this.perPage })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to update user'
                this.loading = false

                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengupdate user. Silakan coba lagi.'
                }
            }
        },

        async deleteUser(userId) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/users/${userId}`, {
                    method: 'DELETE',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                await this.getUsers({ page: this.page, limit: this.perPage })

                this.loading = false
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Failed to delete user'
                this.loading = false

                return {
                    success: false,
                    message: error.data?.message || 'Gagal menghapus user. Silakan coba lagi.'
                }
            }
        }
    },

    getters: {
        getUsersByRole: (state) => (roleName) => {
            if (!roleName) return state.users
            return state.users.filter(user => user.role?.name === roleName)
        }
    }
})