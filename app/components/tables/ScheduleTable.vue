<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-sm border border-gray-200">
        <div class="mx-auto max-w-7xl">

            <div class="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div class="relative w-full sm:w-80">
                        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" v-model="search" placeholder="Cari berdasarkan nama kelas..."
                            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-500 rounded-sm outline-none" />
                    </div>

                    <!-- Dropdown Jurusan -->
                    <div class="relative w-full sm:w-50" ref="jurusanDropdownRef">
                        <div class="flex items-center border rounded-sm bg-white overflow-hidden transition-colors"
                            :class="jurusanDropdownOpen ? 'border-blue-400' : 'border-gray-500'">
                            <input type="text" readonly :placeholder="selectedJurusanName || 'Semua Jurusan'" :class="[
                                'flex-1 min-w-0 pl-3 pr-2 py-2 text-sm outline-none bg-transparent cursor-pointer',
                                jurusanFilter ? 'text-gray-900 placeholder-gray-900' : 'text-gray-400 placeholder-gray-400'
                            ]" @click.stop="toggleJurusanDropdown" />
                            <button type="button" @click.stop="toggleJurusanDropdown"
                                class="px-2 py-2 text-gray-400 hover:text-gray-500 flex-shrink-0 transition-colors">
                                <ChevronDown class="h-3.5 w-3.5 transition-transform duration-200"
                                    :class="{ 'rotate-180': jurusanDropdownOpen }" />
                            </button>
                        </div>

                        <Transition enter-active-class="transition duration-100 ease-out"
                            enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
                            <div v-if="jurusanDropdownOpen"
                                class="absolute z-[10] mt-1 w-full bg-white border border-gray-200 rounded-sm shadow-lg">
                                <ul class="jurusan-scroll max-h-48 overflow-y-auto py-1">
                                    <li v-for="j in jurusanList" :key="j.id" @mousedown.prevent="selectJurusan(j)"
                                        class="px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2"
                                        :class="jurusanFilter === j.id
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'">
                                        <span class="flex-1">{{ j.nama_jurusan }}</span>
                                        <Check v-if="jurusanFilter === j.id"
                                            class="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                                    </li>
                                </ul>
                            </div>
                        </Transition>
                    </div>

                    <!-- Dropdown Tingkat -->
                    <div class="relative w-full sm:w-32" ref="tingkatDropdownRef">
                        <div class="flex items-center border rounded-sm bg-white overflow-hidden transition-colors"
                            :class="tingkatDropdownOpen ? 'border-blue-400' : 'border-gray-500'">
                            <input type="text" readonly :placeholder="tingkatFilter || 'Tingkat'" :class="[
                                'flex-1 min-w-0 pl-3 pr-2 py-2 text-sm outline-none bg-transparent cursor-pointer',
                                tingkatFilter ? 'text-gray-900 placeholder-gray-900' : 'text-gray-400 placeholder-gray-400'
                            ]" @click.stop="toggleTingkatDropdown" />
                            <button type="button" @click.stop="toggleTingkatDropdown"
                                class="px-2 py-2 text-gray-400 hover:text-gray-500 flex-shrink-0 transition-colors">
                                <ChevronDown class="h-3.5 w-3.5 transition-transform duration-200"
                                    :class="{ 'rotate-180': tingkatDropdownOpen }" />
                            </button>
                        </div>

                        <Transition enter-active-class="transition duration-100 ease-out"
                            enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                            leave-active-class="transition duration-75 ease-in"
                            leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
                            <div v-if="tingkatDropdownOpen"
                                class="absolute z-[10] mt-1 w-full bg-white border border-gray-200 rounded-sm shadow-lg">
                                <ul class="tingkat-scroll max-h-48 overflow-y-auto py-1">
                                    <li v-for="t in tingkatOptions" :key="t" @mousedown.prevent="selectTingkat(t)"
                                        class="px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2"
                                        :class="tingkatFilter === t
                                            ? 'bg-blue-50 text-blue-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'">
                                        <span class="flex-1">{{ t }}</span>
                                        <Check v-if="tingkatFilter === t"
                                            class="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                                    </li>
                                </ul>
                            </div>
                        </Transition>
                    </div>

                    <!-- Hapus Filter — 1 tombol untuk semua filter -->
                    <button v-if="jurusanFilter || tingkatFilter" type="button" @click="clearAllFilters"
                        class="text-xs text-red-500 hover:text-red-600 whitespace-nowrap flex-shrink-0 transition-colors self-center">
                        Hapus Filter
                    </button>
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                    <button @click="openImportModal"
                        class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-sm bg-white border border-gray-400 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <Upload class="h-4 w-4" />
                        Import
                    </button>
                    <NuxtLink to="/schedule/create"
                        class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-all shadow-md">
                        <Plus class="h-4 w-4" />
                        Tambah
                    </NuxtLink>
                </div>
            </div>

            <div class="mb-3">
                <AppAlert :type="alertType" :message="alertMessage" :on-close="clearAlert" />
            </div>

            <div v-if="isFirstLoad" class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div v-for="i in 12" :key="'sk-' + i" class="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
                    <div class="flex items-start justify-between mb-4">
                        <div class="space-y-2">
                            <div class="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                            <div class="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div class="h-8 w-8 bg-gray-200 rounded-sm animate-pulse"></div>
                    </div>
                    <div class="h-px bg-gray-100 my-3"></div>
                    <div class="flex items-center gap-2">
                        <div class="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                        <div class="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>

            <div v-else-if="classrooms.length === 0 && !classroomsStore.loading"
                class="flex flex-col items-center justify-center py-20 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarDays class="h-8 w-8 text-gray-400" />
                </div>
                <h3 class="text-sm font-medium text-gray-900 mb-1">Tidak ada kelas</h3>
                <p class="text-sm text-gray-500">
                    {{ search ? `Tidak ada kelas yang cocok dengan "${search}"` : 'Belum ada data kelas.' }}
                </p>
            </div>

            <div v-else class="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <NuxtLink v-for="kelas in classrooms" :key="kelas.id" :to="`/schedule/${kelas.id}`"
                    class="group bg-white border border-gray-200 rounded-sm p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">

                    <div class="flex items-start justify-between mb-3">
                        <div class="flex-1 min-w-0">
                            <h3
                                class="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {{ kelas.name }}
                            </h3>
                            <p class="text-xs text-gray-500 mt-0.5 truncate">
                                {{ kelas.tingkat }} · {{ kelas.nama_jurusan || '-' }}
                            </p>
                        </div>
                        <div
                            class="w-8 h-8 bg-blue-50 group-hover:bg-blue-100 rounded-sm flex items-center justify-center transition-colors flex-shrink-0 ml-2">
                            <ChevronRight class="h-4 w-4 text-blue-500" />
                        </div>
                    </div>

                    <div class="h-px bg-gray-100 mb-3"></div>

                    <div class="flex items-center gap-1.5 text-xs"
                        :class="parseInt(kelas.schedule_count) === 0 ? 'text-gray-400 italic' : 'text-gray-500'">
                        <CalendarDays class="h-3.5 w-3.5 flex-shrink-0" />
                        <span>
                            {{
                                parseInt(kelas.schedule_count) === 0
                                    ? 'Belum ada jadwal terdaftar'
                                    : `${kelas.schedule_count} jadwal terdaftar`
                            }}
                        </span>
                    </div>
                </NuxtLink>

                <template v-if="classroomsStore.loading && !isFirstLoad">
                    <div v-for="i in 4" :key="'loadmore-' + i"
                        class="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
                        <div class="flex items-start justify-between mb-4">
                            <div class="space-y-2">
                                <div class="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                                <div class="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div class="h-8 w-8 bg-gray-200 rounded-sm animate-pulse"></div>
                        </div>
                        <div class="h-px bg-gray-100 my-3"></div>
                        <div class="flex items-center gap-2">
                            <div class="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                            <div class="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </template>
            </div>

            <div v-if="classroomsStore.hasMore && !classroomsStore.loading" ref="loadMoreRef" class="h-8 mt-4">
            </div>

            <div v-if="!classroomsStore.hasMore && classrooms.length > 0 && !isFirstLoad"
                class="text-center text-xs text-gray-400 mt-6">
                Semua kelas sudah ditampilkan
            </div>

        </div>

        <AppImportModal v-model="showImportModal" title="Import Data Jadwal"
            :required-columns="['hari', 'kelas', 'mapel', 'guru', 'jam_mulai', 'jam_selesai']"
            :preview-columns="['hari', 'kelas', 'mapel', 'guru', 'jam_mulai', 'jam_selesai']"
            :import-fn="importSchedule" :validate-row="validateImportRow" @download-template="downloadTemplate"
            @imported="onImported">
            <template #format-info>
                Kolom: <span class="font-semibold">hari</span>, <span class="font-semibold">kelas</span>,
                <span class="font-semibold">mapel</span>, <span class="font-semibold">guru</span>,
                <span class="font-semibold">jam_mulai</span>, <span class="font-semibold">jam_selesai</span>
            </template>
        </AppImportModal>

        <AppConfirm />
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Search, ChevronRight, ChevronDown, CalendarDays, Upload, Plus, Check } from 'lucide-vue-next'
import { useClassroomsStore } from '~/stores/classrooms'
import { useSchedulesStore } from '~/stores/schedules'
import { useTeachersStore } from '~/stores/teachers'
import { useConfirm } from '~/composables/useConfirm'

