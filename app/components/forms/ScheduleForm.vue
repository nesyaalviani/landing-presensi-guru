<template>
    <section class="bg-gray-50">
        <div class="w-full">
            <div class="bg-white rounded-sm border border-gray-200">
                <div class="p-6 sm:p-8">
                    <div v-if="loadingData" class="space-y-6">
                        <div>
                            <div class="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <div class="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1.5"></div>
                                    <div class="h-10 bg-gray-200 rounded-sm animate-pulse"></div>
                                </div>
                                <div>
                                    <div class="h-4 w-20 bg-gray-200 rounded animate-pulse mb-1.5"></div>
                                    <div class="h-10 bg-gray-200 rounded-sm animate-pulse"></div>
                                </div>
                            </div>
                            <div class="h-4 w-56 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <div>
                            <div class="h-5 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-48 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <div>
                            <div class="h-5 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-56 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <div>
                            <div class="h-5 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-32 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <div>
                            <div class="h-5 w-16 bg-gray-200 rounded animate-pulse mb-2"></div>
                            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-4 w-40 bg-gray-200 rounded animate-pulse mt-1.5"></div>
                        </div>

                        <hr class="border-gray-200" />

                        <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
                            <div class="h-10 w-full sm:w-32 bg-gray-200 rounded-sm animate-pulse"></div>
                            <div class="h-10 w-full sm:w-32 bg-gray-200 rounded-sm animate-pulse"></div>
                        </div>
                    </div>

                    <form v-else @submit.prevent="handleSubmit" class="space-y-6">

                        <div ref="alertRef" v-if="alertMessage">
                            <AppAlert :type="alertType" :message="alertMessage" :redirect-delay="alertRedirectDelay"
                                :on-close="clearAlert" :on-redirect="alertRedirectFn" />
                        </div>

                        <!-- Jam Pelajaran -->
                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Jam Pelajaran <span class="text-red-500">*</span>
                            </label>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label for="jam-mulai" class="block text-xs font-medium text-gray-600 mb-1.5">
                                        Jam Mulai
                                    </label>
                                    <ClientOnly>
                                        <clock-timepicker id="jam-mulai" :value="formData.jamMulai"
                                            @input="formData.jamMulai = $event.target.value" required
                                            placeholder="00:00" class="timepicker-simple">
                                        </clock-timepicker>
                                    </ClientOnly>
                                </div>
                                <div>
                                    <label for="jam-selesai" class="block text-xs font-medium text-gray-600 mb-1.5">
                                        Jam Selesai
                                    </label>
                                    <ClientOnly>
                                        <clock-timepicker id="jam-selesai" :value="formData.jamSelesai"
                                            @input="formData.jamSelesai = $event.target.value" required
                                            placeholder="00:00" class="timepicker-simple">
                                        </clock-timepicker>
                                    </ClientOnly>
                                </div>
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih jam mulai dan jam selesai pelajaran</p>
                        </div>

                        <!-- Kelas (infinite scroll + search) -->
                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Kelas <span class="text-red-500">*</span>
                            </label>
                            <div class="relative" ref="kelasDropdownRef">
                                <div class="flex items-center border rounded-sm bg-white overflow-hidden transition-colors"
                                    :class="kelasDropdownOpen ? 'border-blue-400' : 'border-gray-300'">
                                    <input ref="kelasInputRef" v-model="kelasSearchQuery" type="text"
                                        placeholder="Cari atau pilih kelas"
                                        class="flex-1 min-w-0 pl-3 pr-2 py-2.5 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                                        @click.stop="toggleKelasDropdown" @input="onKelasSearchInput" />
                                    <button v-if="formData.kelas" type="button" @click.stop="clearKelasSelection"
                                        class="px-2 py-2 text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors">
                                        <X class="h-3.5 w-3.5" />
                                    </button>
                                    <button type="button" @click.stop="toggleKelasDropdown"
                                        class="px-2 py-2 text-gray-400 hover:text-gray-500 flex-shrink-0 transition-colors">
                                        <ChevronDown class="h-3.5 w-3.5 transition-transform duration-200"
                                            :class="{ 'rotate-180': kelasDropdownOpen }" />
                                    </button>
                                </div>
                                <Transition enter-active-class="transition duration-100 ease-out"
                                    enter-from-class="opacity-0 -translate-y-1"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition duration-75 ease-in"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-1">
                                    <div v-if="kelasDropdownOpen"
                                        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg">
                                        <ul ref="kelasListRef" class="custom-scroll max-h-60 overflow-y-auto py-1"
                                            @scroll="onKelasListScroll">
                                            <li v-if="kelasDropdownItems.length === 0 && !kelasFetching"
                                                class="px-3 py-3 text-sm text-gray-400 text-center">
                                                Tidak ada hasil
                                            </li>
                                            <li v-for="kelas in kelasDropdownItems" :key="kelas.id"
                                                @mousedown.prevent="selectKelas(kelas)"
                                                class="px-3 py-2 text-sm cursor-pointer transition-colors"
                                                :class="formData.kelas === kelas.id
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'">
                                                {{ kelas.name }} - {{ kelas.nama_jurusan }}
                                            </li>
                                            <li v-if="kelasFetching" class="px-3 py-2.5 flex justify-center">
                                                <span
                                                    class="inline-block h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                                            </li>
                                            <li v-else-if="!kelasHasMore && kelasDropdownItems.length > 0"
                                                class="px-3 py-1.5 text-xs text-gray-400 text-center border-t border-gray-100 mt-1">
                                                Semua data ditampilkan
                                            </li>
                                        </ul>
                                    </div>
                                </Transition>
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih kelas yang akan mengikuti pelajaran</p>
                        </div>

                        <!-- Mata Pelajaran (infinite scroll + search) -->
                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Mata Pelajaran <span class="text-red-500">*</span>
                            </label>
                            <div class="relative" ref="mapelDropdownRef">
                                <div class="flex items-center border rounded-sm bg-white overflow-hidden transition-colors"
                                    :class="mapelDropdownOpen ? 'border-blue-400' : 'border-gray-300'">
                                    <input ref="mapelInputRef" v-model="mapelSearchQuery" type="text"
                                        placeholder="Cari atau pilih mata pelajaran"
                                        class="flex-1 min-w-0 pl-3 pr-2 py-2.5 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                                        @click.stop="toggleMapelDropdown" @input="onMapelSearchInput" />
                                    <button v-if="formData.mapel" type="button" @click.stop="clearMapelSelection"
                                        class="px-2 py-2 text-gray-400 hover:text-gray-600 flex-shrink-0 transition-colors">
                                        <X class="h-3.5 w-3.5" />
                                    </button>
                                    <button type="button" @click.stop="toggleMapelDropdown"
                                        class="px-2 py-2 text-gray-400 hover:text-gray-500 flex-shrink-0 transition-colors">
                                        <ChevronDown class="h-3.5 w-3.5 transition-transform duration-200"
                                            :class="{ 'rotate-180': mapelDropdownOpen }" />
                                    </button>
                                </div>
                                <Transition enter-active-class="transition duration-100 ease-out"
                                    enter-from-class="opacity-0 -translate-y-1"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition duration-75 ease-in"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-1">
                                    <div v-if="mapelDropdownOpen"
                                        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg">
                                        <ul ref="mapelListRef" class="custom-scroll max-h-60 overflow-y-auto py-1"
                                            @scroll="onMapelListScroll">
                                            <li v-if="mapelDropdownItems.length === 0 && !mapelFetching"
                                                class="px-3 py-3 text-sm text-gray-400 text-center">
                                                Tidak ada hasil
                                            </li>
                                            <li v-for="mapel in mapelDropdownItems" :key="mapel.id_mapel"
                                                @mousedown.prevent="selectMapel(mapel)"
                                                class="px-3 py-2 text-sm cursor-pointer transition-colors"
                                                :class="formData.mapel === mapel.id_mapel
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'">
                                                {{ mapel.nama_mapel }}
                                            </li>
                                            <li v-if="mapelFetching" class="px-3 py-2.5 flex justify-center">
                                                <span
                                                    class="inline-block h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></span>
                                            </li>
                                            <li v-else-if="!mapelHasMore && mapelDropdownItems.length > 0"
                                                class="px-3 py-1.5 text-xs text-gray-400 text-center border-t border-gray-100 mt-1">
                                                Semua data ditampilkan
                                            </li>
                                        </ul>
                                    </div>
                                </Transition>
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih mata pelajaran yang akan diajarkan</p>
                        </div>

                        <!-- Guru (custom dropdown, fetch by mapel) -->
                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Guru <span class="text-red-500">*</span>
                            </label>
                            <div class="relative" ref="guruDropdownRef">
                                <button type="button" @click.stop="toggleGuruDropdown"
                                    :disabled="!formData.mapel || loadingGuru"
                                    class="w-full flex items-center justify-between pl-3 pr-3 py-2.5 border rounded-sm bg-white transition-colors text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                    :class="guruDropdownOpen ? 'border-blue-400' : 'border-gray-300 hover:border-gray-400'">
                                    <span :class="formData.guru ? 'text-gray-700' : 'text-gray-400'">
                                        {{ formData.guru
                                            ? (guruNameCache[formData.guru] || 'Pilih Guru')
                                            : !formData.mapel
                                                ? 'Pilih mata pelajaran terlebih dahulu'
                                                : loadingGuru
                                                    ? 'Memuat guru...'
                                                    : teachers.length === 0
                                                        ? 'Tidak ada guru untuk mapel ini'
                                                        : 'Pilih Guru' }}
                                    </span>
                                    <span v-if="loadingGuru"
                                        class="inline-block h-4 w-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin flex-shrink-0"></span>
                                    <ChevronDown v-else class="h-3.5 w-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200"
                                        :class="{ 'rotate-180': guruDropdownOpen }" />
                                </button>
                                <Transition enter-active-class="transition duration-100 ease-out"
                                    enter-from-class="opacity-0 -translate-y-1"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition duration-75 ease-in"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-1">
                                    <div v-if="guruDropdownOpen"
                                        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg">
                                        <ul class="custom-scroll max-h-60 overflow-y-auto py-1">
                                            <li v-if="teachers.length === 0"
                                                class="px-3 py-3 text-sm text-gray-400 text-center">
                                                Tidak ada guru
                                            </li>
                                            <li v-for="guru in teachers" :key="guru.id_guru"
                                                @mousedown.prevent="selectGuru(guru)"
                                                class="px-3 py-2 text-sm cursor-pointer transition-colors"
                                                :class="formData.guru === guru.id_guru
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'">
                                                {{ guru.nama_guru }}
                                            </li>
                                        </ul>
                                    </div>
                                </Transition>
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">
                                {{ teachers.length === 0 && formData.mapel && !loadingGuru
                                    ? 'Tidak ada guru yang mengajar mata pelajaran ini'
                                    : 'Guru akan tampil setelah memilih mata pelajaran' }}
                            </p>
                        </div>

                        <!-- Hari (custom dropdown, static list) -->
                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Hari <span class="text-red-500">*</span>
                            </label>
                            <div class="relative" ref="hariDropdownRef">
                                <button type="button" @click.stop="toggleHariDropdown"
                                    class="w-full flex items-center justify-between pl-3 pr-3 py-2.5 border rounded-sm bg-white transition-colors text-sm"
                                    :class="hariDropdownOpen ? 'border-blue-400' : 'border-gray-300 hover:border-gray-400'">
                                    <span :class="formData.hari ? 'text-gray-700' : 'text-gray-400'">
                                        {{ formData.hari || 'Pilih Hari' }}
                                    </span>
                                    <ChevronDown class="h-3.5 w-3.5 text-gray-400 flex-shrink-0 transition-transform duration-200"
                                        :class="{ 'rotate-180': hariDropdownOpen }" />
                                </button>
                                <Transition enter-active-class="transition duration-100 ease-out"
                                    enter-from-class="opacity-0 -translate-y-1"
                                    enter-to-class="opacity-100 translate-y-0"
                                    leave-active-class="transition duration-75 ease-in"
                                    leave-from-class="opacity-100 translate-y-0"
                                    leave-to-class="opacity-0 -translate-y-1">
                                    <div v-if="hariDropdownOpen"
                                        class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg">
                                        <ul class="custom-scroll max-h-60 overflow-y-auto py-1">
                                            <li v-for="hari in HARI_LIST" :key="hari"
                                                @mousedown.prevent="selectHari(hari)"
                                                class="px-3 py-2 text-sm cursor-pointer transition-colors"
                                                :class="formData.hari === hari
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-gray-700 hover:bg-gray-50'">
                                                {{ hari }}
                                            </li>
                                        </ul>
                                    </div>
                                </Transition>
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih hari pelaksanaan</p>
                        </div>

                        <hr class="border-gray-200" />

                        <div class="flex flex-col sm:flex-row items-center justify-end gap-3">
                            <button type="submit" :disabled="loading || loadingData"
                                class="order-1 sm:order-2 w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 focus:outline-none transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                                <Save class="h-4 w-4" />
                                {{ loading ? (isEditMode ? 'Mengupdate...' : 'Menyimpan...') : (isEditMode ? 'Edit Jadwal' : 'Simpan') }}
                            </button>
                            <NuxtLink to="/schedule"
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
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'
import { ChevronDown, X, Save, Info } from 'lucide-vue-next'
import { useSchedulesStore } from '~/stores/schedules'
import { useClassroomsStore } from '~/stores/classrooms'
import { useTeachersStore } from '~/stores/teachers'
import { useSubjectsStore } from '~/stores/subjects'
import { useRouter, useRoute } from 'vue-router'

