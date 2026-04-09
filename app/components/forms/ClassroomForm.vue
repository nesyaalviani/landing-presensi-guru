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
                        <AppAlert :type="alertType" :message="alertMessage" :redirect-delay="alertRedirectDelay"
                            :on-close="clearAlert" :on-redirect="alertRedirectFn" />

                        <!-- Nama Kelas -->
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

                        <!-- Tingkat -->
                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Tingkat <span class="text-red-500">*</span>
                            </label>
                            <div class="relative" ref="tingkatDropdownRef">
                                <div class="flex items-center border rounded-sm bg-white overflow-hidden transition-colors"
                                    :class="tingkatDropdownOpen ? 'border-blue-400' : 'border-gray-300 hover:border-gray-400'">
                                    <input type="text" readonly
                                        :placeholder="formData.tingkat ? `${formData.tingkat}` : 'Pilih Tingkat'"
                                        :class="[
                                            'flex-1 min-w-0 pl-4 pr-2 py-2.5 text-sm outline-none bg-transparent cursor-pointer',
                                            formData.tingkat ? 'text-gray-900 placeholder-gray-900' : 'text-gray-400 placeholder-gray-400'
                                        ]" @click.stop="toggleTingkatDropdown" />
                                    <button type="button" @click.stop="toggleTingkatDropdown"
                                        class="px-3 py-2 text-gray-400 hover:text-gray-500 flex-shrink-0 transition-colors">
                                        <ChevronDown class="h-4 w-4 transition-transform duration-200"
                                            :class="{ 'rotate-180': tingkatDropdownOpen }" />
                                    </button>
                                </div>

                                <Transition enter-active-class="transition duration-100 ease-out"
                                    enter-from-class="opacity-0 -translate-y-1"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition duration-75 ease-in"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-1">
                                    <div v-if="tingkatDropdownOpen"
                                        class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-sm shadow-lg">
                                        <ul class="dropdown-scroll max-h-48 overflow-y-auto py-1">
                                            <li v-for="t in tingkatOptions" :key="t"
                                                @mousedown.prevent="selectTingkat(t)"
                                                class="px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2"
                                                :class="formData.tingkat === t
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'">
                                                <span class="flex-1">{{ t }}</span>
                                                <Check v-if="formData.tingkat === t"
                                                    class="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                                            </li>
                                        </ul>
                                    </div>
                                </Transition>
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih tingkat kelas</p>
                        </div>

                        <!-- Jurusan -->
                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Jurusan <span class="text-red-500">*</span>
                            </label>
                            <div class="relative" ref="jurusanDropdownRef">
                                <div class="flex items-center border rounded-sm bg-white overflow-hidden transition-colors"
                                    :class="jurusanDropdownOpen ? 'border-blue-400' : 'border-gray-300 hover:border-gray-400'">
                                    <input type="text" readonly :placeholder="selectedJurusanName || 'Pilih Jurusan'"
                                        :class="[
                                            'flex-1 min-w-0 pl-4 pr-2 py-2.5 text-sm outline-none bg-transparent cursor-pointer',
                                            formData.id_jurusan ? 'text-gray-900 placeholder-gray-900' : 'text-gray-400 placeholder-gray-400'
                                        ]" @click.stop="toggleJurusanDropdown" />
                                    <button type="button" @click.stop="toggleJurusanDropdown"
                                        class="px-3 py-2 text-gray-400 hover:text-gray-500 flex-shrink-0 transition-colors">
                                        <ChevronDown class="h-4 w-4 transition-transform duration-200"
                                            :class="{ 'rotate-180': jurusanDropdownOpen }" />
                                    </button>
                                </div>

                                <Transition enter-active-class="transition duration-100 ease-out"
                                    enter-from-class="opacity-0 -translate-y-1"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition duration-75 ease-in"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-1">
                                    <div v-if="jurusanDropdownOpen"
                                        class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-sm shadow-lg">
                                        <ul class="dropdown-scroll max-h-48 overflow-y-auto py-1">
                                            <li v-for="j in jurusanList" :key="j.id"
                                                @mousedown.prevent="selectJurusan(j)"
                                                class="px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2"
                                                :class="formData.id_jurusan === j.id
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'">
                                                <span class="flex-1">{{ j.nama_jurusan }}</span>
                                                <Check v-if="formData.id_jurusan === j.id"
                                                    class="h-3.5 w-3.5 text-blue-500 flex-shrink-0" />
                                            </li>
                                        </ul>
                                    </div>
                                </Transition>
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih jurusan kelas</p>
                        </div>

                        <hr class="border-gray-200" />

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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { X, Save, Info, ChevronDown, Check } from 'lucide-vue-next'
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

