<template>
    <section class="bg-gray-50">
        <div class="w-full">
            <div class="bg-white rounded-sm border border-gray-200">
                <div class="p-6 sm:p-8">
                    <div v-if="loading && isEditMode" class="space-y-6">
                        <div>
                            <div class="h-5 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-48 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <div>
                            <div class="h-5 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-56 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <div>
                            <div class="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-64 bg-gray-200 rounded animate-pulse mt-1.5"></div>
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

                        <div>
                            <label for="nama_guru"
                                class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Nama Guru <span class="text-red-500">*</span>
                            </label>
                            <input id="nama_guru" v-model="formData.nama_guru" type="text"
                                placeholder="Contoh: Asep Widiana" required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Masukkan nama lengkap guru</p>
                        </div>

                        <div>
                            <label for="nip" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                NIP <span class="text-red-500">*</span>
                            </label>
                            <input id="nip" v-model="formData.nip" type="text" inputmode="numeric" pattern="[0-9]*"
                                placeholder="Contoh: 185273770" required
                                class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                            <p class="mt-1.5 text-xs text-gray-500">Nomor Induk Pegawai harus unik</p>
                        </div>

                        <div>
                            <label for="mapel" class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Mata Pelajaran <span class="text-red-500">*</span>
                            </label>

                            <div class="relative" ref="mapelDropdownRef">
                                <div class="flex items-center border rounded-sm bg-white overflow-hidden transition-colors"
                                    :class="mapelDropdownOpen ? 'border-blue-400' : 'border-gray-300'">

                                    <!-- Input search sekaligus trigger -->
                                    <input ref="mapelInputRef" v-model="mapelSearchQuery" type="text"
                                        placeholder="Cari atau pilih mata pelajaran"
                                        class="flex-1 min-w-0 pl-3 pr-2 py-2.5 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                                        @click.stop="openMapelDropdown" @input="onMapelSearchInput" />

                                    <!-- Chevron -->
                                    <button type="button" @click.stop="toggleMapelDropdown"
                                        class="px-2 py-2 text-gray-400 hover:text-gray-500 flex-shrink-0 transition-colors">
                                        <ChevronDown class="h-3.5 w-3.5 transition-transform duration-200"
                                            :class="{ 'rotate-180': mapelDropdownOpen }" />
                                    </button>
                                </div>

                                <!-- Dropdown panel -->
                                <Transition enter-active-class="transition duration-100 ease-out"
                                    enter-from-class="opacity-0 -translate-y-1"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition duration-75 ease-in"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-1">
                                    <div v-if="mapelDropdownOpen"
                                        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg">
                                        <ul ref="mapelListRef" class="mapel-scroll max-h-60 overflow-y-auto py-1"
                                            @scroll="onMapelListScroll">

                                            <!-- Empty state -->
                                            <li v-if="mapelDropdownItems.length === 0 && !mapelFetching"
                                                class="px-3 py-3 text-sm text-gray-400 text-center">
                                                Tidak ada hasil
                                            </li>

                                            <!-- Items dengan checkbox -->
                                            <li v-for="mapel in mapelDropdownItems" :key="mapel.id_mapel"
                                                @mousedown.prevent="toggleMapelItem(mapel)"
                                                class="px-3 py-2 text-sm cursor-pointer transition-colors flex items-center gap-2"
                                                :class="formData.mapel.includes(mapel.id_mapel)
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'">
                                                <input type="checkbox"
                                                    :checked="formData.mapel.includes(mapel.id_mapel)"
                                                    @mousedown.prevent
                                                    class="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 flex-shrink-0" />
                                                <span class="flex-1">{{ mapel.nama_mapel }}</span>
                                            </li>

                                            <!-- Loading spinner -->
                                            <li v-if="mapelFetching" class="px-3 py-2.5 flex justify-center">
                                                <span
                                                    class="inline-block h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                                            </li>

                                            <!-- End of list -->
                                            <li v-else-if="!mapelHasMore && mapelDropdownItems.length > 0"
                                                class="px-3 py-1.5 text-xs text-gray-400 text-center border-t border-gray-100 mt-1">
                                                Semua data ditampilkan
                                            </li>
                                        </ul>
                                    </div>
                                </Transition>
                            </div>

                            <!-- Selected tags -->
                            <div v-if="formData.mapel.length > 0" class="mt-2 flex flex-wrap gap-2">
                                <span v-for="mapelId in formData.mapel" :key="mapelId"
                                    class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-sm border border-blue-200">
                                    {{ getMapelName(mapelId) }}
                                    <button type="button" @click="removeMapel(mapelId)" class="hover:text-blue-900">
                                        <X class="h-3 w-3" />
                                    </button>
                                </span>
                            </div>

                            <p class="mt-1.5 text-xs text-gray-500">Pilih satu atau lebih mata pelajaran yang akan
                                diampu</p>
                        </div>

                        <hr class="border-gray-200" />

                        <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
                            <button type="submit" :disabled="loading"
                                class="order-1 sm:order-2 w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                {{ loading ? 'Menyimpan...' : (isEditMode ? 'Edit Guru' : 'Simpan') }}
                            </button>
                            <NuxtLink to="/teacher"
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
                            <span class="font-medium">Catatan:</span> Pastikan NIP belum terdaftar dan minimal pilih
                            satu mata pelajaran yang akan diampu.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { X, Save, Info, ChevronDown } from 'lucide-vue-next'
