<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-sm border border-gray-200">
        <div class="mx-auto max-w-7xl">
            <div class="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div class="relative w-full sm:w-56">
                        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" v-model="searchQuery" placeholder="Cari berdasarkan nama/username..."
                            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-500 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>
                    <div class="relative w-full sm:w-44">
                        <select v-model="selectedRole"
                            class="w-full pl-3 pr-8 py-2 text-sm border border-gray-500 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white text-gray-700">
                            <option value="">Semua Role</option>
                            <option value="admin">Admin</option>
                            <option value="km">KM</option>
                            <option value="piket">Petugas Piket</option>
                            <option value="ks">Kepala Sekolah</option>
                        </select>
                        <ChevronDown
                            class="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div class="flex items-center w-full sm:w-auto">
                    <NuxtLink to="/users/create"
                        class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg">
                        <Plus class="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
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
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <template v-if="usersStore.loading">
                                <tr v-for="i in 5" :key="'skeleton-' + i">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="skeleton h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="skeleton h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="skeleton h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="skeleton h-4 w-8 bg-gray-200 rounded animate-pulse"></div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else-if="usersStore.error">
                                <tr>
                                    <td colspan="4" class="px-6 py-12">
                                        <div class="text-center">
                                            <p class="text-sm text-red-600">{{ usersStore.error }}</p>
                                            <button @click="loadUsers"
                                                class="mt-3 px-4 py-2 bg-blue-500 text-white text-sm rounded-sm hover:bg-blue-600">
                                                Coba Lagi
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else-if="filteredUsers.length === 0">
                                <tr>
                                    <td colspan="4" class="px-6 py-12">
                                        <div class="text-center">
                                            <p class="text-sm text-gray-500">Tidak ada data user</p>
                                        </div>
                                    </td>
                                </tr>
                            </template>

                            <template v-else>
                                <tr v-for="user in filteredUsers" :key="user.id"
                                    class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {{ user.name }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ user.username }}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        <span :class="getRoleBadgeClass(user.role_name)"
                                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                                            {{ getRoleLabel(user.role_name) }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {{ user.id_kelas || '-' }}
                                    </td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
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
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUsersStore } from '~/stores/users'
import { Search, ChevronRight, ChevronLeft, Plus, ChevronDown } from 'lucide-vue-next'

const usersStore = useUsersStore()
const searchQuery = ref('')
const selectedRole = ref('')

onMounted(async () => {
    await loadUsers()
})

const loadUsers = async () => {
    await usersStore.getUsers()
}

const filteredUsers = computed(() => {
    let users = usersStore.users

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        users = users.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.username.toLowerCase().includes(query)
        )
    }

    if (selectedRole.value) {
        users = users.filter(user => user.role_name === selectedRole.value)
    }

    return users
})

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
        'admin': 'Admin',
        'km': 'KM',
        'piket': 'Petugas Piket',
        'ks': 'Kepala Sekolah'
    }
    return roleLabels[roleName] || roleName
}
</script>