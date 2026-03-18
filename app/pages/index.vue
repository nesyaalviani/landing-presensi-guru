<template>
  <!-- Stat Cards -->
  <section>
    <div class="mx-auto max-w-7xl">
      <div class="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <div class="px-4 py-6 shadow-lg shadow-blue-100 bg-white rounded-sm">
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-500">Jumlah Guru</p>
              <p class="mt-2 text-3xl font-semibold text-gray-800">25</p>
            </div>
            <div
              class="h-12 w-12 rounded-xl bg-blue-50 p-2.5 text-blue-400 flex items-center justify-center flex-shrink-0">
              <CircleUserRound class="h-7 w-7" />
            </div>
          </div>
        </div>

        <div class="px-4 py-6 shadow-lg shadow-green-100 bg-white rounded-sm">
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-500">Presensi Masuk</p>
              <p class="mt-2 text-3xl font-semibold text-gray-800">35</p>
            </div>
            <div
              class="h-12 w-12 rounded-xl bg-green-50 p-2.5 text-green-400 flex items-center justify-center flex-shrink-0">
              <UserCheck class="h-7 w-7" />
            </div>
          </div>
        </div>

        <div class="px-4 py-6 shadow-lg shadow-rose-100 bg-white rounded-sm">
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-500">Belum Presensi</p>
              <p class="mt-2 text-3xl font-semibold text-gray-800">10</p>
            </div>
            <div
              class="h-12 w-12 rounded-xl bg-rose-50 p-2.5 text-rose-400 flex items-center justify-center flex-shrink-0">
              <UserX class="h-7 w-7" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Charts Section -->
  <section class="mt-6">
    <div class="mx-auto max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">

        <!-- Donut Chart: Presensi Hari Ini -->
        <div class="bg-white rounded-sm shadow-lg shadow-gray-100 p-5">
          <h2 class="text-sm font-semibold text-gray-700 mb-1">Presensi Hari Ini</h2>
          <p class="text-xs text-gray-400 mb-4">Proporsi kehadiran guru</p>
          <div class="flex items-center justify-center" style="height: 200px;">
            <Doughnut :data="donutData" :options="donutOptions" />
          </div>
          <div class="mt-4 flex justify-center gap-6 text-xs text-gray-500">
            <span class="flex items-center gap-1.5">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-green-400"></span>
              Hadir (35)
            </span>
            <span class="flex items-center gap-1.5">
              <span class="inline-block w-2.5 h-2.5 rounded-full bg-rose-400"></span>
              Belum (10)
            </span>
          </div>
        </div>

        <!-- Bar Chart: Tren Presensi Mingguan -->
        <div class="bg-white rounded-sm shadow-lg shadow-gray-100 p-5 lg:col-span-2">
          <h2 class="text-sm font-semibold text-gray-700 mb-1">Tren Presensi Minggu Ini</h2>
          <p class="text-xs text-gray-400 mb-4">Perbandingan hadir vs tidak hadir per hari</p>
          <div style="height: 220px;">
            <Bar :data="barData" :options="barOptions" />
          </div>
        </div>

      </div>

      <!-- Line Chart: Rekap Bulanan -->
      <div class="mt-4 sm:mt-5 bg-white rounded-sm shadow-lg shadow-gray-100 p-5">
        <h2 class="text-sm font-semibold text-gray-700 mb-1">Rekap Kehadiran Bulanan</h2>
        <p class="text-xs text-gray-400 mb-4">Tren kehadiran guru sepanjang tahun</p>
        <div style="height: 240px;">
          <Line :data="lineData" :options="lineOptions" />
        </div>
      </div>
    </div>
  </section>

  <!-- Tabel Monitoring -->
  <section class="mt-8">
    <div class="mx-auto max-w-7xl">
      <div class="mb-6">
        <h1 class="text-2xl font-bold text-gray-900">Monitoring Presensi Guru Hari Ini</h1>
      </div>

      <div class="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div class="relative w-full sm:max-w-md">
          <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input type="text" placeholder="Cari berdasarkan nama guru..."
            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-500 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
        </div>
      </div>

      <div class="bg-white rounded-sm shadow overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-100">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jam
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kelas
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guru
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Verifikasi
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="guru in guruList" :key="guru.id" class="hover:bg-gray-50 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {{ guru.jam }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {{ guru.kelas }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ guru.nama }}</div>
                  <div class="text-sm text-gray-500">{{ guru.jabatan }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                    guru.status === 'Hadir'
                      ? 'bg-green-100 text-green-800'
                      : guru.status === 'Izin'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-rose-100 text-rose-800'
                  ]">
                    {{ guru.status }}
                  </span>
                </td>
                <td class="whitespace-no-wrap py-4 text-sm font-normal text-gray-500 px-6">
                  <div :class="[
                    'inline-flex items-center rounded-full py-2 px-3 text-xs text-white',
                    guru.verifikasi === 'Disetujui' ? 'bg-blue-600' : 'bg-gray-400'
                  ]">
                    {{ guru.verifikasi }}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div></div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <ChevronLeft class="h-5 w-5" />
                  </button>
                  <button
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                    1
                  </button>
                  <button
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    2
                  </button>
                  <button
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                    3
                  </button>
                  <button
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <ChevronRight class="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { CircleUserRound, UserCheck, UserX, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Doughnut, Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler
} from 'chart.js'

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Filler
)

