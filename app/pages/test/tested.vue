<template>
  <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
    <div class="max-w-full mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-sm shadow-md p-6 mb-6 MT-0">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">XII RPL 1</h1>
            <p class="text-sm text-gray-500 mt-1">SMKN 1 CISARUA - Tahun Ajaran 2024/2025</p>
          </div>
          <!-- <div class="text-right">
            <p class="text-sm text-gray-600">Timetable generated:</p>
            <p class="text-sm font-semibold text-gray-900">{{ currentDate }}</p>
          </div> -->
        </div>
      </div>

      <!-- Schedule Table Container -->
      <div class="bg-white rounded-sm shadow-md overflow-hidden">
        <!-- Info: Scroll horizontal -->
        <div class="bg-blue-50 border-b border-blue-100 px-4 py-2.5">
          <p class="text-xs text-blue-700 flex items-center gap-2">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            Geser ke kanan untuk melihat jadwal lengkap
          </p>
        </div>

        <!-- Scrollable Table -->
        <div class="overflow-x-auto custom-scrollbar">
          <table class="w-full border-collapse min-w-max">
            <!-- Table Header -->
            <thead>
              <tr class="bg-gray-100 border-b-2 border-gray-800">
                <th
                  class="day-cell border border-gray-900 p-2 text-left font-semibold text-gray-700 sticky left-0 bg-gray-100 z-10">
                </th>
                <template v-for="(slot, index) in timeSlots" :key="index">
                  <th v-if="slot.type === 'class'" class="time-cell border border-gray-900 p-2 text-center">
                    <div class="font-semibold text-gray-900 text-base">{{ slot.name }}</div>
                    <div class="text-gray-600 text-[10px]">{{ slot.time }}</div>
                  </th>
                  <th v-else class="border border-gray-900 p-2 bg-white break-cell">
                    <div class="vertical-text text-xs font-semibold text-gray-700">
                      {{ slot.name }}
                    </div>
                  </th>
                </template>
              </tr>
            </thead>

            <!-- Table Body -->
            <tbody>
              <tr v-for="(day, dayName) in schedule" :key="dayName" class="hover:bg-gray-50 transition-colors">
                <td
                  class="day-cell border border-gray-900 p-3 font-semibold text-gray-900 bg-gray-50 sticky left-0 z-10">
                  {{ dayName }}
                </td>
                <template v-for="(session, idx) in day" :key="idx">
                  <td v-if="session.type === 'break'" class="schedule-cell border border-gray-900 bg-white"></td>
                  <td v-else-if="session.type === 'empty'" class="schedule-cell border border-gray-900 bg-white"></td>
                  <td v-else class="schedule-cell border border-gray-900 p-0"
                    :style="{ backgroundColor: session.color }">
                    <button @click="handlePresensi(session, dayName, idx)"
                      class="w-full h-full p-2 text-left hover:opacity-80 hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95">
                      <div class="font-bold text-sm text-gray-900">{{ session.subject }}</div>
                      <div class="text-xs mt-1 text-gray-700">{{ session.teacher }}</div>
                    </button>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Legend -->
      <div class="bg-white rounded-sm shadow-md p-6 mt-6">
        <h3 class="text-sm font-semibold text-gray-900 mb-3">Keterangan Mata Pelajaran:</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <div v-for="(subject, index) in subjects" :key="index" class="flex items-center gap-2">
            <div class="w-4 h-4 rounded border border-gray-300 flex-shrink-0"
              :style="{ backgroundColor: subject.color }">
            </div>
            <span class="text-xs text-gray-700">{{ subject.code }} - {{ subject.name }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Current date
const currentDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: '2-digit', year: 'numeric' })
})