if (process.client) {
    await import('clock-timepicker')
}

const schedulesStore = useSchedulesStore()
const classroomsStore = useClassroomsStore()
const teachersStore = useTeachersStore()
const subjectsStore = useSubjectsStore()
const router = useRouter()
const route = useRoute()

const isEditMode = computed(() => !!route.params.id)
const scheduleId = computed(() => route.params.id)

const formData = ref({
    jamMulai: '',
    jamSelesai: '',
    kelas: '',
    mapel: '',
    guru: '',
    hari: ''
})

const teachers = ref([])
const loadingGuru = ref(false)
const loading = ref(false)
const loadingData = ref(false)

const alertRef = ref(null)

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

const scrollToAlert = async () => {
    await nextTick()
    if (alertRef.value) {
        const navbar = document.querySelector('nav, header, [data-navbar]')
        const navbarHeight = navbar ? navbar.getBoundingClientRect().height : 0
        const elementTop = alertRef.value.getBoundingClientRect().top + window.scrollY
        window.scrollTo({ top: elementTop - navbarHeight - 16, behavior: 'smooth' })
    }
}

// ===================== Fetch Guru by Mapel =====================
const fetchGuruByMapel = async (mapelId) => {
    if (!mapelId) {
        teachers.value = []
        formData.value.guru = ''
        return
    }

    loadingGuru.value = true
    formData.value.guru = ''

    const result = await teachersStore.getTeachers({ id_mapel: mapelId, all: true })
    if (result.success) {
        teachers.value = teachersStore.teachers
    } else {
        teachers.value = []
    }

    loadingGuru.value = false
}

