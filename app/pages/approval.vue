<template>
        <div class="max-w-screen-2xl mx-auto space-y-4">

            <!-- Stats Row -->
            <div class="grid grid-cols-2 gap-3">
                <div class="bg-white rounded-sm border border-slate-200 px-5 py-4 flex items-center gap-3">
                    <div class="h-9 w-9 rounded-sm bg-slate-100 flex items-center justify-center flex-shrink-0">
                        <FileText class="h-4 w-4 text-slate-500" />
                    </div>
                    <div>
                        <p class="text-xs text-slate-500">Total Jadwal</p>
                        <p class="text-xl font-bold text-slate-800 leading-tight">{{ totalJadwal }}</p>
                    </div>
                </div>
                <div class="bg-white rounded-sm border border-amber-200 px-5 py-4 flex items-center gap-3">
                    <div class="h-9 w-9 rounded-sm bg-amber-50 flex items-center justify-center flex-shrink-0">
                        <Clock class="h-4 w-4 text-amber-500" />
                    </div>
                    <div>
                        <p class="text-xs text-slate-500">Menunggu Review</p>
                        <p class="text-xl font-bold text-amber-600 leading-tight">{{ presensiStore.totalPending }}</p>
                    </div>
                </div>
            </div>

            <!-- Filters -->
            <div class="bg-white rounded-sm border border-slate-200 p-3">
                <div class="flex flex-col sm:flex-row gap-2">
                    <div class="relative flex-1 max-w-xs">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                        <input v-model="searchQuery" type="text" placeholder="Cari guru atau mapel..."
                            class="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50" />
                    </div>
                    <div class="relative">
                        <select v-model="filterKelas" @change="fetchWithFilters"
                            class="w-full sm:w-40 px-3 py-2 text-xs border border-slate-200 rounded-sm focus:ring-2 focus:ring-blue-500 bg-slate-50 appearance-none outline-none cursor-pointer transition">
                            <option value="">Semua Kelas</option>
                            <option v-for="kelas in classroomsStore.classrooms" :key="kelas.id" :value="kelas.id">
                                {{ kelas.name }}
                            </option>
                        </select>
                        <ChevronDown
                            class="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                    </div>
                    <input v-model="filterDate" type="date" @change="fetchWithFilters"
                        class="px-3 py-2 text-xs border border-slate-200 rounded-sm focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition" />
                </div>
            </div>

            <!-- Alert -->
            <div ref="alertRef" v-if="alertMessage">
                <AppAlert :type="alertType" :message="alertMessage" :redirect-delay="alertRedirectDelay"
                    :on-close="clearAlert" :on-redirect="alertRedirectFn" />
            </div>

            <!-- Tabs + Content -->
            <div class="bg-white rounded-sm border border-slate-200 overflow-hidden">

                <!-- Tab nav -->
                <div class="flex border-b border-slate-200">
                    <button v-for="tab in tabs" :key="tab.key" @click="switchTab(tab.key)"
                        class="flex-1 flex items-center justify-center gap-1.5 py-3 px-3 text-xs font-medium transition-colors relative"
                        :class="activeTab === tab.key ? 'text-blue-600 bg-blue-50/60' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'">
                        <component :is="tab.icon" class="h-3.5 w-3.5" />
                        <span class="hidden sm:inline">{{ tab.label }}</span>
                        <span
                            class="inline-flex items-center justify-center min-w-[18px] px-1.5 rounded-sm text-[11px] font-semibold leading-5"
                            :class="activeTab === tab.key ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'">{{
                            tab.count }}</span>
                        <span v-if="activeTab === tab.key"
                            class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                    </button>
                </div>

                <div class="p-3">

                    <!-- Loading skeleton: grid for pending/approved/rejected -->
                    <template v-if="loading && activeTab !== 'belum'">
                        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            <div v-for="i in 8" :key="i"
                                class="animate-pulse rounded-sm overflow-hidden bg-slate-100 border border-slate-200">
                                <div class="bg-slate-200 aspect-video"></div>
                                <div class="p-2.5 space-y-1.5">
                                    <div class="h-3 bg-slate-200 rounded w-3/4"></div>
                                    <div class="h-2.5 bg-slate-100 rounded w-1/2"></div>
                                    <div class="h-7 bg-slate-100 rounded mt-2"></div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- Loading skeleton: list for belum -->
                    <template v-else-if="loading && activeTab === 'belum'">
                        <div class="space-y-2">
                            <div v-for="i in 5" :key="i"
                                class="animate-pulse flex gap-3 p-3 rounded-sm border border-slate-200">
                                <div class="flex-1 space-y-2">
                                    <div class="h-3.5 bg-slate-200 rounded w-1/2"></div>
                                    <div class="h-3 bg-slate-100 rounded w-1/3"></div>
                                </div>
                            </div>
                        </div>
                    </template>

                    <!-- Empty state -->
                    <div v-else-if="filteredCards.length === 0" class="py-14 text-center">
                        <div class="h-12 w-12 rounded-sm bg-slate-100 flex items-center justify-center mx-auto mb-3">
                            <component :is="currentTab.icon" class="h-6 w-6 text-slate-400" />
                        </div>
                        <p class="text-sm font-semibold text-slate-700">Tidak ada data</p>
                        <p class="text-xs text-slate-400 mt-1">Tidak ada presensi {{ currentTab.label.toLowerCase() }}
                            untuk filter ini</p>
                    </div>

                    <!-- ===================== -->
                    <!-- TAB BELUM: List view  -->
                    <!-- ===================== -->
                    <div v-else-if="activeTab === 'belum'" class="space-y-2">
                        <div v-for="row in filteredCards" :key="row.id_jadwal"
                            class="flex items-center gap-3 px-4 py-3 rounded-sm border border-slate-200 bg-white">
                            <!-- Icon placeholder -->
                            <div class="h-9 w-9 rounded-sm bg-slate-100 flex items-center justify-center flex-shrink-0">
                                <UserX class="h-4 w-4 text-slate-400" />
                            </div>
                            <!-- Info -->
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-semibold text-slate-800 truncate">{{ getGuruName(row) }}</p>
                                <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                                    <span class="text-xs text-slate-500 truncate">{{ getMapelName(row) }}</span>
                                    <span class="text-slate-300 text-xs">·</span>
                                    <span class="text-xs text-slate-400">{{ row.kelas_name }}</span>
                                    <span class="text-slate-300 text-xs">·</span>
                                    <span class="text-xs text-slate-400">{{ formatTime(row.jam_mulai) }}–{{
                                        formatTime(row.jam_selesai)
                                        }}</span>
                                </div>
                            </div>
                            <!-- Badge -->
                            <span
                                class="flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-sm bg-slate-100 text-slate-500">
                                Belum diabsen
                            </span>
                        </div>
                    </div>

                    <!-- ========================= -->
                    <!-- GRID: pending/approved/rejected -->
                    <!-- ========================= -->
                    <div v-else class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div v-for="row in filteredCards" :key="row.id_jadwal"
                            class="rounded-sm overflow-hidden border border-slate-200 bg-white flex flex-col">
                            <!-- Foto area: klik = fullscreen -->
                            <div class="relative aspect-video overflow-hidden cursor-pointer group bg-slate-100 flex-shrink-0"
                                @click="row.foto_bukti ? openImageModal(row.foto_bukti) : null">
                                <img v-if="row.foto_bukti" :src="row.foto_bukti" :alt="getGuruName(row)"
                                    class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                <div v-else class="w-full h-full flex flex-col items-center justify-center gap-1.5"
                                    :class="noPhotoBg(row)">
                                    <ImageOff class="h-7 w-7 opacity-30" :class="noPhotoIcon(row)" />
                                    <span class="text-[11px] opacity-40" :class="noPhotoIcon(row)">Tanpa foto</span>
                                </div>

                                <!-- Zoom hint on hover (hanya kalau ada foto) -->
                                <div v-if="row.foto_bukti"
                                    class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                    <div
                                        class="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-sm p-1.5">
                                        <ZoomIn class="h-4 w-4 text-white" />
                                    </div>
                                </div>

                                <!-- Status badge di pojok kanan atas foto -->
                                <div class="absolute top-1.5 right-1.5">
                                    <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm backdrop-blur-sm"
                                        :class="statusPillClass(row.status_approve)">{{ statusLabel(row.status_approve)
                                        }}</span>
                                </div>
                            </div>

                            <!-- Info + action area di bawah foto -->
                            <div class="p-2.5 flex flex-col gap-2 flex-1">
                                <!-- Nama & mapel -->
                                <div class="min-w-0">
                                    <p class="text-xs font-semibold text-slate-800 truncate leading-tight">{{
                                        getGuruName(row) }}</p>
                                    <p class="text-[11px] text-slate-500 truncate mt-0.5">{{ getMapelName(row) }}</p>
                                    <div class="flex flex-wrap items-center gap-x-1.5 mt-1">
                                        <span class="text-[10px] text-slate-400">{{ row.kelas_name }}</span>
                                        <span class="text-slate-300 text-[10px]">·</span>
                                        <span class="text-[10px] text-slate-400">{{ formatTime(row.jam_mulai) }}–{{
                                            formatTime(row.jam_selesai) }}</span>
                                    </div>
                                </div>

                                <!-- Status kehadiran -->
                                <div v-if="row.id_presensi" class="flex items-center gap-1.5">
                                    <span class="text-[10px] font-medium px-1.5 py-0.5 rounded-sm"
                                        :class="row.status === 'Hadir' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-600'">{{
                                        row.status }}</span>
                                    <span v-if="row.status === 'Tidak Hadir'" class="text-[10px] text-slate-400">
                                        Tugas: {{ row.memberikan_tugas === true ? 'Ya' : row.memberikan_tugas === false
                                        ? 'Tidak' : '-' }}
                                    </span>
                                </div>

                                <!-- Alasan reject -->
                                <p v-if="row.status_approve === 'Rejected' && row.alasan_reject"
                                    class="text-[10px] text-rose-500 leading-tight line-clamp-2">Ditolak: {{
                                    row.alasan_reject }}</p>

                                <!-- Catatan -->
                                <p v-if="row.catatan"
                                    class="text-[10px] text-slate-400 italic leading-tight line-clamp-1">"{{ row.catatan
                                    }}"</p>

                                <!-- Action buttons (pending only) -->
                                <div v-if="row.id_presensi && row.status_approve === 'Pending'"
                                    class="flex gap-1.5 mt-auto pt-1">
                                    <button @click="openSingleRejectPanel(row)" :disabled="!!processingId"
                                        class="flex-1 py-1.5 text-[11px] font-semibold rounded-sm text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-40">Tolak</button>
                                    <button @click="handleApprove(row)" :disabled="!!processingId"
                                        class="flex-1 py-1.5 text-[11px] font-semibold rounded-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-1">
                                        <Loader2 v-if="processingId === row.id_presensi" class="h-3 w-3 animate-spin" />
                                        <span>{{ processingId === row.id_presensi ? '...' : 'Setujui' }}</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>

        <!-- Reject panel -->
        <Teleport to="body">
            <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0"
                enter-to-class="opacity-100" leave-active-class="transition-all duration-150"
                leave-from-class="opacity-100" leave-to-class="opacity-0">
                <div v-if="rejectPanelOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                    @click.self="closeRejectPanel">
                    <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeRejectPanel"></div>
                    <Transition enter-active-class="transition-all duration-200"
                        enter-from-class="translate-y-4 sm:translate-y-0 sm:scale-95 opacity-0"
                        enter-to-class="translate-y-0 sm:scale-100 opacity-100">
                        <div v-if="rejectPanelOpen"
                            class="relative bg-white rounded-t-sm sm:rounded-sm w-full sm:max-w-md p-5 z-10 shadow-2xl">
                            <div class="flex items-start justify-between mb-4">
                                <div class="flex items-center gap-3">
                                    <div
                                        class="h-10 w-10 rounded-sm overflow-hidden border border-slate-200 flex-shrink-0">
                                        <img v-if="rejectTarget?.foto_bukti" :src="rejectTarget.foto_bukti"
                                            class="w-full h-full object-cover" />
                                        <div v-else class="w-full h-full bg-slate-100 flex items-center justify-center">
                                            <ImageOff class="h-4 w-4 text-slate-400" />
                                        </div>
                                    </div>
                                    <div class="min-w-0">
                                        <p class="text-sm font-bold text-slate-800 truncate">{{
                                            getGuruName(rejectTarget) }}</p>
                                        <p class="text-xs text-slate-500 truncate">{{ getMapelName(rejectTarget) }} · {{
                                            rejectTarget?.kelas_name }}</p>
                                    </div>
                                </div>
                                <button @click="closeRejectPanel"
                                    class="text-slate-400 hover:text-slate-600 transition-colors ml-2 flex-shrink-0">
                                    <X class="h-5 w-5" />
                                </button>
                            </div>

                            <div class="mb-4">
                                <label
                                    class="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                                    Alasan Penolakan <span class="text-rose-500">*</span>
                                </label>
                                <textarea v-model="alasanReject" rows="3" placeholder="Tuliskan alasan penolakan..."
                                    class="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 resize-none outline-none transition bg-slate-50"
                                    autofocus></textarea>
                                <p v-if="alasanRejectError" class="text-xs text-rose-500 mt-1">{{ alasanRejectError }}
                                </p>
                            </div>

                            <div class="flex gap-2">
                                <button @click="closeRejectPanel"
                                    class="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-sm transition-colors">Batalkan</button>
                                <button @click="handleSingleReject"
                                    :disabled="processingId === rejectTarget?.id_presensi"
                                    class="flex-1 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                    <Loader2 v-if="processingId === rejectTarget?.id_presensi"
                                        class="h-4 w-4 animate-spin" />
                                    <XCircle v-else class="h-4 w-4" />
                                    {{ processingId === rejectTarget?.id_presensi ? 'Memproses...' : 'Konfirmasi Tolak'
                                    }}
                                </button>
                            </div>
                        </div>
                    </Transition>
                </div>
            </Transition>
        </Teleport>

        <!-- Image fullscreen -->
        <div v-if="showImageModal" class="fixed inset-0 bg-black flex items-center justify-center z-50"
            @click="closeImageModal">
            <button @click="closeImageModal"
                class="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 bg-black bg-opacity-50 rounded-full p-1">
                <X class="h-6 w-6 sm:h-8 sm:w-8" />
            </button>
            <img :src="selectedImage" alt="Bukti Foto" class="max-w-full max-h-screen object-contain" />
        </div>

        <AppConfirm />
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { usePresensiStore } from '~/stores/presensi'
import { useClassroomsStore } from '~/stores/classrooms'
import {
    Clock, CheckCircle, XCircle, Search, X,
    FileText, Loader2, ChevronDown, ImageOff, ZoomIn, UserX
} from 'lucide-vue-next'
import { useConfirm } from '~/composables/useConfirm'

