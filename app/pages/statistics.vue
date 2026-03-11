<template>
    <div class="max-w-7xl space-y-4 sm:space-y-5">

        <!-- FILTER GLOBAL -->
        <div class="bg-white rounded-sm border border-gray-200 px-6 py-4">
            <div class="flex flex-wrap items-center gap-3">
                <span class="text-sm font-medium text-gray-600">Filter:</span>

                <div class="relative">
                    <select v-model="selectedPeriode" @change="onFilterChange"
                        class="appearance-none pl-4 pr-9 py-2 text-sm border border-gray-300 rounded-sm bg-white text-gray-700 cursor-pointer transition">
                        <option value="minggu">Minggu Ini</option>
                        <option value="bulan">Bulan Ini</option>
                        <option value="tahun">Tahun Ini</option>
                    </select>
                    <ChevronDown
                        class="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>

                <div class="relative">
                    <select v-model="selectedKelas" @change="onFilterChange"
                        class="appearance-none pl-4 pr-9 py-2 text-sm border border-gray-300 rounded-sm bg-white text-gray-700 cursor-pointer transition">
                        <option value="">Semua Kelas</option>
                        <option v-for="kelas in statisticsStore.kelasList" :key="kelas.id" :value="kelas.id">
                            {{ kelas.name }}
                        </option>
                    </select>
                    <ChevronDown
                        class="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
            </div>
        </div>

        <!-- SECTION 1: BAR + TREN -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">

            <!-- Bar: Rekap Hadir vs Tidak Hadir -->
            <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-base font-semibold text-gray-900">Rekap Kehadiran</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Total hadir vs tidak hadir pada periode ini</p>
                </div>
                <div class="px-6 py-6" style="height: 260px;">
                    <Bar v-if="!statisticsStore.loadingBar" :data="barChartData" :options="barChartOptions" />
                    <div v-else class="h-full flex items-center justify-center">
                        <Loader2 class="h-6 w-6 animate-spin text-gray-300" />
                    </div>
                </div>
            </div>

            <!-- Line: Tren Keseluruhan -->
            <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-base font-semibold text-gray-900">Tren Kehadiran</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Pergerakan hadir & tidak hadir per periode</p>
                </div>
                <div class="px-6 py-6">
                    <Line v-if="!statisticsStore.loadingTren" :data="trenChartData" :options="trenChartOptions"
                        class="max-h-52" />
                    <div v-else class="flex items-center justify-center" style="height: 208px;">
                        <Loader2 class="h-6 w-6 animate-spin text-gray-300" />
                    </div>
                </div>
            </div>

        </div>

        <!-- SECTION 2: TOP HADIR + TOP TIDAK HADIR -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">

            <!-- Top 10 Hadir -->
            <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-base font-semibold text-gray-900">Top 10 Kehadiran</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Guru paling rajin hadir</p>
                </div>
                <template v-if="!statisticsStore.loadingTopHadir">
                    <div v-if="statisticsStore.topHadir.length > 0" class="overflow-y-auto"
                        style="max-height: 340px; scrollbar-width: none; -ms-overflow-style: none;">
                        <div v-for="(guru, index) in statisticsStore.topHadir" :key="guru.nama_guru"
                            class="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                            <div :class="[
                                'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                                index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                    index === 1 ? 'bg-gray-100 text-gray-500' :
                                        index === 2 ? 'bg-orange-100 text-orange-500' :
                                            'bg-gray-50 text-gray-400'
                            ]">{{ index + 1 }}</div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">{{ guru.nama_guru }}</p>
                                <p class="text-xs text-gray-400">{{ guru.total_hadir }} kali hadir</p>
                            </div>
                            <div class="w-20 hidden sm:block">
                                <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full rounded-full bg-emerald-400 transition-all"
                                        :style="{ width: (guru.persen || 0) + '%' }"></div>
                                </div>
                            </div>
                            <div class="flex-shrink-0 text-sm font-semibold text-emerald-500">
                                {{ guru.persen || 0 }}%
                            </div>
                        </div>
                    </div>
                    <div v-else class="px-6 py-10 text-center text-sm text-gray-400">
                        Belum ada data untuk periode ini
                    </div>
                </template>
                <div v-else class="flex items-center justify-center py-10">
                    <Loader2 class="h-6 w-6 animate-spin text-gray-300" />
                </div>
            </div>

            <!-- Top 10 Tidak Hadir -->
            <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-base font-semibold text-gray-900">Top 10 Ketidakhadiran</h2>
                    <p class="text-xs text-gray-400 mt-0.5">Guru paling sering tidak hadir</p>
                </div>
                <template v-if="!statisticsStore.loadingTopTidakHadir">
                    <div v-if="statisticsStore.topTidakHadir.length > 0" class="overflow-y-auto"
                        style="max-height: 340px; scrollbar-width: none; -ms-overflow-style: none;">
                        <div v-for="(guru, index) in statisticsStore.topTidakHadir" :key="guru.nama_guru"
                            class="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                            <div :class="[
                                'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                                index === 0 ? 'bg-red-100 text-red-500' :
                                    index === 1 ? 'bg-orange-100 text-orange-500' :
                                        index === 2 ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-gray-50 text-gray-400'
                            ]">{{ index + 1 }}</div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">{{ guru.nama_guru }}</p>
                                <p class="text-xs text-gray-400">{{ guru.total_tidak_hadir }} kali tidak hadir</p>
                            </div>
                            <div class="flex-shrink-0 text-sm font-semibold text-red-400">
                                {{ guru.total_tidak_hadir }}x
                            </div>
                        </div>
                    </div>
                    <div v-else class="px-6 py-10 text-center text-sm text-gray-400">
                        Belum ada data untuk periode ini
                    </div>
                </template>
                <div v-else class="flex items-center justify-center py-10">
                    <Loader2 class="h-6 w-6 animate-spin text-gray-300" />
                </div>
            </div>

        </div>

        <!-- SECTION 3: LINE CHART PER GURU -->
        <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
            <div class="px-6 py-4 border-b border-gray-200">
                <h2 class="text-base font-semibold text-gray-900">Tren Kehadiran Per Guru</h2>
                <p class="text-xs text-gray-400 mt-0.5">
                    {{ selectedKelas ? 'Semua guru di kelas yang dipilih' : 'Top 10 guru paling sering hadir' }}
                </p>
            </div>
            <div class="px-6 py-6">
                <template v-if="!statisticsStore.loadingLine">
                    <Line v-if="statisticsStore.lineChart.datasets.length > 0" :data="lineChartData"
                        :options="lineChartOptions" class="max-h-80" />
                    <div v-else class="h-80 flex items-center justify-center text-sm text-gray-400">
                        Belum ada data untuk periode ini
                    </div>
                </template>
                <div v-else class="h-80 flex items-center justify-center">
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
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { ChevronDown, Loader2 } from 'lucide-vue-next'
import { useStatisticsStore } from '@/stores/statistics'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Tooltip,
    Legend,
    Filler
)

