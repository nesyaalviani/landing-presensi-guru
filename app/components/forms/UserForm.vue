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
                        <AppAlert :type="alertType" :message="alertMessage" :redirect-delay="alertRedirectDelay"
                            :on-close="clearAlert" :on-redirect="alertRedirectFn" />

                        <!-- Role -->
                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Role <span class="text-red-500">*</span>
                            </label>
                            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                <div @click="formData.id_role = 1" :class="[
                                    'cursor-pointer border rounded-sm px-4 py-2.5 text-center transition-all',
                                    formData.id_role === 1
                                        ? 'border-blue-500 bg-blue-500 text-white'
                                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                                ]">
                                    <span class="text-sm font-medium">Admin</span>
                                </div>

                                <div @click="formData.id_role = 2" :class="[
                                    'cursor-pointer border rounded-sm px-4 py-2.5 text-center transition-all',
                                    formData.id_role === 2
                                        ? 'border-blue-500 bg-blue-500 text-white'
                                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                                ]">
                                    <span class="text-sm font-medium">KM</span>
                                </div>

                                <div @click="formData.id_role = 3" :class="[
                                    'cursor-pointer border rounded-sm px-4 py-2.5 text-center transition-all',
                                    formData.id_role === 3
                                        ? 'border-blue-500 bg-blue-500 text-white'
                                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                                ]">
                                    <span class="text-sm font-medium">Petugas Piket</span>
                                </div>

                                <div @click="formData.id_role = 4" :class="[
                                    'cursor-pointer border rounded-sm px-4 py-2.5 text-center transition-all',
                                    formData.id_role === 4
                                        ? 'border-blue-500 bg-blue-500 text-white'
                                        : 'border-gray-300 hover:border-gray-400 text-gray-900'
                                ]">
                                    <span class="text-sm font-medium">Kepala Sekolah</span>
                                </div>
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih role sesuai dengan tugas pengguna</p>
                        </div>

                        <!-- Kelas (searchable single-select dropdown) -->
                        <div v-if="formData.id_role === 2">
                            <label for="kelas" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Kelas <span class="text-red-500">*</span>
                            </label>

                            <div class="relative" ref="kelasDropdownRef">
                                <div class="flex items-center border rounded-sm bg-white overflow-hidden transition-colors"
                                    :class="kelasDropdownOpen ? 'border-blue-400' : 'border-gray-300'">

                                    <!-- Input search sekaligus trigger -->
                                    <input ref="kelasInputRef" v-model="kelasSearchQuery" type="text"
                                        placeholder="Cari atau pilih kelas"
                                        class="flex-1 min-w-0 pl-3 pr-2 py-2.5 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                                        @click.stop="openKelasDropdown" @input="onKelasSearchInput" />

                                    <!-- Clear button (tampil jika ada kelas yang dipilih) -->
                                    <button v-if="formData.id_kelas" type="button" @click.stop="clearKelasSelection"
                                        class="px-2 py-2 text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors">
                                        <X class="h-3.5 w-3.5" />
                                    </button>

                                    <!-- Chevron -->
                                    <button type="button" @click.stop="toggleKelasDropdown"
                                        class="px-2 py-2 text-gray-400 hover:text-gray-500 flex-shrink-0 transition-colors">
                                        <ChevronDown class="h-3.5 w-3.5 transition-transform duration-200"
                                            :class="{ 'rotate-180': kelasDropdownOpen }" />
                                    </button>
                                </div>

                                <!-- Dropdown panel -->
                                <Transition enter-active-class="transition duration-100 ease-out"
                                    enter-from-class="opacity-0 -translate-y-1"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition duration-75 ease-in"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-1">
                                    <div v-if="kelasDropdownOpen"
                                        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg">
                                        <ul ref="kelasListRef" class="kelas-scroll max-h-60 overflow-y-auto py-1"
                                            @scroll="onKelasListScroll">

                                            <!-- Empty state -->
                                            <li v-if="kelasDropdownItems.length === 0 && !kelasFetching"
                                                class="px-3 py-3 text-sm text-gray-400 text-center">
                                                Tidak ada hasil
                                            </li>

                                            <!-- Items (single select, tanpa checkbox) -->
                                            <li v-for="kelas in kelasDropdownItems" :key="kelas.id"
                                                @mousedown.prevent="selectKelasItem(kelas)"
                                                class="px-3 py-2 text-sm cursor-pointer transition-colors" :class="formData.id_kelas === kelas.id
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'">
                                                {{ kelas.name }} - {{ kelas.nama_jurusan }}
                                            </li>

                                            <!-- Loading spinner -->
                                            <li v-if="kelasFetching" class="px-3 py-2.5 flex justify-center">
                                                <span
                                                    class="inline-block h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                                            </li>

                                            <!-- End of list -->
                                            <li v-else-if="!kelasHasMore && kelasDropdownItems.length > 0"
                                                class="px-3 py-1.5 text-xs text-gray-400 text-center border-t border-gray-100 mt-1">
                                                Semua data ditampilkan
                                            </li>
                                        </ul>
                                    </div>
                                </Transition>
                            </div>

                            <p class="mt-1.5 text-xs text-gray-500">KM wajib memilih kelas</p>
                        </div>

                        <!-- Nama -->
                        <div>
                            <label for="nama" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Nama <span class="text-red-500">*</span>
                            </label>
                            <input id="nama" v-model="formData.name" type="text" placeholder="Contoh: John Doe" required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Masukkan nama lengkap pengguna</p>
                        </div>

                        <!-- Username -->
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

                        <!-- Password -->
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

                        <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
                            <button type="submit" :disabled="loading || loadingData"
                                class="order-1 sm:order-2 w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                {{ loading ? (isEditMode ? 'Mengupdate...' : 'Menyimpan...') : (isEditMode ? 'Edit User'
                                : 'Simpan') }}
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
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { X, Save, Info, ChevronDown } from 'lucide-vue-next'
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