const presensiStore = usePresensiStore()
const classroomsStore = useClassroomsStore()
const { confirm } = useConfirm()

const loading = ref(false)
const processingId = ref(null)

const searchQuery = ref('')
const filterKelas = ref('')
const activeTab = ref('pending')

const todayISO = () => new Date().toLocaleDateString('sv-SE')
const filterDate = ref(todayISO())

const showImageModal = ref(false)
const selectedImage = ref('')
const alertRef = ref(null)

const rejectPanelOpen = ref(false)
const rejectTarget = ref(null)
const alasanReject = ref('')
const alasanRejectError = ref('')

const {
    alertType, alertMessage, alertRedirectDelay, alertRedirectFn, showAlert, clearAlert
} = useAlert()

const totalJadwal = computed(() => presensiStore.presensiList.length)

const tabs = computed(() => [
    {
        key: 'pending',
        label: 'Menunggu',
        icon: Clock,
        count: presensiStore.presensiList.filter(p => p.id_presensi && p.status_approve === 'Pending').length
    },
    {
        key: 'approved',
        label: 'Disetujui',
        icon: CheckCircle,
        count: presensiStore.presensiList.filter(p => p.status_approve === 'Approved').length
    },
    {
        key: 'rejected',
        label: 'Ditolak',
        icon: XCircle,
        count: presensiStore.presensiList.filter(p => p.status_approve === 'Rejected').length
    },
    {
        key: 'belum',
        label: 'Belum',
        icon: FileText,
        count: presensiStore.presensiList.filter(p => !p.id_presensi).length
    }
])

