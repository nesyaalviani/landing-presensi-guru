<template>
    <section class="bg-gray-50">
        <div class="w-full">
            <div class="bg-white rounded-sm border border-gray-200">
                <div class="p-6 sm:p-8">
                    <div v-if="loadingData && isEditMode" class="space-y-6">
                        <div>
                            <div class="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-64 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <div>
                            <div class="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-56 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <div>
                            <div class="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="grid grid-cols-2 gap-3">
                                <div class="h-20 bg-gray-200 rounded-sm animate-pulse"></div>
                                <div class="h-20 bg-gray-200 rounded-sm animate-pulse"></div>
                            </div>
                        </div>

                        <hr class="border-gray-200" />

                        <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
                            <div class="h-10 w-full sm:w-32 bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-10 w-full sm:w-32 bg-gray-200 rounded-sm animate-pulse"></div>
                        </div>
                    </div>

                    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
                        <div>
                            <label for="kode" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Kode Mata Pelajaran <span class="text-red-500">*</span>
                            </label>
                            <input id="kode" v-model="formData.kode" type="text" placeholder="Contoh: PW" maxlength="5"
                                required @input="formData.kode = formData.kode.toUpperCase()"
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400 uppercase" />
                            <p class="mt-1.5 text-xs text-gray-500">Maksimal 5 karakter, otomatis uppercase</p>
                        </div>

                        <div>
                            <label for="nama" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Nama Mata Pelajaran <span class="text-red-500">*</span>
                            </label>
                            <input id="nama" v-model="formData.nama" type="text" placeholder="Contoh: Pemrograman Web"
                                required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Masukkan nama lengkap mata pelajaran</p>
                        </div>

                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Status Mata Pelajaran <span class="text-red-500">*</span>
                            </label>
                            <div class="grid grid-cols-2 gap-3">
                                <label :class="[
                                    'relative flex items-center p-3 border-2 rounded-sm cursor-pointer transition-all',
                                    formData.status === 'aktif'
                                        ? 'border-green-500 bg-green-50'
                                        : 'border-gray-300 bg-white hover:border-gray-400'
                                ]">
                                    <input type="radio" v-model="formData.status" value="aktif" class="sr-only" />
                                    <div class="flex items-center gap-2 w-full">
                                        <div :class="[
                                            'h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                                            formData.status === 'aktif'
                                                ? 'border-green-500 bg-green-500'
                                                : 'border-gray-300'
                                        ]">
                                            <Check v-if="formData.status === 'aktif'" class="h-2.5 w-2.5 text-white" />
                                        </div>
                                        <div class="flex-1">
                                            <div class="text-sm font-medium text-gray-900">Aktif</div>
                                            <div class="text-xs text-gray-500">Mata pelajaran aktif</div>
                                        </div>
                                    </div>
                                </label>

                                <label :class="[
                                    'relative flex items-center p-3 border-2 rounded-sm cursor-pointer transition-all',
                                    formData.status === 'nonaktif'
                                        ? 'border-red-500 bg-red-50'
                                        : 'border-gray-300 bg-white hover:border-gray-400'
                                ]">
                                    <input type="radio" v-model="formData.status" value="nonaktif" class="sr-only" />
                                    <div class="flex items-center gap-2 w-full">
                                        <div :class="[
                                            'h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                                            formData.status === 'nonaktif'
                                                ? 'border-red-500 bg-red-500'
                                                : 'border-gray-300'
                                        ]">
                                            <Check v-if="formData.status === 'nonaktif'" class="h-2.5 w-2.5 text-white" />
                                        </div>
                                        <div class="flex-1">
                                            <div class="text-sm font-medium text-gray-900">Non-Aktif</div>
                                            <div class="text-xs text-gray-500">Mata pelajaran tidak aktif</div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <hr class="border-gray-200" />

                        <div v-if="errorMessage" class="p-4 bg-red-50 border border-red-200 rounded-sm">
                            <div class="flex items-center gap-2 text-sm text-red-800">
                                <AlertCircle class="h-4 w-4 shrink-0" />
                                <p>{{ errorMessage }}</p>
                            </div>
                        </div>

                        <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
                            <button type="submit" :disabled="loading || loadingData"
                                class="order-1 sm:order-2 w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                {{ loading ? (isEditMode ? 'Mengupdate...' : 'Menyimpan...') : (isEditMode ? 'Update Mata Pelajaran' : 'Simpan Mata Pelajaran') }}
                            </button>
                            <NuxtLink to="/subjects"
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
                            <span class="font-medium">Catatan:</span> Pastikan kode dan nama mata pelajaran sudah sesuai
                            dengan kurikulum yang berlaku.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Check, X, Save, Info, AlertCircle } from 'lucide-vue-next'
import { useSubjectsStore } from '~/stores/subjects'
import { useRouter, useRoute } from 'vue-router'

const subjectsStore = useSubjectsStore()
const router = useRouter()
const route = useRoute()

const isEditMode = computed(() => !!route.params.id)
const subjectId = computed(() => route.params.id)

const formData = ref({
    kode: '',
    nama: '',
    status: 'aktif'
})

const errorMessage = ref('')
const loading = ref(false)
const loadingData = ref(false)

const loadSubjectData = async () => {
    if (!isEditMode.value) return

    loadingData.value = true
    const result = await subjectsStore.getSubjectById(subjectId.value)
    loadingData.value = false

    if (result.success && result.data) {
        const subject = result.data
        formData.value = {
            kode: subject.kode_mapel || '',
            nama: subject.nama_mapel,
            status: subject.status ? 'aktif' : 'nonaktif'
        }
    } else {
        errorMessage.value = 'Gagal memuat data mata pelajaran'
    }
}

const validateForm = () => {
    if (!formData.value.kode || !formData.value.nama) {
        errorMessage.value = 'Semua field wajib diisi'
        return false
    }

    if (formData.value.kode.trim().length === 0) {
        errorMessage.value = 'Kode mata pelajaran tidak boleh kosong'
        return false
    }

    if (formData.value.kode.length > 5) {
        errorMessage.value = 'Kode mata pelajaran maksimal 5 karakter'
        return false
    }

    if (formData.value.nama.trim().length === 0) {
        errorMessage.value = 'Nama mata pelajaran tidak boleh kosong'
        return false
    }

    return true
}

const handleSubmit = async () => {
    errorMessage.value = ''

    if (!validateForm()) {
        return
    }

    loading.value = true

    const statusBoolean = formData.value.status === 'aktif'

    const payload = {
        nama_mapel: formData.value.nama.trim(),
        kode_mapel: formData.value.kode.trim().toUpperCase(),
        status: statusBoolean
    }

    let result
    if (isEditMode.value) {
        result = await subjectsStore.updateSubject(subjectId.value, payload)
    } else {
        result = await subjectsStore.createSubject(payload)
    }

    loading.value = false

    if (result.success) {
        router.push('/subjects')
    } else {
        errorMessage.value = result.message
    }
}

onMounted(async () => {
    await loadSubjectData()
})
</script>