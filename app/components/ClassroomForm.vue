<template>
    <section class="bg-gray-50">
        <div class="w-full">
            <div class="bg-white rounded-sm border border-gray-200">
                <div class="p-6 sm:p-8">
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Grid 2 Kolom -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- Kolom Kiri -->
                            <div class="space-y-6">
                                <!-- Nama Kelas -->
                                <div>
                                    <label for="nama-kelas"
                                        class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        Nama Kelas <span class="text-red-500">*</span>
                                    </label>
                                    <input id="nama-kelas" v-model="formData.namaKelas" type="text"
                                        placeholder="Contoh: XII RPL 1" required
                                        class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                                    <p class="mt-1.5 text-xs text-gray-500">Masukkan nama kelas dengan format yang jelas
                                    </p>
                                </div>

                                <!-- Jurusan -->
                                <div>
                                    <label for="jurusan"
                                        class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        Jurusan <span class="text-red-500">*</span>
                                    </label>
                                    <div class="relative">
                                        <select id="jurusan" v-model="formData.jurusan" required
                                            class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all hover:border-gray-400">
                                            <option value="" disabled>Pilih Jurusan</option>
                                            <option value="rpl">Rekayasa Perangkat Lunak</option>
                                            <option value="perhotelan">Perhotelan</option>
                                            <option value="tkj">Teknik Komputer & Jaringan</option>
                                            <option value="mm">Multimedia</option>
                                        </select>
                                        <ChevronDown
                                            class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <!-- Kolom Kanan -->
                            <div class="space-y-6">
                                <!-- Tingkat -->
                                <div>
                                    <label for="tingkat"
                                        class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        Tingkat <span class="text-red-500">*</span>
                                    </label>
                                    <div class="relative">
                                        <select id="tingkat" v-model="formData.tingkat" required
                                            class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all hover:border-gray-400">
                                            <option value="" disabled>Pilih Tingkat</option>
                                            <option value="X">Kelas X</option>
                                            <option value="XI">Kelas XI</option>
                                            <option value="XII">Kelas XII</option>
                                        </select>
                                        <ChevronDown
                                            class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                <!-- Status -->
                                <div>
                                    <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                        Status Kelas <span class="text-red-500">*</span>
                                    </label>
                                    <div class="grid grid-cols-2 gap-3">
                                        <!-- Aktif -->
                                        <label :class="[
                                            'relative flex items-center p-3 border-2 rounded-sm cursor-pointer transition-all',
                                            formData.status === 'aktif'
                                                ? 'border-green-500 bg-green-50'
                                                : 'border-gray-300 bg-white hover:border-gray-400'
                                        ]">
                                            <input type="radio" v-model="formData.status" value="aktif"
                                                class="sr-only" />
                                            <div class="flex items-center gap-2 w-full">
                                                <div :class="[
                                                    'h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                                                    formData.status === 'aktif'
                                                        ? 'border-green-500 bg-green-500'
                                                        : 'border-gray-300'
                                                ]">
                                                    <Check v-if="formData.status === 'aktif'"
                                                        class="h-2.5 w-2.5 text-white" />
                                                </div>
                                                <div class="flex-1">
                                                    <div class="text-sm font-medium text-gray-900">Aktif</div>
                                                    <div class="text-xs text-gray-500">Kelas berjalan</div>
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
                                            <input type="radio" v-model="formData.status" value="nonaktif"
                                                class="sr-only" />
                                            <div class="flex items-center gap-2 w-full">
                                                <div :class="[
                                                    'h-4 w-4 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                                                    formData.status === 'nonaktif'
                                                        ? 'border-red-500 bg-red-500'
                                                        : 'border-gray-300'
                                                ]">
                                                    <Check v-if="formData.status === 'nonaktif'"
                                                        class="h-2.5 w-2.5 text-white" />
                                                </div>
                                                <div class="flex-1">
                                                    <div class="text-sm font-medium text-gray-900">Non-Aktif</div>
                                                    <div class="text-xs text-gray-500">Kelas tutup</div>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr class="border-gray-200" />

                        <!-- Action Buttons -->
                        <div class="flex items-center justify-end gap-3">
                            <NuxtLink to="/classroom"
                                class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all">
                                <X class="h-4 w-4" />
                                Batal
                            </NuxtLink>
                            <button type="submit"
                                class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm hover:shadow-md">
                                <Save class="h-4 w-4" />
                                Simpan Kelas
                            </button>
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
import { ref } from 'vue'
import { ChevronDown, Check, X, Save, Info } from 'lucide-vue-next'

const formData = ref({
    namaKelas: '',
    jurusan: '',
    tingkat: '',
    status: 'aktif'
})

const handleSubmit = () => {
    console.log('Form submitted:', formData.value)
}
</script>