import { useTeachersStore } from '~/stores/teachers'
import { useRouter, useRoute } from 'vue-router'

const teachersStore = useTeachersStore()
const router = useRouter()
const route = useRoute()

const isEditMode = computed(() => !!route.params.id)
const teacherId = computed(() => route.params.id)

const formData = ref({
    nama_guru: '',
    nip: '',
    mapel: []
})

const loading = ref(!!route.params.id)

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

// ===================== Mapel infinite dropdown =====================
const MAPEL_LIMIT = 10

const mapelDropdownOpen = ref(false)
const mapelSearchQuery = ref('')
const mapelDropdownItems = ref([])
const mapelPage = ref(1)
const mapelHasMore = ref(true)
const mapelFetching = ref(false)
const mapelDropdownRef = ref(null)
const mapelInputRef = ref(null)
const mapelListRef = ref(null)
const mapelNameCache = ref({})

let mapelSearchTimer = null

const fetchMapelDropdown = async (reset = false) => {
    if (mapelFetching.value) return
    if (!mapelHasMore.value && !reset) return

    mapelFetching.value = true

    if (reset) {
        mapelDropdownItems.value = []
        mapelPage.value = 1
        mapelHasMore.value = true
    }

    try {
        const config = useRuntimeConfig()
        const token = process.client ? localStorage.getItem('token') : null

        const params = new URLSearchParams({
            page: mapelPage.value,
            limit: MAPEL_LIMIT,
        })
        if (mapelSearchQuery.value) params.set('search', mapelSearchQuery.value)

        const res = await $fetch(`/mapel?${params}`, {
            baseURL: config.public.apiBase,
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        })

        const incoming = res.data || []

        // Cache nama mapel untuk tag display
        incoming.forEach(m => {
            mapelNameCache.value[m.id_mapel] = m.nama_mapel
        })

        mapelDropdownItems.value = reset
            ? incoming
            : [...mapelDropdownItems.value, ...incoming]

        const pagination = res.pagination
        if (pagination) {
            mapelHasMore.value = mapelPage.value < pagination.totalPages
            mapelPage.value++
        } else {
            mapelHasMore.value = false
        }
    } catch (e) {
        console.error('Gagal fetch mapel dropdown:', e)
    } finally {
        mapelFetching.value = false
    }
}

const openMapelDropdown = async () => {
    if (mapelDropdownOpen.value) {
        closeMapelDropdown()
        return
    }
    mapelDropdownOpen.value = true
    if (mapelDropdownItems.value.length === 0) {
        await fetchMapelDropdown(true)
    }
}

const toggleMapelDropdown = async () => {
    if (mapelDropdownOpen.value) {
        closeMapelDropdown()
    } else {
        mapelDropdownOpen.value = true
        if (mapelDropdownItems.value.length === 0) {
            await fetchMapelDropdown(true)
        }
    }
}

