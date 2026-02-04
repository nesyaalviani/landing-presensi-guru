<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-sm border border-gray-200">
        <div class="mx-auto max-w-7xl">
            <div class="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div class="relative w-full sm:w-56">
                    <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input 
                        type="text" 
                        v-model="searchQuery"
                        placeholder="Cari mata pelajaran..."
                        class="w-full pl-9 pr-3 py-2 text-sm border border-gray-500 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                </div>
                <div class="flex items-center w-full sm:w-auto">
                    <NuxtLink
                        to="/subjects/create"
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
                                    Kode
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama
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
                            <tr v-if="filteredSubjects.length === 0">
                                <td colspan="4" class="px-6 py-12 text-center text-sm text-gray-500">
                                    <div class="flex flex-col items-center gap-2">
                                        <Search class="h-12 w-12 text-gray-300" />
                                        <p class="font-medium">Tidak ada data mata pelajaran</p>
                                        <p class="text-xs">{{ searchQuery ? 'Tidak ada mata pelajaran yang sesuai dengan pencarian' : 'Mulai dengan menambahkan mata pelajaran baru' }}</p>
                                    </div>
                                </td>
                            </tr>

                            <tr 
                                v-for="subject in filteredSubjects" 
                                :key="subject.id_mapel"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    <span v-if="subject.kode_mapel" class="font-medium">{{ subject.kode_mapel }}</span>
                                    <span v-else class="text-gray-400 italic text-xs">Tidak ada kode</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {{ subject.nama_mapel }}
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span v-if="subject.status"
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Aktif
                                    </span>
                                    <span v-else
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                        Non-Aktif
                                    </span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-2">
                                        <NuxtLink
                                            :to="`/subjects/edit/${subject.id_mapel}`"
                                            class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Edit">
                                            <Pencil class="h-4 w-4" />
                                        </NuxtLink>
                                        <button 
                                            @click="handleDelete(subject)"
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

            <!-- Pagination (Optional) -->
            <!-- <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
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
                    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p class="text-sm text-gray-700">
                                Menampilkan <span class="font-medium">{{ filteredSubjects.length }}</span> dari <span class="font-medium">{{ subjects.length }}</span> data
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
                                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    2
                                </button>
                                <button
                                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    3
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
import { Search, ChevronRight, ChevronLeft, Plus, Pencil, Trash2, AlertCircle } from 'lucide-vue-next'
import { useSubjectsStore } from '~/stores/subjects'

const subjectsStore = useSubjectsStore()

const searchQuery = ref('')

const subjects = computed(() => subjectsStore.subjects)
const loading = computed(() => subjectsStore.loading)
const error = computed(() => subjectsStore.error)

const filteredSubjects = computed(() => {
    return subjectsStore.searchSubjects(searchQuery.value)
})

const handleDelete = async (subject) => {
    if (confirm(`Apakah Anda yakin ingin menghapus mata pelajaran "${subject.nama_mapel}"?`)) {
        const result = await subjectsStore.deleteSubject(subject.id_mapel)
        
        if (result.success) {
            alert('Mata pelajaran berhasil dihapus!')
        } else {
            alert(result.message)
        }
    }
}

onMounted(async () => {
    await subjectsStore.getSubjects()
})
</script>