// ===================== GURU dropdown =====================
const guruDropdownOpen = ref(false)
const guruDropdownRef = ref(null)
const guruNameCache = ref({})

const toggleGuruDropdown = () => {
    if (!formData.value.mapel || loadingGuru.value) return
    guruDropdownOpen.value = !guruDropdownOpen.value
}

const closeGuruDropdown = () => {
    guruDropdownOpen.value = false
}

const selectGuru = (guru) => {
    formData.value.guru = guru.id_guru
    guruNameCache.value[guru.id_guru] = guru.nama_guru
    guruDropdownOpen.value = false
}

const handleGuruClickOutside = (e) => {
    if (guruDropdownRef.value && !guruDropdownRef.value.contains(e.target)) {
        closeGuruDropdown()
    }
}

// ===================== HARI dropdown =====================
const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']

const hariDropdownOpen = ref(false)
const hariDropdownRef = ref(null)

const toggleHariDropdown = () => {
    hariDropdownOpen.value = !hariDropdownOpen.value
}

const closeHariDropdown = () => {
    hariDropdownOpen.value = false
}

const selectHari = (hari) => {
    formData.value.hari = hari
    hariDropdownOpen.value = false
}

const handleHariClickOutside = (e) => {
    if (hariDropdownRef.value && !hariDropdownRef.value.contains(e.target)) {
        closeHariDropdown()
    }
}

