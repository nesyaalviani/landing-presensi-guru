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
                    <p class="text-xl font-bold text-slate-800 leading-tight">{{ presensiStore.summary.total }}</p>
                </div>
            </div>
            <div class="bg-white rounded-sm border border-amber-200 px-5 py-4 flex items-center gap-3">
                <div class="h-9 w-9 rounded-sm bg-amber-50 flex items-center justify-center flex-shrink-0">
                    <Clock class="h-4 w-4 text-amber-500" />
                </div>
                <div>
                    <p class="text-xs text-slate-500">Menunggu Persetujuan</p>
                    <p class="text-xl font-bold text-amber-600 leading-tight">{{ presensiStore.summary.pending }}</p>
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-white rounded-sm border border-slate-200 p-3">
            <div class="flex flex-col sm:flex-row gap-2 flex-wrap">

                <div class="relative flex-1 sm:max-w-sm">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input v-model="searchQuery" type="text" placeholder="Cari guru atau mapel..."
                        class="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition bg-slate-50"
                        @input="onSearchInput" />
                </div>

                <!-- Kelas dropdown -->
                <div class="relative" ref="kelasDropdownRef">
                    <div class="flex items-center border rounded-sm bg-slate-50 overflow-hidden transition-colors min-w-[160px]"
                        :class="kelasDropdownOpen ? 'border-blue-500' : 'border-slate-200'">
                        <input v-model="kelasSearchQuery" type="text" placeholder="Semua Kelas"
                            class="flex-1 min-w-0 pl-3 pr-2 py-2 text-xs outline-none bg-transparent text-slate-700 placeholder-slate-400"
                            @click.stop="toggleKelasDropdown" @input="onKelasSearchInput" />
                        <button type="button" @click.stop="toggleKelasDropdown"
                            class="px-2 py-2 text-slate-400 hover:text-slate-500 flex-shrink-0 transition-colors">
                            <ChevronDown class="h-3.5 w-3.5 transition-transform duration-200"
                                :class="{ 'rotate-180': kelasDropdownOpen }" />
                        </button>
                    </div>
                    <Transition enter-active-class="transition duration-100 ease-out"
                        enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                        leave-active-class="transition duration-75 ease-in" leave-from-class="opacity-100 translate-y-0"
                        leave-to-class="opacity-0 -translate-y-1">
                        <div v-if="kelasDropdownOpen"
                            class="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-sm shadow-lg">
                            <ul ref="kelasListRef" class="kelas-scroll max-h-52 overflow-y-auto py-1"
                                @scroll="onKelasListScroll">
                                <li @mousedown.prevent="selectKelasItem(null)"
                                    class="px-3 py-2 text-xs cursor-pointer transition-colors" :class="!filterKelas
                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                        : 'text-slate-500 hover:bg-slate-50'">
                                    Semua Kelas
                                </li>
                                <li v-if="kelasDropdownItems.length === 0 && !kelasFetching"
                                    class="px-3 py-3 text-xs text-slate-400 text-center">
                                    Tidak ada hasil
                                </li>
                                <li v-for="kelas in kelasDropdownItems" :key="kelas.id"
                                    @mousedown.prevent="selectKelasItem(kelas)"
                                    class="px-3 py-2 text-xs cursor-pointer transition-colors" :class="filterKelas === kelas.id
                                        ? 'bg-blue-50 text-blue-700 font-medium'
                                        : 'text-slate-700 hover:bg-slate-50'">
                                    {{ kelas.name }}
                                </li>
                                <li v-if="kelasFetching" class="px-3 py-2.5 flex justify-center">
                                    <span
                                        class="inline-block h-3.5 w-3.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                                </li>
                                <li v-else-if="!kelasHasMore && kelasDropdownItems.length > 0"
                                    class="px-3 py-1.5 text-[11px] text-slate-400 text-center border-t border-slate-100 mt-1">
                                    Semua data ditampilkan
                                </li>
                            </ul>
                        </div>
                    </Transition>
                </div>

                <!-- Date filter -->
                <input v-model="filterDate" type="date" @change="fetchWithFilters"
                    class="px-3 py-2 text-xs border border-slate-200 rounded-sm focus:ring-2 focus:ring-blue-500 bg-slate-50 outline-none transition" />

                <!-- Hapus Filter -->
                <button v-if="hasActiveFilter" type="button" @click="resetAllFilters"
                    class="text-xs text-red-500 hover:text-red-600 whitespace-nowrap flex-shrink-0 transition-colors">
                    Hapus Filter
                </button>

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
                    :class="activeTab === tab.key
                        ? 'text-blue-600 bg-blue-50/60'
                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'">
                    <component :is="tab.icon" class="h-3.5 w-3.5" />
                    <span class="hidden sm:inline">{{ tab.label }}</span>
                    <span
                        class="inline-flex items-center justify-center min-w-[18px] px-1.5 rounded-sm text-[11px] font-semibold leading-5"
                        :class="activeTab === tab.key
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-slate-100 text-slate-500'">
                        {{ tab.count }}
                    </span>
                    <span v-if="activeTab === tab.key"
                        class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></span>
                </button>
            </div>

            <div class="p-3">

                <!-- BULK BAR — tampil hanya di tab pending kalau bulk enabled -->
                <div v-if="settingsStore.bulkApprovalEnabled && activeTab === 'pending' && allPendingIds.length > 0"
                    class="flex items-center justify-between gap-3 mb-3 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-sm">

                    <label class="flex items-center gap-2 cursor-pointer select-none">
                        <input type="checkbox" :checked="allSelected" @change="toggleSelectAll"
                            class="w-3.5 h-3.5 rounded accent-blue-600 cursor-pointer" />
                        <span class="text-xs text-slate-600 font-medium">
                            {{ selectedIds.length > 0 ? `${selectedIds.length} presensi dipilih` : 'Pilih semua' }}
                        </span>
                    </label>

                    <button v-if="selectedIds.length > 0" @click="handleBulkApprove" :disabled="processingId === 'bulk'"
                        class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-sm transition-colors disabled:opacity-50">
                        <Loader2 v-if="processingId === 'bulk'" class="h-3 w-3 animate-spin" />
                        <CheckCircle v-else class="h-3 w-3" />
                        Setujui {{ selectedIds.length }} Presensi
                    </button>
                </div>

                <!-- Loading skeleton: grid -->
                <template v-if="loading && activeTab !== 'belum'">
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
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

                <!-- Loading skeleton: list belum -->
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
                <div v-else-if="currentTabData.length === 0" class="py-14 text-center">
                    <div class="h-12 w-12 rounded-sm bg-slate-100 flex items-center justify-center mx-auto mb-3">
                        <component :is="currentTab.icon" class="h-6 w-6 text-slate-400" />
                    </div>
                    <p class="text-sm font-semibold text-slate-700">Tidak ada data</p>
                    <p class="text-xs text-slate-400 mt-1">
                        Tidak ada presensi {{ currentTab.label.toLowerCase() }} untuk filter ini
                    </p>
                </div>

                <!-- TAB BELUM: List view -->
                <div v-else-if="activeTab === 'belum'" class="space-y-2">
                    <div v-for="row in currentTabData" :key="row.id_jadwal"
                        class="flex items-center gap-3 px-4 py-3 rounded-sm border border-slate-200 bg-white">
                        <div class="h-9 w-9 rounded-sm bg-slate-100 flex items-center justify-center flex-shrink-0">
                            <UserX class="h-4 w-4 text-slate-400" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <p class="text-sm font-semibold text-slate-800 truncate">{{ getGuruName(row) }}</p>
                            <div class="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5">
                                <span class="text-xs text-slate-500 truncate">{{ getMapelName(row) }}</span>
                                <span class="text-slate-300 text-xs">·</span>
                                <span class="text-xs text-slate-400">{{ row.kelas_name }}</span>
                                <span class="text-slate-300 text-xs">·</span>
                                <span class="text-xs text-slate-400">
                                    {{ formatTime(row.jam_mulai) }}–{{ formatTime(row.jam_selesai) }}
                                </span>
                            </div>
                        </div>

                        <!-- BARU: tombol Buka — hanya muncul kalau filterDate adalah hari lalu -->
                        <template v-if="isPastFilterDate">
                            <!-- Sudah dibuka → disabled -->
                            <span v-if="row.is_opened_by_admin"
                                class="flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-sm bg-emerald-50 border border-emerald-200 text-emerald-600">
                                <CheckCircle class="h-3 w-3" />
                                Sudah Dibuka
                            </span>
                            <!-- Belum dibuka → aktif -->
                            <button v-else @click="handleOpenPresensi(row)" :disabled="openingId === row.id_jadwal"
                                class="flex-shrink-0 inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1.5 rounded-sm transition-colors disabled:opacity-50"
                                :class="openingId === row.id_jadwal
                                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'">
                                <Loader2 v-if="openingId === row.id_jadwal" class="h-3 w-3 animate-spin" />
                                <Unlock v-else class="h-3 w-3" />
                                {{ openingId === row.id_jadwal ? 'Membuka...' : 'Buka' }}
                            </button>
                        </template>

                        <!-- Hari ini: label biasa (tidak berubah) -->
                        <span v-else
                            class="flex-shrink-0 text-[11px] font-medium px-2 py-0.5 rounded-sm bg-slate-100 text-slate-500">
                            Belum diabsen
                        </span>
                    </div>
                </div>

                <!-- GRID: pending / approved / rejected -->
                <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div v-for="row in currentTabData" :key="row.id_jadwal"
                        class="rounded-sm overflow-hidden border bg-white flex flex-col transition-all duration-150"
                        :class="[
                            selectedIds.includes(row.id_presensi)
                                ? 'border-blue-400 ring-2 ring-blue-300 ring-offset-1'
                                : 'border-slate-200'
                        ]">

                        <!-- Foto -->
                        <div class="relative aspect-video overflow-hidden bg-slate-100 flex-shrink-0"
                            :class="row.foto_bukti ? 'cursor-pointer group' : ''"
                            @click="row.foto_bukti ? openImageModal(row.foto_bukti) : null">

                            <img v-if="row.foto_bukti" :src="row.foto_bukti" :alt="getGuruName(row)"
                                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                            <div v-else class="w-full h-full flex flex-col items-center justify-center gap-1.5"
                                :class="noPhotoBg(row)">
                                <ImageOff class="h-7 w-7 opacity-30" :class="noPhotoIcon(row)" />
                                <span class="text-[11px] opacity-40" :class="noPhotoIcon(row)">Tanpa foto</span>
                            </div>

                            <!-- Zoom hint -->
                            <div v-if="row.foto_bukti"
                                class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                <div
                                    class="opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-sm p-1.5">
                                    <ZoomIn class="h-4 w-4 text-white" />
                                </div>
                            </div>

                            <!-- Status badge -->
                            <div class="absolute top-1.5 right-1.5">
                                <span class="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm backdrop-blur-sm"
                                    :class="statusPillClass(row.status_approve)">
                                    {{ statusLabel(row.status_approve) }}
                                </span>
                            </div>

                            <!-- Checkbox bulk — pojok kiri atas, hanya tab pending + bulk enabled -->
                            <div v-if="settingsStore.bulkApprovalEnabled && row.status_approve === 'Pending' && row.id_presensi"
                                class="absolute top-1.5 left-1.5 z-10" @click.stop>
                                <input type="checkbox" :checked="selectedIds.includes(row.id_presensi)"
                                    @change="toggleSelect(row.id_presensi)"
                                    class="w-4 h-4 rounded accent-blue-600 cursor-pointer shadow-md" />
                            </div>
                        </div>

                        <!-- Info + actions -->
                        <div class="p-2.5 flex flex-col gap-2 flex-1">
                            <div class="min-w-0">
                                <p class="text-xs font-semibold text-slate-800 truncate leading-tight">
                                    {{ getGuruName(row) }}
                                </p>
                                <p class="text-[11px] text-slate-500 truncate mt-0.5">{{ getMapelName(row) }}</p>
                                <div class="flex flex-wrap items-center gap-x-1.5 mt-1">
                                    <span class="text-[10px] text-slate-400">{{ row.kelas_name }}</span>
                                    <span class="text-slate-300 text-[10px]">·</span>
                                    <span class="text-[10px] text-slate-400">
                                        {{ formatTime(row.jam_mulai) }}–{{ formatTime(row.jam_selesai) }}
                                    </span>
                                </div>
                            </div>

                            <!-- Status kehadiran -->
                            <div v-if="row.id_presensi" class="flex items-center gap-1.5">
                                <span class="text-[10px] font-medium px-1.5 py-0.5 rounded-sm" :class="row.status === 'Hadir'
                                    ? 'bg-emerald-100 text-emerald-700'
                                    : 'bg-rose-100 text-rose-600'">
                                    {{ row.status }}
                                </span>
                                <span v-if="row.status === 'Tidak Hadir'" class="text-[10px] text-slate-400">
                                    Tugas: {{ row.memberikan_tugas === true
                                        ? 'Ya'
                                        : row.memberikan_tugas === false
                                            ? 'Tidak'
                                            : '-' }}
                                </span>
                            </div>

                            <!-- Alasan reject -->
                            <p v-if="row.status_approve === 'Rejected' && row.alasan_reject"
                                class="text-[10px] text-rose-500 leading-tight line-clamp-2">
                                Ditolak: {{ row.alasan_reject }}
                            </p>

                            <!-- Catatan -->
                            <p v-if="row.catatan" class="text-[10px] text-slate-400 italic leading-tight line-clamp-1">
                                "{{ row.catatan }}"
                            </p>

                            <!-- Action buttons — hanya di tab pending -->
                            <div v-if="row.id_presensi && row.status_approve === 'Pending'"
                                class="flex gap-1.5 mt-auto pt-1">
                                <button @click="openSingleRejectPanel(row)" :disabled="!!processingId"
                                    class="flex-1 py-1.5 text-[11px] font-semibold rounded-sm text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors disabled:opacity-40">
                                    Tolak
                                </button>
                                <button @click="handleApprove(row)" :disabled="!!processingId"
                                    class="flex-1 py-1.5 text-[11px] font-semibold rounded-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors disabled:opacity-40 flex items-center justify-center gap-1">
                                    <Loader2 v-if="processingId === row.id_presensi" class="h-3 w-3 animate-spin" />
                                    <span>{{ processingId === row.id_presensi ? 'Memproses...' : 'Setujui' }}</span>
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
            enter-to-class="opacity-100" leave-active-class="transition-all duration-150" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
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
                                <div class="h-10 w-10 rounded-sm overflow-hidden border border-slate-200 flex-shrink-0">
                                    <img v-if="rejectTarget?.foto_bukti" :src="rejectTarget.foto_bukti"
                                        class="w-full h-full object-cover" />
                                    <div v-else class="w-full h-full bg-slate-100 flex items-center justify-center">
                                        <ImageOff class="h-4 w-4 text-slate-400" />
                                    </div>
                                </div>
                                <div class="min-w-0">
                                    <p class="text-sm font-bold text-slate-800 truncate">
                                        {{ getGuruName(rejectTarget) }}
                                    </p>
                                    <p class="text-xs text-slate-500 truncate">
                                        {{ getMapelName(rejectTarget) }} · {{ rejectTarget?.kelas_name }}
                                    </p>
                                </div>
                            </div>
                            <button @click="closeRejectPanel"
                                class="text-slate-400 hover:text-slate-600 transition-colors ml-2 flex-shrink-0">
                                <X class="h-5 w-5" />
                            </button>
                        </div>

                        <div class="mb-4">
                            <label class="text-xs font-semibold text-slate-700 uppercase tracking-wide block mb-1.5">
                                Alasan Penolakan <span class="text-rose-500">*</span>
                            </label>
                            <textarea v-model="alasanReject" rows="3" placeholder="Tuliskan alasan penolakan..."
                                class="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-sm focus:ring-2 focus:ring-rose-400 focus:border-rose-400 resize-none outline-none transition bg-slate-50"
                                autofocus></textarea>
                            <p v-if="alasanRejectError" class="text-xs text-rose-500 mt-1">
                                {{ alasanRejectError }}
                            </p>
                        </div>

                        <div class="flex gap-2">
                            <button @click="closeRejectPanel"
                                class="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-sm transition-colors">
                                Batalkan
                            </button>
                            <button @click="handleSingleReject" :disabled="processingId === rejectTarget?.id_presensi"
                                class="flex-1 py-2.5 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-sm transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                                <Loader2 v-if="processingId === rejectTarget?.id_presensi"
                                    class="h-4 w-4 animate-spin" />
                                <XCircle v-else class="h-4 w-4" />
                                {{ processingId === rejectTarget?.id_presensi ? 'Memproses...' : 'Konfirmasi Tolak' }}
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { usePresensiStore } from '~/stores/presensi'
import { useSettingsStore } from '~/stores/settings'
import { useClassroomsStore } from '~/stores/classrooms'
import {
    Clock, CheckCircle, XCircle, Search, X,
    FileText, Loader2, ChevronDown, ImageOff, ZoomIn, UserX, Unlock
} from 'lucide-vue-next'
import { useConfirm } from '~/composables/useConfirm'

