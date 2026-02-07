<template>
    <section class="bg-gray-50">
        <div class="w-full">
            <div class="bg-white rounded-sm border border-gray-200">
                <div class="p-6 sm:p-8">
                    <div v-if="loadingData && isEditMode" class="space-y-6">
                        <!-- Role Skeleton -->
                        <div>
                            <div class="h-5 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div class="h-10 bg-gray-200 rounded-sm animate-pulse"></div>
                                <div class="h-10 bg-gray-200 rounded-sm animate-pulse"></div>
                                <div class="h-10 bg-gray-200 rounded-sm animate-pulse"></div>
                                <div class="h-10 bg-gray-200 rounded-sm animate-pulse"></div>
                            </div>
                            <div class="h-4 w-56 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <!-- Nama Skeleton -->
                        <div>
                            <div class="h-5 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-48 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <!-- Username Skeleton -->
                        <div>
                            <div class="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-64 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <!-- Password Skeleton -->
                        <div>
                            <div class="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-32 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <hr class="border-gray-200" />

                        <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
                            <div class="h-10 w-full sm:w-32 bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-10 w-full sm:w-32 bg-gray-200 rounded-sm animate-pulse"></div>
                        </div>
                    </div>

                    <form v-else @submit.prevent="handleSubmit" class="space-y-6">
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
                                    class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all hover:border-gray-400">
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
                            <input id="nama" v-model="formData.name" type="text" placeholder="Contoh: John Doe" required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Masukkan nama lengkap pengguna</p>
                        </div>

                        <div>
                            <label for="username"
                                class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Username <span class="text-red-500">*</span>
                            </label>
                            <input id="username" v-model="formData.username" type="text" placeholder="Contoh: johndoe"
                                required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Username harus unik, tanpa spasi, huruf kecil
                                (minimal 3 karakter)</p>
                        </div>

                        <div>
                            <label for="password"
                                class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Password <span v-if="!isEditMode" class="text-red-500">*</span>
                                <span v-else class="text-gray-500 text-xs font-normal">(Kosongkan jika tidak ingin
                                    mengubah)</span>
                            </label>
                            <input id="password" v-model="formData.password" type="password"
                                placeholder="Masukkan password" :required="!isEditMode"
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Minimal 8 karakter</p>
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
                                {{ loading ? (isEditMode ? 'Mengupdate...' : 'Menyimpan...') : (isEditMode ? 'Update User' : 'Simpan User') }}
                            </button>
                            <NuxtLink to="/users"
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
import { ref, onMounted, computed, watch } from 'vue'
import { X, Save, Info, ChevronDown, AlertCircle } from 'lucide-vue-next'
import { useUsersStore } from '~/stores/users'
import { useClassroomsStore } from '~/stores/classrooms'
import { useRouter, useRoute } from 'vue-router'

const usersStore = useUsersStore()
const classroomsStore = useClassroomsStore()
const router = useRouter()
const route = useRoute()

const isEditMode = computed(() => !!route.params.id)
const userId = computed(() => route.params.id)

const formData = ref({
    name: '',
    username: '',
    password: '',
    id_role: null,
    id_kelas: ''
})

const classrooms = ref([])
const errorMessage = ref('')
const loading = ref(false)
const loadingData = ref(false)

const loadUserData = async () => {
    if (!isEditMode.value) return

    loadingData.value = true
    const result = await usersStore.getUserById(userId.value)
    loadingData.value = false

    if (result.success && result.data) {
        const user = result.data
        formData.value = {
            name: user.name,
            username: user.username,
            password: '',
            id_role: user.id_role,
            id_kelas: user.id_kelas || ''
        }
    } else {
        errorMessage.value = 'Gagal memuat data user'
    }
}

watch(() => formData.value.id_role, (newRole) => {
    if (newRole !== 2) {
        formData.value.id_kelas = ''
    }
})

const validateForm = () => {
    if (!formData.value.id_role) {
        errorMessage.value = 'Silakan pilih role pengguna'
        return false
    }

    if (formData.value.id_role === 2 && !formData.value.id_kelas) {
        errorMessage.value = 'KM wajib memilih kelas'
        return false
    }

    if (!formData.value.name || formData.value.name.trim().length === 0) {
        errorMessage.value = 'Nama tidak boleh kosong'
        return false
    }

    if (!formData.value.username || formData.value.username.trim().length < 3) {
        errorMessage.value = 'Username minimal 3 karakter'
        return false
    }

    const usernameRegex = /^[a-z0-9_]+$/
    if (!usernameRegex.test(formData.value.username)) {
        errorMessage.value = 'Username hanya boleh huruf kecil, angka, dan underscore (tanpa spasi)'
        return false
    }

    if (!isEditMode.value || formData.value.password) {
        if (formData.value.password.length < 8) {
            errorMessage.value = 'Password minimal 8 karakter'
            return false
        }
    }

    return true
}

const handleSubmit = async () => {
    errorMessage.value = ''

    if (!validateForm()) {
        return
    }

    loading.value = true

    const payload = {
        name: formData.value.name.trim(),
        username: formData.value.username.trim().toLowerCase(),
        id_role: formData.value.id_role,
        id_kelas: formData.value.id_role === 2 ? formData.value.id_kelas : null
    }

    if (formData.value.password) {
        payload.password = formData.value.password
    }

    let result
    if (isEditMode.value) {
        result = await usersStore.updateUser(userId.value, payload)
    } else {
        result = await usersStore.createUser(payload)
    }

    loading.value = false

    if (result.success) {
        router.push('/users')
    } else {
        errorMessage.value = result.message
    }
}

onMounted(async () => {
    const classroomResult = await classroomsStore.getClassrooms()
    if (classroomResult.success) {
        classrooms.value = classroomsStore.classrooms
    }

    await loadUserData()
})
</script>