// ===================== KELAS dropdown =====================
const KELAS_LIMIT = 10

const kelasDropdownOpen = ref(false)
const kelasSearchQuery = ref('')
const kelasDropdownItems = ref([])
const kelasPage = ref(1)
const kelasHasMore = ref(true)
const kelasFetching = ref(false)
const kelasDropdownRef = ref(null)
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
        const params = { page: kelasPage.value, limit: KELAS_LIMIT }
        if (kelasSearchQuery.value) params.search = kelasSearchQuery.value

        const result = await classroomsStore.getClassrooms(params)

        if (result.success) {
            const incoming = result.data.data || []

            incoming.forEach(k => {
                kelasNameCache.value[k.id] = `${k.name} - ${k.nama_jurusan}`
            })

            kelasDropdownItems.value = reset
                ? [...incoming]
                : [...kelasDropdownItems.value, ...incoming]

            const p = result.data.pagination || {}
            kelasHasMore.value = kelasPage.value < (p.totalPages ?? 1)
            if (!reset) kelasPage.value++
            else kelasPage.value = 2
        }
    } catch (e) {
        console.error('Gagal fetch kelas:', e)
    } finally {
        kelasFetching.value = false
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
    kelasSearchQuery.value = formData.value.kelas
        ? (kelasNameCache.value[formData.value.kelas] || '')
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
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40 && kelasHasMore.value && !kelasFetching.value) {
        fetchKelasDropdown()
    }
}