const presensiStore = usePresensiStore()
const settingsStore = useSettingsStore()
const classroomsStore = useClassroomsStore()
const { confirm } = useConfirm()

// ─────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────
const loading = ref(false)
const processingId = ref(null)

const searchQuery = ref('')
const filterKelas = ref('')
const activeTab = ref('pending')

const todayISO = () => new Date().toLocaleDateString('sv-SE')
const filterDate = ref(todayISO())
// Apakah filter tanggal yang sedang aktif adalah hari lalu?
const isPastFilterDate = computed(() => filterDate.value < todayISO())

// ID jadwal yang sedang dalam proses dibuka (untuk disable tombol)
const openingId = ref(null)

const showImageModal = ref(false)
const selectedImage = ref('')
const alertRef = ref(null)

const rejectPanelOpen = ref(false)
const rejectTarget = ref(null)
const alasanReject = ref('')
const alasanRejectError = ref('')

// Bulk state
const selectedIds = ref([])

const {
    alertType, alertMessage, alertRedirectDelay, alertRedirectFn, showAlert, clearAlert
} = useAlert()

// ─────────────────────────────────────────────
// BULK COMPUTED
// ─────────────────────────────────────────────
const allPendingIds = computed(() =>
    currentTabData.value
        .filter(r => r.id_presensi && r.status_approve === 'Pending')
        .map(r => r.id_presensi)
)

