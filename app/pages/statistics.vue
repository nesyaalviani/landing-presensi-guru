<template>
    <div class="max-w-7xl">
        <section>
            <div class="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">

                <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <div>
                        <h2 class="text-base font-semibold text-gray-900">Tren Kehadiran Guru</h2>
                    </div>

                    <div class="relative">
                        <select v-model="selectedPeriode" @change="onPeriodeChange"
                            class="appearance-none pl-4 pr-9 py-2 text-sm border border-gray-300 rounded-sm bg-white text-gray-700 cursor-pointer transition">
                            <option value="minggu">Minggu Ini</option>
                            <option value="bulan">Bulan Ini</option>
                            <option value="tahun">Tahun Ini</option>
                        </select>
                        <ChevronDown
                            class="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div class="px-6 py-6">
                    <Line v-if="!loading" :data="chartData" :options="chartOptions" class="max-h-80" />
                    <div v-else class="h-80 flex items-center justify-center">
                        <Loader2 class="h-6 w-6 animate-spin text-gray-300" />
                    </div>
                </div>

            </div>
        </section>

        <section class="mt-4 sm:mt-5">
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 items-start">

                <div class="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
                    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <div>
                            <h2 class="text-base font-semibold text-gray-900">Peringkat Teratas Minggu Ini</h2>
                        </div>
                    </div>
                    <div class="overflow-y-auto"
                        style="max-height: 340px; scrollbar-width: none; -ms-overflow-style: none;">
                        <div v-for="(guru, index) in peringkatList" :key="guru.nama"
                            class="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                            <div :class="[
                                'flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold',
                                index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                    index === 1 ? 'bg-gray-100 text-gray-500' :
                                        index === 2 ? 'bg-orange-100 text-orange-500' :
                                            'bg-gray-50 text-gray-400'
                            ]">{{ index + 1 }}</div>
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-900 truncate">{{ guru.nama }}</p>
                                <p class="text-xs text-gray-400">{{ guru.jabatan }}</p>
                            </div>
                            <div class="w-24 hidden sm:block">
                                <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                    <div class="h-full rounded-full transition-all"
                                        :style="{ width: guru.persen + '%', backgroundColor: guru.color }"></div>
                                </div>
                            </div>
                            <div class="flex-shrink-0 text-sm font-semibold" :style="{ color: guru.color }">
                                {{ guru.persen }}%
                            </div>
                        </div>
                    </div>
                </div>

                <div class="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden lg:col-span-2">
                    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <div>
                            <h2 class="text-base font-semibold text-gray-900">Tren Presensi</h2>
                        </div>
                        <div class="relative">
                            <select v-model="selectedPeriodeBar" @change="onPeriodeBarChange"
                                class="appearance-none pl-4 pr-9 py-2 text-sm border border-gray-300 rounded-sm bg-white text-gray-700 cursor-pointer transition">
                                <option value="minggu">Minggu Ini</option>
                                <option value="bulan">Bulan Ini</option>
                                <option value="tahun">Tahun Ini</option>
                            </select>
                            <ChevronDown
                                class="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                    <div class="px-6 py-6">
                        <Bar v-if="!loadingBar" :data="barChartData" :options="barOptions" class="max-h-80" />
                        <div v-else class="flex items-center justify-center" style="height: 220px;">
                            <Loader2 class="h-6 w-6 animate-spin text-gray-300" />
                        </div>
                    </div>
                </div>

            </div>
        </section>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Line, Doughnut, Bar } from 'vue-chartjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { ChevronDown, Loader2 } from 'lucide-vue-next'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    Filler
)

const selectedPeriode = ref('bulan')
const loading = ref(false)

const DUMMY = {
    minggu: {
        labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
        datasets: [
            { nama: 'Budi Santoso', data: [1, 0, 1, 1, 1], color: '#6366f1' },
            { nama: 'Siti Rahayu', data: [1, 1, 1, 1, 1], color: '#0ea5e9' },
            { nama: 'Agus Widodo', data: [0, 1, 0, 1, 0], color: '#f97316' },
            { nama: 'Nina Pratiwi', data: [1, 1, 1, 0, 1], color: '#8b5cf6' },
            { nama: 'Eko Prasetyo', data: [1, 1, 1, 1, 0], color: '#14b8a6' },
        ]
    },
    bulan: {
        labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
        datasets: [
            { nama: 'Budi Santoso', data: [5, 3, 6, 4], color: '#6366f1' },
            { nama: 'Siti Rahayu', data: [7, 7, 7, 6], color: '#0ea5e9' },
            { nama: 'Agus Widodo', data: [3, 2, 4, 4], color: '#f97316' },
            { nama: 'Nina Pratiwi', data: [4, 4, 4, 5], color: '#8b5cf6' },
            { nama: 'Eko Prasetyo', data: [6, 5, 6, 5], color: '#14b8a6' },
        ]
    },
    tahun: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        datasets: [
            { nama: 'Budi Santoso', data: [18, 15, 17, 16, 18, 14, 17, 16, 15, 18, 17, 16], color: '#6366f1' },
            { nama: 'Siti Rahayu', data: [22, 21, 22, 20, 22, 21, 22, 21, 20, 22, 21, 22], color: '#0ea5e9' },
            { nama: 'Agus Widodo', data: [12, 10, 11, 9, 12, 8, 11, 10, 9, 11, 10, 9], color: '#f97316' },
            { nama: 'Nina Pratiwi', data: [14, 14, 13, 14, 14, 13, 14, 14, 13, 14, 14, 13], color: '#8b5cf6' },
            { nama: 'Eko Prasetyo', data: [19, 18, 19, 17, 18, 17, 19, 18, 17, 19, 18, 17], color: '#14b8a6' },
        ]
    }
}

