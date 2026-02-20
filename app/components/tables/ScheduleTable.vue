<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-sm border border-gray-200">
        <div class="mx-auto max-w-7xl">
            <div class="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div class="relative w-full sm:w-44">
                        <select v-model="selectedDay" @change="onFilterChange"
                            class="w-full pl-3 pr-8 py-2 text-sm border border-gray-500 rounded-sm outline-none appearance-none bg-white pr-8">
                            <option :value="null">Semua Hari</option>
                            <option value="Senin">Senin</option>
                            <option value="Selasa">Selasa</option>
                            <option value="Rabu">Rabu</option>
                            <option value="Kamis">Kamis</option>
                            <option value="Jumat">Jumat</option>
                        </select>
                        <ChevronDown
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div class="relative w-full sm:w-44">
                        <select v-model="selectedClass" @change="onFilterChange"
                            class="w-full pl-3 pr-8 py-2 text-sm border border-gray-500 rounded-sm outline-none appearance-none bg-white pr-8">
                            <option :value="null">Semua Kelas</option>
                            <option v-for="kelas in classrooms" :key="kelas.id" :value="kelas.id">
                                {{ kelas.name }}
                            </option>
                        </select>
                        <ChevronDown
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div class="flex items-center w-full sm:w-auto">
                    <NuxtLink to="/schedule/create"
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
                                    Jam
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kelas
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mapel
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Guru
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hari
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <template v-if="loading">
                                <tr v-for="i in 5" :key="'skeleton-' + i" class="hover:bg-gray-50">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-7 w-7 bg-gray-200 rounded-md animate-pulse"></div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else-if="error">
                                <tr>
                                    <td colspan="6" class="px-6 py-12">
                                        <div class="text-center">
                                            <p class="text-sm text-red-600">{{ error }}</p>
                                            <button @click="fetchSchedules()"
                                                class="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-sm hover:bg-blue-600">
                                                Coba Lagi
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else-if="schedules.length === 0">
                                <tr>
                                    <td colspan="6" class="px-6 py-12">
                                        <div class="text-center">
                                            <p class="text-sm text-gray-500">Tidak ada data jadwal</p>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else>
                                <tr v-for="schedule in schedules" :key="schedule.id_jadwal"
                                    class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ formatTime(schedule.jam_mulai) }} – {{ formatTime(schedule.jam_selesai) }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ schedule.nama_kelas || '-' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ schedule.guru?.mapel?.nama_mapel || '-' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ schedule.guru?.nama_guru || '-' }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ schedule.hari }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <button @click="toggleDropdown(schedule.id_jadwal)"
                                            :ref="el => setButtonRef(el, schedule.id_jadwal)"
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

        <Teleport to="body">
            <Transition enter-active-class="transition ease-out duration-100"
                enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                leave-to-class="transform opacity-0 scale-95">
                <div v-if="activeDropdown !== null" :style="dropdownStyle"
                    class="fixed w-48 rounded-sm shadow-lg bg-white ring-1 ring-gray-200 ring-opacity-5 z-50">
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

        <AppConfirm />
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { ChevronRight, ChevronLeft, Plus, Pencil, Trash2, ChevronDown, MoreVertical } from 'lucide-vue-next'
import { useSchedulesStore } from '~/stores/schedules'
import { useClassroomsStore } from '~/stores/classrooms'
import { useConfirm } from '~/composables/useConfirm'

const schedulesStore = useSchedulesStore()
const classroomsStore = useClassroomsStore()
const { confirm } = useConfirm()
const { alertType, alertMessage, showAlert, clearAlert } = useAlert()

const selectedDay = ref(null)
const selectedClass = ref(null)
const activeDropdown = ref(null)
const dropdownStyle = ref({})
const buttonRefs = ref({})

let autoCloseTimer = null

const schedules = computed(() => schedulesStore.schedules)
const classrooms = computed(() => classroomsStore.classrooms)
const loading = computed(() => schedulesStore.loading)
const error = computed(() => schedulesStore.error)
const page = computed(() => schedulesStore.page)
const totalPages = computed(() => schedulesStore.totalPages)

const visiblePages = computed(() => {
    const pages = []
    const total = totalPages.value
    const current = page.value
    const delta = 2

    for (let i = Math.max(1, current - delta); i <= Math.min(total, current + delta); i++) {
        pages.push(i)
    }

    return pages
})

const fetchSchedules = (pageNum = 1) => {
    schedulesStore.getSchedules({
        hari: selectedDay.value || undefined,
        id_kelas: selectedClass.value || undefined,
        page: pageNum,
    })
}

const onFilterChange = () => {
    fetchSchedules(1)
}

const goToPage = (pageNum) => {
    if (pageNum < 1 || pageNum > totalPages.value || pageNum === page.value) return
    fetchSchedules(pageNum)
}

const formatTime = (time) => {
    if (!time) return '-'
    return time.substring(0, 5)
}

const setButtonRef = (el, id) => {
    if (el) {
        buttonRefs.value[id] = el
    }
}

const getScheduleById = (id) => {
    return schedules.value.find(s => s.id_jadwal === id)
}

const calculateDropdownPosition = (buttonEl) => {
    if (!buttonEl) return {}

    const rect = buttonEl.getBoundingClientRect()
    const dropdownWidth = 192
    const dropdownHeight = 120

    let top = rect.bottom + 8
    let left = rect.right - dropdownWidth

    if (top + dropdownHeight > window.innerHeight) {
        top = rect.top - dropdownHeight - 8
    }

    if (left < 8) {
        left = 8
    }

    if (left + dropdownWidth > window.innerWidth - 8) {
        left = window.innerWidth - dropdownWidth - 8
    }

    return {
        top: `${top}px`,
        left: `${left}px`
    }
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

const showAutoAlert = (type, message) => {
    clearTimeout(autoCloseTimer)
    showAlert(type, message)
    autoCloseTimer = setTimeout(() => clearAlert(), 1000)
}

const handleDelete = async (schedule) => {
    if (!schedule) return

    const timeRange = `${formatTime(schedule.jam_mulai)} – ${formatTime(schedule.jam_selesai)}`
    const scheduleInfo = `${schedule.hari}, ${timeRange}, ${schedule.nama_kelas}`

    const confirmed = await confirm({
        title: 'Hapus Jadwal',
        message: `Apakah Anda yakin ingin menghapus jadwal "${scheduleInfo}"? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: 'Hapus',
        cancelText: 'Batal',
        type: 'danger',
    })

    if (!confirmed) return

    closeDropdown()

    const result = await schedulesStore.deleteSchedule(schedule.id_jadwal)

    if (result.success) {
        showAutoAlert('success', `Jadwal ${scheduleInfo} berhasil dihapus.`)
    } else {
        showAutoAlert('error', result.message || 'Gagal menghapus jadwal.')
    }
}

const handleClickOutside = (event) => {
    const isDropdown = event.target.closest('.fixed.w-48')
    const isButton = Object.values(buttonRefs.value).some(btn => btn?.contains(event.target))

    if (!isDropdown && !isButton) {
        closeDropdown()
    }
}

const handleScroll = () => {
    if (activeDropdown.value !== null) {
        const buttonEl = buttonRefs.value[activeDropdown.value]
        dropdownStyle.value = calculateDropdownPosition(buttonEl)
    }
}

onMounted(async () => {
    await Promise.all([
        fetchSchedules(1),
        classroomsStore.getClassrooms()
    ])

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