const currentTab = computed(() => tabs.value.find(t => t.key === activeTab.value) || tabs.value[0])

const filteredCards = computed(() => {
    let result = presensiStore.presensiList

    if (activeTab.value === 'belum') result = result.filter(p => !p.id_presensi)
    else if (activeTab.value === 'pending') result = result.filter(p => p.id_presensi && p.status_approve === 'Pending')
    else if (activeTab.value === 'approved') result = result.filter(p => p.status_approve === 'Approved')
    else if (activeTab.value === 'rejected') result = result.filter(p => p.status_approve === 'Rejected')

    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        result = result.filter(p =>
            getGuruName(p).toLowerCase().includes(q) ||
            getMapelName(p).toLowerCase().includes(q)
        )
    }

    return result
})

const switchTab = (key) => {
    activeTab.value = key
    closeRejectPanel()
}

// Styling helpers
const noPhotoBg = (row) => {
    if (row.status_approve === 'Approved') return 'bg-emerald-50'
    if (row.status_approve === 'Rejected') return 'bg-rose-50'
    return 'bg-amber-50'
}

const noPhotoIcon = (row) => {
    if (row.status_approve === 'Approved') return 'text-emerald-600'
    if (row.status_approve === 'Rejected') return 'text-rose-500'
    return 'text-amber-500'
}

