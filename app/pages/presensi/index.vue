<template>
  <div class="min-h-screen bg-gray-50">
    <section class="px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <div class="mx-auto max-w-7xl">
        <div class="mb-6 sm:mb-8">
          <template v-if="presensiStore.loading">
            <div class="h-8 sm:h-9 w-48 sm:w-64 bg-gray-200 rounded animate-pulse mb-3 sm:mb-4"></div>
            <div class="space-y-2">
              <div class="h-5 sm:h-6 w-56 sm:w-72 bg-gray-200 rounded animate-pulse"></div>
              <div class="h-4 sm:h-5 w-32 sm:w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </template>

          <template v-else-if="schedules.length > 0">
            <h1 class="text-2xl sm:text-3xl font-semibold mb-3 sm:mb-4">Jadwal Hari Ini</h1>
            <div class="text-gray-600">
              <p class="text-base sm:text-lg">{{ formattedDate }} - {{ formattedTime }}</p>
              <p class="text-sm sm:text-base">Kelas: {{ kelasName }}</p>
            </div>
          </template>
        </div>

        <div v-if="presensiStore.error && !presensiStore.loading"
          class="bg-red-50 border border-red-200 rounded-sm p-4 mb-6">
          <p class="text-red-700 text-sm">{{ presensiStore.error }}</p>
        </div>

        <div v-if="presensiStore.loading" class="space-y-3 sm:space-y-4 mb-6">
          <div v-for="i in 5" :key="'skeleton-' + i"
            class="bg-white rounded-sm shadow-sm border border-gray-200 p-4 sm:p-6">
            <div class="block sm:hidden space-y-4">
              <div class="flex items-start justify-between">
                <div class="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-6 w-28 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div class="space-y-3">
                <div class="h-6 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div class="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
            </div>

            <div class="hidden sm:flex items-start justify-between">
              <div class="flex gap-4 lg:gap-6 flex-1">
                <div class="h-6 w-28 bg-gray-200 rounded animate-pulse"></div>
                <div class="flex-1 space-y-3">
                  <div class="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-7 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
              <div class="h-10 w-28 bg-gray-200 rounded-sm animate-pulse"></div>
            </div>
          </div>
        </div>

        <div v-else-if="schedules.length === 0" class="bg-white rounded-sm border border-gray-200 p-8 text-center">
          <ClipboardList class="mx-auto h-12 w-12 text-gray-400" />
          <h3 class="mt-2 text-sm font-medium text-gray-900">Tidak ada jadwal</h3>
          <p class="mt-1 text-sm text-gray-500">Tidak ada jadwal untuk hari ini.</p>
        </div>

        <div v-else class="space-y-3 sm:space-y-4 mb-6">
          <div v-for="schedule in paginatedSchedules" :key="schedule.id"
            class="bg-white rounded-sm shadow-sm border border-gray-200 p-4 sm:p-6">

            <!-- Mobile -->
            <div class="block sm:hidden space-y-4">
              <div class="flex items-start justify-between">
                <div class="text-gray-700">
                  <p class="text-base font-medium">{{ schedule.timeRange }}</p>
                  <span v-if="schedule.timeStatus === 'belum_dimulai'"
                    class="inline-block mt-1 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                    Belum Dimulai
                  </span>
                  <span v-else-if="schedule.timeStatus === 'sedang_berlangsung'"
                    class="inline-block mt-1 bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded">
                    Sedang Berlangsung
                  </span>
                  <span v-else-if="schedule.timeStatus === 'sudah_selesai'"
                    class="inline-block mt-1 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">
                    Sudah Selesai
                  </span>
                </div>

                <div>
                  <span v-if="schedule.status === 'belum' && schedule.timeStatus !== 'belum_dimulai'"
                    class="inline-block bg-amber-100 text-amber-700 text-xs px-3 py-1 rounded">
                    Belum Presensi
                  </span>
                  <span v-else-if="schedule.status === 'Pending'"
                    class="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-3 py-1 rounded">
                    <Clock class="w-3 h-3" />
                    Pending
                  </span>
                  <span v-else-if="schedule.status === 'Approved'"
                    class="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-3 py-1 rounded">
                    <Check class="w-3 h-3" />
                    Disetujui
                  </span>
                  <span v-else-if="schedule.status === 'Rejected'"
                    class="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-3 py-1 rounded">
                    <X class="w-3 h-3" />
                    Ditolak
                  </span>
                </div>
              </div>

              <div>
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-lg font-semibold">{{ schedule.subject }}</h3>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                  <User class="w-4 h-4" />
                  <span class="text-sm">{{ schedule.teacher }}</span>
                </div>
              </div>

              <div v-if="schedule.presensi?.catatan" class="text-sm text-gray-600 bg-gray-50 p-3 rounded-sm">
                <p class="font-medium text-gray-700 mb-1">Keterangan:</p>
                <p>{{ schedule.presensi.catatan }}</p>
              </div>

              <div v-if="schedule.status === 'Rejected' && schedule.presensi?.alasan_reject"
                class="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-sm">
                <p class="font-medium text-red-700 mb-1">Alasan Penolakan:</p>
                <p>{{ schedule.presensi.alasan_reject }}</p>
              </div>

              <div class="w-full">
                <button v-if="schedule.status === 'belum' && schedule.timeStatus === 'sedang_berlangsung'"
                  class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none transition-all shadow-sm"
                  @click="handlePresensi(schedule)">
                  <Plus class="w-4 h-4" />
                  Presensi
                </button>
                <button v-else-if="schedule.status === 'belum' && schedule.timeStatus === 'belum_dimulai'"
                  class="w-full bg-gray-100 text-gray-500 px-4 py-2.5 text-sm font-medium rounded-sm cursor-not-allowed flex items-center justify-center gap-2"
                  disabled>
                  <Clock class="w-4 h-4 text-gray-400" />
                  {{ getCountdown(schedule.jam_mulai) ? `${getCountdown(schedule.jam_mulai)}` : 'Segera Dimulai' }}
                </button>
                <button v-else-if="schedule.status === 'belum' && schedule.timeStatus === 'sudah_selesai'"
                  class="w-full bg-gray-100 text-gray-400 px-4 py-2.5 text-sm font-medium rounded-sm cursor-not-allowed"
                  disabled>
                  Sesi Berakhir
                </button>
                <button v-else-if="schedule.status === 'Rejected'" :disabled="isBandingExpired(schedule)" :class="[
                  'w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-sm transition-all shadow-sm',
                  isBandingExpired(schedule)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'text-white bg-orange-500 hover:bg-orange-600 focus:outline-none hover:shadow-md'
                ]" @click="!isBandingExpired(schedule) && handleResubmit(schedule)">
                  <RotateCcw class="w-4 h-4" />
                  {{ isBandingExpired(schedule) ? 'Banding Kedaluwarsa' : 'Kirim Ulang' }}
                </button>
                <button v-else
                  class="w-full bg-gray-200 text-gray-600 px-4 py-2.5 text-sm font-medium rounded-sm cursor-default"
                  disabled>
                  Sudah Presensi
                </button>
              </div>
            </div>

            <!-- Desktop -->
            <div class="hidden sm:block">
              <div class="flex items-start justify-between">
                <div class="flex gap-4 lg:gap-6 flex-1">
                  <div class="text-gray-700 min-w-[120px]">
                    <p class="text-base lg:text-lg font-medium">{{ schedule.timeRange }}</p>
                  </div>

                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <h3 class="text-base lg:text-lg font-semibold">{{ schedule.subject }}</h3>
                    </div>
                    <div class="flex items-center gap-2 text-gray-600 mb-3">
                      <User class="w-4 h-4" />
                      <span class="text-sm">{{ schedule.teacher }}</span>
                    </div>

                    <div class="mt-3 flex items-center gap-2 flex-wrap">
                      <span v-if="schedule.timeStatus === 'belum_dimulai'"
                        class="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded">
                        Belum Dimulai
                      </span>
                      <span v-else-if="schedule.timeStatus === 'sedang_berlangsung'"
                        class="inline-block bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded">
                        Sedang Berlangsung
                      </span>
                      <span v-else-if="schedule.timeStatus === 'sudah_selesai'"
                        class="inline-block bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded">
                        Sudah Selesai
                      </span>

                      <span v-if="schedule.status === 'belum' && schedule.timeStatus !== 'belum_dimulai'"
                        class="inline-block bg-amber-100 text-amber-700 text-sm px-4 py-1 rounded">
                        Belum Presensi
                      </span>
                      <span v-else-if="schedule.status === 'Pending'"
                        class="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-sm px-4 py-1 rounded">
                        <Clock class="w-4 h-4" />
                        Pending
                      </span>
                      <span v-else-if="schedule.status === 'Approved'"
                        class="inline-flex items-center gap-1 bg-green-100 text-green-700 text-sm px-4 py-1 rounded">
                        <Check class="w-4 h-4" />
                        Disetujui
                      </span>
                      <span v-else-if="schedule.status === 'Rejected'"
                        class="inline-flex items-center gap-1 bg-red-100 text-red-700 text-sm px-4 py-1 rounded">
                        <X class="w-4 h-4" />
                        Ditolak
                      </span>
                    </div>
                  </div>
                </div>

                <div class="flex-shrink-0">
                  <button v-if="schedule.status === 'belum' && schedule.timeStatus === 'sedang_berlangsung'"
                    class="flex items-center gap-2 px-4 lg:px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none transition-all shadow-sm hover:shadow-md"
                    @click="handlePresensi(schedule)">
                    <Plus class="w-4 lg:w-5 h-4 lg:h-5" />
                    Presensi
                  </button>
                  <button v-else-if="schedule.status === 'belum' && schedule.timeStatus === 'belum_dimulai'"
                    class="bg-gray-100 text-gray-500 px-4 lg:px-5 py-2 text-sm rounded-sm cursor-not-allowed flex items-center gap-2"
                    disabled>
                    <Clock class="w-4 h-4 text-gray-400" />
                    {{ getCountdown(schedule.jam_mulai) ? `${getCountdown(schedule.jam_mulai)}` : 'Segera Dimulai' }}
                  </button>
                  <button v-else-if="schedule.status === 'belum' && schedule.timeStatus === 'sudah_selesai'"
                    class="bg-gray-100 text-gray-400 px-4 lg:px-6 py-2 text-sm rounded-sm cursor-not-allowed" disabled>
                    Sesi Berakhir
                  </button>
                  <button v-else-if="schedule.status === 'Rejected'" :disabled="isBandingExpired(schedule)" :class="[
                    'flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-sm transition-all shadow-sm',
                    isBandingExpired(schedule)
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'text-white bg-orange-500 hover:bg-orange-600 focus:outline-none hover:shadow-md'
                  ]" @click="!isBandingExpired(schedule) && handleResubmit(schedule)">
                    <RotateCcw class="w-4 h-4" />
                    {{ isBandingExpired(schedule) ? 'Banding Kedaluwarsa' : 'Kirim Ulang' }}
                  </button>
                  <button v-else class="bg-gray-200 text-gray-600 px-4 lg:px-6 py-2 text-sm rounded-sm cursor-default"
                    disabled>
                    Sudah Presensi
                  </button>
                </div>
              </div>

              <div v-if="schedule.presensi?.catatan"
                class="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-sm ml-[144px]">
                <p class="font-medium text-gray-700 mb-1">Keterangan:</p>
                <p>{{ schedule.presensi.catatan }}</p>
              </div>
              <div v-if="schedule.status === 'Rejected' && schedule.presensi?.alasan_reject"
                class="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-sm ml-[144px]">
                <p class="font-medium text-red-700 mb-1">Alasan Penolakan:</p>
                <p>{{ schedule.presensi.alasan_reject }}</p>
              </div>
            </div>

          </div>
        </div>

        <template v-if="presensiStore.loading">
          <div class="mb-6 bg-gray-200 h-16 sm:h-14 rounded-sm animate-pulse"></div>
        </template>
        <div v-else-if="schedules.length > 0"
          class="mb-6 flex items-start gap-2 sm:gap-3 text-gray-600 bg-blue-50 p-3 sm:p-4 rounded-sm">
          <Info class="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-blue-600 flex-shrink-0" />
          <p class="text-xs sm:text-sm">
            Tombol <strong>'Presensi'</strong> hanya aktif saat jam pelajaran sedang berlangsung.
          </p>
        </div>

        <div v-if="totalPages > 1 && !presensiStore.loading"
          class="bg-white rounded-sm border border-gray-200 px-3 sm:px-4 py-3">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button @click="previousPage" :disabled="currentPage === 1"
                class="relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <span class="inline-flex items-center text-xs text-gray-700">
                {{ currentPage }} / {{ totalPages }}
              </span>
              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-3 py-2 border border-gray-300 text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Next
              </button>
            </div>

            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Halaman <span class="font-medium">{{ currentPage }}</span> dari <span class="font-medium">{{
                    totalPages }}</span>
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button @click="previousPage" :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronLeft class="h-5 w-5" />
                  </button>
                  <button v-for="page in visiblePages" :key="page" @click="goToPage(page)" :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    page === currentPage
                      ? 'border-blue-500 bg-blue-50 text-blue-600 z-10'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  ]">
                    {{ page }}
                  </button>
                  <button @click="nextPage" :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <ChevronRight class="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronRight, ChevronLeft, Clock, Check, X, User, Plus, RotateCcw, Info, ClipboardList } from 'lucide-vue-next'
