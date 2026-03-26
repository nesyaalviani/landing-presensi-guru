<template>
  <!-- Loading Skeleton -->
  <div v-if="presensiStore.loading" class="min-h-screen bg-slate-50 px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
    <div class="mx-auto max-w-3xl">
      <div class="mb-8">
        <div class="h-7 w-52 bg-slate-200 rounded-md animate-pulse mb-3"></div>
        <div class="h-4 w-72 bg-slate-200 rounded animate-pulse mb-2"></div>
        <div class="h-4 w-40 bg-slate-200 rounded animate-pulse"></div>
      </div>
      <div class="space-y-3">
        <div v-for="i in 4" :key="i"
          class="bg-white rounded-xl border border-slate-200 p-5 flex gap-0 items-stretch overflow-hidden"
          :style="{ opacity: 1 - (i - 1) * 0.18 }">
          <div class="w-1 bg-slate-200 animate-pulse flex-shrink-0 mr-4 rounded-full"></div>
          <div class="flex-1 space-y-2.5 py-1">
            <div class="h-5 w-36 bg-slate-200 rounded animate-pulse"></div>
            <div class="h-4 w-52 bg-slate-200 rounded animate-pulse"></div>
            <div class="h-6 w-24 bg-slate-200 rounded-full animate-pulse"></div>
          </div>
          <div class="h-9 w-28 bg-slate-200 rounded-lg animate-pulse flex-shrink-0 self-center"></div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="schedules.length === 0"
    class="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-6 py-24">
    <div class="text-center max-w-sm w-full">
      <div class="relative inline-flex items-center justify-center mb-8">
        <div class="w-28 h-28 rounded-full flex items-center justify-center" :class="stateConfig.ringBg">
          <div class="w-16 h-16 rounded-full flex items-center justify-center shadow-sm" :class="stateConfig.iconBg">
            <component :is="stateConfig.icon" class="w-8 h-8" :class="stateConfig.iconColor" :stroke-width="1.75" />
          </div>
        </div>
        <span class="absolute top-1 right-1 w-3 h-3 rounded-full border-2 border-slate-50" :class="stateConfig.dotColor"></span>
      </div>
      <h2 class="text-xl font-bold text-slate-800 mb-2 tracking-tight">{{ stateConfig.title }}</h2>
      <p class="text-sm text-slate-500 leading-relaxed mb-6">{{ stateConfig.description }}</p>
      <span class="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border" :class="stateConfig.badgeClass">
        <span class="w-1.5 h-1.5 rounded-full" :class="stateConfig.dotColor"></span>
        {{ emptyStateKeterangan ?? stateConfig.badgeLabel }}
      </span>
    </div>
  </div>

  <!-- Main -->
  <div v-else class="min-h-screen bg-slate-50">
    <section class="px-2 sm:px-4 lg:px-8 py-3 sm:py-4">
      <div class="mx-auto max-w-full lg:max-w-4xl">

        <div class="mb-6 sm:mb-8">
          <div class="flex items-start justify-between gap-4 flex-wrap mb-4">
            <div>
              <h1 class="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight mb-1">Jadwal Hari Ini</h1>

              <p class="text-sm text-slate-500 mb-2">{{ formattedDate }}</p>

              <div class="inline-flex items-center gap-2 bg-slate-900 rounded-lg px-3 py-1.5">
                <span class="font-mono text-xl font-bold text-white tabular-nums tracking-widest leading-none">
                  {{ formattedTime }}
                </span>
                <div class="flex flex-col items-center gap-1 ml-0.5">
                  <span class="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
                  <span class="text-[10px] font-semibold text-slate-400 uppercase tracking-wide leading-none">WIB</span>
                </div>
              </div>

            </div>
            <!-- Kelas badge -->
            <div class="inline-flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 shadow-sm">
              <div class="w-2 h-2 rounded-full bg-blue-600"></div>
              <span class="text-xs font-bold text-slate-700 tracking-wide">{{ kelasName }}</span>
            </div>
          </div>

          <!-- Progress bar -->
          <div class="flex items-center gap-3">
            <div class="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div class="h-full bg-blue-600 rounded-full transition-all duration-700"
                :style="{ width: progressPct + '%' }"></div>
            </div>
            <span class="text-xs font-medium text-slate-400 tabular-nums flex-shrink-0">
              {{ doneCount }}/{{ schedules.length }}
              <span class="hidden sm:inline"> selesai</span>
            </span>
          </div>
        </div>

        <!-- Cards -->
        <div class="space-y-3 mb-6">
          <div
            v-for="schedule in paginatedSchedules"
            :key="schedule.id"
            class="group relative bg-white rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-md"
            :class="cardBorderClass(schedule)"
          >
            <div class="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" :class="accentBarClass(schedule)"></div>

            <div class="pl-5 pr-4 sm:pr-5 py-4 sm:py-5">

              <div class="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <div class="flex items-center gap-2">
                  <Clock class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span class="text-sm font-bold text-slate-700 tabular-nums">{{ schedule.timeRange }}</span>
                  <span class="text-slate-300 text-xs">|</span>
                  <span class="text-xs font-medium" :class="timeStatusTextClass(schedule)">
                    {{ timeStatusLabel(schedule) }}
                  </span>
                </div>
                <span class="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                  :class="statusBadgeClass(schedule)">
                  <component :is="statusIcon(schedule)" class="w-3 h-3" />
                  {{ statusLabel(schedule) }}
                </span>
              </div>

              <div class="mb-4">
                <h3 class="text-base sm:text-lg font-bold text-slate-800 leading-snug mb-1.5">
                  {{ schedule.subject }}
                </h3>
                <div class="flex items-center gap-1.5">
                  <User class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span class="text-xs text-slate-500">{{ schedule.teacher }}</span>
                </div>
              </div>

              <div v-if="schedule.presensi?.catatan"
                class="mb-3.5 flex gap-2 bg-slate-50 border border-slate-100 rounded-lg p-3">
                <MessageSquare class="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <p class="text-xs text-slate-600 leading-relaxed">{{ schedule.presensi.catatan }}</p>
              </div>

              <div v-if="schedule.status === 'Rejected' && schedule.presensi?.alasan_reject"
                class="mb-3.5 flex gap-2.5 bg-red-50 border border-red-100 rounded-lg p-3">
                <AlertCircle class="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="text-[11px] font-bold text-red-600 mb-0.5 uppercase tracking-wide">Alasan Penolakan</p>
                  <p class="text-xs text-red-600 leading-relaxed">{{ schedule.presensi.alasan_reject }}</p>
                </div>
              </div>

              <div class="flex items-center justify-between gap-3">
                <!-- Countdown chip -->
                <div v-if="schedule.status === 'belum' && schedule.timeStatus === 'belum_dimulai'"
                  class="inline-flex items-center gap-1.5 text-xs text-slate-500">
                  <span class="w-1.5 h-1.5 rounded-full bg-slate-300 animate-pulse"></span>
                  Mulai dalam
                  <span class="font-bold tabular-nums text-slate-700">{{ getCountdown(schedule.jam_mulai) ?? '—' }}</span>
                </div>
                <div v-else class="flex-1"></div>

                <!-- Tombol aksi -->
                <div class="flex-shrink-0">
                  <button v-if="schedule.status === 'belum' && schedule.timeStatus === 'sedang_berlangsung'"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg shadow-sm transition-all"
                    @click="handlePresensi(schedule)">
                    <Plus class="w-4 h-4" /> Presensi
                  </button>

                  <button v-else-if="schedule.status === 'belum' && schedule.timeStatus === 'belum_dimulai'"
                    class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed"
                    disabled>
                    <Lock class="w-3.5 h-3.5" /> Belum Dibuka
                  </button>

                  <button v-else-if="schedule.status === 'belum' && schedule.timeStatus === 'sudah_selesai'"
                    class="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed"
                    disabled>
                    <XCircle class="w-3.5 h-3.5" /> Sesi Berakhir
                  </button>

                  <button v-else-if="schedule.status === 'Rejected'"
                    :disabled="isBandingExpired(schedule)"
                    class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all shadow-sm"
                    :class="isBandingExpired(schedule)
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white'"
                    @click="!isBandingExpired(schedule) && handleResubmit(schedule)">
                    <RotateCcw class="w-3.5 h-3.5" />
                    {{ isBandingExpired(schedule) ? 'Kedaluwarsa' : 'Kirim Ulang' }}
                  </button>

                  <span v-else
                    class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 bg-slate-50 rounded-lg border border-slate-100">
                    <CheckCircle2 class="w-3.5 h-3.5" /> Sudah Presensi
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div class="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6">
          <div class="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Info class="w-4 h-4 text-blue-600" />
          </div>
          <p class="text-xs text-blue-700 leading-relaxed">
            Tombol <strong class="font-bold">Presensi</strong> hanya aktif saat jam pelajaran sedang berlangsung.
            Pastikan Anda hadir tepat waktu.
          </p>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1"
          class="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between">
          <p class="text-xs text-slate-500 hidden sm:block">
            Halaman <span class="font-bold text-slate-700">{{ currentPage }}</span>
            dari <span class="font-bold text-slate-700">{{ totalPages }}</span>
          </p>
          <div class="flex items-center gap-1 mx-auto sm:mx-0">
            <button @click="previousPage" :disabled="currentPage === 1"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronLeft class="w-4 h-4" />
            </button>
            <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
              class="w-8 h-8 rounded-lg text-xs font-bold transition-colors"
              :class="page === currentPage ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'">
              {{ page }}
            </button>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
              <ChevronRight class="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  ChevronRight, ChevronLeft, Clock, X, User, Plus, RotateCcw,
  Info, CalendarOff, Coffee, CalendarX, UsersRound,
  CheckCircle2, XCircle, AlertCircle, MessageSquare, Lock
} from 'lucide-vue-next'
import { usePresensiStore } from '~/stores/presensi'
import { useAuthStore } from '~/stores/auth'

