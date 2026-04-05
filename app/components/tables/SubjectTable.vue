<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-sm border border-gray-200">
        <div class="mx-auto max-w-7xl">
            <div class="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div class="relative w-full sm:w-80">
                        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" v-model="searchQuery" placeholder="Cari berdasarkan nama/kode..."
                            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-500 rounded-sm outline-none" />
                    </div>

                    <!-- Dropdown Status -->
                    <div class="flex items-center gap-3 w-full sm:w-auto" ref="statusDropdownRef">
                        <div class="relative w-full sm:w-50">
                            <div class="flex items-center border rounded-sm bg-white overflow-hidden transition-colors"
                                :class="statusDropdownOpen ? 'border-blue-400' : 'border-gray-500'">
                                <input type="text" readonly :placeholder="selectedStatusName || 'Semua Status'" :class="[
                                    'flex-1 min-w-0 pl-3 pr-2 py-2 text-sm outline-none bg-transparent cursor-pointer',
                                    selectedStatus ? 'text-gray-900 placeholder-gray-900' : 'text-gray-400 placeholder-gray-400'
                                ]" @click.stop="toggleStatusDropdown" />
                                <button type="button" @click.stop="toggleStatusDropdown"
                                    class="px-2 py-2 text-gray-400 hover:text-gray-500 flex-shrink-0 transition-colors">
                                    <ChevronDown class="h-3.5 w-3.5 transition-transform duration-200"
                                        :class="{ 'rotate-180': statusDropdownOpen }" />
                                </button>
                            </div>

                            <Transition enter-active-class="transition duration-100 ease-out"
                                enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                                leave-active-class="transition duration-75 ease-in"
                                leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
                                <div v-if="statusDropdownOpen"
                                    class="absolute z-[10] mt-1 w-full bg-white border border-gray-200 rounded-sm shadow-lg">
                                    <ul class="status-scroll max-h-48 overflow-y-auto py-1">
                                        <li v-for="s in statusOptions" :key="s.value"
                                            @mousedown.prevent="selectStatus(s)"
                                            class="px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2"
                                            :class="selectedStatus === s.value
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'">
                                            <span class="flex-1">{{ s.label }}</span>
                                            <Check v-if="selectedStatus === s.value"
                                                class="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                                        </li>
                                    </ul>
                                </div>
                            </Transition>
                        </div>

                        <button v-if="selectedStatus" type="button" @mousedown.prevent="clearStatusFilter"
                            class="text-xs text-red-500 hover:text-red-600 whitespace-nowrap flex-shrink-0 transition-colors">
                            Hapus Filter
                        </button>
                    </div>
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                    <button @click="showImportModal = true"
                        class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-sm bg-white border border-gray-400 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <Upload class="h-4 w-4" />
                        Import
                    </button>
                    <NuxtLink to="/subjects/create"
                        class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 hover:bg-blue-600 transition-all shadow-md">
                        <Plus class="h-4 w-4" />
                        Tambah
                    </NuxtLink>
                </div>
            </div>

            <div class="mb-3">
                <AppAlert :type="alertType" :message="alertMessage" :on-close="clearAlert" />
            </div>

            <div class="bg-white shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-100">
                            <tr>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kode
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Mata Pelajaran
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Guru Pengampu
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <template v-if="loading">
                                <tr v-for="i in perPage" :key="'skeleton-' + i" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-48 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex gap-1">
                                            <div class="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                                            <div class="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-7 w-7 bg-gray-200 rounded-md animate-pulse"></div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else-if="error">
                                <tr>
                                    <td colspan="5" class="px-6 py-12">
                                        <div class="text-center">
                                            <p class="text-sm text-red-600">{{ error }}</p>
                                            <button @click="fetchSubjects()"
                                                class="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-sm hover:bg-blue-600">
                                                Coba Lagi
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else-if="subjects.length === 0">
                                <tr>
                                    <td colspan="5" class="px-6 py-12">
                                        <div class="text-center">
                                            <p class="text-sm text-gray-500">Tidak ada data mata pelajaran</p>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else>
                                <tr v-for="subject in subjects" :key="subject.id_mapel"
                                    class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ subject.kode_mapel || '-' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ subject.nama_mapel }}
                                    </td>

                                    <!-- Kolom Guru Pengampu -->
                                    <td class="px-6 py-4 text-sm text-gray-600">
                                        <div class="flex flex-wrap gap-1 items-center">
                                            <template v-if="subject.guru_list && subject.guru_list.length > 0">

                                                <!-- Badge individual maks 2, masing-masing punya tooltip -->
                                                <div v-for="guru in subject.guru_list.slice(0, 2)" :key="guru.id_guru"
                                                    class="relative group">
                                                    <span
                                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 whitespace-nowrap cursor-default">
                                                        {{ guru.nama_guru }}
                                                    </span>
                                                    <div
                                                        class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50 pointer-events-none">
                                                        <div
                                                            class="bg-gray-800 text-white text-xs rounded-md px-3 py-1.5 whitespace-nowrap">
                                                            {{ guru.nama_guru }}
                                                        </div>
                                                        <div class="w-2 h-2 bg-gray-800 rotate-45 mx-auto -mt-1"></div>
                                                    </div>
                                                </div>

                                                <!-- Chip +N dengan tooltip list, muncul kalau guru lebih dari 2 -->
                                                <div v-if="subject.guru_list.length > 2" class="relative group">
                                                    <span
                                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 cursor-default select-none">
                                                        +{{ subject.guru_list.length - 2 }} lainnya
                                                    </span>
                                                    <div
                                                        class="absolute bottom-full left-0 mb-2 hidden group-hover:block z-50 pointer-events-none">
                                                        <div
                                                            class="bg-gray-800 text-white text-xs rounded-md px-3 py-2 min-w-max">
                                                            <p v-for="g in subject.guru_list.slice(2)" :key="g.id_guru"
                                                                class="py-0.5 whitespace-nowrap">
                                                                {{ g.nama_guru }}
                                                            </p>
                                                        </div>
                                                        <div class="w-2 h-2 bg-gray-800 rotate-45 ml-3 -mt-1"></div>
                                                    </div>
                                                </div>

                                            </template>
                                            <span v-else class="text-gray-400 text-xs italic">-</span>
                                        </div>
                                    </td>

                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <span v-if="subject.status"
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Aktif
                                        </span>
                                        <span v-else
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                            Non-Aktif
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <button @click="toggleDropdown(subject.id_mapel)"
                                            :ref="el => setButtonRef(el, subject.id_mapel)"
                                            class="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                                            title="More actions">
                                            <MoreVertical class="h-4 w-4" />
                                        </button>
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="bg-white py-3 border-t border-gray-200 sm:px-6">
                <div class="flex items-center justify-between">
                    <div class="flex-1 flex justify-between sm:hidden">
                        <button @click="goToPage(page - 1)" :disabled="page <= 1 || loading"
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            Previous
                        </button>
                        <button @click="goToPage(page + 1)" :disabled="page >= totalPages || loading"
                            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            Next
                        </button>
                    </div>
                    <div class="hidden sm:flex sm:items-center sm:justify-end sm:w-full">
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button @click="goToPage(page - 1)" :disabled="page <= 1 || loading"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                                <ChevronLeft class="h-5 w-5" />
                            </button>
                            <button v-for="p in visiblePages" :key="p" @click="goToPage(p)" :disabled="loading" :class="[
                                'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                                p === page
                                    ? 'border-blue-500 bg-blue-50 text-blue-600 z-10'
                                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                            ]">
                                {{ p }}
                            </button>
                            <button @click="goToPage(page + 1)" :disabled="page >= totalPages || loading"
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                                <ChevronRight class="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        </div>

        <!-- Action dropdown (teleport) -->
        <Teleport to="body">
            <Transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <div v-if="activeDropdown !== null" :style="dropdownStyle"
                    class="fixed w-48 rounded-sm shadow-lg bg-white ring-1 ring-gray-200 ring-opacity-5 z-50">
                    <div class="py-1">
                        <NuxtLink :to="`/subjects/edit/${activeDropdown}`" @click="closeDropdown"
                            class="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            <Pencil class="h-4 w-4 mr-3 text-gray-500" />
                            Edit
                        </NuxtLink>
                        <div class="border-t border-gray-100 my-1"></div>
                        <button @click="handleDelete(getSubjectById(activeDropdown))"
                            class="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 class="h-4 w-4 mr-3" />
                            Hapus
                        </button>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <AppImportModal v-model="showImportModal" title="Import Data Mata Pelajaran"
            :required-columns="['nama_mapel', 'kode_mapel']" :preview-columns="['nama_mapel', 'kode_mapel', 'status']"
            :import-fn="subjectsStore.importSubject" @download-template="downloadTemplate" @imported="onImported">
            <template #format-info>
                Kolom yang diperlukan:
                <span class="font-semibold">nama_mapel</span>,
                <span class="font-semibold">kode_mapel</span>,
                <span class="font-semibold">status</span>
                (aktif / nonaktif, opsional — default aktif)
            </template>
        </AppImportModal>

        <AppConfirm />
    </section>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import {
    Search, ChevronRight, ChevronLeft, Plus, Pencil, Trash2,
    ChevronDown, MoreVertical, Check, Upload
} from 'lucide-vue-next'
import { useSubjectsStore } from '~/stores/subjects'
import { useConfirm } from '~/composables/useConfirm'

