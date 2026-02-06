<template>
    <section class="bg-gray-50">
        <div class="w-full">
            <div class="bg-white rounded-sm border border-gray-200">
                <div class="p-6 sm:p-8">
                    <form @submit.prevent="handleSubmit" class="space-y-6">

                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Role <span class="text-red-500">*</span>
                            </label>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div @click="formData.id_role = 1" :class="[
                                    'cursor-pointer border-2 rounded-sm px-4 py-2.5 text-center transition-all',
                                    formData.id_role === 1
                                        ? 'border-blue-500 bg-blue-500 text-white'
                                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                                ]">
                                    <span class="text-sm font-medium">Admin</span>
                                </div>

                                <div @click="formData.id_role = 2" :class="[
                                    'cursor-pointer border-2 rounded-sm px-4 py-2.5 text-center transition-all',
                                    formData.id_role === 2
                                        ? 'border-blue-500 bg-blue-500 text-white'
                                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                                ]">
                                    <span class="text-sm font-medium">KM</span>
                                </div>

                                <div @click="formData.id_role = 3" :class="[
                                    'cursor-pointer border-2 rounded-sm px-4 py-2.5 text-center transition-all',
                                    formData.id_role === 3
                                        ? 'border-blue-500 bg-blue-500 text-white'
                                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                                ]">
                                    <span class="text-sm font-medium">Petugas Piket</span>
                                </div>

                                <div @click="formData.id_role = 4" :class="[
                                    'cursor-pointer border-2 rounded-sm px-4 py-2.5 text-center transition-all',
                                    formData.id_role === 4
                                        ? 'border-blue-500 bg-blue-500 text-white'
                                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                                ]">
                                    <span class="text-sm font-medium">Kepala Sekolah</span>
                                </div>
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih role sesuai dengan tugas pengguna</p>
                        </div>

                        <div v-if="formData.id_role === 2">
                            <label for="kelas" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Kelas <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <select id="kelas" v-model="formData.id_kelas" required
                                    class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all hover:border-gray-400">
                                    <option value="" disabled>Pilih Kelas</option>
                                    <option v-for="kelas in classrooms" :key="kelas.id" :value="kelas.id">
                                        {{ kelas.name }} - {{ kelas.jurusan }}
                                    </option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">KM wajib memiliki kelas</p>
                        </div>

                        <div>
                            <label for="nama" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Nama <span class="text-red-500">*</span>
                            </label>
                            <input id="nama" v-model="formData.name" type="text" placeholder="Contoh: Piket" required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Masukkan nama lengkap pengguna</p>
                        </div>

                        <div>
                            <label for="username"
                                class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Username <span class="text-red-500">*</span>
                            </label>
                            <input id="username" v-model="formData.username" type="text" placeholder="Contoh: piket"
                                required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Username akan digunakan untuk login</p>
                        </div>

                        <div>
                            <label for="password"
                                class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Password <span class="text-red-500">*</span>
                            </label>
                            <input id="password" v-model="formData.password" type="password"
                                placeholder="Masukkan password" required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Minimal 8 karakter</p>
                        </div>

                        <hr class="border-gray-200" />

                        <div class="flex items-center justify-end gap-3">
                            <NuxtLink to="/users"
                                class="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all">
                                <X class="h-4 w-4" />
                                Batal
                            </NuxtLink>
                            <button type="submit" :disabled="isSubmitting" :class="[
                                'flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all shadow-sm',
                                isSubmitting
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 hover:shadow-md'
                            ]">
                                <Save class="h-4 w-4" />
                                {{ isSubmitting ? 'Menyimpan...' : 'Simpan User' }}
                            </button>
                        </div>
                    </form>
                </div>

                <div class="px-6 sm:px-8 py-4 bg-gray-50 border-t border-gray-200 rounded-b-sm">
                    <div class="flex items-center gap-2 text-xs text-gray-600">
                        <Info class="h-4 w-4 text-blue-500 shrink-0" />
                        <p>
                            <span class="font-medium">Catatan:</span> Pastikan username belum terdaftar sebelumnya dan
                            password cukup kuat untuk keamanan akun.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '~/stores/users'
import { useClassroomsStore } from '~/stores/classrooms'
import { X, Save, Info, ChevronDown } from 'lucide-vue-next'

const router = useRouter()
const usersStore = useUsersStore()
const classroomsStore = useClassroomsStore()

const formData = ref({
    name: '',
    username: '',
    password: '',
    id_role: null,
    id_kelas: ''
})

const classrooms = ref([])
const isSubmitting = ref(false)

onMounted(async () => {
    const result = await classroomsStore.getClassrooms()
    if (result.success) {
        classrooms.value = classroomsStore.classrooms
    }
})

watch(() => formData.value.id_role, (newRole) => {
    if (newRole !== 2) {
        formData.value.id_kelas = ''
    }
})

const handleSubmit = async () => {
    if (!formData.value.id_role) {
        alert('Silakan pilih role pengguna')
        return
    }

    if (formData.value.id_role === 2 && !formData.value.id_kelas) {
        alert('KM wajib memilih kelas')
        return
    }

    if (formData.value.password.length < 8) {
        alert('Password minimal 8 karakter')
        return
    }

    isSubmitting.value = true

    try {
        const userData = {
            name: formData.value.name,
            username: formData.value.username,
            password: formData.value.password,
            id_role: formData.value.id_role,
            id_kelas: formData.value.id_role === 2 ? formData.value.id_kelas : null
        }

        const result = await usersStore.createUser(userData)

        if (result.success) {
            alert('User berhasil ditambahkan!')
            router.push('/users')
        } else {
            alert(result.message || 'Gagal menambahkan user')
        }
    } catch (error) {
        console.error('Error:', error)
        alert('Terjadi kesalahan saat menambahkan user')
    } finally {
        isSubmitting.value = false
    }
}
</script>