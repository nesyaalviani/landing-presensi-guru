<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-sm border border-gray-200">
        <div class="mx-auto max-w-7xl">
            <div class="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div class="relative w-full sm:w-80">
                        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" v-model="searchQuery" placeholder="Cari berdasarkan nama/username..."
                            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-500 rounded-sm outline-none" />
                    </div>

                    <div class="flex items-center gap-3 w-full sm:w-auto" ref="roleDropdownRef">
                        <div class="relative w-full sm:w-50">
                            <div class="flex items-center border rounded-sm bg-white overflow-hidden transition-colors"
                                :class="roleDropdownOpen ? 'border-blue-400' : 'border-gray-500'">

                                <input type="text" readonly :placeholder="selectedRoleName || 'Semua Role'" :class="[
                                    'flex-1 min-w-0 pl-3 pr-2 py-2 text-sm outline-none bg-transparent cursor-pointer',
                                    selectedRole ? 'text-gray-900 placeholder-gray-900' : 'text-gray-400 placeholder-gray-400'
                                ]" @click.stop="toggleRoleDropdown" />

                                <button type="button" @click.stop="toggleRoleDropdown"
                                    class="px-2 py-2 text-gray-400 hover:text-gray-500 flex-shrink-0 transition-colors">
                                    <ChevronDown class="h-3.5 w-3.5 transition-transform duration-200"
                                        :class="{ 'rotate-180': roleDropdownOpen }" />
                                </button>
                            </div>

                            <Transition enter-active-class="transition duration-100 ease-out"
                                enter-from-class="opacity-0 -translate-y-1" enter-to-class="opacity-100 translate-y-0"
                                leave-active-class="transition duration-75 ease-in"
                                leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 -translate-y-1">
                                <div v-if="roleDropdownOpen"
                                    class="absolute z-[10] mt-1 w-full bg-white border border-gray-200 rounded-sm shadow-lg">
                                    <ul class="py-1">
                                        <li v-for="role in roleOptions" :key="role.value"
                                            @mousedown.prevent="selectRole(role)"
                                            class="px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2"
                                            :class="selectedRole === role.value
                                                ? 'bg-blue-50 text-blue-700 font-medium'
                                                : 'text-gray-700 hover:bg-gray-50'">
                                            <span class="flex-1">{{ role.label }}</span>
                                            <Check v-if="selectedRole === role.value"
                                                class="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                                        </li>
                                    </ul>
                                </div>
                            </Transition>
                        </div>

                        <button v-if="selectedRole" type="button" @mousedown.prevent="clearRoleFilter"
                            class="text-xs text-red-500 hover:text-red-600 whitespace-nowrap flex-shrink-0 transition-colors">
                            Hapus Filter
                        </button>
                    </div>
                </div>

                <div class="flex items-center w-full sm:w-auto">
                    <NuxtLink to="/users/create"
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
                                    Nama
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Username
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kelas
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
                                        <div class="h-5 w-26 sm:w-36 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-27 sm:w-32 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-22 bg-gray-200 rounded-full animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="h-5 w-8 bg-gray-200 rounded animate-pulse"></div>
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
                                            <button @click="fetchUsers()"
                                                class="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-sm hover:bg-blue-600">
                                                Coba Lagi
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else-if="users.length === 0">
                                <tr>
                                    <td colspan="5" class="px-6 py-12">
                                        <div class="text-center">
                                            <p class="text-sm text-gray-500">Tidak ada data user</p>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else>
                                <tr v-for="user in users" :key="user.id" class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ user.name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ user.username }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <span :class="getRoleBadgeClass(user.role?.name)"
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                            {{ getRoleLabel(user.role?.name) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <span v-if="user.kelas">
                                            {{ user.kelas.name }}
                                        </span>
                                        <span v-else class="text-gray-400">-</span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <button @click="toggleDropdown(user.id)" :ref="el => setButtonRef(el, user.id)"
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
                        <NuxtLink :to="`/users/edit/${activeDropdown}`" @click="closeDropdown"
                            class="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                            <Pencil class="h-4 w-4 mr-3 text-gray-500" />
                            Edit
                        </NuxtLink>
                        <div class="border-t border-gray-100 my-1"></div>
                        <button @click="handleDelete(getUserById(activeDropdown))"
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
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { Search, ChevronRight, ChevronLeft, Plus, Pencil, Trash2, ChevronDown, MoreVertical, Check } from 'lucide-vue-next'
import { useUsersStore } from '~/stores/users'
import { useConfirm } from '~/composables/useConfirm'

const usersStore = useUsersStore()
const { confirm } = useConfirm()
const { alertType, alertMessage, showAlert, clearAlert } = useAlert()

const searchQuery = ref('')
const selectedRole = ref(null)
const selectedRoleName = ref('')
const roleDropdownOpen = ref(false)
const roleDropdownRef = ref(null)
const activeDropdown = ref(null)
const dropdownStyle = ref({})
const buttonRefs = ref({})

let autoCloseTimer = null
let searchTimeout = null

const roleOptions = [
    { value: '1', label: 'Admin' },
    { value: '2', label: 'KM' },
    { value: '3', label: 'Petugas Piket' },
    { value: '4', label: 'Kepala Sekolah' },
]

const users = computed(() => usersStore.users)
const loading = computed(() => usersStore.loading)
const error = computed(() => usersStore.error)
const page = computed(() => usersStore.page)
const perPage = computed(() => usersStore.perPage)
const totalPages = computed(() => usersStore.totalPages)

const visiblePages = computed(() => {
    const pages = []
    const range = 2
    const start = Math.max(1, page.value - range)
    const end = Math.min(totalPages.value, page.value + range)
    for (let i = start; i <= end; i++) pages.push(i)
    return pages
})

const fetchUsers = (newPage = 1) => {
    const filters = { page: newPage }
    if (searchQuery.value) filters.search = searchQuery.value
    if (selectedRole.value) filters.id_role = selectedRole.value
    usersStore.getUsers(filters)
}

const goToPage = (newPage) => {
    if (newPage < 1 || newPage > totalPages.value || loading.value) return
    fetchUsers(newPage)
}

watch(searchQuery, () => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => fetchUsers(1), 400)
})

