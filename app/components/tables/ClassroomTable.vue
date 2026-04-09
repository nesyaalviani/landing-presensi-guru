<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-sm border border-gray-200">
        <div class="mx-auto max-w-7xl">
            <div class="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div class="relative w-full sm:w-80">
                        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" v-model="searchQuery" placeholder="Cari berdasarkan nama kelas..."
                            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-500 rounded-sm outline-none"
                            @input="onSearchInput" />
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

                    <!-- Hapus filter -->
                    <button v-if="jurusanFilter || tingkatFilter" type="button" @click="clearAllFilters"
                        class="text-xs text-red-500 hover:text-red-600 whitespace-nowrap flex-shrink-0 transition-colors self-center">
                        Hapus Filter
                    </button>
                </div>

                <div class="flex items-center gap-2 w-full sm:w-auto">
                    <button @click="showImportModal = true"
                        class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-sm bg-white border border-gray-400 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
                        <Upload class="h-4 w-4" />
                        Import
                    </button>
                    <NuxtLink to="/classroom/create"
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
                                    Nama Kelas
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jurusan
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tingkat
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <template v-if="loading">
                                <tr v-for="i in 10" :key="'skeleton-' + i" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-26 sm:w-36 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-27 sm:w-32 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-22 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-7 w-7 bg-gray-200 rounded-md animate-pulse"></div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else-if="error">
                                <tr>
                                    <td colspan="4" class="px-6 py-12">
                                        <div class="text-center">
                                            <p class="text-sm text-red-600">{{ error }}</p>
                                            <button @click="fetchClassrooms"
                                                class="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-sm hover:bg-blue-600">
                                                Coba Lagi
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else-if="classrooms.length === 0">
                                <tr>
                                    <td colspan="4" class="px-6 py-12">
                                        <div class="text-center">
                                            <p class="text-sm text-gray-500">Tidak ada data kelas</p>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else>
                                <tr v-for="classroom in classrooms" :key="classroom.id"
                                    class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ classroom.name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ classroom.nama_jurusan || '-' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ classroom.tingkat }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <button @click="toggleDropdown(classroom.id)"
                                            :ref="el => setButtonRef(el, classroom.id)"
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
                        <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            Previous
                        </button>
                        <button @click="goToPage(currentPage + 1)"
                            :disabled="currentPage === totalPages || totalPages === 0"
                            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                            Next
                        </button>
                    </div>
                    <div class="hidden sm:flex sm:items-center sm:justify-end sm:w-full">
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed">
                                <ChevronLeft class="h-5 w-5" />
                            </button>

                            <template v-for="page in visiblePages" :key="page">
                                <span v-if="page === '...'"
                                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500">
                                    ...
                                </span>
                                <button v-else @click="goToPage(page)" :class="[
                                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                                    page === currentPage
                                        ? 'border-blue-500 bg-blue-50 text-blue-600 z-10'
                                        : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                                ]">
                                    {{ page }}
                                </button>
                            </template>

                            <button @click="goToPage(currentPage + 1)"
                                :disabled="currentPage === totalPages || totalPages === 0"
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
                        <NuxtLink :to="`/classroom/edit/${activeDropdown}`" @click="closeDropdown"
                            class="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            <Pencil class="h-4 w-4 mr-3 text-gray-500" />
                            Edit
                        </NuxtLink>
                        <div class="border-t border-gray-100 my-1"></div>
                        <button @click="handleDelete(getClassroomById(activeDropdown))"
                            class="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                            <Trash2 class="h-4 w-4 mr-3" />
                            Hapus
                        </button>
                    </div>
                </div>
            </Transition>
        </Teleport>

        <AppImportModal v-model="showImportModal" title="Import Data Kelas"
            :required-columns="['name', 'tingkat', 'jurusan']" :preview-columns="['name', 'tingkat', 'jurusan']"
            :import-fn="classroomsStore.importClassroom" @download-template="downloadTemplate" @imported="onImported">
            <template #format-info>
                Kolom yang diperlukan:
                <span class="font-semibold">name</span>,
                <span class="font-semibold">tingkat</span>
                (X / XI / XII),
                <span class="font-semibold">jurusan</span>
                (kode jurusan — contoh: <code class="bg-blue-100 px-1 rounded">RPL</code>)
            </template>
        </AppImportModal>

        <AppConfirm />
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import {
    Search, ChevronRight, ChevronLeft, Plus, Pencil, Trash2,
    ChevronDown, MoreVertical, Check, Upload
} from 'lucide-vue-next'
import { useClassroomsStore } from '~/stores/classrooms'
import { useConfirm } from '~/composables/useConfirm'