// Time slots configuration
const timeSlots = ref([
  { name: 'Jam ke-1', time: '6:30 - 7:10', type: 'class' },
  { name: 'Jam ke-2', time: '7:10 - 7:50', type: 'class' },
  { name: 'Jam ke-3', time: '7:50 - 8:30', type: 'class' },
  { name: 'Jam ke-4', time: '8:30 - 9:10', type: 'class' },
  { name: 'ISTIRAHAT 1', time: '9:10 - 9:25', type: 'break' },
  { name: 'Jam ke-5', time: '9:25 - 10:05', type: 'class' },
  { name: 'Jam ke-6', time: '10:05 - 10:45', type: 'class' },
  { name: 'Jam ke-7', time: '10:45 - 11:25', type: 'class' },
  { name: 'Jam ke-8', time: '11:25 - 12:05', type: 'class' },
  { name: 'ISTIRAHAT 2', time: '12:05 - 12:25', type: 'break' },
  { name: 'Jam ke-9', time: '12:25 - 13:05', type: 'class' },
  { name: 'Jam ke-10', time: '13:05 - 13:45', type: 'class' },
  { name: 'Jam ke-11', time: '13:45 - 14:25', type: 'class' },
  { name: 'Jam ke-12', time: '14:25 - 15:05', type: 'class' },
])

// Subject list with colors
const subjects = ref([
  { code: 'PPB', name: 'Pemrograman Perangkat Bergerak', color: '#A7F3D0' },
  { code: 'PKK RPL', name: 'Produk Kreatif dan Kewirausahaan', color: '#38BDF8' },
  { code: 'BK', name: 'Bimbingan Konseling', color: '#86EFAC' },
  { code: 'B INDO', name: 'Bahasa Indonesia', color: '#38BDF8' },
  { code: 'PABP', name: 'Pendidikan Agama Islam', color: '#F9A8D4' },
  { code: 'PROG WEB', name: 'Pemrograman Web', color: '#FB923C' },
])

