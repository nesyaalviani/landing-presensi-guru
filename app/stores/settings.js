import { defineStore } from 'pinia'

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        bulkApprovalEnabled: false,
        loading: false,
        error: null,
        activityLogs: []
    }),

    actions: {
        async fetchBulkApprovalStatus() {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()
            try {
                const token = process.client ? localStorage.getItem('token') : null
                const response = await $fetch('/settings/bulk-approval', {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.bulkApprovalEnabled = response.enabled
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Gagal mengambil status bulk approval'
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        },

        async setBulkApprovalStatus(enabled) {
            this.loading = true
            this.error = null
            const config = useRuntimeConfig()
            try {
                const token = process.client ? localStorage.getItem('token') : null
                const response = await $fetch('/settings/bulk-approval', {
                    method: 'PUT',
                    baseURL: config.public.apiBase,
                    headers: {
                        'Content-Type': 'application/json',
                        ...(token && { Authorization: `Bearer ${token}` })
                    },
                    body: { enabled }
                })
                this.bulkApprovalEnabled = response.enabled
                return { success: true, data: response }
            } catch (error) {
                this.error = error.data?.message || 'Gagal mengubah status bulk approval'
                return { success: false, message: this.error }
            } finally {
                this.loading = false
            }
        },

        async fetchActivityLogs() {
            const config = useRuntimeConfig()
            try {
                const token = process.client ? localStorage.getItem('token') : null
                const response = await $fetch('/settings/activity-logs', {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.activityLogs = response
                return { success: true }
            } catch (error) {
                return { success: false }
            }
        }
    }
})