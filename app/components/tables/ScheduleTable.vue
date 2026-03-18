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

                    <div class="relative w-full sm:w-50">
                        <select v-model="jurusanFilter" @change="onFilterChange"
                            class="w-full px-3 py-2 text-sm border border-gray-500 rounded-sm outline-none appearance-none bg-white pr-8">
                            <option :value="null">Semua Jurusan</option>
                            <option v-for="j in jurusanList" :key="j.id" :value="j.id">
                                {{ j.nama_jurusan }}
                            </option>
                        </select>
                        <ChevronDown
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div class="relative w-full sm:w-32">
                        <select v-model="tingkatFilter" @change="onFilterChange"
                            class="w-full px-3 py-2 text-sm border border-gray-500 rounded-sm outline-none appearance-none bg-white pr-8">
                            <option :value="null">Tingkat</option>
                            <option value="X">X</option>
                            <option value="XI">XI</option>
                            <option value="XII">XII</option>
                        </select>
                        <ChevronDown
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
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
import { Search, ChevronRight, ChevronDown, CalendarDays, Upload, Plus } from 'lucide-vue-next'
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

const openImportModal = async () => {
    if (importTeachers.value.length === 0) {
        const r = await teachersStore.getTeachers({ all: true })
        if (r.success) importTeachers.value = teachersStore.teachers
    }
    showImportModal.value = true
}

const validateImportRow = (row) => {
    const validDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']
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

onMounted(async () => {
    isFirstLoad.value = true
    await Promise.all([
        classroomsStore.resetAndFetch(getFilters()),
        classroomsStore.getJurusanList()
    ])
    isFirstLoad.value = false
    setupObserver()
})

onUnmounted(() => {
    if (observer) observer.disconnect()
    clearTimeout(searchTimeout)
})
</script>