const presensiStore = usePresensiStore()
const authStore = useAuthStore()
const router = useRouter()

const currentPage = ref(1)
const itemsPerPage = 10
const now = ref(new Date())
let clockInterval = null

// ─── Empty state configs ──────────────────────────────────────
const STATE_CONFIGS = {
  weekend: {
    icon: Coffee, iconBg: 'bg-violet-100', iconColor: 'text-violet-500',
    ringBg: 'bg-violet-50', dotColor: 'bg-violet-400',
    badgeClass: 'bg-violet-50 border-violet-200 text-violet-600',
    title: 'Selamat Beristirahat',
    description: 'Tidak ada kegiatan belajar mengajar hari ini. Manfaatkan akhir pekan untuk istirahat.',
    badgeLabel: 'Sabtu / Minggu',
  },
  libur: {
    icon: CalendarOff, iconBg: 'bg-emerald-100', iconColor: 'text-emerald-500',
    ringBg: 'bg-emerald-50', dotColor: 'bg-emerald-400',
    badgeClass: 'bg-emerald-50 border-emerald-200 text-emerald-600',
    title: 'Hari Libur',
    description: 'Tidak ada kegiatan belajar mengajar hari ini sesuai kalender akademik.',
    badgeLabel: 'Libur Akademik',
  },
  kegiatan: {
    icon: UsersRound, iconBg: 'bg-amber-100', iconColor: 'text-amber-500',
    ringBg: 'bg-amber-50', dotColor: 'bg-amber-400',
    badgeClass: 'bg-amber-50 border-amber-200 text-amber-600',
    title: 'Presensi Ditangguhkan',
    description: 'Presensi tidak dapat dilakukan karena terdapat kegiatan yang sedang berlangsung.',
    badgeLabel: 'Sedang Ada Kegiatan',
  },
  kosong: {
    icon: CalendarX, iconBg: 'bg-blue-100', iconColor: 'text-blue-500',
    ringBg: 'bg-blue-50', dotColor: 'bg-blue-400',
    badgeClass: 'bg-blue-50 border-blue-200 text-blue-600',
    title: 'Tidak Ada Jadwal',
    description: 'Tidak ada jadwal pelajaran terdaftar untuk kelas Anda hari ini.',
    badgeLabel: 'Tidak Ada Jadwal',
  },
}

