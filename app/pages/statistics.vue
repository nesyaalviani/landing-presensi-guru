<template>
    <div class="max-w-7xl space-y-4 sm:space-y-5">

        <!-- FILTER GLOBAL -->
        <div class="bg-white rounded-sm border border-gray-200 px-6 py-4">
            <div class="flex flex-wrap items-center gap-3">
                <span class="text-sm font-medium text-gray-600">Filter:</span>
                <div class="relative">
                    <select v-model="selectedPeriode" @change="onFilterChange"
                        class="appearance-none pl-4 pr-9 py-2 text-sm border border-gray-300 rounded-sm bg-white text-gray-700 cursor-pointer">
                        <option value="minggu">Minggu Ini</option>
                        <option value="bulan">Bulan Ini</option>
                        <option value="tahun">Tahun Ini</option>
                    </select>
                    <ChevronDown class="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
                <div class="relative">
                    <select v-model="selectedKelas" @change="onFilterChange"
                        class="appearance-none pl-4 pr-9 py-2 text-sm border border-gray-300 rounded-sm bg-white text-gray-700 cursor-pointer">
                        <option value="">Semua Kelas</option>
                        <option v-for="kelas in statisticsStore.kelasList" :key="kelas.id" :value="kelas.id">
                            {{ kelas.name }}
                        </option>
                    </select>
                    <ChevronDown class="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>

        <!-- SUMMARY CARDS -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div class="bg-white rounded-sm border border-gray-200 px-5 py-4">
                <p class="text-xs text-gray-400 mb-1">Total Presensi</p>
                <div v-if="statisticsStore.loadingSummary" class="h-8 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
                <p v-else class="text-2xl font-bold text-gray-900">{{ statisticsStore.summaryStats.total }}</p>
                <p class="text-xs text-gray-400 mt-1">jadwal tercatat</p>
            </div>
            <div class="bg-white rounded-sm border border-gray-200 px-5 py-4">
                <p class="text-xs text-gray-400 mb-1">Tingkat Kehadiran</p>
                <div v-if="statisticsStore.loadingSummary" class="h-8 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
                <div v-else class="flex items-end gap-2">
                    <p class="text-2xl font-bold text-emerald-600">{{ statisticsStore.summaryStats.pct_hadir }}%</p>
                    <span v-if="statisticsStore.summaryStats.trend !== 0"
                        :class="['text-xs font-medium mb-1', statisticsStore.summaryStats.trend > 0 ? 'text-emerald-500' : 'text-red-400']">
                        {{ statisticsStore.summaryStats.trend > 0 ? '▲' : '▼' }}
                        {{ Math.abs(statisticsStore.summaryStats.trend) }}%
                    </span>
                </div>
                <p class="text-xs text-gray-400 mt-1">vs periode sebelumnya</p>
            </div>
            <div class="bg-white rounded-sm border border-gray-200 px-5 py-4">
                <p class="text-xs text-gray-400 mb-1">Tingkat Ketidakhadiran</p>
                <div v-if="statisticsStore.loadingSummary" class="h-8 w-20 bg-gray-200 rounded animate-pulse mt-1"></div>
                <p v-else class="text-2xl font-bold text-red-500">{{ statisticsStore.summaryStats.pct_tidak_hadir }}%</p>
                <p class="text-xs text-gray-400 mt-1">dari total presensi</p>
            </div>
            <div class="bg-amber-50 rounded-sm border border-amber-200 px-5 py-4">
                <p class="text-xs text-amber-500 mb-1">Belum Dipresensi</p>
                <div v-if="statisticsStore.loadingUnpresensi" class="h-8 w-20 bg-amber-200 rounded animate-pulse mt-1"></div>
                <p v-else class="text-2xl font-bold text-amber-700">{{ statisticsStore.unpresensiStats.total_belum }}</p>
                <p class="text-xs text-amber-500 mt-1">slot jadwal terlewat</p>
            </div>
        </div>

        <!-- SECTION 1: BAR + TREN -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-base font-semibold text-gray-900">Rekap Kehadiran</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Hadir · Tidak Hadir + Tugas · Tidak Hadir murni</p>
                </div>
                <div class="px-6 py-6" style="height: 280px;">
                    <Bar v-if="!statisticsStore.loadingBar" :data="barChartData" :options="barChartOptions" />
                    <div v-else class="h-full flex items-center justify-center">
                        <Loader2 class="h-6 w-6 animate-spin text-gray-300" />
                    </div>
                </div>
            </div>
            <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-base font-semibold text-gray-900">Tren Kehadiran</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Pergerakan hadir & tidak hadir per periode</p>
                </div>
                <div class="px-6 py-6" style="height: 280px;">
                    <Line v-if="!statisticsStore.loadingTren" :data="trenChartData" :options="trenChartOptions" />
                    <div v-else class="h-full flex items-center justify-center">
                        <Loader2 class="h-6 w-6 animate-spin text-gray-300" />
                    </div>
                </div>
            </div>
        </div>

        <!-- SECTION 2: TOP 10 -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
            <!-- Top 10 Hadir -->
            <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-base font-semibold text-gray-900">Top 10 Kehadiran</h2>
                    <p class="text-xs text-gray-400 mt-0.5">{{ selectedKelas ? 'Di kelas yang dipilih' : 'Semua kelas' }}</p>
                </div>
                <template v-if="!statisticsStore.loadingTopHadir">
                    <div v-if="statisticsStore.topHadir.length > 0" class="overflow-y-auto"
                        style="max-height: 340px; scrollbar-width: none;">
                        <div v-for="guru in statisticsStore.topHadir" :key="guru.nama_guru"
                            class="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                            <div :class="[
                                'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                                guru.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                                guru.rank === 2 ? 'bg-gray-100 text-gray-500' :
                                guru.rank === 3 ? 'bg-orange-100 text-orange-500' : 'bg-gray-50 text-gray-400'
                            ]">{{ guru.rank }}</div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">{{ guru.nama_guru }}</p>
                                <p class="text-xs text-gray-400">{{ guru.total_hadir }} / {{ guru.total_jadwal }} jadwal</p>
                            </div>
                            <div class="w-20 hidden sm:block">
                                <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full rounded-full bg-emerald-400 transition-all"
                                        :style="{ width: (guru.persen || 0) + '%' }"></div>
                                </div>
                            </div>
                            <div class="flex-shrink-0 text-sm font-semibold text-emerald-500 w-12 text-right">
                                {{ guru.persen || 0 }}%
                            </div>
                        </div>
                    </div>
                    <div v-else class="px-6 py-10 text-center text-sm text-gray-400">Belum ada data untuk periode ini</div>
                </template>
                <div v-else class="flex items-center justify-center py-10">
                    <Loader2 class="h-6 w-6 animate-spin text-gray-300" />
                </div>
            </div>

            <!-- Top 10 Tidak Hadir -->
            <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-base font-semibold text-gray-900">Top 10 Ketidakhadiran</h2>
                    <p class="text-xs text-gray-400 mt-0.5">{{ selectedKelas ? 'Di kelas yang dipilih' : 'Semua kelas' }}</p>
                </div>
                <template v-if="!statisticsStore.loadingTopTidakHadir">
                    <div v-if="statisticsStore.topTidakHadir.length > 0" class="overflow-y-auto"
                        style="max-height: 340px; scrollbar-width: none;">
                        <div v-for="guru in statisticsStore.topTidakHadir" :key="guru.nama_guru"
                            class="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                            <div :class="[
                                'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                                guru.rank === 1 ? 'bg-red-100 text-red-500' :
                                guru.rank === 2 ? 'bg-orange-100 text-orange-500' :
                                guru.rank === 3 ? 'bg-yellow-100 text-yellow-600' : 'bg-gray-50 text-gray-400'
                            ]">{{ guru.rank }}</div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">{{ guru.nama_guru }}</p>
                                <p class="text-xs text-gray-400">{{ guru.total_tidak_hadir }} kali tidak hadir</p>
                            </div>
                            <div class="flex-shrink-0 text-sm font-semibold text-red-400">{{ guru.total_tidak_hadir }}x</div>
                        </div>
                    </div>
                    <div v-else class="px-6 py-10 text-center text-sm text-gray-400">Belum ada data untuk periode ini</div>
                </template>
                <div v-else class="flex items-center justify-center py-10">
                    <Loader2 class="h-6 w-6 animate-spin text-gray-300" />
                </div>
            </div>
        </div>

        <!-- SECTION 3: TABEL PERFORMA PER GURU -->
        <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 class="text-base font-semibold text-gray-900">Performa Per Guru</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Detail kehadiran, ketidakhadiran, dan slot belum dipresensi per guru</p>
                </div>
                <div class="relative w-full sm:w-56">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <input v-model="searchGuru" type="text" placeholder="Cari nama guru..."
                        class="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded-sm outline-none focus:border-blue-500" />
                </div>
            </div>

            <template v-if="!statisticsStore.loadingPerforma">
                <div v-if="filteredPerforma.length > 0" class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                                    @click="sortBy('nama_guru')">
                                    <div class="flex items-center gap-1">
                                        Nama Guru
                                        <SortIcon field="nama_guru" :sort-field="sortField" :sort-dir="sortDir" />
                                    </div>
                                </th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                                    @click="sortBy('hadir')">
                                    <div class="flex items-center justify-center gap-1">
                                        Hadir
                                        <SortIcon field="hadir" :sort-field="sortField" :sort-dir="sortDir" />
                                    </div>
                                </th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-amber-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                                    @click="sortBy('tidak_hadir_tugas')">
                                    <div class="flex items-center justify-center gap-1">
                                        TH + Tugas
                                        <SortIcon field="tidak_hadir_tugas" :sort-field="sortField" :sort-dir="sortDir" />
                                    </div>
                                </th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-red-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                                    @click="sortBy('tidak_hadir')">
                                    <div class="flex items-center justify-center gap-1">
                                        Tidak Hadir
                                        <SortIcon field="tidak_hadir" :sort-field="sortField" :sort-dir="sortDir" />
                                    </div>
                                </th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                                    @click="sortBy('tidak_dipresensi')">
                                    <div class="flex items-center justify-center gap-1">
                                        Blm Dipresensi
                                        <SortIcon field="tidak_dipresensi" :sort-field="sortField" :sort-dir="sortDir" />
                                    </div>
                                </th>
                                <th class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                                    @click="sortBy('pct_hadir')">
                                    <div class="flex items-center justify-center gap-1">
                                        % Hadir
                                        <SortIcon field="pct_hadir" :sort-field="sortField" :sort-dir="sortDir" />
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-100">
                            <tr v-for="guru in filteredPerforma" :key="guru.nama_guru"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-3.5 text-sm font-medium text-gray-900 whitespace-nowrap">
                                    {{ guru.nama_guru }}
                                </td>
                                <td class="px-4 py-3.5 text-center text-sm text-emerald-600 font-semibold">
                                    {{ guru.hadir }}
                                </td>
                                <td class="px-4 py-3.5 text-center text-sm text-amber-600 font-medium">
                                    {{ guru.tidak_hadir_tugas }}
                                </td>
                                <td class="px-4 py-3.5 text-center text-sm text-red-500 font-medium">
                                    {{ guru.tidak_hadir }}
                                </td>
                                <td class="px-4 py-3.5 text-center">
                                    <span :class="[
                                        'text-sm font-medium',
                                        guru.tidak_dipresensi > 0 ? 'text-amber-500' : 'text-gray-300'
                                    ]">
                                        {{ guru.tidak_dipresensi }}
                                    </span>
                                </td>
                                <td class="px-4 py-3.5">
                                    <div class="flex items-center gap-2 justify-center">
                                        <div class="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                                            <div class="h-full rounded-full transition-all"
                                                :class="guru.pct_hadir >= 80 ? 'bg-emerald-400' : guru.pct_hadir >= 60 ? 'bg-amber-400' : 'bg-red-400'"
                                                :style="{ width: guru.pct_hadir + '%' }"></div>
                                        </div>
                                        <span :class="[
                                            'text-sm font-semibold',
                                            guru.pct_hadir >= 80 ? 'text-emerald-600' :
                                            guru.pct_hadir >= 60 ? 'text-amber-600' : 'text-red-500'
                                        ]">{{ guru.pct_hadir }}%</span>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div v-else class="px-6 py-10 text-center text-sm text-gray-400">
                    {{ searchGuru ? `Tidak ada guru dengan nama "${searchGuru}"` : 'Belum ada data untuk periode ini' }}
                </div>
            </template>
            <div v-else class="flex items-center justify-center py-12">
                <Loader2 class="h-6 w-6 animate-spin text-gray-300" />
            </div>
        </div>

        <!-- SECTION 4: LINE CHART PER GURU -->
        <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                    <h2 class="text-base font-semibold text-gray-900">Tren Kehadiran Per Guru</h2>
                    <p class="text-xs text-gray-400 mt-0.5">
                        {{ selectedGuru ? `Menampilkan: ${selectedGuru}` : selectedKelas ? 'Semua guru di kelas ini' : 'Top 5 guru paling sering hadir' }}
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <div class="relative">
                        <select v-model="selectedGuru" @change="onGuruChange"
                            class="appearance-none pl-3 pr-8 py-1.5 text-sm border border-gray-300 rounded-sm bg-white text-gray-700 cursor-pointer">
                            <option value="">{{ selectedKelas ? 'Semua Guru' : 'Top 5' }}</option>
                            <option v-for="nama in statisticsStore.lineChart.guruList" :key="nama" :value="nama">
                                {{ nama }}
                            </option>
                        </select>
                        <ChevronDown class="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
                    </div>
                    <button v-if="selectedGuru" @click="clearGuruFilter"
                        class="px-2 py-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">
                        Reset
                    </button>
                </div>
            </div>
            <div class="px-6 py-6" style="height: 320px;">
                <template v-if="!statisticsStore.loadingLine">
                    <Line v-if="statisticsStore.lineChart.datasets.length > 0"
                        :data="lineChartData" :options="lineChartOptions" />
                    <div v-else class="h-full flex items-center justify-center text-sm text-gray-400">
                        Belum ada data untuk periode ini
                    </div>
                </template>
                <div v-else class="h-full flex items-center justify-center">
                    <Loader2 class="h-6 w-6 animate-spin text-gray-300" />
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Line, Bar } from 'vue-chartjs'
import {
    Chart as ChartJS, CategoryScale, LinearScale,
    PointElement, LineElement, BarElement, Tooltip, Legend, Filler
} from 'chart.js'
import { ChevronDown, Loader2, Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-vue-next'
import { useStatisticsStore } from '@/stores/statistics'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Legend, Filler)

