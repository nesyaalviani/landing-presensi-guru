<template>
    <section class="bg-gray-50">
        <div class="w-full">
            <div class="bg-white rounded-sm border border-gray-200">
                <div class="p-6 sm:p-8">
                    <div v-if="loading && isEditMode" class="space-y-6">
                        <div>
                            <div class="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-48 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <div>
                            <div class="h-5 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-56 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <div>
                            <div class="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-64 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <hr class="border-gray-200" />

                        <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
                            <div class="h-10 w-full sm:w-32 bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-10 w-full sm:w-32 bg-gray-200 rounded-sm animate-pulse"></div>
                        </div>
                    </div>

                    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
                        <div>
                            <label for="nama_kelas"
                                class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Nama Kelas <span class="text-red-500">*</span>
                            </label>
                            <input id="nama_kelas" v-model="formData.name" type="text" placeholder="Contoh: XII RPL 1"
                                required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Masukkan nama kelas dengan format yang jelas</p>
                        </div>

                        <div>
                            <label for="tingkat" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Tingkat <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <select id="tingkat" v-model="formData.tingkat" required
                                    class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all hover:border-gray-400">
                                    <option value="" disabled>Pilih Tingkat</option>
                                    <option value="X">Kelas X</option>
                                    <option value="XI">Kelas XI</option>
                                    <option value="XII">Kelas XII</option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih tingkat kelas</p>
                        </div>

                        <div>
                            <label for="jurusan" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Jurusan <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <select id="jurusan" v-model="formData.id_jurusan" required
                                    class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all hover:border-gray-400">
                                    <option value="" disabled>Pilih Jurusan</option>
                                    <option v-for="j in jurusanList" :key="j.id" :value="j.id">
                                        {{ j.nama_jurusan }}
                                    </option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih jurusan kelas</p>
                        </div>

                        <hr class="border-gray-200" />

                        <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-sm">
                            <div class="flex items-center gap-2 text-sm text-red-800">
                                <AlertCircle class="h-4 w-4 shrink-0" />
                                <p>{{ errorMessage }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
                            <button type="submit" :disabled="loading"
                                class="order-1 sm:order-2 w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                {{ loading ? 'Menyimpan...' : (isEditMode ? 'Edit Kelas' : 'Simpan') }}
                            </button>
                            <NuxtLink to="/classroom"
                                class="order-2 sm:order-1 w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none transition-all">
                                <X class="h-4 w-4" />
                                Batal
                            </NuxtLink>
                        </div>
                    </form>
                </div>

                <div class="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-sm">
                    <div class="flex items-center gap-2 text-xs text-gray-600">
                        <Info class="h-4 w-4 text-blue-500 shrink-0" />
                        <p>
                            <span class="font-medium">Catatan:</span> Pastikan semua informasi yang dimasukkan sudah
                            benar sebelum menyimpan. Data yang sudah disimpan dapat diubah melalui menu edit.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { X, Save, Info, ChevronDown, AlertCircle } from 'lucide-vue-next'
import { useClassroomsStore } from '~/stores/classrooms'
import { useRouter, useRoute } from 'vue-router'

const classroomsStore = useClassroomsStore()
const router = useRouter()
const route = useRoute()

const isEditMode = computed(() => !!route.params.id)
const classroomId = computed(() => route.params.id)

const jurusanList = computed(() => classroomsStore.jurusanList)

const formData = ref({
    name: '',
    tingkat: '',
    id_jurusan: ''
})

const errorMessage = ref('')
const loading = ref(false)

const loadClassroomData = async () => {
    if (!isEditMode.value) return

    loading.value = true
    const result = await classroomsStore.getClassroomById(classroomId.value)
    loading.value = false

    if (result.success && result.data) {
        const classroom = result.data
        formData.value = {
            name: classroom.name,
            tingkat: classroom.tingkat,
            id_jurusan: classroom.id_jurusan
        }
    } else {
        errorMessage.value = 'Gagal memuat data kelas'
    }
}

const handleSubmit = async () => {
    errorMessage.value = ''

    if (!formData.value.name || !formData.value.tingkat || !formData.value.id_jurusan) {
        errorMessage.value = 'Semua field wajib diisi.'
        return
    }

    loading.value = true

    const payload = {
        name: formData.value.name,
        tingkat: formData.value.tingkat,
        id_jurusan: formData.value.id_jurusan
    }

    let result
    if (isEditMode.value) {
        result = await classroomsStore.updateClassroom(classroomId.value, payload)
    } else {
        result = await classroomsStore.createClassroom(payload)
    }

    loading.value = false

    if (result.success) {
        router.push('/classroom')
    } else {
        errorMessage.value = result.message
    }
}

onMounted(async () => {
    await Promise.all([
        classroomsStore.getJurusanList(),
        loadClassroomData()
    ])
})
</script>