const closeMapelDropdown = () => {
    mapelDropdownOpen.value = false
    // Reset search & list saat ditutup supaya saat dibuka lagi selalu fresh
    if (mapelSearchQuery.value) {
        mapelSearchQuery.value = ''
        fetchMapelDropdown(true)
    }
}

const onMapelSearchInput = () => {
    if (!mapelDropdownOpen.value) mapelDropdownOpen.value = true
    clearTimeout(mapelSearchTimer)
    mapelSearchTimer = setTimeout(() => fetchMapelDropdown(true), 350)
}

const onMapelListScroll = () => {
    const el = mapelListRef.value
    if (!el) return
    const nearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 40
    if (nearBottom && mapelHasMore.value && !mapelFetching.value) {
        fetchMapelDropdown()
    }
}

const toggleMapelItem = (mapel) => {
    const idx = formData.value.mapel.indexOf(mapel.id_mapel)
    if (idx === -1) {
        formData.value.mapel.push(mapel.id_mapel)
        mapelNameCache.value[mapel.id_mapel] = mapel.nama_mapel
    } else {
        formData.value.mapel.splice(idx, 1)
    }
    // Kalau sedang dalam mode search, reset supaya list kembali normal
    // tanpa menutup dropdown (multi-select tetap terbuka)
    if (mapelSearchQuery.value) {
        mapelSearchQuery.value = ''
        fetchMapelDropdown(true)
    }
}

const removeMapel = (mapelId) => {
    formData.value.mapel = formData.value.mapel.filter(id => id !== mapelId)
}

const getMapelName = (mapelId) => {
    return mapelNameCache.value[mapelId] || ''
}

const handleMapelClickOutside = (event) => {
    if (mapelDropdownRef.value && !mapelDropdownRef.value.contains(event.target)) {
        closeMapelDropdown()
    }
}

// ===================== Load teacher data (edit mode) =====================
const loadTeacherData = async () => {
    if (!isEditMode.value) return

    const result = await teachersStore.getTeacherById(teacherId.value)

    if (result.success && result.data) {
        const teacher = result.data
        formData.value = {
            nama_guru: teacher.nama_guru,
            nip: teacher.nip || '',
            mapel: teacher.mapel ? teacher.mapel.map(m => m.id_mapel) : []
        }
        // Seed cache dari data edit supaya tag langsung tampil
        if (teacher.mapel) {
            teacher.mapel.forEach(m => {
                mapelNameCache.value[m.id_mapel] = m.nama_mapel
            })
        }
    } else {
        showAlert('error', 'Gagal memuat data guru')
    }

    loading.value = false
}

// ===================== Submit =====================
const handleSubmit = async () => {
    clearAlert()

    if (!formData.value.nama_guru || !formData.value.nip) {
        showAlert('error', 'Semua field wajib diisi.')
        return
    }

    if (formData.value.mapel.length === 0) {
        showAlert('error', 'Pilih minimal satu mata pelajaran.')
        return
    }

    loading.value = true

    const payload = {
        nama_guru: formData.value.nama_guru,
        nip: formData.value.nip,
        mapel: formData.value.mapel
    }

    const result = isEditMode.value
        ? await teachersStore.updateTeacher(teacherId.value, payload)
        : await teachersStore.createTeacher(payload)

    loading.value = false

    if (result.success) {
        showAlert('success', isEditMode.value ? 'Data guru berhasil diupdate!' : 'Guru berhasil ditambahkan!', {
            redirectDelay: 1500,
            redirectFn: () => router.push('/teacher')
        })
    } else {
        showAlert('error', result.message)
    }
}

// ===================== Lifecycle =====================
onMounted(async () => {
    await Promise.all([
        fetchMapelDropdown(true),
        loadTeacherData()
    ])

    if (process.client) {
        document.addEventListener('click', handleMapelClickOutside)
    }
})

onUnmounted(() => {
    clearTimeout(mapelSearchTimer)
    if (process.client) {
        document.removeEventListener('click', handleMapelClickOutside)
    }
})
</script>

<style scoped>
.mapel-scroll::-webkit-scrollbar {
    width: 4px;
}

.mapel-scroll::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px 0;
}

.mapel-scroll::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 99px;
}

.mapel-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
}

.mapel-scroll {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
}
</style>