const subjectsStore = useSubjectsStore()
const { confirm } = useConfirm()
const { alertType, alertMessage, showAlert, clearAlert } = useAlert()

// ===================== State =====================
const searchQuery = ref('')
const selectedStatus = ref(null)
const selectedStatusName = ref('')
const statusDropdownOpen = ref(false)
const statusDropdownRef = ref(null)
const activeDropdown = ref(null)
const dropdownStyle = ref({})
const buttonRefs = ref({})
const showImportModal = ref(false)

let autoCloseTimer = null
let searchTimeout = null

const statusOptions = [
    { value: 'aktif', label: 'Aktif' },
    { value: 'nonaktif', label: 'Non-Aktif' },
]

// ===================== Computed =====================
const subjects = computed(() => subjectsStore.subjects)
const loading = computed(() => subjectsStore.loading)
const error = computed(() => subjectsStore.error)
const page = computed(() => subjectsStore.page)
const perPage = computed(() => subjectsStore.perPage)
const totalPages = computed(() => subjectsStore.totalPages)

const visiblePages = computed(() => {
    const pages = []
    const range = 2
    const start = Math.max(1, page.value - range)
    const end = Math.min(totalPages.value, page.value + range)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
})

// ===================== Fetch =====================
const fetchSubjects = (newPage = 1) => {
    const filters = { page: newPage }
    if (searchQuery.value) filters.search = searchQuery.value
    if (selectedStatus.value) filters.status = selectedStatus.value
    subjectsStore.getSubjects(filters)
}

