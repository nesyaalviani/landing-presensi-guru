<template>
  <div class="space-y-5">

    <!-- Header -->
    <div class="flex items-start justify-between gap-4">
      <div>
        <h1 class="text-xl font-semibold text-gray-900">{{ greeting }}, {{ userName }}</h1>
        <p class="text-sm text-gray-400 mt-0.5">{{ todayLabel }}</p>
      </div>
      <div class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-sm flex-shrink-0">
        <div class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <span class="text-sm font-mono text-gray-500">{{ serverTime }}</span>
      </div>
    </div>

    <!-- Banner kalender — tampil kalau ada kegiatan/libur hari ini -->
    <div v-if="kalenderHariIni" class="flex items-center gap-3 px-4 py-3 bg-blue-50 border border-blue-200 rounded-sm">
      <CalendarDays class="h-4 w-4 text-blue-500 flex-shrink-0" />
      <p class="text-sm text-blue-800">
        <span class="font-semibold">Hari ini:</span>
        {{ kalenderHariIni.keterangan }}
        <span v-if="kalenderHariIni.jam" class="text-blue-600">
          ({{ kalenderHariIni.jam }})
        </span>
      </p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="bg-white rounded-sm border border-gray-200 px-5 py-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-medium text-gray-400">Total Jadwal</p>
          <CalendarDays class="h-4 w-4 text-gray-300" />
        </div>
        <p class="text-2xl font-bold text-gray-900">{{ summary.total }}</p>
        <p class="text-xs text-gray-400 mt-1">hari ini</p>
      </div>

      <div class="bg-white rounded-sm border border-yellow-100 px-5 py-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-medium text-gray-400">Menunggu</p>
          <Clock class="h-4 w-4 text-yellow-300" />
        </div>
        <p class="text-2xl font-bold text-yellow-500">{{ summary.pending }}</p>
        <p class="text-xs text-gray-400 mt-1">pending approval</p>
      </div>

      <div class="bg-white rounded-sm border border-green-100 px-5 py-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-medium text-gray-400">Disetujui</p>
          <CheckCircle class="h-4 w-4 text-green-300" />
        </div>
        <p class="text-2xl font-bold text-green-600">{{ summary.approved }}</p>
        <p class="text-xs text-gray-400 mt-1">dari {{ summary.total }} jadwal</p>
      </div>

      <div class="bg-white rounded-sm border border-red-100 px-5 py-5">
        <div class="flex items-center justify-between mb-3">
          <p class="text-xs font-medium text-gray-400">Belum Presensi</p>
          <AlertCircle class="h-4 w-4 text-red-300" />
        </div>
        <p class="text-2xl font-bold text-red-500">{{ summary.belum }}</p>
        <p class="text-xs text-gray-400 mt-1">jam sudah lewat</p>
      </div>
    </div>

    <!-- 2 Kolom Utama -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">

      <!-- Kiri: Guru hadir / tidak hadir hari ini -->
      <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="text-sm font-semibold text-gray-900">Kehadiran Guru Hari Ini</h2>
            <p class="text-xs text-gray-400 mt-0.5">Berdasarkan presensi yang sudah disetujui</p>
          </div>
          <NuxtLink to="/approval"
            class="text-xs text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700 flex-shrink-0">
            Kelola
            <ChevronRight class="h-3.5 w-3.5" />
          </NuxtLink>
        </div>

        <!-- Tab hadir / tidak hadir -->
        <div class="flex border-b border-gray-100">
          <button @click="activeTab = 'hadir'" :class="[
            'flex-1 py-2.5 text-xs font-semibold transition-colors',
            activeTab === 'hadir'
              ? 'text-green-600 border-b-2 border-green-500 bg-green-50'
              : 'text-gray-400 hover:text-gray-600'
          ]">
            Hadir ({{ hadirList.length }})
          </button>
          <button @click="activeTab = 'tidakHadir'" :class="[
            'flex-1 py-2.5 text-xs font-semibold transition-colors',
            activeTab === 'tidakHadir'
              ? 'text-red-500 border-b-2 border-red-400 bg-red-50'
              : 'text-gray-400 hover:text-gray-600'
          ]">
            Tidak Hadir ({{ tidakHadirList.length }})
          </button>
        </div>

        <div class="overflow-y-auto" style="max-height: 280px; scrollbar-width: none;">
          <template v-if="activeTab === 'hadir'">
            <!-- Loading state -->
            <div v-if="loading" class="px-5 py-8 text-center text-sm text-gray-400">
              Memuat data...
            </div>
            <div v-else-if="hadirList.length === 0" class="px-5 py-8 text-center text-sm text-gray-400">
              Belum ada presensi yang disetujui
            </div>
            <div v-for="item in hadirList" :key="item.id"
              class="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
              <div class="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-bold text-green-600">{{ item.inisial }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ item.guru }}</p>
                <p class="text-xs text-gray-400 truncate">{{ item.mapel }} · {{ item.kelas }}</p>
              </div>
              <p class="text-xs text-gray-400 flex-shrink-0">{{ item.jam }}</p>
            </div>
          </template>

          <template v-else>
            <div v-if="loading" class="px-5 py-8 text-center text-sm text-gray-400">
              Memuat data...
            </div>
            <div v-else-if="tidakHadirList.length === 0" class="px-5 py-8 text-center text-sm text-gray-400">
              Tidak ada guru yang tidak hadir hari ini
            </div>
            <div v-for="item in tidakHadirList" :key="item.id"
              class="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
              <div class="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span class="text-xs font-bold text-red-500">{{ item.inisial }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">{{ item.guru }}</p>
                <p class="text-xs text-gray-400 truncate">{{ item.mapel }} · {{ item.kelas }}</p>
              </div>
              <span class="text-xs flex-shrink-0 px-2 py-0.5 rounded-full"
                :class="item.tugas ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-600'">
                {{ item.tugas ? 'Ada Tugas' : 'Tanpa Tugas' }}
              </span>
            </div>
          </template>
        </div>
      </div>

      <!-- Kanan: Jadwal belum dipresensi -->
      <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
        <div class="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 class="text-sm font-semibold text-gray-900">Jadwal Belum Dipresensi</h2>
            <p class="text-xs text-gray-400 mt-0.5">Jam sudah lewat — perlu follow up ke KM</p>
          </div>
          <span v-if="belumPresensiList.length > 0"
            class="text-xs bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
            {{ belumPresensiList.length }}
          </span>
        </div>

        <div class="overflow-y-auto" style="max-height: 320px; scrollbar-width: none;">
          <!-- Loading state -->
          <div v-if="loading" class="px-5 py-10 text-center text-sm text-gray-400">
            Memuat data...
          </div>
          <div v-else-if="belumPresensiList.length === 0" class="px-5 py-10 text-center">
            <CheckCircle class="h-8 w-8 text-green-300 mx-auto mb-2" />
            <p class="text-sm text-gray-500 font-medium">Semua jadwal sudah dipresensi</p>
          </div>
          <div v-for="item in belumPresensiList" :key="item.id"
            class="flex items-center gap-3 px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
            <div class="w-1.5 h-8 rounded-full bg-red-200 flex-shrink-0"></div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate">{{ item.guru }}</p>
              <p class="text-xs text-gray-400 truncate">{{ item.mapel }} · {{ item.kelas }}</p>
            </div>
            <p class="text-xs text-gray-400 flex-shrink-0 bg-gray-100 px-2 py-1 rounded-sm font-mono">
              {{ item.jam }}
            </p>
          </div>
        </div>

        <div v-if="belumPresensiList.length > 0" class="px-5 py-3 bg-red-50 border-t border-red-100">
          <p class="text-xs text-red-600">
            <span class="font-semibold">{{ belumPresensiList.length }} jadwal</span>
            perlu tindak lanjut ke KM kelas masing-masing
          </p>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  CalendarDays, Clock, CheckCircle, AlertCircle, ChevronRight
} from 'lucide-vue-next'