// Schedule data
const schedule = ref({
  'Senin': [
    { type: 'class', subject: 'Upacara', teacher: 'Upacara', color: '#EF4444' },
    { type: 'class', subject: 'PPB', teacher: 'SANDI', color: '#A7F3D0' },
    { type: 'class', subject: 'PPB', teacher: 'SANDI', color: '#A7F3D0' },
    { type: 'class', subject: 'PPB', teacher: 'SANDI', color: '#A7F3D0' },
    { type: 'break' },
    { type: 'class', subject: 'PPB', teacher: 'SANDI', color: '#A7F3D0' },
    { type: 'class', subject: 'PPB', teacher: 'SANDI', color: '#A7F3D0' },
    { type: 'class', subject: 'PKK RPL', teacher: 'YAYA', color: '#38BDF8' },
    { type: 'class', subject: 'PKK RPL', teacher: 'YAYA', color: '#38BDF8' },
    { type: 'break' },
    { type: 'class', subject: 'PKK RPL', teacher: 'YAYA', color: '#38BDF8' },
    { type: 'class', subject: 'PKK RPL', teacher: 'YAYA', color: '#38BDF8' },
    { type: 'class', subject: 'PKK RPL', teacher: 'YAYA', color: '#38BDF8' },
    { type: 'class', subject: 'BK', teacher: 'VIRA', color: '#86EFAC' },
  ],
  'Selasa': [
    { type: 'class', subject: 'B INDO', teacher: 'UPIK', color: '#38BDF8' },
    { type: 'class', subject: 'B INDO', teacher: 'UPIK', color: '#38BDF8' },
    { type: 'class', subject: 'B INDO', teacher: 'UPIK', color: '#38BDF8' },
    { type: 'class', subject: 'PABP', teacher: 'NURON', color: '#F9A8D4' },
    { type: 'break' },
    { type: 'class', subject: 'PABP', teacher: 'NURON', color: '#F9A8D4' },
    { type: 'class', subject: 'PABP', teacher: 'NURON', color: '#F9A8D4' },
    { type: 'class', subject: 'PROG WEB', teacher: 'INDRA', color: '#FB923C' },
    { type: 'class', subject: 'PROG WEB', teacher: 'INDRA', color: '#FB923C' },
    { type: 'break' },
    { type: 'class', subject: 'PROG WEB', teacher: 'INDRA', color: '#FB923C' },
    { type: 'class', subject: 'PROG WEB', teacher: 'INDRA', color: '#FB923C' },
    { type: 'class', subject: 'PROG WEB', teacher: 'INDRA', color: '#FB923C' },
    { type: 'empty' },
  ],
  'Rabu': [
    { type: 'class', subject: 'PBTGM', teacher: 'DONNY', color: '#FCD34D' },
    { type: 'class', subject: 'PBTGM', teacher: 'DONNY', color: '#FCD34D' },
    { type: 'class', subject: 'PBTGM', teacher: 'DONNY', color: '#FCD34D' },
    { type: 'class', subject: 'PBTGM', teacher: 'DONNY', color: '#FCD34D' },
    { type: 'break' },
    { type: 'class', subject: 'PBTGM', teacher: 'DONNY', color: '#FCD34D' },
    { type: 'class', subject: 'PBTGM', teacher: 'DONNY', color: '#FCD34D' },
    { type: 'class', subject: 'MTK', teacher: 'RESTU', color: '#9CA3AF' },
    { type: 'class', subject: 'MTK', teacher: 'RESTU', color: '#9CA3AF' },
    { type: 'break' },
    { type: 'class', subject: 'MTK', teacher: 'RESTU', color: '#9CA3AF' },
    { type: 'class', subject: 'PP', teacher: 'AYU R', color: '#A78BFA' },
    { type: 'class', subject: 'PP', teacher: 'AYU R', color: '#A78BFA' },
    { type: 'class', subject: 'BK', teacher: 'VIRA', color: '#86EFAC' },
  ],
  'Kamis': [
    { type: 'class', subject: 'BASDAT', teacher: 'TETI', color: '#86EFAC' },
    { type: 'class', subject: 'BASDAT', teacher: 'TETI', color: '#86EFAC' },
    { type: 'class', subject: 'BASDAT', teacher: 'TETI', color: '#86EFAC' },
    { type: 'class', subject: 'BASDAT', teacher: 'TETI', color: '#86EFAC' },
    { type: 'break' },
    { type: 'class', subject: 'BASDAT', teacher: 'TETI', color: '#86EFAC' },
    { type: 'class', subject: 'BASDAT', teacher: 'TETI', color: '#86EFAC' },
    { type: 'class', subject: 'B JPG', teacher: 'RAHMAT', color: '#EF4444' },
    { type: 'class', subject: 'B INGG', teacher: 'RINA', color: '#38BDF8' },
    { type: 'break' },
    { type: 'class', subject: 'B INGG', teacher: 'RINA', color: '#38BDF8' },
    { type: 'class', subject: 'B INGG', teacher: 'RINA', color: '#38BDF8' },
    { type: 'class', subject: 'B INGG', teacher: 'RINA', color: '#38BDF8' },
    { type: 'empty' },
  ],
  'Jumat': [
    { type: 'class', subject: 'B SUND', teacher: 'RIKSA', color: '#DBEAFE' },
    { type: 'class', subject: 'B SUND', teacher: 'RIKSA', color: '#DBEAFE' },
    { type: 'class', subject: 'MAPIL-D ESGRAF', teacher: 'HANDY', color: '#FDE047' },
    { type: 'class', subject: 'MAPIL-D ESGRAF', teacher: 'HANDY', color: '#FDE047' },
    { type: 'break' },
    { type: 'class', subject: 'MAPIL-D ESGRAF', teacher: 'HANDY', color: '#FDE047' },
    { type: 'class', subject: 'MAPIL-D ESGRAF', teacher: 'HANDY', color: '#FDE047' },
    { type: 'empty' },
    { type: 'empty' },
    { type: 'break' },
    { type: 'empty' },
    { type: 'empty' },
    { type: 'empty' },
    { type: 'empty' },
  ],
})
</script>

<style scoped>
.schedule-cell {
  min-width: 120px;
  height: 80px;
}

.day-cell {
  min-width: 100px;
}

.time-cell {
  min-width: 120px;
}

.break-cell {
  min-width: 60px;
}

.vertical-text {
  writing-mode: vertical-rl;
  text-orientation: mixed;
}

/* Custom scrollbar */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Sticky column */
.sticky {
  position: sticky;
}
</style>