<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Nama Kelas -->
            <div>
                <label for="nama-kelas" class="block text-sm font-medium text-gray-700 mb-2">
                    Nama Kelas <span class="text-red-500">*</span>
                </label>
                <input id="nama-kelas" v-model="formData.namaKelas" type="text" placeholder="Contoh: XII RPL 1" required
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>

            <!-- Jurusan -->
            <div>
                <label for="jurusan" class="block text-sm font-medium text-gray-700 mb-2">
                    Jurusan <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <select id="jurusan" v-model="formData.jurusan" required
                        class="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white">
                        <option value="" disabled>Pilih Jurusan</option>
                        <option value="rpl">Rekayasa Perangkat Lunak</option>
                        <option value="perhotelan">Perhotelan</option>
                    </select>
                    <ChevronDown
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <!-- Tingkat -->
            <div>
                <label for="tingkat" class="block text-sm font-medium text-gray-700 mb-2">
                    Tingkat <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <select id="tingkat" v-model="formData.tingkat" required
                        class="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white">
                        <option value="" disabled>Pilih Tingkat</option>
                        <option value="X">X</option>
                        <option value="XI">XI</option>
                        <option value="XII">XII</option>
                    </select>
                    <ChevronDown
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <!-- Status -->
            <div>
                <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                    Status <span class="text-red-500">*</span>
                </label>
                <div class="relative">
                    <select id="status" v-model="formData.status" required
                        class="w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white">
                        <option value="" disabled>Pilih Status</option>
                        <option value="aktif">Aktif</option>
                        <option value="nonaktif">Non-Aktif</option>
                    </select>
                    <ChevronDown
                        class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-end gap-3 pt-4">
                <NuxtLink to="/classroom"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    Batal
                </NuxtLink>
                <button type="submit"
                    class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <Plus class="h-4 w-4" />
                    Simpan Kelas
                </button>
            </div>
        </form>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown, Plus } from 'lucide-vue-next'

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