// ========================
// Sort Icon component
// ========================
const SortIcon = {
    props: ['field', 'sortField', 'sortDir'],
    components: { ArrowUpDown, ArrowUp, ArrowDown },
    template: `
        <ArrowUp v-if="sortField === field && sortDir === 'asc'" class="h-3 w-3 text-blue-500" />
        <ArrowDown v-else-if="sortField === field && sortDir === 'desc'" class="h-3 w-3 text-blue-500" />
        <ArrowUpDown v-else class="h-3 w-3 text-gray-300" />
    `
}

const statisticsStore = useStatisticsStore()
const selectedPeriode = ref('bulan')
const selectedKelas = ref('')
const selectedGuru = ref('')
const searchGuru = ref('')
const sortField = ref('pct_hadir')
const sortDir = ref('desc')

const onFilterChange = async () => {
    selectedGuru.value = ''
    await statisticsStore.fetchAll(selectedPeriode.value, selectedKelas.value || null, null)
}

const onGuruChange = async () => {
    await statisticsStore.getLinePerGuru(
        selectedPeriode.value,
        selectedKelas.value || null,
        selectedGuru.value || null
    )
}

const clearGuruFilter = async () => {
    selectedGuru.value = ''
    await statisticsStore.getLinePerGuru(selectedPeriode.value, selectedKelas.value || null, null)
}