const loading = ref(false)

const {
    alertType,
    alertMessage,
    alertRedirectDelay,
    alertRedirectFn,
    showAlert,
    clearAlert,
    watchInputClearError
} = useAlert()

watchInputClearError(formData)

// ===================== Tingkat dropdown =====================
const tingkatOptions = ['X', 'XI', 'XII']
const tingkatDropdownOpen = ref(false)
const tingkatDropdownRef = ref(null)

const toggleTingkatDropdown = () => {
    tingkatDropdownOpen.value = !tingkatDropdownOpen.value
    if (tingkatDropdownOpen.value) jurusanDropdownOpen.value = false
}

const selectTingkat = (t) => {
    formData.value.tingkat = t
    tingkatDropdownOpen.value = false
}

const handleTingkatClickOutside = (event) => {
    if (tingkatDropdownRef.value && !tingkatDropdownRef.value.contains(event.target)) {
        tingkatDropdownOpen.value = false
    }
}

// ===================== Jurusan dropdown =====================
const jurusanDropdownOpen = ref(false)
const jurusanDropdownRef = ref(null)
const selectedJurusanName = ref('')

const toggleJurusanDropdown = () => {
    jurusanDropdownOpen.value = !jurusanDropdownOpen.value
    if (jurusanDropdownOpen.value) tingkatDropdownOpen.value = false
}

const selectJurusan = (j) => {
    formData.value.id_jurusan = j.id
    selectedJurusanName.value = j.nama_jurusan
    jurusanDropdownOpen.value = false
}

const handleJurusanClickOutside = (event) => {
    if (jurusanDropdownRef.value && !jurusanDropdownRef.value.contains(event.target)) {
        jurusanDropdownOpen.value = false
    }
}

// ===================== Load data =====================
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
        const matched = classroomsStore.jurusanList.find(j => j.id === classroom.id_jurusan)
        if (matched) selectedJurusanName.value = matched.nama_jurusan
    } else {
        showAlert('error', 'Gagal memuat data kelas')
    }
}

const handleSubmit = async () => {
    clearAlert()

    if (!formData.value.name || !formData.value.tingkat || !formData.value.id_jurusan) {
        showAlert('error', 'Semua field wajib diisi.')
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
        showAlert('success', isEditMode.value ? 'Kelas berhasil diupdate!' : 'Kelas berhasil ditambahkan!',
            {
                redirectDelay: 1500,
                redirectFn: () => router.push('/classroom')
            })
    } else {
        showAlert('error', result.message)
    }
}

// ===================== Lifecycle =====================
onMounted(async () => {
    await Promise.all([
        classroomsStore.getJurusanList(),
        loadClassroomData()
    ])

    if (process.client) {
        document.addEventListener('click', handleJurusanClickOutside)
        document.addEventListener('click', handleTingkatClickOutside)
    }
})

onUnmounted(() => {
    if (process.client) {
        document.removeEventListener('click', handleJurusanClickOutside)
        document.removeEventListener('click', handleTingkatClickOutside)
    }
})
</script>

<style scoped>
.dropdown-scroll::-webkit-scrollbar {
    width: 4px;
}

.dropdown-scroll::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px 0;
}

.dropdown-scroll::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 99px;
}

.dropdown-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
}

.dropdown-scroll {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
}
</style>