const loading = ref(false)
const loadingData = ref(false)

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

// ===================== Kelas searchable single-select dropdown =====================
const KELAS_LIMIT = 10

const kelasDropdownOpen = ref(false)
const kelasSearchQuery = ref('')
const kelasDropdownItems = ref([])
const kelasPage = ref(1)
const kelasHasMore = ref(true)
const kelasFetching = ref(false)
const kelasDropdownRef = ref(null)
const kelasInputRef = ref(null)
const kelasListRef = ref(null)
const kelasNameCache = ref({})

let kelasSearchTimer = null

const fetchKelasDropdown = async (reset = false) => {
    if (kelasFetching.value) return
    if (!kelasHasMore.value && !reset) return

    kelasFetching.value = true

    if (reset) {
        kelasDropdownItems.value = []
        kelasPage.value = 1
        kelasHasMore.value = true
    }

    try {
        const params = {
            page: kelasPage.value,
            limit: KELAS_LIMIT,
        }
        if (kelasSearchQuery.value) params.search = kelasSearchQuery.value

        const result = await classroomsStore.getClassrooms(params)

        if (result.success) {
            const incoming = classroomsStore.classrooms

            // Cache nama kelas untuk display
            incoming.forEach(k => {
                kelasNameCache.value[k.id] = `${k.name} - ${k.nama_jurusan}`
            })

            kelasDropdownItems.value = reset
                ? [...incoming]
                : [...kelasDropdownItems.value, ...incoming]

            kelasHasMore.value = classroomsStore.hasMore
            if (!reset) kelasPage.value++
        }
    } catch (e) {
        console.error('Gagal fetch kelas dropdown:', e)
    } finally {
        kelasFetching.value = false
    }
}

const openKelasDropdown = async () => {
    if (kelasDropdownOpen.value) {
        closeKelasDropdown()
        return
    }
    kelasDropdownOpen.value = true
    if (kelasDropdownItems.value.length === 0) {
        await fetchKelasDropdown(true)
    }
}

const toggleKelasDropdown = async () => {
    if (kelasDropdownOpen.value) {
        closeKelasDropdown()
    } else {
        kelasDropdownOpen.value = true
        if (kelasDropdownItems.value.length === 0) {
            await fetchKelasDropdown(true)
        }
    }
}

const closeKelasDropdown = () => {
    kelasDropdownOpen.value = false
    // Kembalikan nama kelas terpilih ke input (atau kosongkan jika belum ada pilihan)
    kelasSearchQuery.value = formData.value.id_kelas
        ? getKelasName(formData.value.id_kelas)
        : ''
}

const onKelasSearchInput = () => {
    if (!kelasDropdownOpen.value) kelasDropdownOpen.value = true
    clearTimeout(kelasSearchTimer)
    kelasSearchTimer = setTimeout(() => fetchKelasDropdown(true), 350)
}