const statusPillClass = (status) => {
    if (status === 'Pending') return 'bg-amber-500/80 text-white'
    if (status === 'Approved') return 'bg-emerald-500/80 text-white'
    if (status === 'Rejected') return 'bg-rose-500/80 text-white'
    return 'bg-black/40 text-white/70'
}

const statusLabel = (status) => {
    if (status === 'Pending') return 'Menunggu'
    if (status === 'Approved') return 'Disetujui'
    if (status === 'Rejected') return 'Ditolak'
    return status
}

const getGuruName = (row) => row?.guru?.nama_guru || 'N/A'
const getMapelName = (row) => row?.guru?.mapel?.nama_mapel || 'N/A'
const formatTime = (time) => time ? time.substring(0, 5) : '-'

const scrollToAlert = async () => {
    await nextTick()
    if (alertRef.value) {
        const navbar = document.querySelector('nav, header, [data-navbar]')
        const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0
        const elementTop = alertRef.value.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: elementTop - navbarHeight - 16, behavior: 'smooth' })
    }
}

const fetchWithFilters = async () => {
    loading.value = true
    await presensiStore.getAllPresensi({
        tanggal: filterDate.value || undefined,
        id_kelas: filterKelas.value || undefined
    })
    loading.value = false
}

const openImageModal = (url) => {
    selectedImage.value = url
    showImageModal.value = true
    document.body.style.overflow = 'hidden'
}

