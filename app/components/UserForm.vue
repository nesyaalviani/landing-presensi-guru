<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Role - Card Selection -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                    Role <span class="text-red-500">*</span>
                </label>
                <div class="grid grid-cols-3 gap-3">
                    <!-- Admin Card -->
                    <div @click="formData.role = 'admin'" :class="[
                        'cursor-pointer border-2 rounded-sm p-4 text-center transition-all',
                        formData.role === 'admin'
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    ]">
                        <span class="text-sm font-medium">Admin</span>
                    </div>

                    <!-- KM Card -->
                    <div @click="formData.role = 'km'" :class="[
                        'cursor-pointer border-2 rounded-sm p-4 text-center transition-all',
                        formData.role === 'km'
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    ]">
                        <span class="text-sm font-medium">KM</span>
                    </div>

                    <!-- Petugas Piket Card -->
                    <div @click="formData.role = 'petugas_piket'" :class="[
                        'cursor-pointer border-2 rounded-sm p-4 text-center transition-all',
                        formData.role === 'petugas_piket'
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 hover:border-gray-400 text-gray-900'
                    ]">
                        <span class="text-sm font-medium">Petugas Piket</span>
                    </div>
                </div>
            </div>

            <!-- Nama -->
            <div>
                <label for="nama" class="block text-sm font-medium text-gray-700 mb-2">
                    Nama <span class="text-red-500">*</span>
                </label>
                <input id="nama" v-model="formData.nama" type="text" placeholder="Contoh: Sya" required
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>

            <!-- Email -->
            <div>
                <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
                    Email <span class="text-red-500">*</span>
                </label>
                <input id="email" v-model="formData.email" type="email"
                    placeholder="Contoh: xiirpl1@smkn.cisarua.sch.id" required
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
            </div>

            <!-- Password -->
            <div>
                <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
                    Password <span class="text-red-500">*</span>
                </label>
                <input id="password" v-model="formData.password" type="password" placeholder="Masukkan password"
                    required
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
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
                <NuxtLink to="/users"
                    class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    Batal
                </NuxtLink>
                <button type="submit"
                    class="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-blue-500 rounded-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                    <Plus class="h-4 w-4" />
                    Simpan User
                </button>
            </div>
        </form>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronDown, Plus } from 'lucide-vue-next'

const formData = ref({
    nama: '',
    email: '',
    role: '',
    password: '',
    status: 'aktif'
})

const handleSubmit = () => {
    console.log('Form submitted:', formData.value)
}
</script>