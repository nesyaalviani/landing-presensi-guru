<template>
    <section class="bg-gray-50">
        <div class="w-full">
            <div class="bg-white rounded-sm border border-gray-200">
                <div class="p-6 sm:p-8">
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <div>
                            <label for="nama_guru" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Nama Guru <span class="text-red-500">*</span>
                            </label>
                            <input 
                                id="nama_guru" 
                                v-model="formData.nama_guru" 
                                type="text" 
                                placeholder="Contoh: Asep Widiana" 
                                required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Masukkan nama lengkap guru</p>
                        </div>

                        <div>
                            <label for="nip" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                NIP <span class="text-red-500">*</span>
                            </label>
                            <input 
                                id="nip" 
                                v-model="formData.nip" 
                                type="text"
                                placeholder="Contoh: 185273770" 
                                required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Nomor Induk Pegawai harus unik</p>
                        </div>

                        <div>
                            <label for="mapel" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Mata Pelajaran <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <button
                                    type="button"
                                    @click="showMapelDropdown = !showMapelDropdown"
                                    class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400 flex items-center justify-between bg-white"
                                >
                                    <span v-if="formData.mapel.length === 0" class="text-gray-500">
                                        Pilih mata pelajaran
                                    </span>
                                    <span v-else class="text-gray-900">
                                        {{ formData.mapel.length }} mata pelajaran dipilih
                                    </span>
                                    <ChevronDown class="h-4 w-4 text-gray-400" />
                                </button>

                                <div 
                                    v-if="showMapelDropdown"
                                    class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-sm shadow-lg max-h-60 overflow-auto"
                                >
                                    <div class="p-2 space-y-1">
                                        <label
                                            v-for="mapel in availableMapels"
                                            :key="mapel.id_mapel"
                                            class="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 rounded cursor-pointer transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                :value="mapel.id_mapel"
                                                v-model="formData.mapel"
                                                class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span class="text-sm text-gray-700">{{ mapel.nama_mapel }}</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div v-if="formData.mapel.length > 0" class="mt-2 flex flex-wrap gap-2">
                                <span
                                    v-for="mapelId in formData.mapel"
                                    :key="mapelId"
                                    class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-sm border border-blue-200"
                                >
                                    {{ getMapelName(mapelId) }}
                                    <button
                                        type="button"
                                        @click="removeMapel(mapelId)"
                                        class="hover:text-blue-900"
                                    >
                                        <X class="h-3 w-3" />
                                    </button>
                                </span>
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih satu atau lebih mata pelajaran yang diampu</p>
                        </div>

                        <hr class="border-gray-200" />

                        <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-sm">
                            <div class="flex items-center gap-2 text-sm text-red-800">
                                <AlertCircle class="h-4 w-4 shrink-0" />
                                <p>{{ errorMessage }}</p>
                            </div>
                        </div>

                        <div class="flex items-center justify-end gap-3">
                            <NuxtLink to="/teachers"
                                class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all">
                                <X class="h-4 w-4" />
                                Batal
                            </NuxtLink>
                            <button 
                                type="submit"
                                :disabled="loading || formData.mapel.length === 0"
                                class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                {{ loading ? 'Menyimpan...' : 'Simpan Guru' }}
                            </button>
                        </div>
                    </form>
                </div>

                <div class="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-sm">
                    <div class="flex items-center gap-2 text-xs text-gray-600">
                        <Info class="h-4 w-4 text-blue-500 shrink-0" />
                        <p>
                            <span class="font-medium">Catatan:</span> Pastikan NIP belum terdaftar dan minimal pilih satu mata pelajaran yang akan diampu.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { X, Save, Info, ChevronDown, AlertCircle } from 'lucide-vue-next'
import { useTeachersStore } from '~/stores/teachers'
import { useRouter } from 'vue-router'

const teachersStore = useTeachersStore()
const router = useRouter()

const formData = ref({
    nama_guru: '',
    nip: '',
    mapel: []
})

const showMapelDropdown = ref(false)
const errorMessage = ref('')
const loading = ref(false)

const availableMapels = computed(() => teachersStore.mapels)

const getMapelName = (mapelId) => {
    const mapel = availableMapels.value.find(m => m.id_mapel === mapelId)
    return mapel ? mapel.nama_mapel : ''
}

const removeMapel = (mapelId) => {
    formData.value.mapel = formData.value.mapel.filter(id => id !== mapelId)
}

const handleSubmit = async () => {
    errorMessage.value = ''
    
    if (!formData.value.nama_guru || !formData.value.nip) {
        errorMessage.value = 'Semua field wajib diisi.'
        return
    }

    if (formData.value.mapel.length === 0) {
        errorMessage.value = 'Pilih minimal satu mata pelajaran.'
        return
    }

    loading.value = true

    console.log('Data yang akan dikirim:', {
        nama_guru: formData.value.nama_guru,
        nip: formData.value.nip,
        mapel: formData.value.mapel
    })

    const result = await teachersStore.createTeacher({
        nama_guru: formData.value.nama_guru,
        nip: formData.value.nip,
        mapel: formData.value.mapel
    })

    loading.value = false

    if (result.success) {
        router.push('/teacher')
    } else {
        errorMessage.value = result.message
    }
}

onMounted(async () => {
    await teachersStore.getMapels()
})

if (process.client) {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.relative')) {
            showMapelDropdown.value = false
        }
    })
}
</script>