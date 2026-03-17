<template>
  <div class="min-h-screen bg-slate-50 font-sans">

    <div class="max-w-screen-lg mx-auto px-0 sm:px-0 lg:px-0 py-0 lg:py-0 flex flex-col lg:flex-row gap-4">
      <div class="flex-1 min-w-0">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="flex flex-col sm:flex-row sm:items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-300">
            <div class="flex items-center gap-1 flex-shrink-0">
              <h2 class="text-sm sm:text-base font-bold text-slate-800 tracking-tight mr-1">
                {{ monthName }} {{ currentYear }}
              </h2>
              <button @click="prevMonth" class="p-1.5  hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <ChevronLeft class="h-4 w-4" />
              </button>
              <button @click="nextMonth" class="p-1.5 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors">
                <ChevronRight class="h-4 w-4" />
              </button>
            </div>
            <div class="flex items-center gap-2 sm:gap-4 flex-wrap flex-1">
              <div v-for="cat in categories" :key="cat.value" class="flex items-center gap-1 sm:gap-1.5">
                <span class="w-2 h-2 rounded-full flex-shrink-0" :class="cat.dot"></span>
                <span class="text-[10px] sm:text-xs text-slate-500 whitespace-nowrap">{{ cat.label }}</span>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-7 border-b border-slate-300">
            <div
              v-for="(day, i) in dayLabels"
              :key="day"
              class="py-2 text-center font-semibold uppercase tracking-widest"
              :class="[i === 0 ? 'text-rose-400' : 'text-slate-400', 'text-[9px] sm:text-xs']"
            >
              <span class="sm:hidden">{{ day[0] }}</span>
              <span class="hidden sm:inline">{{ day }}</span>
            </div>
          </div>

          <div>
            <div
              v-for="(week, wIdx) in calendarWeeks"
              :key="wIdx"
              class="relative"
            >
              <div class="grid grid-cols-7">
                <div
                  v-for="(cell, cIdx) in week"
                  :key="cIdx"
                  @click="cell.isCurrentMonth && cell.date && selectDate(cell.date)"
                  class="relative border-b border-r border-slate-200 transition-colors"
                  :class="[
                    'min-h-[56px] sm:min-h-[70px] lg:min-h-[75px]',
                    'p-1 sm:p-1.5 lg:p-2',
                    !cell.isCurrentMonth ? 'bg-slate-50/50 cursor-default' : 'cursor-pointer hover:bg-blue-50/40',
                    cIdx === 6 ? 'border-r-0' : '',
                    wIdx === calendarWeeks.length - 1 ? 'border-b-0' : '',
                    cell.date && isToday(cell.date) ? 'bg-blue-50/60' : '',
                    cell.date && selectedDate === cell.date ? 'bg-blue-100/70 ring-1 ring-inset ring-blue-300' : '',
                  ]"
                >
                  <!-- Day Number -->
                  <div v-if="cell.date" class="flex items-start justify-between mb-0.5 sm:mb-1.5">
                    <span
                      class="inline-flex items-center justify-center rounded-full font-semibold transition-colors z-10 relative"
                      :class="[
                        'h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7',
                        'text-[10px] sm:text-xs lg:text-sm',
                        isToday(cell.date) ? 'bg-blue-600 text-white' : '',
                        !isToday(cell.date) && cell.isCurrentMonth && !cell.isSunday ? 'text-slate-700' : '',
                        !isToday(cell.date) && !cell.isCurrentMonth ? 'text-slate-300' : '',
                        !isToday(cell.date) && cell.isSunday && cell.isCurrentMonth ? 'text-rose-400' : '',
                      ]"
                    >
                      {{ cell.day }}
                    </span>
                  </div>

                  <div v-if="cell.date && cell.isCurrentMonth" class="hidden sm:block space-y-0.5 lg:space-y-1">
                    <div
                      v-for="_ in getSpanBarCountForCell(cell.date, wIdx)"
                      :key="_"
                      class="h-[20px]"
                    ></div>
                    <div
                      v-for="(event, eIdx) in getSingleDayEventsForDate(cell.date).slice(0, 2)"
                      :key="eIdx"
                      @click.stop="selectEventFromCalendar(event)"
                      class="flex items-center gap-1 px-1 sm:px-1.5 py-0.5 rounded cursor-pointer transition-opacity hover:opacity-80 truncate"
                      :class="[eventCategoryClass(event.category), 'text-[9px] sm:text-xs font-medium']"
                    >
                      <span class="w-1 sm:w-1.5 h-1 sm:h-1.5 rounded-full flex-shrink-0" :class="eventDotClass(event.category)"></span>
                      <span class="truncate">{{ event.title }}</span>
                    </div>
                    <div v-if="getSingleDayEventsForDate(cell.date).length > 2" class="text-[9px] sm:text-xs text-slate-400 pl-1 font-medium">
                      +{{ getSingleDayEventsForDate(cell.date).length - 2 }} lagi
                    </div>
                  </div>
                </div>
              </div>

              <div class="bar-layer absolute inset-x-0 pointer-events-none">
                <div
                  v-for="(bar, bIdx) in getSpanBarsForWeek(wIdx)"
                  :key="bIdx"
                  class="absolute flex items-center overflow-visible pointer-events-auto cursor-pointer hover:opacity-80 transition-opacity"
                  :style="{ ...getBarStyle(bar), backgroundColor: barColorMap[bar.event.category] || '#e2e8f0' }"
                  @click.stop="selectEventFromCalendar(bar.event)"
                >
                  <span
                    class="whitespace-nowrap font-semibold leading-none px-1 text-[8px] sm:px-1.5 sm:text-[10px] lg:text-xs"
                    :class="getBarTextClass(bar.event.category)"
                  >
                    {{ bar.event.title }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-3 sm:space-y-4">
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h3 class="text-xs sm:text-sm font-bold text-slate-700 truncate pr-2">
              {{ selectedDate ? formatDateLabel(selectedDate) : 'Pilih tanggal' }}
            </h3>
            <button
              v-if="selectedDate"
              @click="openAddModalForDate(selectedDate)"
              class="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors flex-shrink-0"
            >
              <Plus class="h-3.5 w-3.5" />
              <span class="hidden sm:inline">Tambah</span>
            </button>
          </div>

          <div v-if="!selectedDate" class="px-4 py-6 sm:py-8 text-center">
            <CalendarDays class="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-slate-200 mb-2" />
            <p class="text-xs text-slate-400">Klik tanggal untuk melihat kegiatan</p>
          </div>

          <div v-else-if="selectedDateAllEvents.length === 0" class="px-4 py-6 sm:py-8 text-center">
            <CalendarDays class="mx-auto h-8 w-8 sm:h-10 sm:w-10 text-slate-200 mb-2" />
            <p class="text-xs text-slate-400">Tidak ada kegiatan</p>
          </div>

          <div v-else class="divide-y divide-slate-100">
            <div
              v-for="event in selectedDateAllEvents"
              :key="event.id"
              class="px-4 py-3 hover:bg-slate-50 transition-colors group"
            >
              <div class="flex items-start gap-3">
                <div class="mt-1 w-2 h-2 rounded-full flex-shrink-0" :class="eventDotClass(event.category)"></div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs sm:text-sm font-semibold text-slate-800 truncate">{{ event.title }}</p>
                  <p class="text-[10px] sm:text-xs text-slate-400 mt-0.5">{{ event.categoryLabel }}</p>
                  <p v-if="event.endDate && event.endDate !== event.date" class="text-[10px] sm:text-xs text-slate-400 mt-0.5">
                    {{ formatDateShort(event.date) }} – {{ formatDateShort(event.endDate) }}
                  </p>
                  <p v-if="event.description" class="text-[10px] sm:text-xs text-slate-500 mt-1 line-clamp-2">{{ event.description }}</p>
                </div>
                <div class="flex items-center gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button @click="openEditModal(event)" class="p-1.5 rounded-md hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors">
                    <Pencil class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </button>
                  <button @click="confirmDelete(event)" class="p-1.5 rounded-md hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 class="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Upcoming Events -->
        <div class="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="px-4 py-3 border-b border-slate-100">
            <h3 class="text-xs sm:text-sm font-bold text-slate-700">Kegiatan Mendatang</h3>
          </div>
          <div v-if="upcomingEvents.length === 0" class="px-4 py-5 text-center">
            <p class="text-xs text-slate-400">Tidak ada kegiatan mendatang</p>
          </div>
          <div v-else>
            <div class="flex gap-2 p-3 overflow-x-auto lg:hidden pb-3">
              <div
                v-for="event in upcomingEvents"
                :key="event.id"
                @click="jumpToEvent(event)"
                class="flex-shrink-0 w-36 bg-slate-50 rounded-lg p-2.5 cursor-pointer hover:bg-blue-50 transition-colors border border-slate-100"
              >
                <div class="flex items-center gap-1.5 mb-1.5">
                  <span class="w-1.5 h-1.5 rounded-full flex-shrink-0" :class="eventDotClass(event.category)"></span>
                  <span class="text-[10px] font-medium text-slate-400">{{ formatDayNum(event.date) }} {{ formatMonthShort(event.date) }}</span>
                </div>
                <p class="text-xs font-semibold text-slate-700 line-clamp-2 leading-snug">{{ event.title }}</p>
              </div>
            </div>
            <div class="hidden lg:block divide-y divide-slate-100 max-h-72 overflow-y-auto">
              <div
                v-for="event in upcomingEvents"
                :key="'lg-' + event.id"
                class="flex px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer items-start gap-3"
                @click="jumpToEvent(event)"
              >
                <div class="flex-shrink-0 text-center bg-slate-100 rounded-lg px-2 py-1 min-w-[38px]">
                  <p class="text-xs font-bold text-slate-700 leading-none">{{ formatDayNum(event.date) }}</p>
                  <p class="text-[10px] text-slate-400 uppercase mt-0.5">{{ formatMonthShort(event.date) }}</p>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-semibold text-slate-700 truncate">{{ event.title }}</p>
                  <span class="inline-block mt-1 text-[10px] font-medium px-1.5 py-0.5 rounded" :class="eventCategoryClass(event.category)">
                    {{ event.categoryLabel }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Tambah / Edit -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showModal" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="closeModal"></div>
          <div class="relative bg-white w-full sm:max-w-md z-10 overflow-hidden rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[92vh] flex flex-col">
            <div class="px-5 sm:px-6 py-4 sm:py-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0">
              <div class="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 bg-slate-200 rounded-full sm:hidden"></div>
              <h3 class="text-sm sm:text-base font-bold text-slate-800 mt-2 sm:mt-0">
                {{ editingEvent ? 'Edit Kegiatan' : 'Tambah Kegiatan' }}
              </h3>
              <button @click="closeModal" class="p-1.5 sm:p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors mt-2 sm:mt-0">
                <X class="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>
            <div class="px-5 sm:px-6 py-4 sm:py-5 space-y-4 overflow-y-auto flex-1">
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1.5">Nama Kegiatan <span class="text-red-500">*</span></label>
                <input v-model="form.title" type="text" placeholder="Contoh: Ujian Tengah Semester"
                  class="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  :class="formErrors.title ? 'border-red-400 focus:ring-red-400' : ''" />
                <p v-if="formErrors.title" class="text-xs text-red-500 mt-1">{{ formErrors.title }}</p>
              </div>
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1.5">Tanggal Mulai <span class="text-red-500">*</span></label>
                  <input v-model="form.date" type="date"
                    class="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    :class="formErrors.date ? 'border-red-400 focus:ring-red-400' : ''" />
                  <p v-if="formErrors.date" class="text-xs text-red-500 mt-1">{{ formErrors.date }}</p>
                </div>
                <div>
                  <label class="block text-xs font-semibold text-slate-600 mb-1.5">Tanggal Selesai</label>
                  <input v-model="form.endDate" type="date"
                    class="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" />
                </div>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1.5">Kategori <span class="text-red-500">*</span></label>
                <div class="relative">
                  <select v-model="form.category"
                    class="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white transition"
                    :class="formErrors.category ? 'border-red-400 focus:ring-red-400' : ''">
                    <option value="">Pilih kategori</option>
                    <option v-for="cat in categories" :key="cat.value" :value="cat.value">{{ cat.label }}</option>
                  </select>
                  <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
                <p v-if="formErrors.category" class="text-xs text-red-500 mt-1">{{ formErrors.category }}</p>
              </div>
              <div>
                <label class="block text-xs font-semibold text-slate-600 mb-1.5">Keterangan</label>
                <textarea v-model="form.description" rows="3" placeholder="Tambahkan keterangan kegiatan (opsional)..."
                  class="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition"></textarea>
              </div>
            </div>
            <div class="px-5 sm:px-6 py-4 border-t border-slate-100 flex gap-3 flex-shrink-0">
              <button @click="closeModal" class="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
              <button @click="saveEvent" class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-sm">
                {{ editingEvent ? 'Simpan' : 'Tambah' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showDeleteConfirm" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div class="fixed inset-0 bg-black/40 backdrop-blur-sm" @click="showDeleteConfirm = false"></div>
          <div class="relative bg-white w-full sm:max-w-sm z-10 p-6 text-center rounded-t-2xl sm:rounded-2xl shadow-2xl">
            <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Trash2 class="h-5 w-5 sm:h-6 sm:w-6 text-red-500" />
            </div>
            <h3 class="text-sm sm:text-base font-bold text-slate-800 mb-1">Hapus Kegiatan?</h3>
            <p class="text-xs sm:text-sm text-slate-500 mb-5">
              Kegiatan <span class="font-semibold text-slate-700">"{{ deletingEvent?.title }}"</span> akan dihapus permanen.
            </p>
            <div class="flex gap-3">
              <button @click="showDeleteConfirm = false" class="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
              <button @click="deleteEvent" class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors">Hapus</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight, Plus, X, Pencil, Trash2, CalendarDays, ChevronDown } from 'lucide-vue-next'

const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear  = ref(today.getFullYear())
const selectedDate = ref(null)

const showModal         = ref(false)
const showDeleteConfirm = ref(false)
const editingEvent      = ref(null)
const deletingEvent     = ref(null)

const form       = ref({ title: '', date: '', endDate: '', category: '', description: '' })
const formErrors = ref({})

const categories = [
  { value: 'libur',    label: 'Hari Libur',       dot: 'bg-rose-400',   chip: 'bg-rose-50 text-rose-600' },
  { value: 'ujian',    label: 'Ujian / Asesmen',  dot: 'bg-violet-400', chip: 'bg-violet-50 text-violet-600' },
  { value: 'kegiatan', label: 'Kegiatan Sekolah', dot: 'bg-blue-400',   chip: 'bg-blue-50 text-blue-600' },
  { value: 'rapat',    label: 'Rapat',            dot: 'bg-amber-400',  chip: 'bg-amber-50 text-amber-700' },
]

const getCatMeta = (v) => categories.find(c => c.value === v) || { dot: 'bg-slate-400', chip: 'bg-slate-100 text-slate-600', label: 'Lainnya' }
const eventCategoryClass = (cat) => getCatMeta(cat).chip
const eventDotClass      = (cat) => getCatMeta(cat).dot

const barColorMap = {
  libur:    '#fecdd3',
  ujian:    '#ddd6fe',
  kegiatan: '#bfdbfe',
  rapat:    '#fde68a',
}
const barTextMap = {
  libur:    'text-rose-800',
  ujian:    'text-violet-800',
  kegiatan: 'text-blue-800',
  rapat:    'text-amber-800',
}
const getBarTextClass = (cat) => barTextMap[cat] || 'text-slate-700'

const pad = (n) => String(n).padStart(2, '0')
const mm  = pad(today.getMonth() + 1)
const yy  = today.getFullYear()

const events = ref([
  { id: 1, title: 'Libur Idul Fitri',          date: `${yy}-${mm}-01`, endDate: `${yy}-${mm}-03`, category: 'libur',    description: 'Libur nasional Idul Fitri 1446 H.' },
  { id: 2, title: 'UTS Semester Genap',         date: `${yy}-${mm}-08`, endDate: `${yy}-${mm}-12`, category: 'ujian',    description: 'Ujian Tengah Semester Genap untuk semua kelas.' },
  { id: 3, title: 'Rapat Komite Sekolah',       date: `${yy}-${mm}-10`, endDate: '',               category: 'rapat',    description: '' },
  { id: 4, title: 'Peringatan Hari Pendidikan', date: `${yy}-${mm}-02`, endDate: '',               category: 'kegiatan', description: 'Upacara bendera dan pentas seni.' },
  { id: 5, title: 'Classmeeting',               date: `${yy}-${mm}-18`, endDate: `${yy}-${mm}-20`, category: 'kegiatan', description: 'Lomba antar kelas.' },
  { id: 6, title: 'UAS Semester Genap',         date: `${yy}-${mm}-25`, endDate: `${yy}-${mm}-28`, category: 'ujian',    description: 'Ujian Akhir Semester Genap.' },
])
let nextId = 7

const dayLabels  = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
const monthNames = ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember']

const monthName = computed(() => monthNames[currentMonth.value])

const calendarCells = computed(() => {
  const year        = currentYear.value
  const month       = currentMonth.value
  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const daysInPrev  = new Date(year, month, 0).getDate()
  const cells = []

  for (let i = firstDay - 1; i >= 0; i--) {
    const d = daysInPrev - i
    cells.push({ day: d, date: `${year}-${pad(month)}-${pad(d)}`, isCurrentMonth: false, isSunday: (firstDay - i - 1) % 7 === 0 })
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay()
    cells.push({ day: d, date: `${year}-${pad(month + 1)}-${pad(d)}`, isCurrentMonth: true, isSunday: dow === 0 })
  }
  const remaining = 42 - cells.length
  for (let d = 1; d <= remaining; d++) {
    cells.push({ day: d, date: `${year}-${pad(month + 2)}-${pad(d)}`, isCurrentMonth: false, isSunday: (cells.length + d - 1) % 7 === 0 })
  }
  return cells
})

const calendarWeeks = computed(() => {
  const weeks = []
  for (let i = 0; i < 42; i += 7) weeks.push(calendarCells.value.slice(i, i + 7))
  return weeks
})

const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`
const isToday  = (dateStr) => dateStr === todayStr

const prevMonth = () => {
  if (currentMonth.value === 0) { currentMonth.value = 11; currentYear.value-- }
  else currentMonth.value--
}
const nextMonth = () => {
  if (currentMonth.value === 11) { currentMonth.value = 0; currentYear.value++ }
  else currentMonth.value++
}

const isSpanningEvent = (event) => event.endDate && event.endDate > event.date

const dateInRange = (dateStr, event) => {
  const end = event.endDate || event.date
  return dateStr >= event.date && dateStr <= end
}

const getSingleDayEventsForDate = (dateStr) =>
  events.value
    .filter(e => e.date === dateStr && !isSpanningEvent(e))
    .map(e => ({ ...e, categoryLabel: getCatMeta(e.category).label }))

const getAllEventsForDate = (dateStr) =>
  events.value
    .filter(e => dateInRange(dateStr, e))
    .map(e => ({ ...e, categoryLabel: getCatMeta(e.category).label }))

const selectedDateAllEvents = computed(() =>
  selectedDate.value ? getAllEventsForDate(selectedDate.value) : []
)

const upcomingEvents = computed(() =>
  events.value
    .filter(e => (e.endDate || e.date) >= todayStr)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 8)
    .map(e => ({ ...e, categoryLabel: getCatMeta(e.category).label }))
)

const selectDate = (dateStr) => {
  selectedDate.value = selectedDate.value === dateStr ? null : dateStr
}
const selectEventFromCalendar = (event) => { selectedDate.value = event.date }
const jumpToEvent = (event) => {
  const [y, m] = event.date.split('-').map(Number)
  currentYear.value  = y
  currentMonth.value = m - 1
  selectedDate.value = event.date
}

const getSpanBarsForWeek = (wIdx) => {
  const week      = calendarWeeks.value[wIdx]
  const weekStart = week[0].date
  const weekEnd   = week[6].date

  const spanning = events.value
    .filter(e => isSpanningEvent(e) && e.date <= weekEnd && e.endDate >= weekStart)
    .sort((a, b) => a.date.localeCompare(b.date))

  const bars = []
  const rowOccupied = {}

  spanning.forEach(event => {
    const colStart = week.findIndex(cell => cell.date >= event.date)
    let   colEnd   = week.findLastIndex(cell => cell.date <= event.endDate)
    if (colEnd === -1) colEnd = 6
    if (colStart === -1) return

    let row = 0
    while (true) {
      let occupied = false
      for (let c = colStart; c <= colEnd; c++) {
        if (rowOccupied[`${row}-${c}`]) { occupied = true; break }
      }
      if (!occupied) break
      row++
    }
    for (let c = colStart; c <= colEnd; c++) rowOccupied[`${row}-${c}`] = true

    bars.push({ event, colStart, colEnd, row })
  })

  return bars
}

const getSpanBarCountForCell = (dateStr, wIdx) => {
  const bars   = getSpanBarsForWeek(wIdx)
  const week   = calendarWeeks.value[wIdx]
  const colIdx = week.findIndex(c => c.date === dateStr)
  if (colIdx === -1) return 0
  return bars.filter(b => colIdx >= b.colStart && colIdx <= b.colEnd).length
}

const getBarStyle = (bar) => {
  const colWidth = 100 / 7
  const GAP      = 0.2  // gap kiri-kanan (%)

  const left  = bar.colStart * colWidth + GAP
  const width = (bar.colEnd - bar.colStart + 1) * colWidth - GAP * 2

  return {
    left:         `${left}%`,
    width:        `${width}%`,
    top:          `calc(var(--bar-offset) + ${bar.row} * var(--bar-row-h))`,
    height:       `var(--bar-h)`,
    borderRadius: '9999px',
  }
}

const formatDateLabel = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
}
const formatDateShort = (dateStr) => {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
const formatDayNum     = (dateStr) => dateStr.split('-')[2]
const formatMonthShort = (dateStr) => monthNames[Number(dateStr.split('-')[1]) - 1].slice(0, 3)

const resetForm = () => {
  form.value         = { title: '', date: '', endDate: '', category: '', description: '' }
  formErrors.value   = {}
  editingEvent.value = null
}
const openAddModal        = () => { resetForm(); if (selectedDate.value) form.value.date = selectedDate.value; showModal.value = true }
const openAddModalForDate = (dateStr) => { resetForm(); form.value.date = dateStr; showModal.value = true }
const openEditModal = (event) => {
  resetForm()
  editingEvent.value = event
  form.value = { title: event.title, date: event.date, endDate: event.endDate || '', category: event.category, description: event.description || '' }
  showModal.value = true
}
const closeModal = () => { showModal.value = false; resetForm() }

const validateForm = () => {
  const errors = {}
  if (!form.value.title.trim()) errors.title    = 'Nama kegiatan wajib diisi.'
  if (!form.value.date)         errors.date     = 'Tanggal mulai wajib diisi.'
  if (!form.value.category)     errors.category = 'Kategori wajib dipilih.'
  formErrors.value = errors
  return Object.keys(errors).length === 0
}
const saveEvent = () => {
  if (!validateForm()) return
  if (editingEvent.value) {
    const idx = events.value.findIndex(e => e.id === editingEvent.value.id)
    if (idx !== -1) events.value[idx] = { ...events.value[idx], ...form.value }
  } else {
    events.value.push({ id: nextId++, ...form.value })
  }
  selectedDate.value = form.value.date
  closeModal()
}

const confirmDelete = (event) => { deletingEvent.value = event; showDeleteConfirm.value = true }
const deleteEvent   = () => {
  events.value = events.value.filter(e => e.id !== deletingEvent.value.id)
  showDeleteConfirm.value = false
  deletingEvent.value = null
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from,
.modal-leave-to     { opacity: 0; }
.modal-enter-active .relative { transition: transform 0.25s cubic-bezier(0.32, 0.72, 0, 1); }
.modal-enter-from   .relative { transform: translateY(100%); }
@media (min-width: 640px) {
  .modal-enter-active .relative { transition: transform 0.2s ease; }
  .modal-enter-from   .relative { transform: scale(0.96) translateY(8px); }
}

.bar-layer {
  top: 0;
  --bar-offset: 26px;
  --bar-h:      14px;
  --bar-row-h:  16px;
}
@media (min-width: 640px) {
  .bar-layer {
    --bar-offset: 32px;
    --bar-h:      18px;
    --bar-row-h:  20px;
  }
}
@media (min-width: 1024px) {
  .bar-layer {
    --bar-offset: 38px;
    --bar-h:      18px;
    --bar-row-h:  20px;
  }
}
</style>