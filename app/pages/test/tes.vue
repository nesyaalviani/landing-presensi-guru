<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl mx-auto px-4 py-8">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-semibold mb-4">Jadwal Hari Ini</h1>
        <div class="text-gray-600">
          <p class="text-lg">{{ formattedDate }}</p>
          <p class="text-base">Kelas: {{ selectedClass }}</p>
        </div>
      </div>

      <!-- Schedule Cards -->
      <div class="space-y-4">
        <div v-for="schedule in schedules" :key="schedule.id"
          class="bg-white rounded-sm shadow-sm border border-gray-200 p-6">
          <div class="flex items-start justify-between">
            <!-- Left Side: Time and Subject Info -->
            <div class="flex gap-6">
              <!-- Time Column -->
              <div class="text-gray-700">
                <p class="text-lg font-medium">{{ schedule.timeRange }}</p>
                <p class="text-sm text-gray-500">{{ schedule.classTime }}</p>
              </div>

              <!-- Subject and Teacher Info -->
              <div>
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-lg font-semibold">{{ schedule.subject }}</h3>
                  <span v-if="schedule.duration" class="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    ({{ schedule.duration }})
                  </span>
                </div>
                <div class="flex items-center gap-2 text-gray-600">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span class="text-sm">{{ schedule.teacher }}</span>
                </div>

                <!-- Status Badge -->
                <div class="mt-3">
                  <span v-if="schedule.status === 'belum'"
                    class="inline-block bg-amber-100 text-amber-700 text-sm px-4 py-1 rounded">
                    Belum Presensi
                  </span>
                  <span v-else-if="schedule.status === 'hadir'"
                    class="inline-flex items-center gap-1 bg-green-100 text-green-700 text-sm px-4 py-1 rounded">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    Hadir
                  </span>
                </div>
              </div>
            </div>

            <!-- Right Side: Action Button -->
            <div>
              <button v-if="schedule.status === 'belum'"
                class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm hover:shadow-md"
                @click="handlePresensi(schedule.id)">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Presensi
              </button>
              <button v-else class="bg-gray-200 text-gray-600 px-6 py-2 rounded-sm cursor-default" disabled>
                Sudah Presensi
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Info Note -->
      <div class="mt-6 flex items-start gap-3 text-gray-600 bg-blue-50 p-4 rounded-sm">
        <svg class="w-5 h-5 mt-0.5 text-blue-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clip-rule="evenodd" />
        </svg>
        <p class="text-sm">
          Klik tombol <strong>'Presensi'</strong> untuk mencatat kehadiran guru di setiap jam pelajaran.
        </p>
      </div>

      <!-- Pagination -->
      <div class="mt-8 flex justify-center items-center gap-2">
        <button class="p-2 rounded hover:bg-gray-100 disabled:opacity-50" :disabled="currentPage === 1"
          @click="currentPage--">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button v-for="page in totalPages" :key="page" class="w-10 h-10 rounded hover:bg-gray-100" :class="{
          'bg-blue-500 text-white hover:bg-blue-600': page === currentPage,
          'text-gray-700': page !== currentPage,
        }" @click="currentPage = page">
          {{ page }}
        </button>

        <button class="p-2 rounded hover:bg-gray-100 disabled:opacity-50" :disabled="currentPage === totalPages"
          @click="currentPage++">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Data
const selectedClass = ref('XII RPL 1')
const currentPage = ref(1)
const totalPages = ref(5)

// Dummy schedule data
const schedules = ref([
  {
    id: 1,
    timeRange: '07.10 – 09.10',
    classTime: '08.10 – 09.10',
    subject: 'PPB',
    duration: '3 JP',
    teacher: 'Pak Sandi',
    status: 'belum', // belum, hadir
  },
  {
    id: 2,
    timeRange: '09.25 – 10.05',
    classTime: '09.25 – 10.05',
    subject: 'B. Indo',
    duration: null,
    teacher: 'Bu Ipik',
    status: 'hadir',
  },
  {
    id: 3,
    timeRange: '10.20 – 11.40',
    classTime: '10.20 – 11.40',
    subject: 'Matematika',
    duration: '2 JP',
    teacher: 'Pak Budi',
    status: 'belum',
  },
  {
    id: 4,
    timeRange: '12.30 – 14.10',
    classTime: '12.30 – 14.10',
    subject: 'Basis Data',
    duration: '2 JP',
    teacher: 'Bu Siti',
    status: 'hadir',
  },
])

// Computed
const formattedDate = computed(() => {
  const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }
  const date = new Date(2026, 1, 5) // February 5, 2026
  return date.toLocaleDateString('id-ID', options)
})

// Methods
const handlePresensi = (scheduleId) => {
  const schedule = schedules.value.find((s) => s.id === scheduleId)
  if (schedule) {
    schedule.status = 'hadir'
    alert(`Presensi untuk ${schedule.subject} berhasil dicatat!`)
  }
}
</script>