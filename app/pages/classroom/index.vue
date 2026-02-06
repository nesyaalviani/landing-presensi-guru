<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-sm border border-gray-200">
        <div class="mx-auto max-w-7xl">
            <div class="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <div class="relative w-full sm:w-56">
                        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" v-model="searchQuery" placeholder="Cari nama kelas..."
                            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-500 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>

                    <div class="relative w-full sm:w-44">
                        <select v-model="jurusanFilter"
                            class="w-full pl-3 pr-8 py-2 text-sm border border-gray-500 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white text-gray-700">
                            <option value="">Semua Jurusan</option>
                            <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
                            <option value="Perhotelan">Perhotelan</option>
                            <option value="Teknik Komputer & Jaringan">Teknik Komputer & Jaringan</option>
                            <option value="Multimedia">Multimedia</option>
                        </select>
                        <ChevronDown
                            class="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <div class="relative w-full sm:w-32">
                        <select v-model="tingkatFilter"
                            class="w-full pl-3 pr-8 py-2 text-sm border border-gray-500 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white text-gray-700">
                            <option value="">Tingkat</option>
                            <option value="X">X</option>
                            <option value="XI">XI</option>
                            <option value="XII">XII</option>
                        </select>
                        <ChevronDown
                            class="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <div class="flex items-center w-full sm:w-auto">
                    <NuxtLink to="/classroom/create"
                        class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg">
                        <Plus class="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                        Tambah
                    </NuxtLink>
                </div>
            </div>

            <div v-if="classroomsStore.loading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>

            <div v-else-if="filteredClassrooms.length === 0" class="text-center py-12">
                <p class="text-gray-500">Tidak ada data kelas ditemukan</p>
            </div>

            <div v-else class="bg-white shadow overflow-hidden rounded-sm">
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
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-2">
                                        <NuxtLink :to="`/classroom/edit/${classroom.id}`"
                                            class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Edit">
                                            <Pencil class="h-4 w-4" />
                                        </NuxtLink>
                                        <button @click="handleDelete(classroom.id)"
                                            class="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            title="Hapus">
                                            <Trash2 class="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div v-if="!classroomsStore.loading && filteredClassrooms.length > 0"
                class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
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
                                Menampilkan <span class="font-medium">{{ filteredClassrooms.length }}</span> kelas
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
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Search, ChevronRight, ChevronLeft, Plus, Pencil, Trash2, ChevronDown } from 'lucide-vue-next'
import { useClassroomsStore } from '~/stores/classrooms'

const classroomsStore = useClassroomsStore()

const searchQuery = ref('')
const jurusanFilter = ref('')
const tingkatFilter = ref('')

onMounted(async () => {
    await classroomsStore.getClassrooms()
})

const filteredClassrooms = computed(() => {
    return classroomsStore.searchClassrooms(
        searchQuery.value,
        tingkatFilter.value,
        jurusanFilter.value
    )
})

const handleDelete = async (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus kelas ini?')) {
        const result = await classroomsStore.deleteClassroom(id)

        if (result.success) {
            alert('Kelas berhasil dihapus!')
            await classroomsStore.getClassrooms()
        } else {
            alert(result.message)
        }
    }
}
</script>