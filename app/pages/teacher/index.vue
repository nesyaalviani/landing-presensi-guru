<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-sm border border-gray-200">
        <div class="mx-auto max-w-7xl">
            <div class="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div class="relative w-full sm:w-80">
                        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                            type="text" 
                            v-model="searchQuery"
                            placeholder="Cari berdasarkan nama guru..."
                            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-500 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>

                    <div class="relative w-full sm:w-64">
                        <select 
                            v-model="selectedMapel"
                            class="w-full px-3 py-2 text-sm border border-gray-500 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white pr-8">
                            <option :value="null">Semua Mata Pelajaran</option>
                            <option 
                                v-for="mapel in mapels" 
                                :key="mapel.id_mapel" 
                                :value="mapel.id_mapel">
                                {{ mapel.nama_mapel }}
                            </option>
                        </select>
                        <ChevronDown class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div class="flex items-center w-full sm:w-auto">
                    <NuxtLink
                        to="/teacher/create"
                        class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg">
                        <Plus class="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                        Tambah
                    </NuxtLink>
                </div>
            </div>

            <div v-if="loading" class="flex items-center justify-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>

            <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-sm p-4 mb-6">
                <div class="flex items-center gap-2 text-sm text-red-800">
                    <AlertCircle class="h-4 w-4 shrink-0" />
                    <p>{{ error }}</p>
                </div>
            </div>

            <div v-else class="bg-white shadow overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-100">
                            <tr>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Guru
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    NIP
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mata Pelajaran
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-if="filteredTeachers.length === 0">
                                <td colspan="4" class="px-6 py-12 text-center text-sm text-gray-500">
                                    <div class="flex flex-col items-center gap-2">
                                        <Search class="h-12 w-12 text-gray-300" />
                                        <p class="font-medium">Tidak ada data guru</p>
                                        <p class="text-xs">{{ searchQuery || selectedMapel ? 'Tidak ada guru yang sesuai dengan filter' : 'Mulai dengan menambahkan guru baru' }}</p>
                                    </div>
                                </td>
                            </tr>

                            <tr 
                                v-for="teacher in filteredTeachers" 
                                :key="teacher.id_guru || teacher.nip"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {{ teacher.nama_guru }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {{ teacher.nip }}
                                </td>
                                <td class="px-6 py-4 text-sm text-gray-600">
                                    <div class="flex flex-wrap gap-1">
                                        <span 
                                            v-for="mapelId in teacher.mapel" 
                                            :key="mapelId"
                                            class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {{ getMapelName(mapelId) }}
                                        </span>
                                        <span 
                                            v-if="!teacher.mapel || teacher.mapel.length === 0"
                                            class="text-gray-400 text-xs italic">
                                            Tidak ada mapel
                                        </span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-2">
                                        <NuxtLink
                                            :to="`/teacher/edit/${teacher.id_guru || teacher.nip}`"
                                            class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Edit">
                                            <Pencil class="h-4 w-4" />
                                        </NuxtLink>
                                        <button 
                                            @click="handleDelete(teacher)"
                                            class="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                                            title="Delete">
                                            <Trash2 class="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Pagination (Optional - implement jika API support pagination) -->
            <!-- <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div class="flex items-center justify-between">
                    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p class="text-sm text-gray-700">
                                Menampilkan <span class="font-medium">{{ filteredTeachers.length }}</span> dari <span class="font-medium">{{ teachers.length }}</span> data
                            </p>
                        </div>
                        <div>
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
            </div> -->
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, ChevronRight, ChevronLeft, Plus, Pencil, Trash2, ChevronDown, AlertCircle } from 'lucide-vue-next'
import { useTeachersStore } from '~/stores/teachers'

const teachersStore = useTeachersStore()

const searchQuery = ref('')
const selectedMapel = ref(null)

const teachers = computed(() => teachersStore.teachers)
const mapels = computed(() => teachersStore.mapels)
const loading = computed(() => teachersStore.loading)
const error = computed(() => teachersStore.error)

const filteredTeachers = computed(() => {
    return teachersStore.searchTeachers(searchQuery.value, selectedMapel.value)
})

const getMapelName = (mapelId) => {
    const mapel = mapels.value.find(m => m.id_mapel === mapelId)
    return mapel ? mapel.nama_mapel : 'Unknown'
}

const handleDelete = async (teacher) => {
    if (confirm(`Apakah Anda yakin ingin menghapus guru ${teacher.nama_guru}?`)) {
        console.log('Delete teacher:', teacher)
    }
}

// Load data on mount
onMounted(async () => {
    await Promise.all([
        teachersStore.getTeachers(),
        teachersStore.getMapels()
    ])
})
</script>