const allSelected = computed(() =>
    allPendingIds.value.length > 0 &&
    allPendingIds.value.every(id => selectedIds.value.includes(id))
)

const toggleSelectAll = () => {
    if (allSelected.value) {
        selectedIds.value = []
    } else {
        selectedIds.value = [...allPendingIds.value]
    }
}

const toggleSelect = (id) => {
    const idx = selectedIds.value.indexOf(id)
    if (idx === -1) selectedIds.value.push(id)
    else selectedIds.value.splice(idx, 1)
}

// ─────────────────────────────────────────────
// KELAS DROPDOWN
// ─────────────────────────────────────────────
const KELAS_LIMIT = 10
const kelasDropdownOpen = ref(false)
const kelasDropdownRef = ref(null)
const kelasListRef = ref(null)
const kelasSearchQuery = ref('')
const kelasNameCache = ref({})
const kelasDropdownItems = ref([])
const kelasPage = ref(1)
const kelasHasMore = ref(true)
const kelasFetching = ref(false)
let kelasSearchTimer = null

const fetchKelasDropdown = async (reset = false) => {
    if (kelasFetching.value) return
    if (!kelasHasMore.value && !reset) return
    kelasFetching.value = true

    if (reset) {
        kelasDropdownItems.value = []
        kelasPage.value = 1
        kelasHasMore.value = true
    }

    try {
        const result = await classroomsStore.getClassrooms({
            page: kelasPage.value,
            limit: KELAS_LIMIT,
            search: kelasSearchQuery.value || undefined
        })

        if (result?.success !== false) {
            const incoming = Array.isArray(result)
                ? result
                : result?.data?.data || result?.data || []

            const pagination = result?.data?.pagination || null

            incoming.forEach(k => { kelasNameCache.value[k.id] = k.name })

            kelasDropdownItems.value = reset
                ? [...incoming]
                : [...kelasDropdownItems.value, ...incoming]

            if (pagination) {
                kelasHasMore.value = kelasPage.value < (pagination.totalPages ?? 1)
            } else {
                kelasHasMore.value = incoming.length === KELAS_LIMIT
            }

            if (!reset) kelasPage.value++
            else kelasPage.value = 2
        }
    } catch (e) {
        console.error('fetchKelasDropdown error:', e)
    } finally {
        kelasFetching.value = false
    }
}