const sortBy = (field) => {
    if (sortField.value === field) {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortField.value = field
        sortDir.value = field === 'nama_guru' ? 'asc' : 'desc'
    }
}

const filteredPerforma = computed(() => {
    let data = [...statisticsStore.performaGuru]

    if (searchGuru.value.trim()) {
        const q = searchGuru.value.toLowerCase()
        data = data.filter(g => g.nama_guru.toLowerCase().includes(q))
    }

    data.sort((a, b) => {
        const aVal = a[sortField.value]
        const bVal = b[sortField.value]
        if (typeof aVal === 'string') {
            return sortDir.value === 'asc'
                ? aVal.localeCompare(bVal)
                : bVal.localeCompare(aVal)
        }
        return sortDir.value === 'asc' ? aVal - bVal : bVal - aVal
    })

    return data
})

onMounted(async () => {
    await statisticsStore.getKelas()
    await statisticsStore.fetchAll('bulan', null, null)
})

// ========================
// BAR CHART
// ========================
const barChartData = computed(() => ({
    labels: statisticsStore.barChart.labels,
    datasets: [{
        label: 'Jumlah',
        data: statisticsStore.barChart.data,
        backgroundColor: ['#34d399', '#fbbf24', '#f87171'],
        borderRadius: 6,
        borderSkipped: false,
    }]
}))

const barChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 6,
            callbacks: {
                label: (ctx) => {
                    const pct = statisticsStore.barChart.percentages?.[ctx.dataIndex] ?? 0
                    return ` ${ctx.raw} presensi (${pct}%)`
                }
            }
        }
    },
    scales: {
        x: { grid: { display: false }, border: { display: false } },
        y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            border: { display: false },
            ticks: { font: { size: 12 }, color: '#94a3b8', stepSize: 1 }
        }
    }
}))

// ========================
// TREN CHART
// ========================
const trenChartData = computed(() => ({
    labels: statisticsStore.trenChart.labels,
    datasets: [
        {
            label: 'Hadir',
            data: statisticsStore.trenChart.hadir,
            borderColor: '#34d399', backgroundColor: '#34d39915',
            tension: 0.4, fill: false, pointRadius: 4, pointHoverRadius: 7,
            pointBackgroundColor: '#34d399', borderWidth: 2,
        },
        {
            label: 'Tidak Hadir + Tugas',
            data: statisticsStore.trenChart.tidakHadirTugas,
            borderColor: '#fbbf24', backgroundColor: '#fbbf2415',
            tension: 0.4, fill: false, pointRadius: 4, pointHoverRadius: 7,
            pointBackgroundColor: '#fbbf24', borderWidth: 2,
        },
        {
            label: 'Tidak Hadir',
            data: statisticsStore.trenChart.tidakHadir,
            borderColor: '#f87171', backgroundColor: '#f8717115',
            tension: 0.4, fill: false, pointRadius: 4, pointHoverRadius: 7,
            pointBackgroundColor: '#f87171', borderWidth: 2,
        }
    ]
}))

