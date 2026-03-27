<template>
  <div class="min-h-screen bg-slate-50">
    <div class="space-y-4 sm:space-y-5">

      <!-- Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">

        <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 class="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p class="text-xs text-slate-500 mb-0.5">Hadir</p>
              <div v-if="isLoading" class="h-7 w-12 bg-slate-200 rounded animate-pulse"></div>
              <p v-else class="text-2xl font-bold text-green-600 leading-none">{{ totalHadir }}</p>
            </div>
          </div>
        </div>

        <!-- Card Tidak Hadir — angka utama + sub-info dengan tugas -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center flex-shrink-0">
              <XCircle class="w-4 h-4 text-red-500" />
            </div>
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div>
                <p class="text-xs text-slate-500 mb-0.5">Tidak Hadir</p>
                <p class="text-2xl font-bold text-red-500 leading-none">{{ totalTidakHadir }}</p>
              </div>
              <div class="w-px self-stretch bg-slate-200 mx-1"></div>
              <div>
                <p class="text-xs text-slate-500 mb-0.5">Dengan Tugas</p>
                <p class="text-2xl font-bold text-blue-500 leading-none">{{ totalTidakHadirDenganTugas }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Card Ditolak -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
              <ShieldX class="w-4 h-4 text-orange-500" />
            </div>
            <div>
              <p class="text-xs text-slate-500 mb-0.5">Ditolak</p>
              <div v-if="isLoading" class="h-7 w-12 bg-slate-200 rounded animate-pulse"></div>
              <p v-else class="text-2xl font-bold text-orange-500 leading-none">{{ totalDitolak }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
              <Clock class="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <p class="text-xs text-slate-500 mb-0.5">Tdk Dipresensi</p>
              <div v-if="isLoading" class="h-7 w-12 bg-slate-200 rounded animate-pulse"></div>
              <p v-else class="text-2xl font-bold text-slate-400 leading-none">{{ totalBelum }}</p>
            </div>
          </div>
        </div>

      </div>

      <!-- History Cards -->
      <div class="space-y-3">

        <!-- Loading Skeleton -->
        <template v-if="isLoading">
          <div v-for="i in perPage" :key="'skeleton-' + i"
            class="bg-white rounded-xl border border-slate-200 overflow-hidden"
            :style="{ opacity: 1 - (i - 1) * 0.12 }">
            <div class="pl-5 pr-4 sm:pr-5 py-4 sm:py-5 flex gap-0 items-stretch">
              <div class="w-1 bg-slate-200 animate-pulse flex-shrink-0 mr-4 rounded-full self-stretch"></div>
              <div class="flex-1 space-y-2.5 py-1">
                <div class="h-4 w-28 bg-slate-200 rounded animate-pulse"></div>
                <div class="h-5 w-44 bg-slate-200 rounded animate-pulse"></div>
                <div class="h-4 w-36 bg-slate-200 rounded animate-pulse"></div>
                <div class="flex gap-2 pt-1">
                  <div class="h-6 w-16 bg-slate-200 rounded-full animate-pulse"></div>
                  <div class="h-6 w-20 bg-slate-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            <div class="bg-slate-50 px-5 py-2.5 border-t border-slate-100">
              <div class="h-3.5 w-40 bg-slate-200 rounded animate-pulse"></div>
            </div>
          </div>
        </template>

        <!-- Actual Data -->
        <template v-else>
          <div v-for="history in historyData" :key="`${history.id_jadwal}-${history.date}`"
            class="group relative bg-white rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-md"
            :class="cardBorderClass(history)">
            <div class="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl" :class="accentBarClass(history)"></div>

            <div class="pl-5 pr-4 sm:pr-5 py-4 sm:py-5">

              <div class="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <div class="flex items-center gap-2">
                  <Calendar class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span class="text-xs font-medium text-slate-500">{{ history.hari }}, {{ history.date }}</span>
                  <span class="text-slate-300 text-xs">|</span>
                  <Clock class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span class="text-sm font-bold text-slate-700 tabular-nums">{{ history.timeRange }}</span>
                </div>

                <span v-if="history.status !== 'belum' && history.statusApprove"
                  class="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                  :class="approveBadgeClass(history)">
                  <component :is="approveIcon(history)" class="w-3 h-3" />
                  {{ approveLabel(history) }}
                </span>
              </div>

              <div class="mb-3.5">
                <h3 class="text-base sm:text-lg font-bold text-slate-800 leading-snug mb-1.5">
                  {{ history.subject }}
                </h3>
                <div class="flex items-center gap-1.5">
                  <User class="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span class="text-xs text-slate-500">{{ history.teacher }}</span>
                </div>
              </div>

              <div class="flex items-center gap-2 flex-wrap mb-3.5">
                <span class="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
                  :class="statusBadgeClass(history)">
                  <component :is="statusIcon(history)" class="w-3 h-3" />
                  {{ statusLabel(history) }}
                </span>

                <span v-if="history.status === 'tidak-hadir' && history.hasTugas"
                  class="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                  <FileText class="w-3 h-3" />
                  Ada Tugas
                </span>

                <button v-if="history.photo" @click="viewPhoto(history)"
                  class="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full bg-violet-100 text-violet-700 hover:bg-violet-200 transition-colors">
                  <ImageIcon class="w-3 h-3" />
                  Lihat Foto
                </button>
              </div>

              <div v-if="history.keterangan" class="mb-3 flex gap-2 bg-slate-50 border border-slate-100 rounded-lg p-3">
                <MessageSquare class="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                <p class="text-xs text-slate-600 leading-relaxed">{{ history.keterangan }}</p>
              </div>

              <div v-if="history.statusApprove === 'Rejected' && history.alasanReject"
                class="mb-3 flex gap-2.5 bg-red-50 border border-red-100 rounded-lg p-3">
                <AlertCircle class="w-3.5 h-3.5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="text-[11px] font-bold text-red-600 mb-0.5 uppercase tracking-wide">Alasan Penolakan</p>
                  <p class="text-xs text-red-600 leading-relaxed">{{ history.alasanReject }}</p>
                </div>
              </div>

              <div v-if="history.statusApprove === 'Rejected'" class="flex justify-end">
                <button :disabled="isBandingExpired(history)"
                  class="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-lg transition-all shadow-sm"
                  :class="isBandingExpired(history)
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 active:scale-95 text-white'"
                  @click="!isBandingExpired(history) && handleResubmit(history)">
                  <RotateCcw class="w-3.5 h-3.5" />
                  {{ isBandingExpired(history) ? 'Kedaluwarsa' : 'Kirim Ulang' }}
                </button>
              </div>

            </div>

            <div class="bg-slate-50 px-5 py-2.5 border-t border-slate-100">
              <div class="flex items-center gap-1.5 text-xs text-slate-400">
                <Clock class="w-3.5 h-3.5 flex-shrink-0" />
                <span v-if="history.status === 'belum'" class="italic">Presensi tidak dilakukan</span>
                <span v-else>Diinput pada: {{ history.createdAt }}</span>
              </div>
            </div>

          </div>
        </template>

        <!-- Empty State -->
        <div v-if="!isLoading && historyData.length === 0"
          class="bg-white rounded-xl border border-slate-200 p-10 sm:p-14 text-center">
          <div class="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <ClipboardList class="w-7 h-7 text-slate-400" />
          </div>
          <h3 class="text-base font-bold text-slate-700 mb-1.5">Tidak Ada Riwayat</h3>
          <p class="text-sm text-slate-500 leading-relaxed">Belum ada riwayat presensi yang sesuai dengan filter yang
            dipilih.
          </p>
        </div>

      </div>

      <!-- Pagination -->
      <div v-if="!isLoading && totalPages > 1"
        class="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between">
        <p class="text-xs text-slate-500 hidden sm:block">
          Menampilkan
          <span class="font-bold text-slate-700">{{ (currentPage - 1) * perPage + 1 }}</span>–<span
            class="font-bold text-slate-700">{{ Math.min(currentPage * perPage, totalSlot) }}</span>
          dari <span class="font-bold text-slate-700">{{ totalSlot }}</span> data
        </p>
        <div class="flex items-center gap-1 mx-auto sm:mx-0">
          <button @click="previousPage" :disabled="currentPage === 1"
            class="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
            <ChevronLeft class="w-4 h-4" />
          </button>
          <button v-for="page in displayPages" :key="page" @click="goToPage(page)"
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

    <!-- Photo Modal -->
    <div v-if="showPhotoModal"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click="closePhotoModal">
      <button @click="closePhotoModal"
        class="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition z-10">
        <X class="w-5 h-5" />
      </button>
      <img :src="selectedPhoto" alt="Bukti Foto" class="max-w-full max-h-[90vh] object-contain rounded-xl shadow-2xl"
        @click.stop />
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import {
  ChevronRight, ChevronLeft, Clock, User, RotateCcw,
  CheckCircle2, XCircle, AlertCircle, MessageSquare,
  ClipboardList, Calendar, FileText, Image as ImageIcon,
  X, ShieldX
} from 'lucide-vue-next'
import { usePresensiStore } from '@/stores/presensi'
import { useRouter } from 'vue-router'

const presensiStore = usePresensiStore()
const router = useRouter()

const isLoading = ref(false)
const currentPage = ref(1)
const perPage = ref(10)
const showPhotoModal = ref(false)
const selectedPhoto = ref(null)
const historyData = ref([])
const totalSlot = ref(0)
const totalHadir = ref(0)
const totalTidakHadir = ref(0)
const totalTidakHadirDenganTugas = ref(0)
const totalDitolak = ref(0)
const totalBelum = ref(0)
const totalPages = ref(1)

// ─── Formatters ───────────────────────────────────────────────
const formatDate = (isoString) => {
  if (!isoString) return ''
  return new Date(isoString).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
const formatDateTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  const d = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  const t = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  return `${d}, ${t}`
}

// ─── Mapper ───────────────────────────────────────────────────
const mapToHistory = (item) => {
  const jamMulai = item.jadwal?.jam_mulai?.substring(0, 5) || ''
  const jamSelesai = item.jadwal?.jam_selesai?.substring(0, 5) || ''
  const isBelum = item.presensi === null
  return {
    id_jadwal: item.jadwal?.id_jadwal,
    id_presensi: item.id_presensi,
    hari: item.jadwal?.hari || '',
    date: formatDate(item.tanggal),
    timeRange: `${jamMulai} – ${jamSelesai}`,
    subject: item.jadwal?.mapel || 'N/A',
    teacher: item.jadwal?.guru || 'N/A',
    status: isBelum ? 'belum' : item.presensi?.status === 'Hadir' ? 'hadir' : 'tidak-hadir',
    statusApprove: item.presensi?.status_approve || null,
    hasTugas: item.presensi?.memberikan_tugas || false,
    keterangan: item.presensi?.catatan || '',
    alasanReject: item.presensi?.alasan_reject || null,
    rejectedAt: item.presensi?.rejected_at || null,
    photo: item.presensi?.foto_bukti || null,
    createdAt: formatDateTime(item.created_at),
  }
}

// ─── Style helpers ────────────────────────────────────────────
const accentBarClass = (h) => {
  if (h.statusApprove === 'Approved') return 'bg-green-500'
  if (h.statusApprove === 'Rejected') return 'bg-red-500'
  if (h.statusApprove === 'Pending') return 'bg-yellow-400'
  if (h.status === 'hadir') return 'bg-blue-400'
  if (h.status === 'tidak-hadir') return 'bg-red-300'
  return 'bg-slate-200'
}
const cardBorderClass = (h) => {
  if (h.statusApprove === 'Approved') return 'border-green-100 hover:border-green-200'
  if (h.statusApprove === 'Rejected') return 'border-red-100 hover:border-red-200'
  if (h.statusApprove === 'Pending') return 'border-yellow-100 hover:border-yellow-200'
  return 'border-slate-200 hover:border-slate-300'
}

const statusLabel = (h) => {
  if (h.status === 'hadir') return 'Hadir'
  if (h.status === 'tidak-hadir') return 'Tidak Hadir'
  return 'Tdk Dipresensi'
}
const statusBadgeClass = (h) => {
  if (h.status === 'hadir') return 'bg-green-100 text-green-700'
  if (h.status === 'tidak-hadir') return 'bg-red-100 text-red-600'
  return 'bg-slate-100 text-slate-400'
}
const statusIcon = (h) => {
  if (h.status === 'hadir') return CheckCircle2
  if (h.status === 'tidak-hadir') return XCircle
  return Clock
}

const approveLabel = (h) => {
  if (h.statusApprove === 'Approved') return 'Disetujui'
  if (h.statusApprove === 'Rejected') return 'Ditolak'
  if (h.statusApprove === 'Pending') return 'Menunggu'
  return ''
}
const approveBadgeClass = (h) => {
  if (h.statusApprove === 'Approved') return 'bg-green-100 text-green-700'
  if (h.statusApprove === 'Rejected') return 'bg-red-100 text-red-600'
  if (h.statusApprove === 'Pending') return 'bg-yellow-100 text-yellow-700'
  return 'bg-slate-100 text-slate-500'
}
const approveIcon = (h) => {
  if (h.statusApprove === 'Approved') return CheckCircle2
  if (h.statusApprove === 'Rejected') return XCircle
  return Clock
}

// ─── Methods ──────────────────────────────────────────────────
const isBandingExpired = (history) => {
  if (history.statusApprove !== 'Rejected') return false
  if (!history.rejectedAt) return false
  return (new Date() - new Date(history.rejectedAt)) / (1000 * 60 * 60) > 24
}
const handleResubmit = (history) => {
  if (!history.id_presensi) return
  router.push({
    path: '/presensi/create',
    query: { jadwalId: history.id_jadwal, presensiId: history.id_presensi, mode: 'resubmit' }
  })
}
const viewPhoto = (history) => {
  selectedPhoto.value = history.photo
  showPhotoModal.value = true
  document.body.style.overflow = 'hidden'
}
const closePhotoModal = () => {
  showPhotoModal.value = false
  selectedPhoto.value = null
  document.body.style.overflow = ''
}
const previousPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const goToPage = (page) => { currentPage.value = page }

const fetchRiwayat = async () => {
  isLoading.value = true
  const result = await presensiStore.getRiwayatPresensiKM({
    page: currentPage.value,
    limit: perPage.value
  })
  if (result.success) {
    historyData.value = (result.data.data || []).map(mapToHistory)
    totalSlot.value = result.data.summary?.totalSlot || 0
    totalHadir.value = result.data.summary?.totalHadir || 0
    totalTidakHadir.value = result.data.summary?.totalTidakHadir || 0
    totalTidakHadirDenganTugas.value = result.data.summary?.totalTidakHadirDenganTugas || 0
    totalDitolak.value = result.data.summary?.totalDitolak || 0
    totalBelum.value = result.data.summary?.totalBelum || 0
    totalPages.value = result.data.pagination?.totalPages || 1
  } else {
    historyData.value = []
    totalSlot.value = 0
    totalHadir.value = 0
    totalTidakHadir.value = 0
    totalTidakHadirDenganTugas.value = 0
    totalDitolak.value = 0
    totalBelum.value = 0
    totalPages.value = 1
  }
  isLoading.value = false
}

const displayPages = computed(() => {
  const pages = []
  const maxDisplay = 5
  let startPage = Math.max(1, currentPage.value - 2)
  let endPage = Math.min(totalPages.value, startPage + maxDisplay - 1)
  if (endPage - startPage < maxDisplay - 1) startPage = Math.max(1, endPage - maxDisplay + 1)
  for (let i = startPage; i <= endPage; i++) pages.push(i)
  return pages
})

watch(currentPage, () => fetchRiwayat())
onMounted(() => fetchRiwayat())
</script>