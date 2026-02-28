<template>
    <div class="min-h-screen bg-gray-50 py-2">
        <div class="max-w-7xl space-y-2 sm:space-y-3">

            <section class="stats-section">
                <div class="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <div class="px-4 py-6 shadow-lg shadow-gray-100 bg-white rounded-sm">
                        <div class="flex items-start justify-between">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-500">Total Jadwal</p>
                                <p class="mt-2 text-3xl font-semibold text-gray-800">{{ totalJadwal }}</p>
                            </div>
                            <div
                                class="h-12 w-12 rounded-xl bg-gray-50 p-2.5 text-gray-400 flex items-center justify-center flex-shrink-0">
                                <FileText class="h-7 w-7" />
                            </div>
                        </div>
                    </div>

                    <div class="px-4 py-6 shadow-lg shadow-yellow-100 bg-white rounded-sm">
                        <div class="flex items-start justify-between">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-500">Menunggu</p>
                                <p class="mt-2 text-3xl font-semibold text-gray-800">{{ presensiStore.totalPending }}
                                </p>
                            </div>
                            <div
                                class="h-12 w-12 rounded-xl bg-yellow-50 p-2.5 text-yellow-400 flex items-center justify-center flex-shrink-0">
                                <Clock class="h-7 w-7" />
                            </div>
                        </div>
                    </div>

                    <div class="px-4 py-6 shadow-lg shadow-green-100 bg-white rounded-sm">
                        <div class="flex items-start justify-between">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-500">Disetujui</p>
                                <p class="mt-2 text-3xl font-semibold text-gray-800">{{ presensiStore.totalApproved }}
                                </p>
                            </div>
                            <div
                                class="h-12 w-12 rounded-xl bg-green-50 p-2.5 text-green-400 flex items-center justify-center flex-shrink-0">
                                <CheckCircle class="h-7 w-7" />
                            </div>
                        </div>
                    </div>

                    <div class="px-4 py-6 shadow-lg shadow-rose-100 bg-white rounded-sm">
                        <div class="flex items-start justify-between">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-500">Ditolak</p>
                                <p class="mt-2 text-3xl font-semibold text-gray-800">{{ presensiStore.totalRejected }}
                                </p>
                            </div>
                            <div
                                class="h-12 w-12 rounded-xl bg-rose-50 p-2.5 text-rose-400 flex items-center justify-center flex-shrink-0">
                                <XCircle class="h-7 w-7" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section class="filter-section pt-5">
                <div class="bg-white rounded-sm shadow-sm border border-gray-200 p-4 sm:p-5">
                    <div class="flex flex-col md:flex-row gap-3">
                        <div class="flex-1 max-w-md">
                            <div class="relative">
                                <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <input v-model="searchQuery" type="text"
                                    class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                    placeholder="Cari nama guru atau mata pelajaran..." />
                            </div>
                        </div>

                        <div class="relative w-full md:w-52">
                            <select v-model="filterStatus"
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer transition">
                                <option value="all">Semua Status</option>
                                <option value="belum">Belum Presensi</option>
                                <option value="Pending">Menunggu</option>
                                <option value="Approved">Disetujui</option>
                                <option value="Rejected">Ditolak</option>
                            </select>
                            <ChevronDown
                                class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>

                        <div class="relative w-full md:w-48">
                            <select v-model="filterKelas" @change="fetchWithFilters"
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer transition">
                                <option value="">Semua Kelas</option>
                                <option v-for="kelas in classroomsStore.classrooms" :key="kelas.id" :value="kelas.id">
                                    {{ kelas.name }}
                                </option>
                            </select>
                            <ChevronDown
                                class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>

                        <input v-model="filterDate" type="date" @change="fetchWithFilters"
                            class="w-full md:w-auto px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" />
                    </div>
                </div>
            </section>

            <div ref="alertRef" v-if="alertMessage">
                <AppAlert
                    :type="alertType"
                    :message="alertMessage"
                    :redirect-delay="alertRedirectDelay"
                    :on-close="clearAlert"
                    :on-redirect="alertRedirectFn"
                />
            </div>

            <section class="table-section py-2">
                <div class="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Guru
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Kelas
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Jam
                                    </th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status
                                    </th>
                                    <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                                    <td class="px-6 py-4" v-for="j in 5" :key="j">
                                        <div class="h-4 bg-gray-200 rounded"></div>
                                    </td>
                                </tr>

                                <tr v-else-if="filteredPresensi.length === 0">
                                    <td colspan="5" class="px-6 py-12 text-center">
                                        <FileText class="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        <p class="text-sm font-medium text-gray-900">Tidak ada data</p>
                                        <p class="text-xs text-gray-500 mt-1">Tidak ada jadwal untuk filter yang dipilih
                                        </p>
                                    </td>
                                </tr>

                                <tr v-else v-for="row in filteredPresensi" :key="row.id_jadwal"
                                    class="hover:bg-gray-50 transition-colors"
                                    :class="{ 'bg-gray-50/50': !row.id_presensi }">

                                    <td class="px-6 py-4">
                                        <div class="text-sm font-semibold text-gray-900">{{ getGuruName(row) }}</div>
                                        <div class="text-xs text-gray-500 mt-0.5">{{ getMapelName(row) }}</div>
                                    </td>

                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-700">{{ row.kelas_name || '-' }}</div>
                                    </td>

                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-700">
                                            {{ formatTime(row.jam_mulai) }} - {{ formatTime(row.jam_selesai) }}
                                        </div>
                                    </td>

                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span v-if="!row.id_presensi"
                                            class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                                            Belum Presensi
                                        </span>
                                        <span v-else :class="[
                                            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                                            row.status_approve === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                row.status_approve === 'Approved' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                        ]">
                                            {{ row.status_approve }}
                                        </span>
                                    </td>

                                    <td class="px-6 py-4 text-center whitespace-nowrap">
                                        <span v-if="!row.id_presensi" class="text-xs text-gray-400 italic">
                                            Belum Presensi
                                        </span>
                                        <button v-else @click="openDetailModal(row)"
                                            class="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                                            <Eye class="h-4 w-4" />
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div class="bg-white py-3 border-t border-gray-200 sm:px-6">
                    <div class="flex items-center justify-between">
                        <div class="hidden sm:flex sm:items-center sm:justify-end sm:w-full">
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
                                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <ChevronRight class="h-5 w-5" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </section>
        </div>

        <div v-if="showDetailModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeDetailModal">
            <div class="flex items-center justify-center min-h-screen px-4 py-6">
                <div class="fixed inset-0 bg-black/40 transition-opacity" @click="closeDetailModal"></div>

                <div class="relative bg-white rounded-sm shadow-xl max-w-2xl w-full p-6 z-50">
                    <div class="flex items-center justify-between mb-6 pb-4 border-b">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">Detail Presensi</h3>
                            <p class="text-sm text-gray-500 mt-0.5">#{{ selectedPresensi?.id_presensi }}</p>
                        </div>
                        <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <X class="h-6 w-6" />
                        </button>
                    </div>

                    <div class="space-y-6">
                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="text-xs font-semibold text-gray-500 uppercase">Tanggal</label>
                                <p class="text-sm font-medium text-gray-900 mt-1.5">{{
                                    formatDate(selectedPresensi?.tanggal || filterDate) }}</p>
                            </div>
                            <div>
                                <label class="text-xs font-semibold text-gray-500 uppercase">Jam Pelajaran</label>
                                <p class="text-sm font-medium text-gray-900 mt-1.5">
                                    {{ formatTime(selectedPresensi?.jam_mulai) }} - {{
                                        formatTime(selectedPresensi?.jam_selesai) }}
                                </p>
                            </div>
                            <div>
                                <label class="text-xs font-semibold text-gray-500 uppercase">Nama Guru</label>
                                <p class="text-sm font-medium text-gray-900 mt-1.5">{{ getGuruName(selectedPresensi) }}
                                </p>
                            </div>
                            <div>
                                <label class="text-xs font-semibold text-gray-500 uppercase">Mata Pelajaran</label>
                                <p class="text-sm font-medium text-gray-900 mt-1.5">{{ getMapelName(selectedPresensi) }}
                                </p>
                            </div>
                            <div>
                                <label class="text-xs font-semibold text-gray-500 uppercase">Kelas</label>
                                <p class="text-sm font-medium text-gray-900 mt-1.5">{{ selectedPresensi?.kelas_name ||
                                    '-' }}</p>
                            </div>
                            <div>
                                <label class="text-xs font-semibold text-gray-500 uppercase">Status Kehadiran</label>
                                <p class="mt-1.5">
                                    <span :class="[
                                        'inline-flex px-2.5 py-1 text-xs font-medium rounded-full',
                                        selectedPresensi?.status === 'Hadir' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    ]">
                                        {{ selectedPresensi?.status }}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label class="text-xs font-semibold text-gray-500 uppercase">Memberikan Tugas</label>
                                <p class="text-sm font-medium text-gray-900 mt-1.5">
                                    {{ selectedPresensi?.memberikan_tugas === true ? 'Ya' :
                                        selectedPresensi?.memberikan_tugas === false ? 'Tidak' : '-' }}
                                </p>
                            </div>

                            <div v-if="selectedPresensi?.status_approve === 'Rejected' && selectedPresensi?.alasan_reject" class="col-span-2">
                                <label class="text-xs font-semibold text-gray-500 uppercase block mb-2">Alasan Penolakan</label>
                                <p class="text-sm text-red-700 p-4 bg-red-50 rounded-sm border border-red-200">
                                    {{ selectedPresensi.alasan_reject }}
                                </p>
                            </div>
                        </div>

                        <div v-if="selectedPresensi?.foto_bukti">
                            <label class="text-xs font-semibold text-gray-500 uppercase block mb-2">Foto Bukti</label>
                            <div class="border border-gray-200 rounded-sm overflow-hidden">
                                <img :src="selectedPresensi.foto_bukti" alt="Foto Bukti"
                                    class="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                    @click="openImageModal(selectedPresensi.foto_bukti)" />
                            </div>
                        </div>

                        <div v-if="selectedPresensi?.catatan">
                            <label class="text-xs font-semibold text-gray-500 uppercase block mb-2">Catatan</label>
                            <p class="text-sm text-gray-700 p-4 bg-gray-50 rounded-sm border border-gray-200">
                                {{ selectedPresensi.catatan }}
                            </p>
                        </div>

                        <div v-if="showRejectForm" class="p-4 bg-red-50 border border-red-200 rounded-sm">
                            <label class="text-xs font-semibold text-red-700 uppercase block mb-2">
                                Alasan Penolakan <span class="text-red-500">*</span>
                            </label>
                            <textarea
                                v-model="alasanReject"
                                rows="3"
                                placeholder="Tuliskan alasan penolakan presensi ini..."
                                class="w-full px-3 py-2 text-sm border border-red-300 rounded-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition"
                            ></textarea>
                            <p v-if="alasanRejectError" class="text-xs text-red-600 mt-1">{{ alasanRejectError }}</p>
                        </div>
                    </div>

                    <div v-if="selectedPresensi?.status_approve === 'Pending'" class="flex gap-3 justify-end mt-6 pt-6 border-t">
                        <button @click="toggleRejectForm" :disabled="processing"
                            class="inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            :class="showRejectForm
                                ? 'w-44 text-red-700 bg-red-100 hover:bg-red-200 border border-red-300'
                                : 'flex-1 text-white bg-red-600 hover:bg-red-700'">
                            <XCircle class="h-4 w-4" />
                            {{ showRejectForm ? 'Batalkan' : 'Tolak' }}
                        </button>

                        <button v-if="showRejectForm" @click="handleReject" :disabled="processing"
                            class="w-44 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-red-700 rounded-sm hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <Loader2 v-if="processing" class="h-4 w-4 animate-spin" />
                            <XCircle v-else class="h-4 w-4" />
                            {{ processing ? 'Memproses...' : 'Konfirmasi Tolak' }}
                        </button>

                        <button v-if="!showRejectForm" @click="handleApprove" :disabled="processing"
                            class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-green-600 rounded-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <CheckCircle v-if="!processing" class="h-4 w-4" />
                            <Loader2 v-else class="h-4 w-4 animate-spin" />
                            {{ processing ? 'Memproses...' : 'Setujui' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showImageModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
            @click="closeImageModal">
            <img :src="selectedImage" alt="Full Image" class="max-w-full max-h-full object-contain rounded-sm" />
            <button @click="closeImageModal"
                class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors">
                <X class="h-8 w-8" />
            </button>
        </div>

        <AppConfirm />
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { usePresensiStore } from '~/stores/presensi'
import { useClassroomsStore } from '~/stores/classrooms'
import {
    Clock, CheckCircle, XCircle, Search, Eye, X,
    FileText, Loader2, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-vue-next'
import { useConfirm } from '~/composables/useConfirm'

const presensiStore = usePresensiStore()
const classroomsStore = useClassroomsStore()
const { confirm } = useConfirm()

const loading = ref(false)
const processing = ref(false)

const searchQuery = ref('')
const filterStatus = ref('all')
const filterKelas = ref('')

const todayISO = () => new Date().toLocaleDateString('sv-SE')
const filterDate = ref(todayISO())

const showDetailModal = ref(false)
const showImageModal = ref(false)
const selectedPresensi = ref(null)
const selectedImage = ref('')
const alertRef = ref(null)
const showRejectForm = ref(false)
const alasanReject = ref('')
const alasanRejectError = ref('')

const totalJadwal = computed(() => presensiStore.presensiList.length)

const {
  alertType,
  alertMessage,
  alertRedirectDelay,
  alertRedirectFn,
  showAlert,
  clearAlert
} = useAlert()

const scrollToAlert = async () => {
  await nextTick()
  if (alertRef.value) {
    const navbar = document.querySelector('nav, header, [data-navbar]')
    const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0
    const elementTop = alertRef.value.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top: elementTop - navbarHeight - 16, behavior: 'smooth' })
  }
}

const filteredPresensi = computed(() => {
    let result = presensiStore.presensiList

    if (filterStatus.value === 'belum') {
        result = result.filter(p => !p.id_presensi)
    } else if (filterStatus.value !== 'all') {
        result = result.filter(p => p.status_approve === filterStatus.value)
    }

    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        result = result.filter(p =>
            getGuruName(p).toLowerCase().includes(q) ||
            getMapelName(p).toLowerCase().includes(q)
        )
    }

    return result
})

