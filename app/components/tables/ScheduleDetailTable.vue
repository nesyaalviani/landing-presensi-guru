<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-sm border border-gray-200">
        <div class="mx-auto max-w-7xl">

            <!-- Back + Header -->
            <div class="mb-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                <div class="flex items-center gap-3">
                    <NuxtLink to="/schedule"
                        class="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-sm transition-colors">
                        <ArrowLeft class="h-5 w-5" />
                    </NuxtLink>
                    <div>
                        <div v-if="loadingClass" class="space-y-1">
                            <div class="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                            <div class="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <template v-else>
                            <h1 class="text-lg font-semibold text-gray-900">{{ kelasName }}</h1>
                            <p class="text-sm text-gray-500">{{ kelasMeta }}</p>
                        </template>
                    </div>
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                    <button @click="openImportModal"
                        class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-sm bg-white border border-gray-400 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <Upload class="h-4 w-4" />
                        Import
                    </button>
                    <NuxtLink :to="`/schedule/create?kelasId=${kelasId}`"
                        class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-600 transition-all shadow-md">
                        <Plus class="h-4 w-4" />
                        Tambah
                    </NuxtLink>
                </div>
            </div>

            <!-- Filter Hari -->
            <div class="mb-4 flex gap-2 flex-wrap">
                <button v-for="h in hariOptions" :key="String(h.value)" @click="onHariChange(h.value)" :class="[
                    'px-3 py-1.5 text-xs font-medium rounded-sm border transition-all',
                    selectedDay === h.value
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white border-gray-300 text-gray-600 hover:border-gray-400'
                ]">
                    {{ h.label }}
                </button>
            </div>

            <div class="mb-3">
                <AppAlert :type="alertType" :message="alertMessage" :on-close="clearAlert" />
            </div>

            <!-- Table -->
            <div class="bg-white shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-100">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hari</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jam</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mapel</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Guru</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <template v-if="loading">
                                <tr v-for="i in 6" :key="'sk-' + i" class="hover:bg-gray-50">
                                    <td class="px-6 py-4">
                                        <div class="h-5 w-16 bg-gray-200 rounded animate-pulse">
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="h-5 w-28 bg-gray-200 rounded animate-pulse">
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="h-5 w-36 bg-gray-200 rounded animate-pulse">
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="h-5 w-28 bg-gray-200 rounded animate-pulse">
                                        </div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="h-7 w-7 bg-gray-200 rounded-md animate-pulse">
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else-if="schedules.length === 0">
                                <tr>
                                    <td colspan="5" class="px-6 py-12 text-center text-sm text-gray-500">
                                        {{ selectedDay ? `Tidak ada jadwal untuk hari ${selectedDay}` : 'Belum ada jadwal terdaftar' }}
                                    </td>
                                </tr>
                            </template>

                            <template v-else>
                                <tr v-for="schedule in schedules" :key="schedule.id_jadwal"
                                    class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ schedule.hari }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ formatTime(schedule.jam_mulai) }} – {{ formatTime(schedule.jam_selesai) }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ schedule.guru?.mapel?.nama_mapel || '-' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ schedule.guru?.nama_guru || '-' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <button @click="toggleDropdown(schedule.id_jadwal)"
                                            :ref="el => setButtonRef(el, schedule.id_jadwal)"
                                            class="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                                            <MoreVertical class="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination -->
            <div v-if="totalPages > 1" class="py-3 border-t border-gray-200 sm:px-6">
                <div class="hidden sm:flex sm:items-center sm:justify-between">
                    <p class="text-sm text-gray-700">
                        Halaman <span class="font-medium">{{ page }}</span> dari
                        <span class="font-medium">{{ totalPages }}</span>
                    </p>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                        <button @click="goToPage(page - 1)" :disabled="page <= 1 || loading"
                            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            <ChevronLeft class="h-5 w-5" />
                        </button>
                        <button v-for="p in visiblePages" :key="p" @click="goToPage(p)" :disabled="loading" :class="[
                            'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                            p === page ? 'border-blue-500 bg-blue-50 text-blue-600 z-10' : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        ]">{{ p }}</button>
                        <button @click="goToPage(page + 1)" :disabled="page >= totalPages || loading"
                            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            <ChevronRight class="h-5 w-5" />
                        </button>
                    </nav>
                </div>
            </div>
        </div>

        <!-- Dropdown -->
        <Teleport to="body">
            <Transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <div v-if="activeDropdown !== null" :style="dropdownStyle"
                    class="fixed w-48 rounded-sm shadow-lg bg-white ring-1 ring-gray-200 z-50">
                    <div class="py-1">
                        <NuxtLink :to="`/schedule/edit/${activeDropdown}`" @click="closeDropdown"
                            class="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            <Pencil class="h-4 w-4 mr-3 text-gray-500" />
                            Edit
                        </NuxtLink>
                        <div class="border-t border-gray-100 my-1"></div>
                        <button @click="handleDelete(getScheduleById(activeDropdown))"
                            class="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 class="h-4 w-4 mr-3" />
                            Hapus
                        </button>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <AppImportModal v-model="showImportModal" title="Import Data Jadwal"
            :required-columns="['hari', 'kelas', 'mapel', 'guru', 'jam_mulai', 'jam_selesai']"
            :preview-columns="['hari', 'kelas', 'mapel', 'guru', 'jam_mulai', 'jam_selesai']"
            :import-fn="schedulesStore.importSchedule" :validate-row="validateImportRow"
            @download-template="downloadTemplate" @imported="onImported">
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
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ArrowLeft, Plus, Upload, ChevronLeft, ChevronRight, MoreVertical, Pencil, Trash2 } from 'lucide-vue-next'
import { useSchedulesStore } from '~/stores/schedules'
import { useTeachersStore } from '~/stores/teachers'
import { useConfirm } from '~/composables/useConfirm'

