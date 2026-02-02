// stores/users.js
import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
    state: () => ({
        users: [],
        loading: false,
        error: null
    }),

    actions: {
        async getUsers() {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                // Get token from localStorage
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch('/users', {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                this.users = response
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

        async createUser(userData) {
            this.loading = true
            this.error = null

            const config = useRuntimeConfig()

            try {
                // Get token from localStorage
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
        }
    },

    getters: {
        getUsersByRole: (state) => (roleName) => {
            if (!roleName) return state.users
            return state.users.filter(user => user.role_name === roleName)
        }
    }
})