watch(selectedRole, () => {
    fetchUsers(1)
})

const toggleRoleDropdown = () => {
    roleDropdownOpen.value = !roleDropdownOpen.value
}

const selectRole = (role) => {
    selectedRole.value = role.value
    selectedRoleName.value = role.label
    roleDropdownOpen.value = false
}

const clearRoleFilter = () => {
    selectedRole.value = null
    selectedRoleName.value = ''
    roleDropdownOpen.value = false
}

const handleRoleClickOutside = (event) => {
    if (roleDropdownRef.value && !roleDropdownRef.value.contains(event.target)) {
        roleDropdownOpen.value = false
    }
}

const setButtonRef = (el, id) => {
    if (el) buttonRefs.value[id] = el
}

const getUserById = (id) => {
    return users.value.find(u => u.id === id)
}

const getRoleBadgeClass = (roleName) => {
    const roleStyles = {
        'admin': 'bg-purple-100 text-purple-800',
        'km': 'bg-blue-100 text-blue-800',
        'piket': 'bg-green-100 text-green-800',
        'ks': 'bg-yellow-100 text-yellow-800'
    }
    return roleStyles[roleName] || 'bg-gray-100 text-gray-800'
}

const getRoleLabel = (roleName) => {
    const roleLabels = {
        'admin': 'Administrator',
        'km': 'Ketua Murid',
        'piket': 'Petugas Piket',
        'ks': 'Kepala Sekolah'
    }
    return roleLabels[roleName] || roleName
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

const showAutoAlert = (type, message) => {
    clearTimeout(autoCloseTimer)
    showAlert(type, message)
    autoCloseTimer = setTimeout(() => clearAlert(), 1000)
}

const handleDelete = async (user) => {
    if (!user) return
    const confirmed = await confirm({
        title: 'Hapus User',
        message: `Apakah Anda yakin ingin menghapus user "${user.name}"? Tindakan ini tidak dapat dibatalkan.`,
        confirmText: 'Hapus',
        cancelText: 'Batal',
        type: 'danger',
    })
    if (!confirmed) return
    const result = await usersStore.deleteUser(user.id)
    if (result.success) {
        showAutoAlert('success', `User ${user.name} berhasil dihapus.`)
    } else {
        showAutoAlert('error', result.message || 'Gagal menghapus user.')
    }
}

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

onMounted(async () => {
    await fetchUsers(1)
    if (process.client) {
        document.addEventListener('click', handleClickOutside)
        document.addEventListener('click', handleRoleClickOutside)
        window.addEventListener('scroll', handleScroll, true)
        window.addEventListener('resize', handleScroll)
    }
})

onUnmounted(() => {
    clearTimeout(searchTimeout)
    clearTimeout(autoCloseTimer)
    if (process.client) {
        document.removeEventListener('click', handleClickOutside)
        document.removeEventListener('click', handleRoleClickOutside)
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleScroll)
    }
})
</script>