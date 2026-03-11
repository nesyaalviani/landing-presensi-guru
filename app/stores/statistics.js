import { defineStore } from 'pinia'

const CHART_COLORS = [
    '#6366f1', '#0ea5e9', '#f97316', '#8b5cf6',
    '#14b8a6', '#ec4899', '#84cc16', '#f59e0b',
    '#ef4444', '#06b6d4'
]

export const useStatisticsStore = defineStore('statistics', {
    state: () => ({
        kelasList: [],

        // 1. bar — hadir vs tidak hadir (total)
        barChart: { labels: [], data: [] },
        loadingBar: false,

        // 2. tren keseluruhan — time series
        trenChart: { labels: [], hadir: [], tidakHadir: [] },
        loadingTren: false,

        // 3. top 10 hadir
        topHadir: [],
        loadingTopHadir: false,

        // 4. top 10 tidak hadir
        topTidakHadir: [],
        loadingTopTidakHadir: false,

        // 5. line chart per guru
        lineChart: { labels: [], datasets: [] },
        loadingLine: false,
    }),

    actions: {
        async getKelas() {
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')
                const response = await $fetch('/kelas?all=true', {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.kelasList = response.data || []
            } catch (err) {
                console.error('Failed to fetch kelas:', err)
            }
        },

        async getBarHadirVsTidak(range = 'bulan', id_kelas = null) {
            this.loadingBar = true
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')
                const params = new URLSearchParams({ range })
                if (id_kelas) params.set('id_kelas', id_kelas)
                const response = await $fetch(`/guru/bar?${params}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.barChart = {
                    labels: response.labels || [],
                    data: response.data || []
                }
            } catch (err) {
                console.error('Bar chart error:', err)
            } finally {
                this.loadingBar = false
            }
        },

        async getTrenKeseluruhan(range = 'bulan', id_kelas = null) {
            this.loadingTren = true
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')
                const params = new URLSearchParams({ range })
                if (id_kelas) params.set('id_kelas', id_kelas)
                const response = await $fetch(`/guru/tren?${params}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.trenChart = {
                    labels: response.labels || [],
                    hadir: response.hadir || [],
                    tidakHadir: response.tidakHadir || []
                }
            } catch (err) {
                console.error('Tren chart error:', err)
            } finally {
                this.loadingTren = false
            }
        },

        async getTopHadir(range = 'bulan') {
            this.loadingTopHadir = true
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')
                const response = await $fetch(`/guru/top-hadir?range=${range}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.topHadir = response.data || []
            } catch (err) {
                console.error('Top hadir error:', err)
            } finally {
                this.loadingTopHadir = false
            }
        },

        async getTopTidakHadir(range = 'bulan') {
            this.loadingTopTidakHadir = true
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')
                const response = await $fetch(`/guru/top-tidak-hadir?range=${range}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.topTidakHadir = response.data || []
            } catch (err) {
                console.error('Top tidak hadir error:', err)
            } finally {
                this.loadingTopTidakHadir = false
            }
        },

        async getLinePerGuru(range = 'bulan', id_kelas = null) {
            this.loadingLine = true
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')
                const params = new URLSearchParams({ range })
                if (id_kelas) params.set('id_kelas', id_kelas)
                const response = await $fetch(`/guru/line?${params}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.lineChart = {
                    labels: response.labels || [],
                    datasets: (response.datasets || []).map((d, i) => ({
                        ...d,
                        color: CHART_COLORS[i % CHART_COLORS.length]
                    }))
                }
            } catch (err) {
                console.error('Line chart error:', err)
            } finally {
                this.loadingLine = false
            }
        },

        // Fetch semua sekaligus saat filter berubah
        async fetchAll(range = 'bulan', id_kelas = null) {
            await Promise.all([
                this.getBarHadirVsTidak(range, id_kelas),
                this.getTrenKeseluruhan(range, id_kelas),
                this.getTopHadir(range),
                this.getTopTidakHadir(range),
                this.getLinePerGuru(range, id_kelas),
            ])
        }
    }
})