const toggleKelasDropdown = async () => {
    if (kelasDropdownOpen.value) {
        closeKelasDropdown()
    } else {
        kelasDropdownOpen.value = true
        if (kelasDropdownItems.value.length === 0) {
            await fetchKelasDropdown(true)
        }
    }
}

const closeKelasDropdown = () => {
    kelasDropdownOpen.value = false
    kelasSearchQuery.value = filterKelas.value
        ? (kelasNameCache.value[filterKelas.value] || '')
        : ''
}

const onKelasSearchInput = () => {
    if (!kelasDropdownOpen.value) kelasDropdownOpen.value = true
    clearTimeout(kelasSearchTimer)
    kelasSearchTimer = setTimeout(() => fetchKelasDropdown(true), 350)
}

const onKelasListScroll = () => {
    const el = kelasListRef.value
    if (!el) return
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40
    if (nearBottom && kelasHasMore.value && !kelasFetching.value) {
        fetchKelasDropdown()
    }
}

const selectKelasItem = async (kelas) => {
    if (kelas) {
        filterKelas.value = kelas.id
        kelasNameCache.value[kelas.id] = kelas.name
        kelasSearchQuery.value = kelas.name
    } else {
        filterKelas.value = ''
        kelasSearchQuery.value = ''
    }
    kelasDropdownOpen.value = false
    await fetchWithFilters()
}

