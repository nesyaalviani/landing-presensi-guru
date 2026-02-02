import { defineStore } from 'pinia'

export const useUsersStore = defineStore('users', {
    state: () => ({
        loading: false,
        error: null
    }),

    actions: {
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
    }
})