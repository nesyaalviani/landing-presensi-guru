<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-sm border border-gray-200">
        <div class="mx-auto max-w-7xl">

            <div class="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

                    <div class="relative w-full sm:w-80">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" v-model="searchQuery" placeholder="Cari berdasarkan nama guru..."
                            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-500 rounded-sm outline-none"
                            @input="onSearchInput" />
                    </div>

                    <div class="relative w-full sm:w-50">
                        <select v-model="selectedMapel"
                            class="w-full px-3 py-2 text-sm border border-gray-500 rounded-sm outline-none appearance-none bg-white pr-8"
                            @change="onFilterChange">
                            <option :value="null">Semua Mata Pelajaran</option>
                            <option v-for="mapel in mapels" :key="mapel.id_mapel" :value="mapel.id_mapel">
                                {{ mapel.nama_mapel }}
                            </option>
                        </select>
                        <ChevronDown
                            class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div class="flex items-center w-full sm:w-auto">
                    <NuxtLink to="/teacher/create"
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
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Guru</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    NIP</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mata Pelajaran</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">

                            <template v-if="loading">
                                <tr v-for="i in 10" :key="'skeleton-' + i" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-24 bg-gray-200 rounded-full animate-pulse"></div>
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
                                            <button @click="fetchTeachers()"
                                                class="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-sm hover:bg-blue-600">
                                                Coba Lagi
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else-if="teachers.length === 0">
                                <tr>
                                    <td colspan="4" class="px-6 py-12">
                                        <div class="text-center">
                                            <p class="text-sm text-gray-500">Tidak ada data guru</p>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else>
                                <tr v-for="teacher in teachers" :key="teacher.id_guru" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ teacher.nama_guru }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ teacher.nip || '-' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <div class="flex flex-wrap gap-1">
                                            <span v-for="mapel in teacher.mapel" :key="mapel.id_mapel"
                                                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {{ mapel.nama_mapel }}
                                            </span>
                                            <span v-if="!teacher.mapel || teacher.mapel.length === 0"
                                                class="text-gray-400 text-xs italic">-</span>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <button @click="toggleDropdown(teacher.id_guru)"
                                            :ref="el => setButtonRef(el, teacher.id_guru)"
                                            class="p-1.5 text-gray-600 hover:bg-gray-100 rounded-md"
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

        <Teleport to="body">
            <div v-if="activeDropdown !== null" :style="dropdownStyle"
                class="fixed w-48 rounded-sm shadow-lg bg-white ring-1 ring-gray-200 z-50">
                <div class="py-1">
                    <NuxtLink :to="`/teacher/edit/${activeDropdown}`" @click="closeDropdown"
                        class="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100">
                        <Pencil class="h-4 w-4 mr-3 text-gray-500" />
                        Edit
                    </NuxtLink>
                    <div class="border-t border-gray-100 my-1"></div>
                    <button @click="handleDelete(getTeacherById(activeDropdown))"
                        class="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                        <Trash2 class="h-4 w-4 mr-3" />
                        Hapus
                    </button>
                </div>
            </div>
        </Teleport>

        <AppConfirm />
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Search, ChevronRight, ChevronLeft, Plus, Pencil, Trash2, ChevronDown, MoreVertical } from 'lucide-vue-next'
import { useTeachersStore } from '~/stores/teachers'
import { useConfirm } from '~/composables/useConfirm'

const teachersStore = useTeachersStore()
const { confirm } = useConfirm()
const { alertType, alertMessage, showAlert, clearAlert } = useAlert()

const searchQuery = ref('')
const selectedMapel = ref(null)
const activeDropdown = ref(null)
const dropdownStyle = ref({})
const buttonRefs = ref({})

let searchTimer = null
let autoCloseTimer = null

const teachers = computed(() => teachersStore.teachers)
const mapels = computed(() => teachersStore.mapels)
const loading = computed(() => teachersStore.loading)
const error = computed(() => teachersStore.error)
const page = computed(() => teachersStore.page)
const totalPages = computed(() => teachersStore.totalPages)

const visiblePages = computed(() => {
    const total = totalPages.value
    const current = page.value
    const maxVisible = 3

    let start = Math.max(1, current - 1)
    let end = Math.min(total, start + maxVisible - 1)
    if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1)

    const pages = []
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
})

const fetchTeachers = async (p = 1) => {
    await teachersStore.getTeachers({
        search: searchQuery.value || undefined,
        id_mapel: selectedMapel.value || undefined,
        sort: 'desc',
        page: p
    })
}

const onSearchInput = () => {
    clearTimeout(searchTimer)
    searchTimer = setTimeout(() => fetchTeachers(1), 400)
}

const onFilterChange = () => fetchTeachers(1)

const goToPage = (p) => {
    if (p < 1 || p > totalPages.value) return
    fetchTeachers(p)
}

const getTeacherById = (id) => teachers.value.find(t => t.id_guru === id)

const setButtonRef = (el, id) => {
    if (el) buttonRefs.value[id] = el
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

const showAutoAlert = (type, message) => {
    clearTimeout(autoCloseTimer)
    showAlert(type, message)
    autoCloseTimer = setTimeout(() => clearAlert(), 1000)
}

const handleDelete = async (teacher) => {
    if (!teacher) return

    const confirmed = await confirm({
        title: 'Hapus Guru',
        message: `Apakah Anda yakin ingin menghapus guru ${teacher.nama_guru}? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: 'Hapus',
        cancelText: 'Batal',
        type: 'danger',
    })

    if (!confirmed) return

    closeDropdown()

    const result = await teachersStore.deleteTeacher(teacher.id_guru)

    if (result.success) {
        showAutoAlert('success', `Guru ${teacher.nama_guru} berhasil dihapus.`)
    } else {
        showAutoAlert('error', result.message || 'Gagal menghapus guru.')
    }
}

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

onMounted(async () => {
    await Promise.all([fetchTeachers(1), teachersStore.getMapels()])
    if (process.client) {
        document.addEventListener('click', handleClickOutside)
        window.addEventListener('scroll', handleScroll, true)
        window.addEventListener('resize', handleScroll)
    }
})

onUnmounted(() => {
    clearTimeout(searchTimer)
    clearTimeout(autoCloseTimer)
    if (process.client) {
        document.removeEventListener('click', handleClickOutside)
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleScroll)
    }
})
</script>