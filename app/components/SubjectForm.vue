<template>
    <section class="bg-gray-50">
        <div class="w-full">
            <div class="bg-white rounded-sm border border-gray-200">
                <div class="p-6 sm:p-8">
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Kode Mata Pelajaran -->
                        <div>
                            <label for="kode" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Kode Mata Pelajaran <span class="text-red-500">*</span>
                            </label>
                            <input 
                                id="kode" 
                                v-model="formData.kode" 
                                type="text" 
                                placeholder="Contoh: PW" 
                                required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Masukkan kode mata pelajaran (maksimal 5 karakter)</p>
                        </div>

                        <!-- Nama Mata Pelajaran -->
                        <div>
                            <label for="nama" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Nama Mata Pelajaran <span class="text-red-500">*</span>
                            </label>
                            <input 
                                id="nama" 
                                v-model="formData.nama" 
                                type="text" 
                                placeholder="Contoh: Pemrograman Web" 
                                required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Masukkan nama lengkap mata pelajaran</p>
                        </div>

                        <!-- Status -->
                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Status Mata Pelajaran <span class="text-red-500">*</span>
                            </label>
                            <div class="grid grid-cols-2 gap-3">
                                <!-- Aktif -->
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

                                <!-- Non-Aktif -->
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

                        <!-- Action Buttons -->
                        <div class="flex items-center justify-end gap-3">
                            <NuxtLink to="/subjects"
                                class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all">
                                <X class="h-4 w-4" />
                                Batal
                            </NuxtLink>
                            <button type="submit"
                                class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm hover:shadow-md">
                                <Save class="h-4 w-4" />
                                Simpan Mata Pelajaran
                            </button>
                        </div>
                    </form>
                </div>

                <div class="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-sm">
                    <div class="flex items-center gap-2 text-xs text-gray-600">
                        <Info class="h-4 w-4 text-blue-500 shrink-0" />
                        <p>
                            <span class="font-medium">Catatan:</span> Pastikan kode dan nama mata pelajaran sudah sesuai dengan kurikulum yang berlaku.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown, Check, X, Save, Info } from 'lucide-vue-next'

const formData = ref({
    kode: '',
    nama: '',
    status: 'aktif'
})

const handleSubmit = () => {
    console.log('Form submitted:', formData.value)
}
</script>