const closeImageModal = () => {
    showImageModal.value = false
    selectedImage.value = ''
    document.body.style.overflow = ''
}

const openSingleRejectPanel = (row) => {
    rejectTarget.value = row
    alasanReject.value = ''
    alasanRejectError.value = ''
    rejectPanelOpen.value = true
}

const closeRejectPanel = () => {
    rejectPanelOpen.value = false
    rejectTarget.value = null
    alasanReject.value = ''
    alasanRejectError.value = ''
}

const handleApprove = async (row) => {
    const confirmed = await confirm({
        title: 'Setujui Presensi',
        message: `Setujui presensi ${getGuruName(row)} — ${getMapelName(row)}?`,
        confirmText: 'Setujui',
        cancelText: 'Batal',
        type: 'success',
    })
    if (!confirmed) return

    processingId.value = row.id_presensi
    const result = await presensiStore.approvePresensi(row.id_presensi, 'Approved')
    if (result.success) {
        await fetchWithFilters()
        showAlert('success', 'Presensi berhasil disetujui!')
        scrollToAlert()
    } else {
        showAlert('error', result.message || 'Gagal menyetujui presensi')
        scrollToAlert()
    }
    processingId.value = null
}

const handleSingleReject = async () => {
    if (!alasanReject.value.trim()) {
        alasanRejectError.value = 'Alasan penolakan wajib diisi.'
        return
    }
    alasanRejectError.value = ''

    const row = rejectTarget.value
    const confirmed = await confirm({
        title: 'Tolak Presensi',
        message: `Tolak presensi ${getGuruName(row)}?`,
        confirmText: 'Tolak',
        cancelText: 'Batal',
        type: 'reject',
    })
    if (!confirmed) return

    processingId.value = row.id_presensi
    const result = await presensiStore.approvePresensi(row.id_presensi, 'Rejected', alasanReject.value)
    if (result.success) {
        closeRejectPanel()
        await fetchWithFilters()
        showAlert('success', 'Presensi berhasil ditolak!')
        scrollToAlert()
    } else {
        showAlert('error', result.message || 'Gagal menolak presensi')
        scrollToAlert()
    }
    processingId.value = null
}

onMounted(async () => {
    loading.value = true
    await Promise.all([fetchWithFilters(), classroomsStore.getClassrooms({ all: true })])
    loading.value = false
})
</script>