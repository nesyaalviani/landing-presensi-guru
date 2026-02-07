<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-sm border border-gray-200">
        <div class="mx-auto max-w-7xl">
            <div class="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div class="relative w-full sm:w-80">
                        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" v-model="searchQuery" placeholder="Cari berdasarkan nama kelas..."
                            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-500 rounded-sm outline-none" />
                    </div>

                    <div class="relative w-full sm:w-50">
                        <select v-model="jurusanFilter"
                            class="w-full px-3 py-2 text-sm border border-gray-500 rounded-sm outline-none appearance-none bg-white pr-8">
                            <option value="">Semua Jurusan</option>
                            <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
                            <option value="Perhotelan">Perhotelan</option>
                            <option value="Teknik Komputer & Jaringan">Teknik Komputer & Jaringan</option>
                            <option value="Multimedia">Multimedia</option>
                        </select>
                        <ChevronDown
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div class="relative w-full sm:w-32">
                        <select v-model="tingkatFilter"
                            class="w-full px-3 py-2 text-sm border border-gray-500 rounded-sm outline-none appearance-none bg-white pr-8">
                            <option value="">Tingkat</option>
                            <option value="X">X</option>
                            <option value="XI">XI</option>
                            <option value="XII">XII</option>
                        </select>
                        <ChevronDown
                            class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div class="flex items-center w-full sm:w-auto">
                    <NuxtLink to="/classroom/create"
                        class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 hover:bg-blue-600 transition-all shadow-md">
                        <Plus class="h-4 w-4" />
                        Tambah
                    </NuxtLink>
                </div>
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
                                <tr v-for="i in 5" :key="'skeleton-' + i" class="hover:bg-gray-50">
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
                                            <button @click="classroomsStore.getClassrooms()"
                                                class="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-sm hover:bg-blue-600">
                                                Coba Lagi
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else-if="filteredClassrooms.length === 0">
                                <tr>
                                    <td colspan="4" class="px-6 py-12">
                                        <div class="text-center">
                                            <p class="text-sm text-gray-500">Tidak ada data kelas</p>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else>
                                <tr v-for="classroom in filteredClassrooms" :key="classroom.id"
                                    class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ classroom.name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ classroom.jurusan }}
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
                        <button
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Previous
                        </button>
                        <button
                            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                    <div class="hidden sm:flex sm:items-center sm:justify-end sm:w-full">
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <ChevronLeft class="h-5 w-5" />
                            </button>
                            <button
                                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                                1
                            </button>
                            <button
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
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
                    class="fixed w-48 rounded-lg shadow-lg bg-white ring-1 ring-gray-200 ring-opacity-5 z-50">
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
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { Search, ChevronRight, ChevronLeft, Plus, Pencil, Trash2, ChevronDown, MoreVertical } from 'lucide-vue-next'
import { useClassroomsStore } from '~/stores/classrooms'

const classroomsStore = useClassroomsStore()

const searchQuery = ref('')
const jurusanFilter = ref('')
const tingkatFilter = ref('')
const activeDropdown = ref(null)
const dropdownStyle = ref({})
const buttonRefs = ref({})

const classrooms = computed(() => classroomsStore.classrooms)
const loading = computed(() => classroomsStore.loading)
const error = computed(() => classroomsStore.error)

const filteredClassrooms = computed(() => {
    return classroomsStore.searchClassrooms(
        searchQuery.value,
        tingkatFilter.value,
        jurusanFilter.value
    )
})

const setButtonRef = (el, id) => {
    if (el) {
        buttonRefs.value[id] = el
    }
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

const handleDelete = async (classroom) => {
    if (!classroom) return

    if (confirm(`Apakah Anda yakin ingin menghapus kelas ${classroom.name}?`)) {
        const result = await classroomsStore.deleteClassroom(classroom.id)

        if (result.success) {
            closeDropdown()
            alert('Kelas berhasil dihapus')
        } else {
            alert(result.message || 'Gagal menghapus kelas')
        }
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
    await classroomsStore.getClassrooms()

    if (process.client) {
        document.addEventListener('click', handleClickOutside)
        window.addEventListener('scroll', handleScroll, true)
        window.addEventListener('resize', handleScroll)
    }
})

onUnmounted(() => {
    if (process.client) {
        document.removeEventListener('click', handleClickOutside)
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleScroll)
    }
})
</script>