// ─────────────────────────────────────────────
// HAPUS FILTER
// ─────────────────────────────────────────────
const hasActiveFilter = computed(() => {
    return !!searchQuery.value || !!filterKelas.value || filterDate.value !== todayISO()
})

const resetAllFilters = async () => {
    searchQuery.value = ''
    filterKelas.value = ''
    filterDate.value = todayISO()
    kelasSearchQuery.value = ''
    kelasDropdownOpen.value = false
    clearTimeout(searchTimer)
    await fetchKelasDropdown(true)
    await fetchWithFilters()
}

// ─────────────────────────────────────────────
// TABS
// ─────────────────────────────────────────────
const tabs = computed(() => [
    { key: 'pending', label: 'Menunggu', icon: Clock, count: presensiStore.summary.pending },
    { key: 'approved', label: 'Disetujui', icon: CheckCircle, count: presensiStore.summary.approved },
    { key: 'rejected', label: 'Ditolak', icon: XCircle, count: presensiStore.summary.rejected },
    { key: 'belum', label: 'Belum', icon: FileText, count: presensiStore.summary.belum },
])

const currentTab = computed(() => tabs.value.find(t => t.key === activeTab.value) || tabs.value[0])
const currentTabData = computed(() => presensiStore.presensiTab)

// ─────────────────────────────────────────────
// SEARCH
// ─────────────────────────────────────────────
let searchTimer = null