// ─── Computed ─────────────────────────────────────────────────
const schedules = computed(() => presensiStore.jadwalHariIni || [])
const kelasName = computed(() =>
  presensiStore.jadwalHariIniResponse?.kelas?.name ?? authStore.user?.kelas?.name ?? 'N/A'
)
const formattedDate = computed(() =>
  new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
)

// [CHANGED] Tambah detik (ss) agar terasa seperti jam digital aktif
const formattedTime = computed(() => {
  const h = String(now.value.getHours()).padStart(2, '0')
  const m = String(now.value.getMinutes()).padStart(2, '0')
  const s = String(now.value.getSeconds()).padStart(2, '0') // [ADDED]
  return `${h}:${m}:${s}` // [CHANGED] sebelumnya hanya h:m
})

const emptyStateType = computed(() => {
  const msg = (presensiStore.error || '').toLowerCase()
  if (msg.includes('weekend') || msg.includes('sabtu') || msg.includes('minggu')) return 'weekend'
  if (msg.includes('tidak tersedia saat ini')) return 'kegiatan'
  if (msg.includes('tidak ada kbm')) return 'libur'
  return 'kosong'
})
const emptyStateKeterangan = computed(() => {
  const match = (presensiStore.error || '').match(/\(([^)]+)\)/)
  return match ? match[1] : null
})
const stateConfig = computed(() => STATE_CONFIGS[emptyStateType.value])
const doneCount = computed(() => schedules.value.filter(s => s.status !== 'belum').length)
const progressPct = computed(() =>
  schedules.value.length ? Math.round((doneCount.value / schedules.value.length) * 100) : 0
)
const totalPages = computed(() => Math.ceil(schedules.value.length / itemsPerPage))
const paginatedSchedules = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  return schedules.value.slice(start, start + itemsPerPage)
})
const visiblePages = computed(() => {
  const pages = []
  const maxV = 3
  let start = Math.max(1, currentPage.value - 1)
  let end = Math.min(totalPages.value, start + maxV - 1)
  if (end - start < maxV - 1) start = Math.max(1, end - maxV + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

// ─── Per-card style helpers ───────────────────────────────────
const accentBarClass = (s) => {
  if (s.status === 'Approved')                         return 'bg-green-500'
  if (s.status === 'Rejected')                         return 'bg-red-500'
  if (s.status === 'Pending')                          return 'bg-yellow-400'
  if (s.timeStatus === 'sedang_berlangsung')            return 'bg-blue-500'
  if (s.timeStatus === 'sudah_selesai')                 return 'bg-slate-300'
  return 'bg-slate-200'
}
const cardBorderClass = (s) => {
  if (s.status === 'Approved')                         return 'border-green-100 hover:border-green-200'
  if (s.status === 'Rejected')                         return 'border-red-100 hover:border-red-200'
  if (s.status === 'Pending')                          return 'border-yellow-100 hover:border-yellow-200'
  if (s.timeStatus === 'sedang_berlangsung')            return 'border-blue-100 hover:border-blue-200'
  return 'border-slate-200 hover:border-slate-300'
}
const timeStatusLabel = (s) => {
  if (s.timeStatus === 'sedang_berlangsung') return 'Sedang Berlangsung'
  if (s.timeStatus === 'sudah_selesai')      return 'Sudah Selesai'
  return 'Belum Dimulai'
}
const timeStatusTextClass = (s) => {
  if (s.timeStatus === 'sedang_berlangsung') return 'text-blue-600 font-semibold'
  if (s.timeStatus === 'sudah_selesai')      return 'text-slate-400'
  return 'text-slate-400'
}
const statusLabel = (s) => {
  if (s.status === 'Approved')                         return 'Disetujui'
  if (s.status === 'Rejected')                         return 'Ditolak'
  if (s.status === 'Pending')                          return 'Menunggu'
  if (s.timeStatus === 'belum_dimulai')                return 'Terjadwal'
  if (s.timeStatus === 'sedang_berlangsung')            return 'Belum Presensi'
  return 'Belum Presensi'
}
const statusBadgeClass = (s) => {
  if (s.status === 'Approved') return 'bg-green-100 text-green-700'
  if (s.status === 'Rejected') return 'bg-red-100 text-red-600'
  if (s.status === 'Pending')  return 'bg-yellow-100 text-yellow-700'
  if (s.timeStatus === 'sedang_berlangsung') return 'bg-blue-100 text-blue-700'
  return 'bg-slate-100 text-slate-500'
}
const statusIcon = (s) => {
  if (s.status === 'Approved') return CheckCircle2
  if (s.status === 'Rejected') return XCircle
  if (s.status === 'Pending')  return Clock
  return Clock
}

// ─── Methods ──────────────────────────────────────────────────
const getCountdown = (jamMulai) => {
  if (!jamMulai) return null
  const [h, m, s] = jamMulai.split(':').map(Number)
  const target = new Date(now.value)
  target.setHours(h, m, s || 0, 0)
  const diff = target - now.value
  if (diff <= 0) return null
  const hh = Math.floor(diff / 3600000)
  const mm = Math.floor((diff % 3600000) / 60000)
  const ss = Math.floor((diff % 60000) / 1000)
  const pad = n => String(n).padStart(2, '0')
  return hh > 0 ? `${pad(hh)}:${pad(mm)}:${pad(ss)}` : `${pad(mm)}:${pad(ss)}`
}
const handlePresensi = (schedule) => {
  if (schedule.timeStatus !== 'sedang_berlangsung') return
  router.push({ path: '/presensi/create', query: { jadwalId: schedule.id } })
}
const handleResubmit = (schedule) => {
  const pid = schedule.presensi?.id ?? schedule.presensi?.id_presensi ?? null
  if (!pid) return
  router.push({ path: '/presensi/create', query: { jadwalId: schedule.id, presensiId: pid, mode: 'resubmit' } })
}
const isBandingExpired = (schedule) => {
  if (schedule.status !== 'Rejected') return false
  const rejectedAt = schedule.presensi?.rejected_at
  if (!rejectedAt) return false
  return (now.value - new Date(rejectedAt)) / (1000 * 60 * 60) > 24
}
const previousPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage     = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const goToPage     = (page) => { currentPage.value = page }

// ─── Lifecycle ────────────────────────────────────────────────
onMounted(async () => {
  await presensiStore.getJadwalHariIni()
  const serverTime = presensiStore.jadwalHariIniResponse?.serverTime
  if (serverTime) {
    const today = new Date()
    const [h, m, s] = serverTime.split(':').map(Number)
    today.setHours(h, m, s || 0, 0)
    now.value = today
  } else {
    now.value = new Date()
  }
  clockInterval = setInterval(() => { now.value = new Date(now.value.getTime() + 1000) }, 1000)
})
onUnmounted(() => { if (clockInterval) clearInterval(clockInterval) })
</script>