const trenChartOptions = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
        legend: {
            position: 'bottom',
            labels: { font: { size: 12 }, boxWidth: 12, usePointStyle: true, pointStyle: 'circle', padding: 20 }
        },
        tooltip: { backgroundColor: '#1e293b', titleFont: { size: 12, weight: 'bold' }, bodyFont: { size: 12 }, padding: 10, cornerRadius: 6 }
    },
    scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 12 }, color: '#94a3b8' } },
        y: { grid: { color: '#f1f5f9' }, border: { display: false }, beginAtZero: true, ticks: { font: { size: 12 }, color: '#94a3b8', stepSize: 1 } }
    }
}

// ========================
// LINE CHART
// ========================
const lineChartData = computed(() => ({
    labels: statisticsStore.lineChart.labels,
    datasets: statisticsStore.lineChart.datasets.map(d => ({
        label: d.nama_guru,
        data: d.data,
        borderColor: d.color, backgroundColor: d.color + '15',
        tension: 0.4, fill: false, pointRadius: 4, pointHoverRadius: 7,
        pointBackgroundColor: d.color, borderWidth: 2,
    }))
}))

const lineChartOptions = {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
        legend: {
            position: 'bottom',
            labels: { font: { size: 12 }, boxWidth: 12, usePointStyle: true, pointStyle: 'circle', padding: 20 }
        },
        tooltip: { backgroundColor: '#1e293b', titleFont: { size: 12, weight: 'bold' }, bodyFont: { size: 12 }, padding: 10, cornerRadius: 6 }
    },
    scales: {
        x: { grid: { display: false }, border: { display: false }, ticks: { font: { size: 12 }, color: '#94a3b8' } },
        y: { grid: { color: '#f1f5f9' }, border: { display: false }, beginAtZero: true, ticks: { font: { size: 12 }, color: '#94a3b8', stepSize: 1 } }
    }
}
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar { display: none; }
</style>