const selectKelas = (kelas) => {
    formData.value.kelas = kelas.id
    kelasNameCache.value[kelas.id] = `${kelas.name} - ${kelas.nama_jurusan}`
    kelasSearchQuery.value = `${kelas.name} - ${kelas.nama_jurusan}`
    kelasDropdownOpen.value = false
}

const clearKelasSelection = () => {
    formData.value.kelas = ''
    kelasSearchQuery.value = ''
    fetchKelasDropdown(true)
}

const handleKelasClickOutside = (e) => {
    if (kelasDropdownRef.value && !kelasDropdownRef.value.contains(e.target)) {
        closeKelasDropdown()
    }
}

// ===================== MAPEL dropdown =====================
const MAPEL_LIMIT = 10

const mapelDropdownOpen = ref(false)
const mapelSearchQuery = ref('')
const mapelDropdownItems = ref([])
const mapelPage = ref(1)
const mapelHasMore = ref(true)
const mapelFetching = ref(false)
const mapelDropdownRef = ref(null)
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
        const params = { page: mapelPage.value, limit: MAPEL_LIMIT }
        if (mapelSearchQuery.value) params.search = mapelSearchQuery.value

        const result = await subjectsStore.getSubjects(params)

        if (result.success) {
            const incoming = result.data.data || []

            // Filter hanya mapel aktif
            const activeIncoming = incoming.filter(m => m.status === true)

            activeIncoming.forEach(m => {
                mapelNameCache.value[m.id_mapel] = m.nama_mapel
            })

            mapelDropdownItems.value = reset
                ? [...activeIncoming]
                : [...mapelDropdownItems.value, ...activeIncoming]

            const p = result.data.pagination || {}
            mapelHasMore.value = mapelPage.value < (p.totalPages ?? 1)
            if (!reset) mapelPage.value++
            else mapelPage.value = 2
        }
    } catch (e) {
        console.error('Gagal fetch mapel:', e)
    } finally {
        mapelFetching.value = false
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
    mapelSearchQuery.value = formData.value.mapel
        ? (mapelNameCache.value[formData.value.mapel] || '')
        : ''
}