const classroomsStore = useClassroomsStore()
const schedulesStore = useSchedulesStore()
const teachersStore = useTeachersStore()
const { confirm } = useConfirm()
const { alertType, alertMessage, showAlert, clearAlert } = useAlert()

const search = ref('')
const jurusanFilter = ref(null)
const tingkatFilter = ref(null)
const isFirstLoad = ref(true)
const loadMoreRef = ref(null)
const showImportModal = ref(false)
const importTeachers = ref([])
let searchTimeout = null
let observer = null

const classrooms = computed(() => classroomsStore.classrooms)
const jurusanList = computed(() => classroomsStore.jurusanList)

// ===================== Jurusan dropdown =====================
const jurusanDropdownOpen = ref(false)
const jurusanDropdownRef = ref(null)
const selectedJurusanName = ref('')

// ===================== Tingkat dropdown =====================
const tingkatOptions = ['X', 'XI', 'XII']
const tingkatDropdownOpen = ref(false)
const tingkatDropdownRef = ref(null)

const getFilters = () => ({
    search: search.value || undefined,
    id_jurusan: jurusanFilter.value || undefined,
    tingkat: tingkatFilter.value || undefined,
    limit: 12
})

watch(search, () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(async () => {
        isFirstLoad.value = true
        await classroomsStore.resetAndFetch(getFilters())
        isFirstLoad.value = false
    }, 400)
})