import { usePresensiStore } from '~/stores/presensi'
import { useAuthStore } from '~/stores/auth'

const presensiStore = usePresensiStore()
const authStore = useAuthStore()
const router = useRouter()

const currentPage = ref(1)
const itemsPerPage = 10

const now = ref(new Date())
let clockInterval = null

const schedules = computed(() => {
  return presensiStore.jadwalHariIni || []
})

const kelasName = computed(() => {
  const jadwalData = presensiStore.jadwalHariIniResponse
  if (jadwalData?.kelas) {
    return jadwalData.kelas.name
  }
  return authStore.user?.kelas?.name || 'N/A'
})

const formattedDate = computed(() => {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  return new Date().toLocaleDateString('id-ID', options)
})

const formattedTime = computed(() => {
  const h = String(now.value.getHours()).padStart(2, '0')
  const m = String(now.value.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
})

const totalPages = computed(() => {
  return Math.ceil(schedules.value.length / itemsPerPage)
})

const paginatedSchedules = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return schedules.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 3
  let start = Math.max(1, currentPage.value - 1)
  let end = Math.min(totalPages.value, start + maxVisible - 1)
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const getCountdown = (jamMulai) => {
  if (!jamMulai) return null
  const [h, m, s] = jamMulai.split(':').map(Number)
  const nowTime = now.value
  const target = new Date(nowTime)
  target.setHours(h, m, s || 0, 0)
  const diff = target - nowTime
  if (diff <= 0) return null
  const hh = Math.floor(diff / 3600000)
  const mm = Math.floor((diff % 3600000) / 60000)
  const ss = Math.floor((diff % 60000) / 1000)
  const pad = n => String(n).padStart(2, '0')
  return hh > 0 ? `${pad(hh)}:${pad(mm)}:${pad(ss)}` : `${pad(mm)}:${pad(ss)}`
}

const fetchJadwal = async () => {
  await presensiStore.getJadwalHariIni()
}

const handlePresensi = (schedule) => {
  if (schedule.timeStatus !== 'sedang_berlangsung') return
  router.push({
    path: '/presensi/create',
    query: { jadwalId: schedule.id }
  })
}

const handleResubmit = (schedule) => {
  const pid = schedule.presensi?.id ?? schedule.presensi?.id_presensi ?? null

  if (!pid) {
    console.warn('[handleResubmit] presensiId tidak ditemukan di schedule.presensi:', schedule.presensi)
    return
  }

  router.push({
    path: '/presensi/create',
    query: {
      jadwalId: schedule.id,
      presensiId: pid,
      mode: 'resubmit'
    }
  })
}

const previousPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const goToPage = (page) => {
  currentPage.value = page
}

const isBandingExpired = (schedule) => {
  if (schedule.status !== 'Rejected') return false
  const rejectedAt = schedule.presensi?.rejected_at
  if (!rejectedAt) return false
  const diff = (now.value - new Date(rejectedAt)) / (1000 * 60 * 60)
  return diff > 24
}

onMounted(async () => {
  await fetchJadwal()

  const serverTime = presensiStore.jadwalHariIniResponse?.serverTime
  if (serverTime) {
    const today = new Date()
    const [h, m, s] = serverTime.split(':').map(Number)
    today.setHours(h, m, s || 0, 0)
    now.value = today
  } else {
    now.value = new Date()
  }

  clockInterval = setInterval(() => {
    now.value = new Date(now.value.getTime() + 1000)
  }, 1000)
})

onUnmounted(() => {
  if (clockInterval) clearInterval(clockInterval)
})
</script>