const onKelasListScroll = () => {
    const el = kelasListRef.value
    if (!el) return
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40
    if (nearBottom && kelasHasMore.value && !kelasFetching.value) {
        fetchKelasDropdown()
    }
}

const selectKelasItem = (kelas) => {
    formData.value.id_kelas = kelas.id
    kelasNameCache.value[kelas.id] = `${kelas.name} - ${kelas.nama_jurusan}`
    // Tampilkan nama kelas terpilih di input, lalu tutup dropdown
    kelasSearchQuery.value = `${kelas.name} - ${kelas.nama_jurusan}`
    kelasDropdownOpen.value = false
}

const clearKelasSelection = () => {
    formData.value.id_kelas = ''
    kelasSearchQuery.value = ''
    fetchKelasDropdown(true)
}

const getKelasName = (kelasId) => {
    return kelasNameCache.value[kelasId] || ''
}

const handleKelasClickOutside = (event) => {
    if (kelasDropdownRef.value && !kelasDropdownRef.value.contains(event.target)) {
        closeKelasDropdown()
    }
}

// ===================== Watch role change =====================
watch(() => formData.value.id_role, (newRole) => {
    if (newRole !== 2) {
        formData.value.id_kelas = ''
        kelasSearchQuery.value = ''
    } else {
        // Reset dan fetch ulang saat role KM dipilih
        kelasDropdownItems.value = []
        fetchKelasDropdown(true)
    }
})

// ===================== Load user data (edit mode) =====================
const loadUserData = async () => {
    if (!isEditMode.value) return

    const result = await usersStore.getUserById(userId.value)

    if (result.success && result.data) {
        const user = result.data
        formData.value = {
            name: user.name,
            username: user.username,
            password: '',
            id_role: user.id_role,
            id_kelas: user.id_kelas || ''
        }
        // Seed cache jika ada kelas terpilih supaya input langsung tampil nama
        if (user.id_kelas && user.nama_kelas) {
            kelasNameCache.value[user.id_kelas] = user.nama_kelas
        }
    } else {
        showAlert('error', 'Gagal memuat data user')
    }
}

// ===================== Computed input placeholder kelas =====================
const kelasInputPlaceholder = computed(() => {
    if (formData.value.id_kelas) {
        return getKelasName(formData.value.id_kelas) || 'Kelas terpilih'
    }
    return 'Cari atau pilih kelas'
})

// ===================== Validation & Submit =====================
const validateForm = () => {
    if (!formData.value.id_role) {
        showAlert('error', 'Silakan pilih role pengguna')
        return false
    }

    if (formData.value.id_role === 2 && !formData.value.id_kelas) {
        showAlert('error', 'KM wajib memilih kelas')
        return false
    }

    if (!formData.value.name || formData.value.name.trim().length === 0) {
        showAlert('error', 'Nama tidak boleh kosong')
        return false
    }

    if (!formData.value.username || formData.value.username.trim().length < 3) {
        showAlert('error', 'Username minimal 3 karakter')
        return false
    }

    const usernameRegex = /^[a-z0-9_]+$/
    if (!usernameRegex.test(formData.value.username)) {
        showAlert('error', 'Username hanya boleh huruf kecil, angka, dan underscore (tanpa spasi)')
        return false
    }

    if (!isEditMode.value || formData.value.password) {
        if (formData.value.password.length < 8) {
            showAlert('error', 'Password minimal 8 karakter')
            return false
        }
    }

    return true
}

const handleSubmit = async () => {
    clearAlert()

    if (!validateForm()) return

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
        showAlert('success', isEditMode.value ? 'User berhasil diupdate' : 'User berhasil dibuat', {
            redirectDelay: 1500,
            redirectFn: () => router.push('/users')
        })
    } else {
        showAlert('error', result.message)
    }
}

// ===================== Lifecycle =====================
onMounted(async () => {
    if (isEditMode.value) {
        loadingData.value = true
    }

    await loadUserData()

    if (isEditMode.value) {
        loadingData.value = false
    }

    if (process.client) {
        document.addEventListener('click', handleKelasClickOutside)
    }
})

onUnmounted(() => {
    clearTimeout(kelasSearchTimer)
    if (process.client) {
        document.removeEventListener('click', handleKelasClickOutside)
    }
})
</script>

<style scoped>
.kelas-scroll::-webkit-scrollbar {
    width: 4px;
}

.kelas-scroll::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px 0;
}

.kelas-scroll::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 99px;
}

.kelas-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
}

.kelas-scroll {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
}
</style>