const onSearchInput = () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(async () => {
        loading.value = true
        await presensiStore.getPresensiTab(activeTab.value, getCurrentFilters())
        loading.value = false
    }, 400)
}

// ─────────────────────────────────────────────
// HELPERS FILTER
// ─────────────────────────────────────────────
const getCurrentFilters = () => ({
    tanggal: filterDate.value || undefined,
    id_kelas: filterKelas.value || undefined,
    search: searchQuery.value.trim() || undefined
})

// ─────────────────────────────────────────────
// FETCH
// ─────────────────────────────────────────────
const fetchWithFilters = async () => {
    loading.value = true
    await Promise.all([
        presensiStore.getPresensiSummary(getCurrentFilters()),
        presensiStore.getPresensiTab(activeTab.value, getCurrentFilters())
    ])
    loading.value = false
}

const refreshAfterAction = async () => {
    loading.value = true
    await Promise.all([
        presensiStore.getPresensiSummary(getCurrentFilters()),
        presensiStore.getPresensiTab(activeTab.value, getCurrentFilters())
    ])
    loading.value = false
}

// ─────────────────────────────────────────────
// TAB SWITCH
// ─────────────────────────────────────────────
const switchTab = async (key) => {
    activeTab.value = key
    selectedIds.value = []
    closeRejectPanel()
    loading.value = true
    await presensiStore.getPresensiTab(key, getCurrentFilters())
    loading.value = false
}