const onFilterChange = async () => {
    isFirstLoad.value = true
    await classroomsStore.resetAndFetch(getFilters())
    isFirstLoad.value = false
}

// ===================== Jurusan handlers =====================
const toggleJurusanDropdown = () => {
    jurusanDropdownOpen.value = !jurusanDropdownOpen.value
}

const selectJurusan = (j) => {
    jurusanFilter.value = j.id
    selectedJurusanName.value = j.nama_jurusan
    jurusanDropdownOpen.value = false
    onFilterChange()
}

const clearJurusanFilter = () => {
    jurusanFilter.value = null
    selectedJurusanName.value = ''
}

const handleJurusanClickOutside = (event) => {
    if (jurusanDropdownRef.value && !jurusanDropdownRef.value.contains(event.target)) {
        jurusanDropdownOpen.value = false
    }
}

// ===================== Tingkat handlers =====================
const toggleTingkatDropdown = () => {
    tingkatDropdownOpen.value = !tingkatDropdownOpen.value
}

const selectTingkat = (t) => {
    tingkatFilter.value = t
    tingkatDropdownOpen.value = false
    onFilterChange()
}

const clearTingkatFilter = () => {
    tingkatFilter.value = null
}

const handleTingkatClickOutside = (event) => {
    if (tingkatDropdownRef.value && !tingkatDropdownRef.value.contains(event.target)) {
        tingkatDropdownOpen.value = false
    }
}