const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages.value || loading.value) return
    fetchSubjects(newPage)
}

// ===================== Watchers =====================
watch(searchQuery, () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => fetchSubjects(1), 400)
})

watch(selectedStatus, () => {
    fetchSubjects(1)
})

// ===================== Status dropdown =====================
const toggleStatusDropdown = () => {
    statusDropdownOpen.value = !statusDropdownOpen.value
}

const selectStatus = (s) => {
    selectedStatus.value = s.value
    selectedStatusName.value = s.label
    statusDropdownOpen.value = false
}

const clearStatusFilter = () => {
    selectedStatus.value = null
    selectedStatusName.value = ''
    statusDropdownOpen.value = false
}

const handleStatusClickOutside = (event) => {
    if (statusDropdownRef.value && !statusDropdownRef.value.contains(event.target)) {
        statusDropdownOpen.value = false
    }
}

// ===================== Action dropdown =====================
const setButtonRef = (el, id) => {
    if (el) buttonRefs.value[id] = el
}

const getSubjectById = (id) => {
    return subjects.value.find(s => s.id_mapel === id)
}

const calculateDropdownPosition = (buttonEl) => {
    if (!buttonEl) return {}
    const rect = buttonEl.getBoundingClientRect()
    const dropdownWidth = 192
    const dropdownHeight = 120
    let top = rect.bottom + 8
    let left = rect.right - dropdownWidth
    if (top + dropdownHeight > window.innerHeight) top = rect.top - dropdownHeight - 8
    if (left < 8) left = 8
    if (left + dropdownWidth > window.innerWidth - 8) left = window.innerWidth - dropdownWidth - 8
    return { top: `${top}px`, left: `${left}px` }
}