const statisticsStore = useStatisticsStore()
const selectedPeriode = ref('bulan')
const selectedKelas = ref('')

const onFilterChange = async () => {
    await statisticsStore.fetchAll(
        selectedPeriode.value,
        selectedKelas.value || null
    )
}

onMounted(async () => {
    await statisticsStore.getKelas()
    await statisticsStore.fetchAll('bulan', null)
})

// ========================
// 1. BAR CHART
// ========================
const barChartData = computed(() => ({
    labels: statisticsStore.barChart.labels,
    datasets: [{
        label: 'Jumlah',
        data: statisticsStore.barChart.data,
        backgroundColor: ['#60a5fa', '#fca5a5'],
        borderRadius: 4,
        borderSkipped: false,
    }]
}))

const barChartOptions = {
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
        }
    },
    scales: {
        x: { grid: { display: false }, border: { display: false } },
        y: {
            beginAtZero: true,
            grid: { color: '#f1f5f9' },
            border: { display: false },
            ticks: { font: { size: 12 }, color: '#94a3b8' }
        }
    }
}

// ========================
// 2. TREN KESELURUHAN
// ========================
const trenChartData = computed(() => ({
    labels: statisticsStore.trenChart.labels,
    datasets: [
        {
            label: 'Hadir',
            data: statisticsStore.trenChart.hadir,
            borderColor: '#60a5fa',
            backgroundColor: '#60a5fa15',
            tension: 0.4,
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: '#60a5fa',
            borderWidth: 2,
        },
        {
            label: 'Tidak Hadir',
            data: statisticsStore.trenChart.tidakHadir,
            borderColor: '#f87171',
            backgroundColor: '#f8717115',
            tension: 0.4,
            fill: false,
            pointRadius: 4,
            pointHoverRadius: 7,
            pointBackgroundColor: '#f87171',
            borderWidth: 2,
        }
    ]
}))

const trenChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: { mode: 'index', intersect: false },
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                font: { size: 12 },
                boxWidth: 12,
                boxHeight: 12,
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20,
            }
        },
        tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 6,
        }
    },
    scales: {
        x: {
            grid: { display: false },
            border: { display: false },
            ticks: { font: { size: 12 }, color: '#94a3b8' }
        },
        y: {
            grid: { color: '#f1f5f9' },
            border: { display: false },
            beginAtZero: true,
            ticks: { font: { size: 12 }, color: '#94a3b8' }
        }
    }
}

// ========================
// 3. LINE CHART PER GURU
// ========================
const lineChartData = computed(() => ({
    labels: statisticsStore.lineChart.labels,
    datasets: statisticsStore.lineChart.datasets.map(d => ({
        label: d.nama_guru,
        data: d.data,
        borderColor: d.color,
        backgroundColor: d.color + '15',
        tension: 0.4,
        fill: false,
        pointRadius: 4,
        pointHoverRadius: 7,
        pointBackgroundColor: d.color,
        borderWidth: 2,
    }))
}))

const lineChartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: true,
    interaction: { mode: 'nearest', intersect: true },
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                font: { size: 12 },
                boxWidth: 12,
                boxHeight: 12,
                usePointStyle: true,
                pointStyle: 'circle',
                padding: 20,
            }
        },
        tooltip: {
            backgroundColor: '#1e293b',
            titleFont: { size: 12, weight: 'bold' },
            bodyFont: { size: 12 },
            padding: 10,
            cornerRadius: 6,
        }
    },
    scales: {
        x: {
            grid: { display: false },
            border: { display: false },
            ticks: { font: { size: 12 }, color: '#94a3b8' }
        },
        y: {
            grid: { color: '#f1f5f9' },
            border: { display: false },
            beginAtZero: true,
            ticks: { font: { size: 12 }, color: '#94a3b8', stepSize: 1 }
        }
    }
}))
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
    display: none;
}
</style>