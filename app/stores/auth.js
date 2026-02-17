// stores/auth.js
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

        async fetchProfile() {
            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch('/auth/me', {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                const userData = response.user ?? response

                this.user = userData

                if (process.client) {
                    localStorage.setItem('user', JSON.stringify(userData))
                }

                return { success: true, user: userData }
            } catch (error) {
                if (error.status === 401 || error.status === 403) {
                    this.logout()
                    return { success: false, shouldLogout: true }
                }

                return {
                    success: false,
                    message: error.data?.message || 'Gagal mengambil data profil.'
                }
            }
        },

        async updateProfile(payload) {
            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const body = { name: payload.name.trim() }
                if (payload.password?.trim()) {
                    body.password = payload.password.trim()
                }

                await $fetch('/auth/profile', {
                    method: 'PUT',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body
                })

                const refreshResult = await this.fetchProfile()

                if (!refreshResult.success) {
                    return refreshResult
                }

                return { success: true, user: this.user }
            } catch (error) {
                if (error.status === 401 || error.status === 403) {
                    this.logout()
                    return { success: false, shouldLogout: true }
                }

                return {
                    success: false,
                    message: error.data?.message || 'Gagal memperbarui profil.'
                }
            }
        },

        async fetchKelas(id_kelas) {
            const config = useRuntimeConfig()

            try {
                let token = null
                if (process.client) {
                    token = localStorage.getItem('token')
                }

                const response = await $fetch(`/kelas/${id_kelas}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: {
                        ...(token && { Authorization: `Bearer ${token}` })
                    }
                })

                this.user = { ...this.user, kelas: response }

                return { success: true, data: response }
            } catch (error) {
                this.user = { ...this.user, kelas: null }
                return { success: false, message: error.data?.message }
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

                const userData = response.user ?? response

                this.user = userData

                if (process.client) {
                    localStorage.setItem('user', JSON.stringify(userData))
                }

                return { success: true, user: userData }
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
    },

    getters: {
        namaKelas: (state) => {
            return state.user?.kelas?.name || null
        },

        hasKelas: (state) => {
            return !!state.user?.kelas
        }
    }
})