const toggleDropdown = (id) => {
    if (activeDropdown.value === id) {
        closeDropdown()
        return
    }
    activeDropdown.value = id
    nextTick(() => {
        const buttonEl = buttonRefs.value[id]
        dropdownStyle.value = calculateDropdownPosition(buttonEl)
    })
}

const closeDropdown = () => {
    activeDropdown.value = null
    dropdownStyle.value = {}
}

// ===================== Alert =====================
const showAutoAlert = (type, message) => {
    clearTimeout(autoCloseTimer)
    showAlert(type, message)
    autoCloseTimer = setTimeout(() => clearAlert(), 3000)
}

// ===================== Delete =====================
const handleDelete = async (subject) => {
    if (!subject) return
    const confirmed = await confirm({
        title: 'Hapus Mata Pelajaran',
        message: `Apakah Anda yakin ingin menghapus mata pelajaran "${subject.nama_mapel}"? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: 'Hapus',
        cancelText: 'Batal',
        type: 'danger',
    })
    if (!confirmed) return
    closeDropdown()
    const result = await subjectsStore.deleteSubject(subject.id_mapel)
    if (result.success) {
        showAutoAlert('success', `Mata Pelajaran ${subject.nama_mapel} berhasil dihapus.`)
    } else {
        showAutoAlert('error', result.message || 'Gagal menghapus mata pelajaran.')
    }
}

// ===================== Import =====================
const onImported = (result) => {
    showAutoAlert('success', `Berhasil mengimport ${result.total} mata pelajaran.`)
}

const downloadTemplate = async () => {
    try {
        const XLSX = await import('xlsx')
        const templateData = [
            { nama_mapel: 'Matematika', kode_mapel: 'MTK', status: 'aktif' },
            { nama_mapel: 'Bahasa Indonesia', kode_mapel: 'BIND', status: 'aktif' },
            { nama_mapel: 'Fisika', kode_mapel: 'FIS', status: 'nonaktif' },
        ]
        const worksheet = XLSX.utils.json_to_sheet(templateData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Mapel')
        XLSX.writeFile(workbook, 'template_import_mapel.xlsx')
    } catch (e) {
        console.error('Gagal membuat template:', e)
    }
}

// ===================== Click outside & scroll =====================
const handleClickOutside = (event) => {
    const isDropdown = event.target.closest('.fixed.w-48')
    const isButton = Object.values(buttonRefs.value).some(btn => btn?.contains(event.target))
    if (!isDropdown && !isButton) closeDropdown()
}

const handleScroll = () => {
    if (activeDropdown.value !== null) {
        const buttonEl = buttonRefs.value[activeDropdown.value]
        dropdownStyle.value = calculateDropdownPosition(buttonEl)
    }
}

// ===================== Lifecycle =====================
onMounted(async () => {
    await fetchSubjects(1)
    if (process.client) {
        document.addEventListener('click', handleClickOutside)
        document.addEventListener('click', handleStatusClickOutside)
        window.addEventListener('scroll', handleScroll, true)
        window.addEventListener('resize', handleScroll)
    }
})

onUnmounted(() => {
    clearTimeout(searchTimeout)
    clearTimeout(autoCloseTimer)
    if (process.client) {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('click', handleStatusClickOutside)
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleScroll)
    }
})
</script>

<style scoped>
.status-scroll::-webkit-scrollbar {
    width: 4px;
}

.status-scroll::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px 0;
}

.status-scroll::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 99px;
}

.status-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
}

.status-scroll {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
}
</style>