// ===================== Clear all filters =====================
const clearAllFilters = () => {
    clearJurusanFilter()
    clearTingkatFilter()
    jurusanDropdownOpen.value = false
    tingkatDropdownOpen.value = false
    onFilterChange()
}

// ===================== Infinite scroll =====================
const setupObserver = () => {
    if (!process.client) return
    observer = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && classroomsStore.hasMore && !classroomsStore.loading) {
            await classroomsStore.loadMore(getFilters())
        }
    }, { threshold: 0.1 })

    if (loadMoreRef.value) observer.observe(loadMoreRef.value)
}

watch(loadMoreRef, (el) => {
    if (el && observer) observer.observe(el)
})

// ===================== Import =====================
const openImportModal = async () => {
    if (importTeachers.value.length === 0) {
        const r = await teachersStore.getTeachers({ all: true })
        if (r.success) importTeachers.value = teachersStore.teachers
    }
    showImportModal.value = true
}

const validateImportRow = (row) => {
    const validDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']
    if (!validDays.includes(String(row.hari).trim())) return `Hari "${row.hari}" tidak valid`

    const kelasExists = classrooms.value.some(k => k.name === String(row.kelas).trim())
    if (!kelasExists) return `Kelas "${row.kelas}" tidak ditemukan`

    return null
}

const onImported = (result) => {
    if (result.total > 0) {
        showAlert('success', `Berhasil mengimport ${result.total} data jadwal.`)
    } else {
        showAlert('error', 'Tidak ada data yang berhasil diimport.')
    }
}

const downloadTemplate = async () => {
    const XLSX = await import('xlsx')
    const data = [{
        hari: 'Senin',
        kelas: '10A',
        mapel: 'Matematika',
        guru: 'Budi',
        jam_mulai: '07:00',
        jam_selesai: '08:30'
    }]
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Template')
    XLSX.writeFile(wb, 'template_import_jadwal.xlsx')
}

const importSchedule = async (data) => {
    return await schedulesStore.importSchedule(data)
}

// ===================== Lifecycle =====================
onMounted(async () => {
    isFirstLoad.value = true
    await Promise.all([
        classroomsStore.resetAndFetch(getFilters()),
        classroomsStore.getJurusanList()
    ])
    isFirstLoad.value = false
    setupObserver()

    if (process.client) {
        document.addEventListener('click', handleJurusanClickOutside)
        document.addEventListener('click', handleTingkatClickOutside)
    }
})

onUnmounted(() => {
    if (observer) observer.disconnect()
    clearTimeout(searchTimeout)
    if (process.client) {
        document.removeEventListener('click', handleJurusanClickOutside)
        document.removeEventListener('click', handleTingkatClickOutside)
    }
})
</script>

<style scoped>
.jurusan-scroll::-webkit-scrollbar,
.tingkat-scroll::-webkit-scrollbar {
    width: 4px;
}

.jurusan-scroll::-webkit-scrollbar-track,
.tingkat-scroll::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px 0;
}

.jurusan-scroll::-webkit-scrollbar-thumb,
.tingkat-scroll::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 99px;
}

.jurusan-scroll::-webkit-scrollbar-thumb:hover,
.tingkat-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
}

.jurusan-scroll,
.tingkat-scroll {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
}
</style>