// ─────────────────────────────────────────────
// ACTIONS: APPROVE / REJECT / BULK
// ─────────────────────────────────────────────
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
    processingId.value = null

    if (result.success) {
        await refreshAfterAction()
        showAlert('success', 'Presensi berhasil disetujui!')
        scrollToAlert()
    } else {
        showAlert('error', result.message || 'Gagal menyetujui presensi')
        scrollToAlert()
    }
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
    processingId.value = null

    if (result.success) {
        closeRejectPanel()
        await refreshAfterAction()
        showAlert('success', 'Presensi berhasil ditolak!')
        scrollToAlert()
    } else {
        showAlert('error', result.message || 'Gagal menolak presensi')
        scrollToAlert()
    }
}

const handleBulkApprove = async () => {
    if (selectedIds.value.length === 0) return

    const confirmed = await confirm({
        title: 'Setujui Massal',
        message: `Setujui ${selectedIds.value.length} presensi sekaligus? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: `Setujui ${selectedIds.value.length} Presensi`,
        cancelText: 'Batal',
        type: 'success',
    })
    if (!confirmed) return

    processingId.value = 'bulk'
    try {
        const token = process.client ? localStorage.getItem('token') : null
        const config = useRuntimeConfig()
        const res = await $fetch('/presensi/bulk-approve', {
            method: 'PUT',
            baseURL: config.public.apiBase,
            headers: {
                'Content-Type': 'application/json',
                ...(token && { Authorization: `Bearer ${token}` })
            },
            body: { ids: selectedIds.value, status: 'Approved' }
        })
        selectedIds.value = []
        await refreshAfterAction()
        showAlert('success', `${res.total} presensi berhasil disetujui!`)
        scrollToAlert()
    } catch (e) {
        showAlert('error', e.data?.message || 'Gagal melakukan persetujuan massal')
        scrollToAlert()
    } finally {
        processingId.value = null
    }
}

const handleOpenPresensi = async (row) => {
    openingId.value = row.id_jadwal
    const result = await presensiStore.openPresensi(row.id_jadwal, filterDate.value)
    openingId.value = null

    if (result.success) {
        // Refresh data tab belum supaya tombol langsung berubah jadi "Sudah Dibuka"
        loading.value = true
        await presensiStore.getPresensiTab(activeTab.value, getCurrentFilters())
        loading.value = false
        showAlert('success', 'Presensi berhasil dibuka. KM punya 24 jam untuk mengisi.')
        scrollToAlert()
    } else {
        showAlert('error', result.message || 'Gagal membuka presensi')
        scrollToAlert()
    }
}

// ─────────────────────────────────────────────
// CLICK OUTSIDE
// ─────────────────────────────────────────────
const handleClickOutside = (e) => {
    if (kelasDropdownRef.value && !kelasDropdownRef.value.contains(e.target)) {
        closeKelasDropdown()
    }
}

// ─────────────────────────────────────────────
// UI HELPERS
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

// ─────────────────────────────────────────────
// LIFECYCLE
// ─────────────────────────────────────────────
onMounted(async () => {
    loading.value = true
    await Promise.all([
        settingsStore.fetchBulkApprovalStatus(),
        fetchKelasDropdown(true),
        presensiStore.getPresensiSummary(getCurrentFilters()),
        presensiStore.getPresensiTab('pending', getCurrentFilters())
    ])
    loading.value = false

    if (process.client) document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
    clearTimeout(searchTimer)
    clearTimeout(kelasSearchTimer)
    if (process.client) document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.kelas-scroll::-webkit-scrollbar {
    width: 4px;
}

.kelas-scroll::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px 0;
}

.kelas-scroll::-webkit-scrollbar-thumb {
    background-color: #cbd5e1;
    border-radius: 99px;
}

.kelas-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #94a3b8;
}

.kelas-scroll {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 transparent;
}
</style>