const onMapelSearchInput = () => {
    if (!mapelDropdownOpen.value) mapelDropdownOpen.value = true
    clearTimeout(mapelSearchTimer)
    mapelSearchTimer = setTimeout(() => fetchMapelDropdown(true), 350)
}

const onMapelListScroll = () => {
    const el = mapelListRef.value
    if (!el) return
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 40 && mapelHasMore.value && !mapelFetching.value) {
        fetchMapelDropdown()
    }
}

const selectMapel = async (mapel) => {
    formData.value.mapel = mapel.id_mapel
    mapelNameCache.value[mapel.id_mapel] = mapel.nama_mapel
    mapelSearchQuery.value = mapel.nama_mapel
    mapelDropdownOpen.value = false

    await fetchGuruByMapel(mapel.id_mapel)
}

const clearMapelSelection = () => {
    formData.value.mapel = ''
    formData.value.guru = ''
    teachers.value = []
    mapelSearchQuery.value = ''
    fetchMapelDropdown(true)
}

const handleMapelClickOutside = (e) => {
    if (mapelDropdownRef.value && !mapelDropdownRef.value.contains(e.target)) {
        closeMapelDropdown()
    }
}

// ===================== Load schedule data (edit mode) =====================
const loadScheduleData = async () => {
    if (!isEditMode.value) return

    loadingData.value = true
    const result = await schedulesStore.getScheduleById(scheduleId.value)
    loadingData.value = false

    if (result.success && result.data) {
        const schedule = result.data
        const mapelId = schedule.guru?.mapel?.id_mapel || ''
        const mapelNama = schedule.guru?.mapel?.nama_mapel || ''

        formData.value = {
            jamMulai: schedule.jam_mulai ? schedule.jam_mulai.substring(0, 5) : '',
            jamSelesai: schedule.jam_selesai ? schedule.jam_selesai.substring(0, 5) : '',
            kelas: schedule.id_kelas || '',
            mapel: mapelId,
            guru: schedule.guru?.id_guru || '',
            hari: schedule.hari || ''
        }

        // Seed cache
        if (schedule.id_kelas && schedule.nama_kelas) {
            kelasNameCache.value[schedule.id_kelas] = schedule.nama_kelas
            kelasSearchQuery.value = schedule.nama_kelas
        }
        if (mapelId && mapelNama) {
            mapelNameCache.value[mapelId] = mapelNama
            mapelSearchQuery.value = mapelNama
        }
        if (schedule.hari) {
            // hari langsung dari formData, tidak perlu seed query
        }

        // Fetch guru berdasarkan mapel yang sudah dipilih
        if (mapelId) {
            await fetchGuruByMapel(mapelId)
            // Restore guru setelah fetch (fetchGuruByMapel mereset formData.guru)
            formData.value.guru = schedule.guru?.id_guru || ''
            const guruNama = schedule.guru?.nama_guru || ''
            if (formData.value.guru && guruNama) {
                guruNameCache.value[formData.value.guru] = guruNama
            }
        }
    } else {
        showAlert('error', 'Gagal memuat data jadwal')
        scrollToAlert()
    }
}

