import { defineStore } from 'pinia'

const CHART_COLORS = [
    '#6366f1', '#0ea5e9', '#f97316', '#8b5cf6',
    '#14b8a6', '#ec4899', '#84cc16', '#f59e0b',
    '#ef4444', '#06b6d4'
]

export const useStatisticsStore = defineStore('statistics', {
    state: () => ({
        kelasList: [],

        summaryStats: {
            total: 0, hadir: 0, tidak_hadir_tugas: 0, tidak_hadir: 0,
            pct_hadir: 0, pct_tidak_hadir: 0, trend: 0
        },
        loadingSummary: false,

        barChart: { labels: [], data: [], percentages: [], total: 0 },
        loadingBar: false,

        trenChart: { labels: [], hadir: [], tidakHadirTugas: [], tidakHadir: [] },
        loadingTren: false,

        topHadir: [],
        loadingTopHadir: false,

        topTidakHadir: [],
        loadingTopTidakHadir: false,

        performaGuru: [],
        loadingPerforma: false,

        lineChart: { labels: [], datasets: [], guruList: [] },
        loadingLine: false,

        unpresensiStats: { total_belum: 0 },
        loadingUnpresensi: false,
    }),

    actions: {
        _buildParams(range, id_kelas, date_from, date_to) {
            const params = new URLSearchParams({ range })
            if (id_kelas) params.set('id_kelas', id_kelas)
            if (range === 'custom' && date_from) params.set('date_from', date_from)
            if (range === 'custom' && date_to) params.set('date_to', date_to)
            return params
        },
        async getKelas(params = {}) {
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')

                const query = new URLSearchParams()
                if (params.page) query.set('page', params.page)
                if (params.limit) query.set('limit', params.limit)
                if (params.search) query.set('search', params.search)
                // Kalau tidak ada page/limit, fetch semua (untuk init kelasList global)
                if (!params.page && !params.limit) query.set('all', 'true')

                const response = await $fetch(`/kelas?${query}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })

                this.kelasList = response.data || []
                return { success: true, data: response }
            } catch (err) {
                console.error('Failed to fetch kelas:', err)
                return { success: false }
            }
        },

        async getSummaryStats(range = 'bulan', id_kelas = null, date_from = null, date_to = null) {
            this.loadingSummary = true
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')
                const params = this._buildParams(range, id_kelas, date_from, date_to)
                const response = await $fetch(`/guru/summary-stats?${params}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.summaryStats = response
            } catch (err) {
                console.error('Summary stats error:', err)
            } finally {
                this.loadingSummary = false
            }
        },

        async getBarHadirVsTidak(range = 'bulan', id_kelas = null, date_from = null, date_to = null) {
            this.loadingBar = true
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')
                const params = this._buildParams(range, id_kelas, date_from, date_to)
                const response = await $fetch(`/guru/bar?${params}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.barChart = {
                    labels: response.labels || [],
                    data: response.data || [],
                    percentages: response.percentages || [],
                    total: response.total || 0
                }
            } catch (err) {
                console.error('Bar chart error:', err)
            } finally {
                this.loadingBar = false
            }
        },

        async getTrenKeseluruhan(range = 'bulan', id_kelas = null, date_from = null, date_to = null) {
            this.loadingTren = true
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')
                const params = this._buildParams(range, id_kelas, date_from, date_to)
                const response = await $fetch(`/guru/tren?${params}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.trenChart = {
                    labels: response.labels || [],
                    hadir: response.hadir || [],
                    tidakHadirTugas: response.tidakHadirTugas || [],
                    tidakHadir: response.tidakHadir || []
                }
            } catch (err) {
                console.error('Tren chart error:', err)
            } finally {
                this.loadingTren = false
            }
        },

        async getTopHadir(range = 'bulan', id_kelas = null, date_from = null, date_to = null) {
            this.loadingTopHadir = true
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')
                const params = this._buildParams(range, id_kelas, date_from, date_to)
                const response = await $fetch(`/guru/top-hadir?${params}`, {
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

        async getTopTidakHadir(range = 'bulan', id_kelas = null, date_from = null, date_to = null) {
            this.loadingTopTidakHadir = true
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')
                const params = this._buildParams(range, id_kelas, date_from, date_to)
                const response = await $fetch(`/guru/top-tidak-hadir?${params}`, {
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

        async getPerformaGuru(range = 'bulan', id_kelas = null, date_from = null, date_to = null) {
            this.loadingPerforma = true
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')
                const params = this._buildParams(range, id_kelas, date_from, date_to)
                const response = await $fetch(`/guru/performa-guru?${params}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.performaGuru = response.data || []
            } catch (err) {
                console.error('Performa guru error:', err)
            } finally {
                this.loadingPerforma = false
            }
        },

        async getLinePerGuru(range = 'bulan', id_kelas = null, nama_guru = null, date_from = null, date_to = null) {
            this.loadingLine = true
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')
                const params = this._buildParams(range, id_kelas, date_from, date_to)
                if (nama_guru) params.set('nama_guru', nama_guru)
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
                    })),
                    guruList: response.guruList || []
                }
            } catch (err) {
                console.error('Line chart error:', err)
            } finally {
                this.loadingLine = false
            }
        },

        async getUnpresensiStats(range = 'bulan', id_kelas = null, date_from = null, date_to = null) {
            this.loadingUnpresensi = true
            const config = useRuntimeConfig()
            try {
                let token = null
                if (process.client) token = localStorage.getItem('token')
                const params = this._buildParams(range, id_kelas, date_from, date_to)
                const response = await $fetch(`/guru/unpresensi-stats?${params}`, {
                    method: 'GET',
                    baseURL: config.public.apiBase,
                    headers: { ...(token && { Authorization: `Bearer ${token}` }) }
                })
                this.unpresensiStats = { total_belum: response.total_belum || 0 }
            } catch (err) {
                console.error('Unpresensi stats error:', err)
            } finally {
                this.loadingUnpresensi = false
            }
        },

        async fetchAll(range = 'bulan', id_kelas = null, nama_guru = null, date_from = null, date_to = null) {
            await Promise.all([
                this.getSummaryStats(range, id_kelas, date_from, date_to),
                this.getBarHadirVsTidak(range, id_kelas, date_from, date_to),
                this.getTrenKeseluruhan(range, id_kelas, date_from, date_to),
                this.getTopHadir(range, id_kelas, date_from, date_to),
                this.getTopTidakHadir(range, id_kelas, date_from, date_to),
                this.getPerformaGuru(range, id_kelas, date_from, date_to),
                this.getLinePerGuru(range, id_kelas, nama_guru, date_from, date_to),
                this.getUnpresensiStats(range, id_kelas, date_from, date_to),
            ])
        },
    }
})