const config = useRuntimeConfig()
const activeTab = ref('hadir')

// ── Waktu & tanggal ─────────────────────────────────────
const serverTime = ref('--:--:--')

const todayLabel = new Date().toLocaleDateString('id-ID', {
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 11) return 'Selamat Pagi'
  if (h < 15) return 'Selamat Siang'
  if (h < 18) return 'Selamat Sore'
  return 'Selamat Malam'
})

// Tick jam lokal setiap detik
onMounted(() => {
  const tick = () => {
    serverTime.value = new Date().toLocaleTimeString('id-ID', { hour12: false })
  }
  tick()
  setInterval(tick, 1000)
})

// ── Auth ────────────────────────────────────────────────
// Ganti dengan auth store saat integrasi penuh
const userName = ref('Admin')

// ── State dashboard ─────────────────────────────────────
const loading = ref(true)
const kalenderHariIni = ref(null)
const summary = ref({ total: 0, pending: 0, approved: 0, belum: 0 })
const hadirList = ref([])
const tidakHadirList = ref([])
const belumPresensiList = ref([])

// ── Fetch ────────────────────────────────────────────────
async function fetchDashboard() {
  try {
    const token = process.client ? localStorage.getItem('token') : null
    const data = await $fetch('/guru/dashboard-today', {
      method: 'GET',
      baseURL: config.public.apiBase,
      headers: { ...(token && { Authorization: `Bearer ${token}` }) }
    })

    kalenderHariIni.value = data.kalenderHariIni
    summary.value = data.summary
    hadirList.value = data.hadirList
    tidakHadirList.value = data.tidakHadirList
    belumPresensiList.value = data.belumPresensiList
  } catch (err) {
    console.error('Dashboard fetch error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchDashboard)
</script>