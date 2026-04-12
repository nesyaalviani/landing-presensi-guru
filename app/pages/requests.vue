<template>
    <div class="max-w-screen-2xl mx-auto space-y-4">

        <!-- Stats Row -->
        <div class="grid grid-cols-3 gap-3">
            <div class="bg-white rounded-sm border border-amber-200 px-5 py-4 flex items-center gap-3">
                <div class="h-9 w-9 rounded-sm bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Clock class="h-4 w-4 text-amber-500" />
                </div>
                <div>
                    <p class="text-xs text-slate-500">Menunggu</p>
                    <p class="text-xl font-bold text-amber-600 leading-tight">{{ requestStore.summary.pending }}</p>
                </div>
            </div>
            <div class="bg-white rounded-sm border border-emerald-200 px-5 py-4 flex items-center gap-3">
                <div class="h-9 w-9 rounded-sm bg-emerald-50 flex items-center justify-center flex-shrink-0">
                    <CheckCircle class="h-4 w-4 text-emerald-500" />
                </div>
                <div>
                    <p class="text-xs text-slate-500">Disetujui</p>
                    <p class="text-xl font-bold text-emerald-600 leading-tight">{{ requestStore.summary.approved }}</p>
                </div>
            </div>
            <div class="bg-white rounded-sm border border-rose-200 px-5 py-4 flex items-center gap-3">
                <div class="h-9 w-9 rounded-sm bg-rose-50 flex items-center justify-center flex-shrink-0">
                    <XCircle class="h-4 w-4 text-rose-500" />
                </div>
                <div>
                    <p class="text-xs text-slate-500">Ditolak</p>
                    <p class="text-xl font-bold text-rose-600 leading-tight">{{ requestStore.summary.rejected }}</p>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-sm border border-slate-200 p-3">
            <div class="flex flex-col sm:flex-row gap-2 flex-wrap">

                <!-- Search -->
                <div class="relative flex-1 sm:max-w-sm">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input v-model="searchQuery" type="text" placeholder="Cari guru, mapel, atau kelas..."
                        class="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50"
                        @input="onSearchInput" />
                </div>

                <!-- Date range -->
                <div class="flex items-center border border-slate-200 rounded-sm bg-slate-50 overflow-hidden">
                    <div class="flex gap-0.5 p-1 border-r border-slate-200">
                        <button type="button" @click="setDateShortcut('today')"
                            class="px-2.5 py-1 text-[11px] font-medium rounded-sm transition-colors"
                            :class="activeDateShortcut === 'today' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'">
                            Hari ini
                        </button>
                        <button type="button" @click="setDateShortcut('week')"
                            class="px-2.5 py-1 text-[11px] font-medium rounded-sm transition-colors"
                            :class="activeDateShortcut === 'week' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'">
                            7 hari
                        </button>
                        <button type="button" @click="setDateShortcut('month')"
                            class="px-2.5 py-1 text-[11px] font-medium rounded-sm transition-colors"
                            :class="activeDateShortcut === 'month' ? 'bg-blue-100 text-blue-700' : 'text-slate-500 hover:bg-slate-100'">
                            Bulan ini
                        </button>
                    </div>
                    <div class="px-3 text-[11px] text-slate-400">
                        {{ formatDateRangeLabel }}
                    </div>
                </div>

                <!-- Status filter -->
                <div class="flex items-center gap-1 border border-slate-200 rounded-sm bg-slate-50 p-1">
                    <button v-for="tab in statusTabs" :key="tab.key" @click="filterStatus = tab.key; fetchData()"
                        class="px-2.5 py-1 text-[11px] font-medium rounded-sm transition-colors" :class="filterStatus === tab.key
                            ? 'bg-blue-100 text-blue-700'
                            : 'text-slate-500 hover:bg-slate-100'">
                        {{ tab.label }}
                        <span
                            class="ml-1 inline-flex items-center justify-center min-w-[16px] px-1 rounded-sm text-[10px] font-semibold"
                            :class="filterStatus === tab.key ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-500'">
                            {{ tab.count }}
                        </span>
                    </button>
                </div>

            </div>
        </div>

        <!-- Alert -->
        <div ref="alertRef" v-if="alertMessage">
            <AppAlert :type="alertType" :message="alertMessage" :on-close="clearAlert" />
        </div>

        <!-- Content -->
        <div class="bg-white rounded-sm border border-slate-200 overflow-hidden">

            <!-- Loading skeleton -->
            <template v-if="loading">
                <div class="space-y-0 divide-y divide-slate-100">
                    <div v-for="i in 5" :key="i" class="animate-pulse flex items-center gap-4 px-4 py-4">
                        <div class="flex-1 space-y-2">
                            <div class="h-3.5 bg-slate-200 rounded w-1/3"></div>
                            <div class="h-3 bg-slate-100 rounded w-1/2"></div>
                        </div>
                        <div class="h-8 w-24 bg-slate-200 rounded-sm"></div>
                        <div class="h-8 w-20 bg-slate-200 rounded-sm"></div>
                    </div>
                </div>
            </template>

            <!-- Empty state -->
            <div v-else-if="requestStore.requests.length === 0" class="py-14 text-center">
                <div class="h-12 w-12 rounded-sm bg-slate-100 flex items-center justify-center mx-auto mb-3">
                    <Send class="h-6 w-6 text-slate-400" />
                </div>
                <p class="text-sm font-semibold text-slate-700">Tidak ada request</p>
                <p class="text-xs text-slate-400 mt-1">Belum ada request presensi dari KM untuk filter ini</p>
            </div>

            <!-- List -->
            <div v-else class="divide-y divide-slate-100">
                <div v-for="req in requestStore.requests" :key="req.id"
                    class="flex items-center gap-3 px-4 py-3.5 hover:bg-slate-50 transition-colors">

                    <!-- Status accent bar -->
                    <div class="w-1 self-stretch rounded-full flex-shrink-0" :class="req.status === 'Pending' ? 'bg-amber-400'
                        : req.status === 'Approved' ? 'bg-emerald-500'
                            : 'bg-rose-500'">
                    </div>

                    <!-- Info -->
                    <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-2 mb-0.5 flex-wrap">
                            <p class="text-sm font-semibold text-slate-800 truncate">
                                {{ req.guru?.nama_guru || (req.guru && typeof req.guru === 'object' ?
                                req.guru['nama_guru'] : 'N/A')
                                }}
                            </p>
                            <span class="text-slate-300 text-xs">·</span>
                            <p class="text-xs text-slate-500 truncate">
                                {{ req.guru?.mapel?.nama_mapel || 'N/A' }}
                            </p>
                        </div>
                        <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                            <span class="text-[11px] text-slate-400">{{ req.kelas_name }}</span>
                            <span class="text-slate-300 text-[10px]">·</span>
                            <span class="text-[11px] text-slate-400">
                                {{ req.hari }}, {{ formatDate(req.tanggal) }}
                            </span>
                            <span class="text-slate-300 text-[10px]">·</span>
                            <span class="text-[11px] text-slate-400">
                                {{ formatTime(req.jam_mulai) }}–{{ formatTime(req.jam_selesai) }}
                            </span>
                            <span class="text-slate-300 text-[10px]">·</span>
                            <span class="text-[11px] text-slate-500">
                                Diminta oleh: <span class="font-medium">{{ req.requester_name }}</span>
                            </span>
                        </div>

                        <!-- Alasan reject kalau ada -->
                        <p v-if="req.status === 'Rejected' && req.alasan_reject"
                            class="text-[11px] text-rose-500 mt-1 leading-snug">
                            Ditolak: {{ req.alasan_reject }}
                        </p>

                        <!-- Waktu request -->
                        <p class="text-[10px] text-slate-300 mt-1">
                            Dikirim {{ formatDateTime(req.created_at) }}
                        </p>
                    </div>

                    <!-- Status badge -->
                    <span class="flex-shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-sm" :class="req.status === 'Pending'
                        ? 'bg-amber-100 text-amber-700'
                        : req.status === 'Approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-rose-100 text-rose-600'">
                        {{ req.status === 'Pending' ? 'Menunggu'
                            : req.status === 'Approved' ? 'Disetujui'
                        : 'Ditolak' }}
                    </span>

                    <!-- Action buttons — hanya untuk Pending -->
                    <div v-if="req.status === 'Pending'" class="flex-shrink-0 flex gap-1.5">
                        <button @click="openRejectPanel(req)" :disabled="!!processingId"
                            class="px-3 py-1.5 text-[11px] font-semibold rounded-sm text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-40">
                            Tolak
                        </button>
                        <button @click="handleApprove(req)" :disabled="!!processingId"
                            class="px-3 py-1.5 text-[11px] font-semibold rounded-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-40 flex items-center gap-1">
                            <Loader2 v-if="processingId === req.id" class="h-3 w-3 animate-spin" />
                            <span>{{ processingId === req.id ? 'Memproses...' : 'Setujui' }}</span>
                        </button>
                    </div>

                    <!-- Sudah diproses → icon saja -->
                    <div v-else class="flex-shrink-0 w-[88px] flex justify-center">
                        <CheckCircle v-if="req.status === 'Approved'" class="h-4 w-4 text-emerald-400" />
                        <XCircle v-else class="h-4 w-4 text-rose-400" />
                    </div>

                </div>
            </div>

        </div>

    </div>

    <!-- Reject Panel -->
    <Teleport to="body">
        <Transition enter-active-class="transition-all duration-200" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition-all duration-150" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <div v-if="rejectPanelOpen" class="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                @click.self="closeRejectPanel">
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click="closeRejectPanel"></div>
                <div class="relative bg-white rounded-t-sm sm:rounded-sm w-full sm:max-w-md p-5 z-10 shadow-2xl">
                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <p class="text-sm font-bold text-slate-800">Tolak Request Presensi</p>
                            <p class="text-xs text-slate-500 mt-0.5">
                                {{ rejectTarget?.kelas_name }} · {{ rejectTarget?.hari }}, {{
                                formatDate(rejectTarget?.tanggal) }}
                            </p>
                        </div>
                        <button @click="closeRejectPanel" class="text-slate-400 hover:text-slate-600 transition-colors">
                            <X class="h-5 w-5" />
                        </button>
                    </div>

                    <div class="mb-4">
                        <label class="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                            Alasan Penolakan <span class="text-rose-500">*</span>
                        </label>
                        <textarea v-model="alasanReject" rows="3" placeholder="Tuliskan alasan penolakan request ini..."
                            class="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 resize-none outline-none transition bg-slate-50"
                            autofocus></textarea>
                        <p v-if="alasanError" class="text-xs text-rose-500 mt-1">{{ alasanError }}</p>
                    </div>

                    <div class="flex gap-2">
                        <button @click="closeRejectPanel"
                            class="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-sm transition-colors">
                            Batalkan
                        </button>
                        <button @click="handleReject" :disabled="processingId === rejectTarget?.id"
                            class="flex-1 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                            <Loader2 v-if="processingId === rejectTarget?.id" class="h-4 w-4 animate-spin" />
                            <XCircle v-else class="h-4 w-4" />
                            {{ processingId === rejectTarget?.id ? 'Memproses...' : 'Konfirmasi Tolak' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>

    <AppConfirm />
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import {
    Clock, CheckCircle, XCircle, Search, X, Loader2, Send
} from 'lucide-vue-next'
import { usePresensiRequestStore } from '~/stores/presensiRequest'
import { useConfirm } from '~/composables/useConfirm'

const requestStore = usePresensiRequestStore()
const { confirm } = useConfirm()

// STATE
const loading = ref(false)
const processingId = ref(null)
const searchQuery = ref('')
const filterStatus = ref('')
const activeDateShortcut = ref('month')
const alertRef = ref(null)

const todayISO = () => new Date().toLocaleDateString('sv-SE')
const filterDateRange = ref([
    (() => { const d = new Date(); d.setDate(1); return d.toLocaleDateString('sv-SE') })(),
    todayISO()
])

const { alertType, alertMessage, showAlert, clearAlert } = useAlert()

// Reject panel
const rejectPanelOpen = ref(false)
const rejectTarget = ref(null)
const alasanReject = ref('')
const alasanError = ref('')

// ─────────────────────────────────────────────
// DATE SHORTCUTS
// ─────────────────────────────────────────────
const setDateShortcut = async (type) => {
    activeDateShortcut.value = type
    const end = new Date()
    const start = new Date()
    if (type === 'today') {
        filterDateRange.value = [todayISO(), todayISO()]
    } else if (type === 'week') {
        start.setDate(start.getDate() - 6)
        filterDateRange.value = [start.toLocaleDateString('sv-SE'), end.toLocaleDateString('sv-SE')]
    } else if (type === 'month') {
        start.setDate(1)
        filterDateRange.value = [start.toLocaleDateString('sv-SE'), end.toLocaleDateString('sv-SE')]
    }
    await fetchData()
}

const formatDateRangeLabel = computed(() => {
    const [start, end] = filterDateRange.value
    if (!start || !end) return ''
    if (start === end) return new Date(start + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
    return `${new Date(start + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} – ${new Date(end + 'T00:00:00').toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}`
})

// ─────────────────────────────────────────────
// STATUS TABS
// ─────────────────────────────────────────────
const statusTabs = computed(() => [
    { key: '', label: 'Semua', count: requestStore.summary.total },
    { key: 'Pending', label: 'Menunggu', count: requestStore.summary.pending },
    { key: 'Approved', label: 'Disetujui', count: requestStore.summary.approved },
    { key: 'Rejected', label: 'Ditolak', count: requestStore.summary.rejected },
])

// ─────────────────────────────────────────────
// FETCH
// ─────────────────────────────────────────────
const fetchData = async () => {
    loading.value = true
    await requestStore.getRequests({
        status: filterStatus.value || undefined,
        tanggal_mulai: filterDateRange.value[0],
        tanggal_selesai: filterDateRange.value[1],
        search: searchQuery.value.trim() || undefined
    })
    loading.value = false
}

let searchTimer = null
const onSearchInput = () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(fetchData, 400)
}

// ─────────────────────────────────────────────
// ACTIONS
// ─────────────────────────────────────────────
const handleApprove = async (req) => {
    const confirmed = await confirm({
        title: 'Setujui Request',
        message: `Setujui request presensi dari ${req.requester_name} untuk jadwal ${req.kelas_name}, ${req.hari} ${formatDate(req.tanggal)}? KM akan punya 24 jam untuk mengisi presensi.`,
        confirmText: 'Setujui',
        cancelText: 'Batal',
        type: 'success',
    })
    if (!confirmed) return

    processingId.value = req.id
    const result = await requestStore.approveRequest(req.id)
    processingId.value = null

    if (result.success) {
        showAlert('success', 'Request disetujui. KM punya 24 jam untuk mengisi presensi.')
        scrollToAlert()
    } else {
        showAlert('error', result.message || 'Gagal menyetujui request')
        scrollToAlert()
    }
}

const openRejectPanel = (req) => {
    rejectTarget.value = req
    alasanReject.value = ''
    alasanError.value = ''
    rejectPanelOpen.value = true
}

const closeRejectPanel = () => {
    rejectPanelOpen.value = false
    rejectTarget.value = null
    alasanReject.value = ''
    alasanError.value = ''
}

const handleReject = async () => {
    if (!alasanReject.value.trim()) {
        alasanError.value = 'Alasan penolakan wajib diisi.'
        return
    }
    alasanError.value = ''

    processingId.value = rejectTarget.value.id
    const result = await requestStore.rejectRequest(rejectTarget.value.id, alasanReject.value)
    processingId.value = null

    if (result.success) {
        closeRejectPanel()
        showAlert('success', 'Request berhasil ditolak.')
        scrollToAlert()
    } else {
        showAlert('error', result.message || 'Gagal menolak request')
        scrollToAlert()
    }
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
const scrollToAlert = async () => {
    await nextTick()
    if (alertRef.value) {
        const navbar = document.querySelector('nav, header, [data-navbar]')
        const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0
        const elementTop = alertRef.value.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: elementTop - navbarHeight - 16, behavior: 'smooth' })
    }
}

const formatDate = (iso) => {
    if (!iso) return ''
    return new Date(String(iso).substring(0, 10) + 'T00:00:00').toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    })
}

const formatDateTime = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    })
}

const formatTime = (time) => time ? time.substring(0, 5) : '-'

// ─────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────
onMounted(async () => {
    await fetchData()
})
</script>