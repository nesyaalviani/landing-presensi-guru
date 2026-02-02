<template>
    <section class="bg-gray-50">
        <div class="w-full">
            <div class="bg-white rounded-sm border border-gray-200">
                <div class="p-6 sm:p-8">
                    <form @submit.prevent="handleSubmit" class="space-y-6">
                        <!-- Nama -->
                        <div>
                            <label for="nama" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Nama <span class="text-red-500">*</span>
                            </label>
                            <input 
                                id="nama" 
                                v-model="formData.nama" 
                                type="text" 
                                placeholder="Contoh: Sya" 
                                required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Masukkan nama lengkap pengguna</p>
                        </div>

                        <!-- Email -->
                        <div>
                            <label for="email" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Username <span class="text-red-500">*</span>
                            </label>
                            <input 
                                id="email" 
                                v-model="formData.email" 
                                type="email"
                                placeholder="Contoh: xiirpl1@smkn.cisarua.sch.id" 
                                required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Email akan digunakan untuk login</p>
                        </div>

                        <!-- Password -->
                        <div>
                            <label for="password" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Password <span class="text-red-500">*</span>
                            </label>
                            <input 
                                id="password" 
                                v-model="formData.password" 
                                type="password" 
                                placeholder="Masukkan password"
                                required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Minimal 8 karakter</p>
                        </div>

                        <hr class="border-gray-200" />

                        <!-- Action Buttons -->
                        <div class="flex items-center justify-end gap-3">
                            <NuxtLink to="/users"
                                class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all">
                                <X class="h-4 w-4" />
                                Batal
                            </NuxtLink>
                            <button type="submit"
                                class="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm hover:shadow-md">
                                <Save class="h-4 w-4" />
                                Simpan User
                            </button>
                        </div>
                    </form>
                </div>

                <div class="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-sm">
                    <div class="flex items-center gap-2 text-xs text-gray-600">
                        <Info class="h-4 w-4 text-blue-500 shrink-0" />
                        <p>
                            <span class="font-medium">Catatan:</span> Pastikan username belum terdaftar sebelumnya dan password cukup kuat untuk keamanan akun.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref } from 'vue'
import { X, Save, Info } from 'lucide-vue-next'

const formData = ref({
    nama: '',
    email: '',
    role: '',
    password: ''
})

const handleSubmit = () => {
    console.log('Form submitted:', formData.value)
}
</script>