// ===================== Validation & Submit =====================
const validateForm = () => {
    if (!formData.value.jamMulai || !formData.value.jamSelesai) {
        showAlert('error', 'Jam mulai dan jam selesai wajib diisi')
        scrollToAlert()
        return false
    }
    if (!formData.value.kelas) {
        showAlert('error', 'Kelas wajib dipilih')
        scrollToAlert()
        return false
    }
    if (!formData.value.mapel) {
        showAlert('error', 'Mata pelajaran wajib dipilih')
        scrollToAlert()
        return false
    }
    if (!formData.value.guru) {
        showAlert('error', 'Guru wajib dipilih')
        scrollToAlert()
        return false
    }
    if (!formData.value.hari) {
        showAlert('error', 'Hari wajib dipilih')
        scrollToAlert()
        return false
    }
    if (formData.value.jamMulai >= formData.value.jamSelesai) {
        showAlert('error', 'Jam selesai harus lebih besar dari jam mulai')
        scrollToAlert()
        return false
    }
    return true
}

const handleSubmit = async () => {
    clearAlert()

    if (!validateForm()) return

    loading.value = true

    const payload = {
        id_kelas: parseInt(formData.value.kelas),
        hari: formData.value.hari,
        jam_mulai: formData.value.jamMulai,
        jam_selesai: formData.value.jamSelesai,
        id_guru: parseInt(formData.value.guru),
        id_mapel: parseInt(formData.value.mapel)
    }

    let result
    if (isEditMode.value) {
        result = await schedulesStore.updateSchedule(scheduleId.value, payload)
    } else {
        result = await schedulesStore.createSchedule(payload)
    }

    loading.value = false

    if (result.success) {
        showAlert('success', isEditMode.value ? 'Jadwal berhasil diupdate!' : 'Jadwal berhasil ditambahkan!', {
            redirectDelay: 1500,
            redirectFn: () => router.push('/schedule')
        })
        scrollToAlert()
    } else {
        showAlert('error', result.message)
        scrollToAlert()
    }
}

// ===================== Lifecycle =====================
onMounted(async () => {
    if (process.client) {
        await import('clock-timepicker')
    }

    // Pre-fetch dropdown data
    await Promise.all([
        fetchKelasDropdown(true),
        fetchMapelDropdown(true)
    ])

    // Set kelas dari query param jika ada
    const kelasIdFromQuery = route.query.kelasId
    if (kelasIdFromQuery) {
        formData.value.kelas = parseInt(kelasIdFromQuery)
    }

    await loadScheduleData()

    if (process.client) {
        document.addEventListener('click', handleKelasClickOutside)
        document.addEventListener('click', handleMapelClickOutside)
        document.addEventListener('click', handleGuruClickOutside)
        document.addEventListener('click', handleHariClickOutside)
    }
})

onUnmounted(() => {
    clearTimeout(kelasSearchTimer)
    clearTimeout(mapelSearchTimer)
    if (process.client) {
        document.removeEventListener('click', handleKelasClickOutside)
        document.removeEventListener('click', handleMapelClickOutside)
        document.removeEventListener('click', handleGuruClickOutside)
        document.removeEventListener('click', handleHariClickOutside)
    }
})
</script>

<style scoped>
.custom-scroll::-webkit-scrollbar {
    width: 4px;
}

.custom-scroll::-webkit-scrollbar-track {
    background: transparent;
    margin: 4px 0;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 99px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
    background-color: #9ca3af;
}

.custom-scroll {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
}

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

:deep(.timepicker-simple input:focus) {
    border-color: rgb(59 130 246) !important;
    box-shadow: 0 0 0 1px rgb(59 130 246) !important;
    outline: none !important;
}

:deep(.timepicker-simple input::placeholder) {
    color: rgb(156 163 175) !important;
}
</style>