// --- Data Tabel ---
const guruList = [
  { id: 1, jam: '07:15 - 16:30 WIB', kelas: 'XII RPL 1', nama: 'Siti Nurhaliza', jabatan: 'Guru Senior', status: 'Hadir', verifikasi: 'Disetujui' },
  { id: 2, jam: '07:15 - 16:30 WIB', kelas: 'XI TKJ 2', nama: 'Budi Santoso', jabatan: 'Guru Madya', status: 'Hadir', verifikasi: 'Disetujui' },
  { id: 3, jam: '07:15 - 16:30 WIB', kelas: 'X MM 1', nama: 'Dewi Rahayu', jabatan: 'Guru Muda', status: 'Izin', verifikasi: 'Menunggu' },
  { id: 4, jam: '07:15 - 16:30 WIB', kelas: 'XII AKL 1', nama: 'Ahmad Fauzi', jabatan: 'Guru Senior', status: 'Hadir', verifikasi: 'Disetujui' },
  { id: 5, jam: '07:15 - 16:30 WIB', kelas: 'XI OTKP 1', nama: 'Rina Marlina', jabatan: 'Guru Muda', status: 'Tidak Hadir', verifikasi: 'Menunggu' },
]

// --- Donut Chart ---
const donutData = {
  labels: ['Hadir', 'Belum Presensi'],
  datasets: [{
    data: [35, 10],
    backgroundColor: ['#4ade80', '#fb7185'],
    borderWidth: 0,
    hoverOffset: 6
  }]
}

const donutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: '72%',
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (ctx) => ` ${ctx.label}: ${ctx.parsed} guru`
      }
    }
  }
}

// --- Bar Chart ---
const barData = {
  labels: ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'],
  datasets: [
    {
      label: 'Hadir',
      data: [38, 35, 40, 37, 35],
      backgroundColor: '#60a5fa',
      borderRadius: 4,
      borderSkipped: false
    },
    {
      label: 'Tidak Hadir',
      data: [7, 10, 5, 8, 10],
      backgroundColor: '#fca5a5',
      borderRadius: 4,
      borderSkipped: false
    }
  ]
}

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: { font: { size: 11 }, usePointStyle: true, pointStyleWidth: 8 }
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

// --- Line Chart ---
const lineData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'],
  datasets: [
    {
      label: 'Hadir',
      data: [180, 165, 190, 175, 185, 178, 192, 188, 170, 195, 182, 178],
      borderColor: '#34d399',
      backgroundColor: 'rgba(52, 211, 153, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#34d399'
    },
    {
      label: 'Tidak Hadir',
      data: [45, 60, 35, 50, 40, 47, 33, 37, 55, 30, 43, 47],
      borderColor: '#f87171',
      backgroundColor: 'rgba(248, 113, 113, 0.08)',
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#f87171'
    }
  ]
}

const lineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
    intersect: false
  },
  plugins: {
    legend: {
      position: 'top',
      labels: { font: { size: 11 }, usePointStyle: true, pointStyleWidth: 8 }
    }
  },
  scales: {
    x: { grid: { display: false } },
    y: {
      beginAtZero: true,
      grid: { color: '#f3f4f6' },
      ticks: { stepSize: 50 }
    }
  }
}
</script>