const getGuruName = (row) => row?.guru?.nama_guru || 'N/A'
const getMapelName = (row) => row?.guru?.mapel?.nama_mapel || 'N/A'

const formatDate = (date) => {
    if (!date) return '-'
    const d = new Date(date)
    return d.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

const formatTime = (time) => {
    if (!time) return '-'
    return time.substring(0, 5)
}

const fetchWithFilters = async () => {
    loading.value = true
    await presensiStore.getAllPresensi({
        tanggal: filterDate.value || undefined,
        id_kelas: filterKelas.value || undefined
    })
    loading.value = false
}

const openDetailModal = (row) => {
    selectedPresensi.value = row
    showDetailModal.value = true
}

const closeDetailModal = () => {
    showDetailModal.value = false
    selectedPresensi.value = null
    showRejectForm.value = false
    alasanReject.value = ''
    alasanRejectError.value = ''
}

const openImageModal = (url) => {
    selectedImage.value = url
    showImageModal.value = true
}

const closeImageModal = () => {
    showImageModal.value = false
    selectedImage.value = ''
}

const toggleRejectForm = () => {
    showRejectForm.value = !showRejectForm.value
    alasanReject.value = ''
    alasanRejectError.value = ''
}

const handleApprove = async () => {
    if (!selectedPresensi.value) return

    const confirmed = await confirm({
        title: 'Setujui Presensi',
        message: 'Apakah Anda yakin ingin menyetujui presensi ini?',
        confirmText: 'Setujui',
        cancelText: 'Batal',
        type: 'success',
    })

    if (!confirmed) return

    processing.value = true
    const result = await presensiStore.approvePresensi(selectedPresensi.value.id_presensi, 'Approved')

    if (result.success) {
        closeDetailModal()
        await fetchWithFilters()
        showAlert('success', 'Presensi berhasil disetujui!')
        scrollToAlert()
    } else {
        showAlert('error', result.message || 'Gagal menyetujui presensi')
        scrollToAlert()
    }
    processing.value = false
}

const handleReject = async () => {
    if (!selectedPresensi.value) return

    if (!alasanReject.value.trim()) {
        alasanRejectError.value = 'Alasan penolakan wajib diisi.'
        return
    }
    alasanRejectError.value = ''

    const confirmed = await confirm({
        title: 'Tolak Presensi',
        message: `Tolak presensi ini dengan alasan: "${alasanReject.value}"?`,
        confirmText: 'Tolak',
        cancelText: 'Batal',
        type: 'reject',
    })

    if (!confirmed) return

    processing.value = true
    const result = await presensiStore.approvePresensi(
        selectedPresensi.value.id_presensi,
        'Rejected',
        alasanReject.value
    )

    if (result.success) {
        closeDetailModal()
        await fetchWithFilters()
        showAlert('success', 'Presensi berhasil ditolak!')
        scrollToAlert()
    } else {
        showAlert('error', result.message || 'Gagal menolak presensi')
        scrollToAlert()
    }
    processing.value = false
}

onMounted(async () => {
    loading.value = true
    await Promise.all([
        fetchWithFilters(),
        classroomsStore.getClassrooms()
    ])
    loading.value = false
})
</script>