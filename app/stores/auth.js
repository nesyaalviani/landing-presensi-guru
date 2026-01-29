import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        user: null,
        token: null,
        isAuthenticated: false
    }),

    actions: {
        async login(credentials) {
            const config = useRuntimeConfig()

            try {
                const response = await $fetch('/auth/login', {
                    method: 'POST',
                    baseURL: config.public.apiBase,
                    body: credentials
                })

                this.token = response.token
                this.user = response.user
                this.isAuthenticated = true

                if (process.client) {
                    localStorage.setItem('token', response.token)
                    localStorage.setItem('user', JSON.stringify(response.user))
                }

                return { success: true }
            } catch (error) {
                return {
                    success: false,
                    message: error.data?.message || 'Login failed. Please try again.'
                }
            }
        },

        logout() {
            this.user = null
            this.token = null
            this.isAuthenticated = false

            if (process.client) {
                localStorage.removeItem('token')
                localStorage.removeItem('user')
            }
        },

        checkAuth() {
            if (process.client) {
                const token = localStorage.getItem('token')
                const user = localStorage.getItem('user')

                if (token && user) {
                    this.token = token
                    this.user = JSON.parse(user)
                    this.isAuthenticated = true
                }
            }
        }
    }
})