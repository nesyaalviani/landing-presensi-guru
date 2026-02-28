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
                        <AppAlert :type="alertType" :message="alertMessage" :redirect-delay="alertRedirectDelay"
                            :on-close="clearAlert" :on-redirect="alertRedirectFn" />

                        <div>
                            <label class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Jam Pelajaran <span class="text-red-500">*</span>
                            </label>
                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label for="jam-mulai"
                                        class="block text-xs font-medium text-gray-600 mb-1.5">
                                        Jam Mulai
                                    </label>
                                    <ClientOnly>
                                        <clock-timepicker 
                                            id="jam-mulai" 
                                            :value="formData.jamMulai"
                                            @input="formData.jamMulai = $event.target.value"
                                            required
                                            placeholder="00:00" 
                                            class="timepicker-simple">
                                        </clock-timepicker>
                                    </ClientOnly>
                                </div>

                                <div>
                                    <label for="jam-selesai"
                                        class="block text-xs font-medium text-gray-600 mb-1.5">
                                        Jam Selesai
                                    </label>
                                    <ClientOnly>
                                        <clock-timepicker 
                                            id="jam-selesai" 
                                            :value="formData.jamSelesai"
                                            @input="formData.jamSelesai = $event.target.value"
                                            required 
                                            placeholder="00:00" 
                                            class="timepicker-simple">
                                        </clock-timepicker>
                                    </ClientOnly>
                                </div>
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih jam mulai dan jam selesai pelajaran
                            </p>
                        </div>

                        <div>
                            <label for="kelas"
                                class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Kelas <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <select id="kelas" v-model="formData.kelas" required
                                    class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all hover:border-gray-400">
                                    <option value="" disabled>Pilih Kelas</option>
                                    <option v-for="kelas in classrooms" :key="kelas.id" :value="kelas.id">
                                        {{ kelas.name }}
                                    </option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih kelas yang akan mengikuti pelajaran
                            </p>
                        </div>

                        <div>
                            <label for="mapel"
                                class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Mata Pelajaran <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <select id="mapel" v-model="formData.mapel" required @change="filterTeachers"
                                    class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all hover:border-gray-400">
                                    <option value="" disabled>Pilih Mata Pelajaran</option>
                                    <option v-for="mapel in activeSubjects" :key="mapel.id_mapel"
                                        :value="mapel.id_mapel">
                                        {{ mapel.nama_mapel }}
                                    </option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">Pilih mata pelajaran yang akan diajarkan</p>
                        </div>

                        <div>
                            <label for="guru"
                                class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Guru <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <select id="guru" v-model="formData.guru" required
                                    :disabled="!formData.mapel || filteredTeachers.length === 0"
                                    class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed">
                                    <option value="" disabled>
                                        {{ !formData.mapel ? 'Pilih mata pelajaran terlebih dahulu' : 'Pilih Guru' }}
                                    </option>
                                    <option v-for="guru in filteredTeachers" :key="guru.id_guru"
                                        :value="guru.id_guru">
                                        {{ guru.nama_guru }}
                                    </option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                            </div>
                            <p class="mt-1.5 text-xs text-gray-500">
                                {{ filteredTeachers.length === 0 && formData.mapel ? 'Tidak ada guru yang mengajar mata pelajaran ini' : 'Pilih guru pengajar' }}
                            </p>
                        </div>

                        <div>
                            <label for="hari"
                                class="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                                Hari <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <select id="hari" v-model="formData.hari" required
                                    class="w-full pl-4 pr-10 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none bg-white transition-all hover:border-gray-400">
                                    <option value="" disabled>Pilih Hari</option>
                                    <option value="Senin">Senin</option>
                                    <option value="Selasa">Selasa</option>
                                    <option value="Rabu">Rabu</option>
                                    <option value="Kamis">Kamis</option>
                                    <option value="Jumat">Jumat</option>
                                    <option value="Sabtu">Sabtu</option>
                                </select>
                                <ChevronDown
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
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
import { ref, onMounted, computed } from 'vue'
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

const classrooms = ref([])
const teachers = ref([])
const subjects = ref([])
const filteredTeachers = ref([])
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

const activeSubjects = computed(() => {
    return subjects.value.filter(s => s.status === true)
})

const filterTeachers = () => {
    if (!formData.value.mapel) {
        filteredTeachers.value = []
        formData.value.guru = ''
        return
    }

    filteredTeachers.value = teachers.value.filter(teacher => {
        if (!teacher.mapel || teacher.mapel.length === 0) return false
        return teacher.mapel.some(m => m.id_mapel === parseInt(formData.value.mapel))
    })

    if (formData.value.guru) {
        const guruMasihValid = filteredTeachers.value.some(t => t.id_guru === formData.value.guru)
        if (!guruMasihValid) {
            formData.value.guru = ''
        }
    }
}

const loadScheduleData = async () => {
    if (!isEditMode.value) return

    loadingData.value = true
    const result = await schedulesStore.getScheduleById(scheduleId.value)
    loadingData.value = false

    if (result.success && result.data) {
        const schedule = result.data
        formData.value = {
            jamMulai: schedule.jam_mulai ? schedule.jam_mulai.substring(0, 5) : '',
            jamSelesai: schedule.jam_selesai ? schedule.jam_selesai.substring(0, 5) : '',
            kelas: schedule.id_kelas || '',
            mapel: schedule.guru?.mapel?.id_mapel || '',
            guru: schedule.guru?.id_guru || '',
            hari: schedule.hari || ''
        }

        if (formData.value.mapel) {
            filterTeachers()
        }
    } else {
        showAlert('error', 'Gagal memuat data jadwal')
    }
}

const validateForm = () => {
    if (!formData.value.jamMulai || !formData.value.jamSelesai) {
        showAlert('error', 'Jam mulai dan jam selesai wajib diisi')
        return false
    }

    if (!formData.value.kelas) {
        showAlert('error', 'Kelas wajib dipilih')
        return false
    }

    if (!formData.value.mapel) {
        showAlert('error', 'Mata pelajaran wajib dipilih')
        return false
    }

    if (!formData.value.guru) {
        showAlert('error', 'Guru wajib dipilih')
        return false
    }

    if (!formData.value.hari) {
        showAlert('error', 'Hari wajib dipilih')
        return false
    }

    if (formData.value.jamMulai >= formData.value.jamSelesai) {
        showAlert('error', 'Jam selesai harus lebih besar dari jam mulai')
        return false
    }

    return true
}

const handleSubmit = async () => {
    clearAlert()

    if (!validateForm()) {
        return
    }

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
    } else {
        showAlert('error', result.message)
    }
}


onMounted(async () => {
    if (process.client) {
        await import('clock-timepicker') 
    }

    if (isEditMode.value) {
        loadingData.value = true
    }

    const [classResult, teacherResult, subjectResult] = await Promise.all([
        classroomsStore.getClassrooms({ all: true }),
        teachersStore.getTeachers({ all: true }),
        subjectsStore.getSubjects({ all: true })
    ])

    if (classResult.success) {
        classrooms.value = classroomsStore.classrooms
    }

    if (teacherResult.success) {
        teachers.value = teachersStore.teachers
    }

    if (subjectResult.success) {
        subjects.value = subjectsStore.subjects
    }

    await loadScheduleData()
})
</script>

<style scoped>
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