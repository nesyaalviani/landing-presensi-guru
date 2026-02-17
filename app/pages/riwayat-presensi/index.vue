<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl space-y-2 sm:space-y-3">
      <!-- Summary Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="bg-white rounded-sm shadow-sm border border-gray-200 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="bg-blue-100 p-2 sm:p-3 rounded-sm flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-600">Total Presensi</p>
              <p class="text-xl sm:text-2xl font-bold text-gray-900">{{ totalPresensi }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-sm shadow-sm border border-gray-200 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="bg-green-100 p-2 sm:p-3 rounded-sm flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-600">Hadir</p>
              <p class="text-xl sm:text-2xl font-bold text-green-600">{{ totalHadir }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-sm shadow-sm border border-gray-200 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="bg-red-100 p-2 sm:p-3 rounded-sm flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-600">Tidak Hadir</p>
              <p class="text-xl sm:text-2xl font-bold text-red-600">{{ totalTidakHadir }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- History Cards -->
      <div class="space-y-3 sm:space-y-4">
        <div v-for="history in filteredHistory" :key="history.id"
          class="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition">
          <div class="p-4 sm:p-6">
            <!-- Mobile Layout (< 640px) -->
            <div class="block sm:hidden space-y-3">
              <!-- Time & Date -->
              <div class="flex items-start justify-between">
                <div>
                  <p class="text-base font-medium text-gray-900">{{ history.timeRange }}</p>
                  <p class="text-sm text-gray-500">{{ history.date }}</p>
                </div>
                <!-- Action Buttons Mobile -->
                <div class="flex gap-2">
                  <button v-if="history.photo" @click="viewPhoto(history)"
                    class="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition" title="Lihat Foto">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </button>
                  <button @click="viewDetail(history)" class="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                    title="Detail">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Subject and Duration -->
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <h3 class="text-base font-semibold text-gray-900">{{ history.subject }}</h3>
                  <span v-if="history.duration" class="text-xs text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                    {{ history.duration }}
                  </span>
                </div>

                <!-- Teacher -->
                <div class="flex items-center gap-2 text-gray-600 mb-3">
                  <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="text-sm">{{ history.teacher }}</span>
                </div>

                <!-- Status Badges -->
                <div class="flex items-center gap-2 flex-wrap">
                  <span v-if="history.status === 'hadir'"
                    class="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Hadir
                  </span>
                  <span v-else
                    class="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Tidak Hadir
                  </span>

                  <span v-if="history.hasTugas"
                    class="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Ada Tugas
                  </span>
                </div>
              </div>

              <!-- Keterangan Mobile -->
              <div v-if="history.keterangan" class="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                <p class="font-medium text-gray-700 mb-1">Keterangan:</p>
                <p>{{ history.keterangan }}</p>
              </div>
            </div>

            <!-- Desktop Layout (>= 640px) -->
            <div class="hidden sm:flex items-start justify-between">
              <!-- Left Side: Info -->
              <div class="flex gap-6 flex-1">
                <!-- Time & Date Column -->
                <div class="text-gray-700 min-w-[140px]">
                  <p class="text-lg font-medium">{{ history.timeRange }}</p>
                  <p class="text-sm text-gray-500">{{ history.date }}</p>
                </div>

                <!-- Subject and Teacher Info -->
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-2">
                    <h3 class="text-lg font-semibold">{{ history.subject }}</h3>
                    <span v-if="history.duration" class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                      {{ history.duration }}
                    </span>
                  </div>

                  <div class="flex items-center gap-2 text-gray-600 mb-3">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-sm">{{ history.teacher }}</span>
                  </div>

                  <!-- Status Badges -->
                  <div class="flex items-center gap-2 flex-wrap">
                    <span v-if="history.status === 'hadir'"
                      class="inline-flex items-center gap-1 bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Hadir
                    </span>
                    <span v-else
                      class="inline-flex items-center gap-1 bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Tidak Hadir
                    </span>

                    <span v-if="history.hasTugas"
                      class="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Ada Tugas
                    </span>
                  </div>

                  <!-- Keterangan Desktop -->
                  <div v-if="history.keterangan" class="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    <p class="font-medium text-gray-700 mb-1">Keterangan:</p>
                    <p>{{ history.keterangan }}</p>
                  </div>
                </div>
              </div>

              <!-- Right Side: Actions Desktop -->
              <div class="flex gap-2">
                <button v-if="history.photo" @click="viewPhoto(history)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition" title="Lihat Foto">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </button>

                <button @click="viewDetail(history)" class="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition"
                  title="Detail">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Timestamp Footer -->
          <div class="bg-gray-50 px-4 sm:px-6 py-2.5 sm:py-3 border-t border-gray-200">
            <div class="flex items-center gap-2 text-xs text-gray-500">
              <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="truncate">Diinput pada: {{ history.createdAt }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredHistory.length === 0"
        class="bg-white rounded-sm shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
        <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">Tidak Ada Riwayat</h3>
        <p class="text-sm sm:text-base text-gray-600">Belum ada riwayat presensi yang sesuai dengan filter yang dipilih.
        </p>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-3 sm:px-6 py-3 border-t border-gray-200 rounded-sm mt-4 sm:mt-6">
        <div class="flex items-center justify-between">
          <!-- Mobile Pagination -->
          <div class="flex flex-1 justify-between sm:hidden">
            <button @click="previousPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <span class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>

          <!-- Desktop Pagination -->
          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Menampilkan <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> sampai
                <span class="font-medium">{{ Math.min(currentPage * perPage, totalPresensi) }}</span> dari
                <span class="font-medium">{{ totalPresensi }}</span> hasil
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button @click="previousPage" :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft class="h-5 w-5" />
                </button>
                <button v-for="page in displayPages" :key="page" @click="goToPage(page)" :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
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

    <!-- Photo Modal -->
    <div v-if="showPhotoModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
      @click="closePhotoModal">
      <div class="relative max-w-4xl w-full" @click.stop>
        <button @click="closePhotoModal" class="absolute -top-10 right-0 text-white hover:text-gray-300 transition">
          <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <img :src="selectedPhoto" alt="Bukti Foto" class="w-full h-auto rounded-sm" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronRight, ChevronLeft } from 'lucide-vue-next'

// Data
const selectedClass = ref('XII RPL 1')
const currentPage = ref(1)
const perPage = ref(10)
const filterDate = ref('')
const filterStatus = ref('')
const filterMapel = ref('')
const showPhotoModal = ref(false)
const selectedPhoto = ref(null)

// Dummy history data
const historyData = ref([
  {
    id: 1,
    date: '5 Feb 2026',
    timeRange: '07.10 – 09.10',
    subject: 'PPB',
    duration: '3 JP',
    teacher: 'Pak Sandi',
    status: 'hadir',
    hasTugas: true,
    keterangan: 'Guru mengajar dengan baik, siswa aktif bertanya',
    photo: 'https://via.placeholder.com/800x600',
    createdAt: '5 Feb 2026, 09:15'
  },
  {
    id: 2,
    date: '5 Feb 2026',
    timeRange: '09.25 – 10.05',
    subject: 'B. Indo',
    duration: '1 JP',
    teacher: 'Bu Ipik',
    status: 'hadir',
    hasTugas: false,
    keterangan: '',
    photo: 'https://via.placeholder.com/800x600',
    createdAt: '5 Feb 2026, 10:08'
  },
  {
    id: 3,
    date: '5 Feb 2026',
    timeRange: '10.20 – 11.40',
    subject: 'Matematika',
    duration: '2 JP',
    teacher: 'Pak Budi',
    status: 'tidak-hadir',
    hasTugas: false,
    keterangan: 'Guru berhalangan hadir karena sakit',
    photo: null,
    createdAt: '5 Feb 2026, 10:25'
  },
  {
    id: 4,
    date: '5 Feb 2026',
    timeRange: '12.30 – 14.10',
    subject: 'Basis Data',
    duration: '2 JP',
    teacher: 'Bu Siti',
    status: 'hadir',
    hasTugas: true,
    keterangan: 'Praktikum SQL berjalan lancar',
    photo: 'https://via.placeholder.com/800x600',
    createdAt: '5 Feb 2026, 14:15'
  },
])

// Computed
const formattedDate = computed(() => {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  const date = new Date(2026, 1, 5)
  return date.toLocaleDateString('id-ID', options)
})

const filteredHistory = computed(() => {
  let filtered = historyData.value

  if (filterStatus.value) {
    filtered = filtered.filter(h => h.status === filterStatus.value)
  }

  if (filterMapel.value) {
    filtered = filtered.filter(h => h.subject === filterMapel.value)
  }

  return filtered
})

const totalPresensi = computed(() => filteredHistory.value.length)
const totalHadir = computed(() => filteredHistory.value.filter(h => h.status === 'hadir').length)
const totalTidakHadir = computed(() => filteredHistory.value.filter(h => h.status === 'tidak-hadir').length)

const totalPages = computed(() => Math.ceil(totalPresensi.value / perPage.value))

const displayPages = computed(() => {
  const pages = []
  const maxDisplay = 5
  let startPage = Math.max(1, currentPage.value - 2)
  let endPage = Math.min(totalPages.value, startPage + maxDisplay - 1)

  if (endPage - startPage < maxDisplay - 1) {
    startPage = Math.max(1, endPage - maxDisplay + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const resetFilters = () => {
  filterDate.value = ''
  filterStatus.value = ''
  filterMapel.value = ''
  currentPage.value = 1
}

const viewPhoto = (history) => {
  selectedPhoto.value = history.photo
  showPhotoModal.value = true
}

const closePhotoModal = () => {
  showPhotoModal.value = false
  selectedPhoto.value = null
}

const viewDetail = (history) => {
  // Navigate to detail page or show detail modal
  console.log('View detail:', history)
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const goToPage = (page) => {
  currentPage.value = page
}
</script>