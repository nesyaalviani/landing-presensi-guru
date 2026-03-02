<template>
        <div class="max-w-7xl">
            <section>
                <div class="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">

                    <!-- Header -->
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

                    <!-- Chart -->
                    <div class="px-6 py-6">
                        <Line v-if="!loading" :data="chartData" :options="chartOptions" class="max-h-80" />
                        <div v-else class="h-80 flex items-center justify-center">
                            <Loader2 class="h-6 w-6 animate-spin text-gray-300" />
                        </div>
                    </div>

                </div>
            </section>
        </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Line } from 'vue-chartjs'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Filler
} from 'chart.js'
import { ChevronDown, Loader2 } from 'lucide-vue-next'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

const selectedPeriode = ref('bulan')
const loading = ref(false)

// ── Dummy Data ────────────────────────────────────────────
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
</script>