const route = useRoute()
const kelasId = computed(() => route.params.id)

const schedulesStore = useSchedulesStore()
const teachersStore = useTeachersStore()
const { confirm } = useConfirm()
const { alertType, alertMessage, showAlert, clearAlert } = useAlert()

const loading = ref(true)
const loadingClass = ref(true)
const selectedDay = ref(null)
const page = ref(1)
const totalPages = ref(1)
const activeDropdown = ref(null)
const dropdownStyle = ref({})
const buttonRefs = ref({})
const showImportModal = ref(false)
const importTeachers = ref([])

const kelasName = ref('')
const kelasMeta = ref('')

const hariOptions = [
    { value: null, label: 'Semua' },
    { value: 'Senin', label: 'Senin' },
    { value: 'Selasa', label: 'Selasa' },
    { value: 'Rabu', label: 'Rabu' },
    { value: 'Kamis', label: 'Kamis' },
    { value: 'Jumat', label: 'Jumat' },
    { value: 'Sabtu', label: 'Sabtu' },
]

const schedules = computed(() => schedulesStore.schedules)

const visiblePages = computed(() => {
    const pages = []
    for (let i = Math.max(1, page.value - 2); i <= Math.min(totalPages.value, page.value + 2); i++) pages.push(i)
    return pages
})

const fetchSchedules = async () => {
    loading.value = true
    await schedulesStore.getSchedules({
        id_kelas: kelasId.value,
        hari: selectedDay.value || undefined,
        all: true
    })
    loading.value = false
}

const onHariChange = (hari) => {
    selectedDay.value = hari
    fetchSchedules(1)
}

const goToPage = (p) => {
    if (p < 1 || p > totalPages.value || p === page.value) return
    fetchSchedules(p)
}

const formatTime = (t) => t ? t.substring(0, 5) : '-'
const setButtonRef = (el, id) => { if (el) buttonRefs.value[id] = el }
const getScheduleById = (id) => schedules.value.find(s => s.id_jadwal === id)

const calculateDropdownPosition = (el) => {
    if (!el) return {}
    const rect = el.getBoundingClientRect()
    const w = 192, h = 120
    let top = rect.bottom + 8, left = rect.right - w
    if (top + h > window.innerHeight) top = rect.top - h - 8
    if (left < 8) left = 8
    return { top: `${top}px`, left: `${left}px` }
}

const toggleDropdown = (id) => {
    if (activeDropdown.value === id) { closeDropdown(); return }
    activeDropdown.value = id
    nextTick(() => { dropdownStyle.value = calculateDropdownPosition(buttonRefs.value[id]) })
}

const closeDropdown = () => { activeDropdown.value = null; dropdownStyle.value = {} }

const handleDelete = async (schedule) => {
    if (!schedule) return
    const info = `${schedule.hari}, ${formatTime(schedule.jam_mulai)} – ${formatTime(schedule.jam_selesai)}`
    const confirmed = await confirm({
        title: 'Hapus Jadwal',
        message: `Apakah Anda yakin ingin menghapus jadwal "${info}"?`,
        confirmText: 'Hapus', cancelText: 'Batal', type: 'danger'
    })
    if (!confirmed) return
    closeDropdown()
    const result = await schedulesStore.deleteSchedule(schedule.id_jadwal)
    if (result.success) {
        showAlert('success', 'Jadwal berhasil dihapus.')
        fetchSchedules(page.value)
    } else {
        showAlert('error', result.message || 'Gagal menghapus jadwal.')
    }
}

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
    return null
}

const onImported = (result) => {
    if (result.total > 0) {
        showAlert('success', `Berhasil mengimport ${result.total} data jadwal.`)
        fetchSchedules(1)
    } else {
        showAlert('error', 'Tidak ada data yang berhasil diimport.')
    }
}

const downloadTemplate = async () => {
    const XLSX = await import('xlsx')
    const data = [{ hari: 'Senin', kelas: '10A', mapel: 'Matematika', guru: 'Budi', jam_mulai: '07:00', jam_selesai: '08:30' }]
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Template')
    XLSX.writeFile(wb, 'template_import_jadwal.xlsx')
}

const handleClickOutside = (e) => {
    const isDropdown = e.target.closest('.fixed.w-48')
    const isButton = Object.values(buttonRefs.value).some(btn => btn?.contains(e.target))
    if (!isDropdown && !isButton) closeDropdown()
}

onMounted(async () => {
    loadingClass.value = true

    // Fetch detail kelas langsung by ID, tidak perlu load semua kelas
    const config = useRuntimeConfig()
    try {
        let token = null
        if (process.client) token = localStorage.getItem('token')
        const kelas = await $fetch(`/kelas/${kelasId.value}`, {
            baseURL: config.public.apiBase,
            headers: { ...(token && { Authorization: `Bearer ${token}` }) }
        })
        kelasName.value = kelas.name
        kelasMeta.value = [kelas.tingkat, kelas.nama_jurusan].filter(Boolean).join(' · ')
    } catch (e) {
        kelasName.value = 'Kelas'
    }
    loadingClass.value = false

    await fetchSchedules(1)

    if (process.client) {
        document.addEventListener('click', handleClickOutside)
    }
})

onUnmounted(() => {
    if (process.client) document.removeEventListener('click', handleClickOutside)
})
</script>