const classroomsStore = useClassroomsStore()
const { confirm } = useConfirm()
const { alertType, alertMessage, showAlert, clearAlert } = useAlert()

// ===================== State =====================
const searchQuery = ref('')
const jurusanFilter = ref(null)
const tingkatFilter = ref(null)
const currentPage = ref(1)
const activeDropdown = ref(null)
const dropdownStyle = ref({})
const buttonRefs = ref({})
const showImportModal = ref(false)

let searchTimer = null
let autoCloseTimer = null

const tingkatOptions = ['X', 'XI', 'XII']

// ===================== Computed =====================
const classrooms = computed(() => classroomsStore.classrooms)
const jurusanList = computed(() => classroomsStore.jurusanList)
const loading = computed(() => classroomsStore.loading)
const error = computed(() => classroomsStore.error)
const totalPages = computed(() => classroomsStore.pagination?.totalPages ?? 1)

const visiblePages = computed(() => {
    const total = totalPages.value
    const current = currentPage.value
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

    const pages = []
    if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', total)
    } else if (current >= total - 3) {
        pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total)
    } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total)
    }
    return pages
})

// ===================== Jurusan dropdown =====================
const jurusanDropdownOpen = ref(false)
const jurusanDropdownRef = ref(null)
const selectedJurusanName = ref('')

// ===================== Tingkat dropdown =====================
const tingkatDropdownOpen = ref(false)
const tingkatDropdownRef = ref(null)

// ===================== Fetch =====================
const fetchClassrooms = () => {
    classroomsStore.getClassrooms({
        search: searchQuery.value || undefined,
        tingkat: tingkatFilter.value || undefined,
        id_jurusan: jurusanFilter.value || undefined,
        page: currentPage.value,
        limit: 10
    })
}

const onSearchInput = () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => {
        currentPage.value = 1
        fetchClassrooms()
    }, 400)
}

const onFilterChange = () => {
    currentPage.value = 1
    fetchClassrooms()
}

const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    fetchClassrooms()
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
    jurusanDropdownOpen.value = false
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
    tingkatDropdownOpen.value = false
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
    onFilterChange()
}

// ===================== Action dropdown =====================
const setButtonRef = (el, id) => {
    if (el) buttonRefs.value[id] = el
}

const getClassroomById = (id) => {
    return classrooms.value.find(c => c.id === id)
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
    if (activeDropdown.value === id) { closeDropdown(); return }
    activeDropdown.value = id
    nextTick(() => {
        dropdownStyle.value = calculateDropdownPosition(buttonRefs.value[id])
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
const handleDelete = async (classroom) => {
    if (!classroom) return
    const confirmed = await confirm({
        title: 'Hapus Kelas',
        message: `Apakah Anda yakin ingin menghapus kelas ${classroom.name}? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: 'Hapus',
        cancelText: 'Batal',
        type: 'danger',
    })
    if (!confirmed) return
    closeDropdown()
    const result = await classroomsStore.deleteClassroom(classroom.id)
    if (result.success) {
        showAutoAlert('success', `Kelas ${classroom.name} berhasil dihapus.`)
    } else {
        showAutoAlert('error', result.message || 'Gagal menghapus kelas.')
    }
}

// ===================== Import =====================
const onImported = (result) => {
    showAutoAlert('success', `Berhasil mengimport ${result.total} kelas.`)
}

const downloadTemplate = async () => {
    try {
        const XLSX = await import('xlsx')
        const templateData = [
            { name: 'X RPL 1', tingkat: 'X', jurusan: 'RPL' },
            { name: 'XI TKJ 2', tingkat: 'XI', jurusan: 'TKJ' },
            { name: 'XII MM 1', tingkat: 'XII', jurusan: 'MM' },
        ]
        const worksheet = XLSX.utils.json_to_sheet(templateData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Kelas')
        XLSX.writeFile(workbook, 'template_import_kelas.xlsx')
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
        dropdownStyle.value = calculateDropdownPosition(buttonRefs.value[activeDropdown.value])
    }
}

// ===================== Lifecycle =====================
onMounted(async () => {
    await Promise.all([
        fetchClassrooms(),
        classroomsStore.getJurusanList()
    ])
    if (process.client) {
        document.addEventListener('click', handleClickOutside)
        document.addEventListener('click', handleJurusanClickOutside)
        document.addEventListener('click', handleTingkatClickOutside)
        window.addEventListener('scroll', handleScroll, true)
        window.addEventListener('resize', handleScroll)
    }
})

onUnmounted(() => {
    clearTimeout(searchTimer)
    clearTimeout(autoCloseTimer)
    if (process.client) {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('click', handleJurusanClickOutside)
        document.removeEventListener('click', handleTingkatClickOutside)
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleScroll)
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