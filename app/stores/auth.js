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

        async fetchMe() {
            if (!this.token) {
                return { success: false, message: 'No token' }
            }

            const config = useRuntimeConfig()

            try {
                const response = await $fetch('/auth/me', {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    }
                })

                this.user = response.user

                if (process.client) {
                    localStorage.setItem('user', JSON.stringify(response.user))
                }

                return { success: true, user: response.user }
            } catch (error) {
                if (error.status === 401 || error.status === 403) {
                    this.logout()
                    return { success: false, shouldLogout: true }
                }

                return { success: false, message: error.data?.message }
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