const activeData = ref(DUMMY['bulan'])

const onPeriodeChange = () => {
    loading.value = true
    setTimeout(() => {
        activeData.value = DUMMY[selectedPeriode.value]
        loading.value = false
    }, 300)
}

const chartData = computed(() => ({
    labels: activeData.value.labels,
    datasets: activeData.value.datasets.map(d => ({
        label: d.nama,
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

const chartOptions = computed(() => ({
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
        mode: 'nearest',
        intersect: true,
    },
    layout: {
        padding: {}
    },
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
            ticks: { font: { size: 12 }, color: '#94a3b8', stepSize: 2 }
        }
    }
}))

const peringkatList = [
    { nama: 'Siti Rahayu', jabatan: 'Guru Senior', persen: 100, color: '#4ade80' },
    { nama: 'Eko Prasetyo', jabatan: 'Guru Madya', persen: 96, color: '#34d399' },
    { nama: 'Nina Pratiwi', jabatan: 'Guru Muda', persen: 92, color: '#34d399' },
    { nama: 'Budi Santoso', jabatan: 'Guru Madya', persen: 88, color: '#60a5fa' },
    { nama: 'Dewi Lestari', jabatan: 'Guru Senior', persen: 84, color: '#60a5fa' },
    { nama: 'Hendra Wijaya', jabatan: 'Guru Muda', persen: 80, color: '#a78bfa' },
    { nama: 'Rina Marlina', jabatan: 'Guru Muda', persen: 76, color: '#a78bfa' },
    { nama: 'Ahmad Fauzi', jabatan: 'Guru Senior', persen: 72, color: '#fbbf24' },
    { nama: 'Dian Safitri', jabatan: 'Guru Madya', persen: 68, color: '#fbbf24' },
    { nama: 'Agus Widodo', jabatan: 'Guru Muda', persen: 60, color: '#fb7185' },
]

const BAR_DUMMY = {
    minggu: {
        labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
        hadir: [38, 35, 40, 37, 35],
        tidakHadir: [7, 10, 5, 8, 10],
    },
    bulan: {
        labels: ['Minggu 1', 'Minggu 2', 'Minggu 3', 'Minggu 4'],
        hadir: [185, 178, 192, 180],
        tidakHadir: [40, 47, 33, 45],
    },
    tahun: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
        hadir: [180, 165, 190, 175, 185, 178, 192, 188, 170, 195, 182, 178],
        tidakHadir: [45, 60, 35, 50, 40, 47, 33, 37, 55, 30, 43, 47],
    }
}

const selectedPeriodeBar = ref('minggu')
const loadingBar = ref(false)
const activeBarData = ref(BAR_DUMMY['minggu'])

const onPeriodeBarChange = () => {
    loadingBar.value = true
    setTimeout(() => {
        activeBarData.value = BAR_DUMMY[selectedPeriodeBar.value]
        loadingBar.value = false
    }, 300)
}

const barChartData = computed(() => ({
    labels: activeBarData.value.labels,
    datasets: [
        {
            label: 'Hadir',
            data: activeBarData.value.hadir,
            backgroundColor: '#60a5fa',
            borderRadius: 0,
            borderSkipped: false
        },
        {
            label: 'Tidak Hadir',
            data: activeBarData.value.tidakHadir,
            backgroundColor: '#fca5a5',
            borderRadius: 0,
            borderSkipped: false
        }
    ]
}))

const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
            labels: { font: { size: 11 }, usePointStyle: false, boxWidth: 16, boxHeight: 10, borderRadius: 0, useBorderRadius: false }
        }
    },
    scales: {
        x: { grid: { display: false } },
        y: {
            beginAtZero: true,
            grid: { color: '#f3f4f6' },
            ticks: { stepSize: 10 }
        }
    }
}
</script>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
    display: none;
}
</style>