<template>
    <section class="bg-gray-50">
        <div class="w-full">
            <div class="bg-white rounded-sm border border-gray-200">
                <div class="p-6 sm:p-8">
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Jam Pelajaran -->
                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Jam Pelajaran <span class="text-red-500">*</span>
                            </label>
                            <div class="grid grid-cols-2 gap-4 rounded-sm">
                                <!-- Jam Mulai -->
                                <div>
                                    <label for="jam-mulai" class="block text-xs font-medium text-gray-600 mb-1.5">
                                        Jam Mulai
                                    </label>
                                    <ClientOnly>
                                        <clock-timepicker id="jam-mulai" v-model="formData.jamMulai" required
                                            placeholder="00:00" class="timepicker-simple">
                                        </clock-timepicker>
                                    </ClientOnly>
                                </div>

                                <!-- Jam Selesai -->
                                <div>
                                    <label for="jam-selesai" class="block text-xs font-medium text-gray-600 mb-1.5">
                                        Jam Selesai
                                    </label>
                                    <ClientOnly>
                                        <clock-timepicker id="jam-selesai" v-model="formData.jamSelesai" required
                                            placeholder="00:00" class="timepicker-simple">
                                        </clock-timepicker>
                                    </ClientOnly>
                                </div>
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih jam mulai dan jam selesai pelajaran</p>
                        </div>

                        <!-- Kelas -->
                        <div>
                            <label for="kelas" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Kelas <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <select id="kelas" v-model="formData.kelas" required
                                    class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all hover:border-gray-400">
                                    <option value="" disabled>Pilih Kelas</option>
                                    <option value="X RPL 1">X RPL 1</option>
                                    <option value="XI MPLB 2">XI MPLB 2</option>
                                    <option value="XII RPL 1">XII RPL 1</option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih kelas yang akan mengikuti pelajaran</p>
                        </div>

                        <!-- Mata Pelajaran -->
                        <div>
                            <label for="mapel" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Mata Pelajaran <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <select id="mapel" v-model="formData.mapel" required
                                    class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all hover:border-gray-400">
                                    <option value="" disabled>Pilih Mata Pelajaran</option>
                                    <option value="Pemrograman Web">Pemrograman Web</option>
                                    <option value="Basis Data">Basis Data</option>
                                    <option value="Matematika">Matematika</option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih mata pelajaran yang akan diajarkan</p>
                        </div>

                        <!-- Guru -->
                        <div>
                            <label for="guru" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Guru <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <select id="guru" v-model="formData.guru" required
                                    class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all hover:border-gray-400">
                                    <option value="" disabled>Pilih Guru</option>
                                    <option value="Pak Indra">Pak Indra</option>
                                    <option value="Bu Siti">Bu Siti</option>
                                    <option value="Pak Budi">Pak Budi</option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih guru pengajar</p>
                        </div>

                        <!-- Hari -->
                        <div>
                            <label for="hari" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Hari <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <select id="hari" v-model="formData.hari" required
                                    class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all hover:border-gray-400">
                                    <option value="" disabled>Pilih Hari</option>
                                    <option value="Senin">Senin</option>
                                    <option value="Selasa">Selasa</option>
                                    <option value="Rabu">Rabu</option>
                                    <option value="Kamis">Kamis</option>
                                    <option value="Jumat">Jumat</option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih hari pelaksanaan</p>
                        </div>

                        <!-- Status -->
                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Status Jadwal <span class="text-red-500">*</span>
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
                                            <div class="text-xs text-gray-500">Jadwal berjalan</div>
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
                                            <Check v-if="formData.status === 'nonaktif'"
                                                class="h-2.5 w-2.5 text-white" />
                                        </div>
                                        <div class="flex-1">
                                            <div class="text-sm font-medium text-gray-900">Non-Aktif</div>
                                            <div class="text-xs text-gray-500">Jadwal ditunda</div>
                                        </div>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <hr class="border-gray-200" />

                        <!-- Action Buttons -->
                        <div class="flex items-center justify-end gap-3">
                            <NuxtLink to="/schedule"
                                class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all">
                                <X class="h-4 w-4" />
                                Batal
                            </NuxtLink>
                            <button type="submit"
                                class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm hover:shadow-md">
                                <Save class="h-4 w-4" />
                                Simpan Jadwal
                            </button>
                        </div>
                    </form>
                </div>

                <div class="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-sm">
                    <div class="flex items-center gap-2 text-xs text-gray-600">
                        <Info class="h-4 w-4 text-blue-500 shrink-0" />
                        <p>
                            <span class="font-medium">Catatan:</span> Pastikan tidak ada jadwal yang bentrok pada hari,
                            jam, dan kelas yang sama.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ChevronDown, Check, X, Save, Info } from 'lucide-vue-next'

// Import hanya di client-side
if (process.client) {
    await import('clock-timepicker')
}

const formData = ref({
    jamMulai: '',
    jamSelesai: '',
    kelas: '',
    mapel: '',
    guru: '',
    hari: '',
    status: 'aktif'
})

const handleSubmit = () => {
    console.log('Form submitted:', formData.value)
}
</script>

<style scoped>
/* Override clock-timepicker styling */
:deep(.timepicker-simple) {
    width: 100%;
}

:deep(.timepicker-simple input) {
    width: 100% !important;
    padding: 0.625rem 1rem !important;
    font-size: 0.875rem !important;
    line-height: 1.25rem !important;
    border: 1px solid rgb(209 213 219) !important;
    border-radius: 4px !important;
    outline: none !important;
    background-color: white !important;
    transition: all 0.15s ease-in-out !important;
}

:deep(.timepicker-simple input:hover) {
    border-color: rgb(156 163 175) !important;
}

:deep(.timepicker-simple input::placeholder) {
    color: rgb(156 163 175) !important;
}
</style>