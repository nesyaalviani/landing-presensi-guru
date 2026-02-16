<template>
    <div class="min-h-screen bg-gray-50 py-2">
        <div class="max-w-7xl space-y-2 sm:space-y-3">
            <section class="stats-section">
                <div class="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <div class="px-4 py-6 shadow-lg shadow-yellow-100 bg-white rounded-lg">
                        <div class="flex items-start justify-between">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-500">Menunggu</p>
                                <p class="mt-2 text-3xl font-semibold text-gray-800">{{ presensiStore.totalPending }}</p>
                            </div>
                            <div class="h-12 w-12 rounded-xl bg-yellow-50 p-2.5 text-yellow-400 flex items-center justify-center flex-shrink-0">
                                <Clock class="h-7 w-7" />
                            </div>
                        </div>
                    </div>

                    <div class="px-4 py-6 shadow-lg shadow-green-100 bg-white rounded-lg">
                        <div class="flex items-start justify-between">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-500">Disetujui</p>
                                <p class="mt-2 text-3xl font-semibold text-gray-800">{{ presensiStore.totalApproved }}</p>
                            </div>
                            <div class="h-12 w-12 rounded-xl bg-green-50 p-2.5 text-green-400 flex items-center justify-center flex-shrink-0">
                                <CheckCircle class="h-7 w-7" />
                            </div>
                        </div>
                    </div>

                    <div class="px-4 py-6 shadow-lg shadow-rose-100 bg-white rounded-lg">
                        <div class="flex items-start justify-between">
                            <div class="flex-1 min-w-0">
                                <p class="text-sm font-medium text-gray-500">Ditolak</p>
                                <p class="mt-2 text-3xl font-semibold text-gray-800">{{ presensiStore.totalRejected }}</p>
                            </div>
                            <div class="h-12 w-12 rounded-xl bg-rose-50 p-2.5 text-rose-400 flex items-center justify-center flex-shrink-0">
                                <XCircle class="h-7 w-7" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

           <section class="filter-section pt-5">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5">
                <div class="flex flex-col md:flex-row gap-3">
                    <div class="flex-1 max-w-md">
                        <div class="relative">
                        <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                        v-model="searchQuery" 
                        type="text"
                        class="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        placeholder="Cari nama guru atau mata pelajaran..." 
                        />
                        </div>
                    </div>
                    
                    <div class="relative w-full md:w-52">
                        <select 
                            v-model="filterStatus"
                            class="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white appearance-none cursor-pointer transition">
                            <option value="all">Semua Status</option>
                            <option value="Pending">Menunggu</option>
                            <option value="Approved">Disetujui</option>
                            <option value="Rejected">Ditolak</option>
                        </select>
                        <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <input 
                    v-model="filterDate" 
                    type="date"
                    class="w-full md:w-auto px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition" 
                    />
                </div>
            </div>
      </section>

            <section class="table-section py-2">
                <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Tanggal</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Guru</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Kelas</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Jam</th>
                                    <th class="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                                    <th class="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody class="bg-white divide-y divide-gray-200">
                                <!-- Loading State -->
                                <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                                    <td class="px-6 py-4" v-for="j in 6" :key="j">
                                        <div class="h-4 bg-gray-200 rounded"></div>
                                    </td>
                                </tr>

                                <!-- Empty State -->
                                <tr v-else-if="filteredPresensi.length === 0">
                                    <td colspan="6" class="px-6 py-12 text-center">
                                        <FileText class="mx-auto h-12 w-12 text-gray-300 mb-3" />
                                        <p class="text-sm font-medium text-gray-900">Tidak ada data presensi</p>
                                        <p class="text-xs text-gray-500 mt-1">Presensi akan muncul setelah diinput</p>
                                    </td>
                                </tr>

                                <!-- Data Rows -->
                                <tr v-else v-for="presensi in filteredPresensi" :key="presensi.id_presensi"
                                    class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm font-medium text-gray-900">{{ formatDate(presensi.tanggal) }}</div>
                                    </td>
                                    <td class="px-6 py-4">
                                        <div class="text-sm font-semibold text-gray-900">{{ getGuruName(presensi) }}</div>
                                        <div class="text-xs text-gray-500 mt-0.5">{{ getMapelName(presensi) }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-700">{{ presensi.guru?.kelas || '-' }}</div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-700">
                                            {{ formatTime(presensi.jam_mulai) }} - {{ formatTime(presensi.jam_selesai) }}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span :class="[
                                            'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                                            presensi.status_approve === 'Pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : presensi.status_approve === 'Approved'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                        ]">
                                            {{ presensi.status_approve }}
                                        </span>
                                    </td>
                                    <td class="px-6 py-4 text-center whitespace-nowrap">
                                        <button @click="openDetailModal(presensi)"
                                            class="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors">
                                            <Eye class="h-4 w-4" />
                                            Detail
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                  <div class="bg-white py-3 border-t border-gray-200 sm:px-6">
                <div class="flex items-center justify-between">
                    <div class="flex-1 flex justify-between sm:hidden">
                        <button
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Previous
                        </button>
                        <button
                            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                    <div class="hidden sm:flex sm:items-center sm:justify-end sm:w-full">
                        <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                            <button
                                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <ChevronLeft class="h-5 w-5" />
                            </button>
                            <button
                                class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                                1
                            </button>
                            <button
                                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <ChevronRight class="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
            </section>
        </div>

        <!-- Detail Modal - Unchanged -->
        <div v-if="showDetailModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeDetailModal">
            <div class="flex items-center justify-center min-h-screen px-4 py-6">
                <div class="fixed inset-0 bg-black/40 transition-opacity" @click="closeDetailModal"></div>

                <div class="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 z-50">
                    <!-- Modal Header -->
                    <div class="flex items-center justify-between mb-6 pb-4 border-b">
                        <div>
                            <h3 class="text-xl font-bold text-gray-900">Detail Presensi</h3>
                            <p class="text-sm text-gray-500 mt-0.5">#{{ selectedPresensi?.id_presensi }}</p>
                        </div>
                        <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                            <X class="h-6 w-6" />
                        </button>
                    </div>

                    <!-- Modal Content -->
                    <div class="space-y-6">
                        <!-- Info Grid -->
                        <div class="grid grid-cols-2 gap-6">
                            <div>
                                <label class="text-xs font-semibold text-gray-500 uppercase">Tanggal</label>
                                <p class="text-sm font-medium text-gray-900 mt-1.5">{{ formatDate(selectedPresensi?.tanggal) }}</p>
                            </div>
                            <div>
                                <label class="text-xs font-semibold text-gray-500 uppercase">Jam Pelajaran</label>
                                <p class="text-sm font-medium text-gray-900 mt-1.5">
                                    {{ formatTime(selectedPresensi?.jam_mulai) }} - {{ formatTime(selectedPresensi?.jam_selesai) }}
                                </p>
                            </div>
                            <div>
                                <label class="text-xs font-semibold text-gray-500 uppercase">Nama Guru</label>
                                <p class="text-sm font-medium text-gray-900 mt-1.5">{{ getGuruName(selectedPresensi) }}</p>
                            </div>
                            <div>
                                <label class="text-xs font-semibold text-gray-500 uppercase">Mata Pelajaran</label>
                                <p class="text-sm font-medium text-gray-900 mt-1.5">{{ getMapelName(selectedPresensi) }}</p>
                            </div>
                            <div>
                                <label class="text-xs font-semibold text-gray-500 uppercase">Status Kehadiran</label>
                                <p class="mt-1.5">
                                    <span :class="[
                                        'inline-flex px-2.5 py-1 text-xs font-medium rounded-full',
                                        selectedPresensi?.status === 'Hadir' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    ]">
                                        {{ selectedPresensi?.status }}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label class="text-xs font-semibold text-gray-500 uppercase">Memberikan Tugas</label>
                                <p class="text-sm font-medium text-gray-900 mt-1.5">
                                    {{ selectedPresensi?.memberikan_tugas === true ? 'Ya' : selectedPresensi?.memberikan_tugas === false ? 'Tidak' : '-' }}
                                </p>
                            </div>
                        </div>

                        <!-- Photo -->
                        <div v-if="selectedPresensi?.foto_bukti">
                            <label class="text-xs font-semibold text-gray-500 uppercase block mb-2">Foto Bukti</label>
                            <div class="border border-gray-200 rounded-lg overflow-hidden">
                                <img :src="selectedPresensi.foto_bukti" alt="Foto Bukti"
                                    class="w-full h-64 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                                    @click="openImageModal(selectedPresensi.foto_bukti)" />
                            </div>
                        </div>

                        <!-- Notes -->
                        <div v-if="selectedPresensi?.catatan">
                            <label class="text-xs font-semibold text-gray-500 uppercase block mb-2">Catatan</label>
                            <p class="text-sm text-gray-700 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                {{ selectedPresensi.catatan }}
                            </p>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div v-if="selectedPresensi?.status_approve === 'Pending'" class="flex gap-3 mt-6 pt-6 border-t">
                        <button @click="handleReject" :disabled="processing"
                            class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <XCircle v-if="!processing" class="h-4 w-4" />
                            <Loader2 v-else class="h-4 w-4 animate-spin" />
                            {{ processing ? 'Memproses...' : 'Tolak' }}
                        </button>
                        <button @click="handleApprove" :disabled="processing"
                            class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <CheckCircle v-if="!processing" class="h-4 w-4" />
                            <Loader2 v-else class="h-4 w-4 animate-spin" />
                            {{ processing ? 'Memproses...' : 'Setujui' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Image Modal - Unchanged -->
        <div v-if="showImageModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
            @click="closeImageModal">
            <img :src="selectedImage" alt="Full Image" class="max-w-full max-h-full object-contain rounded-lg" />
            <button @click="closeImageModal" class="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors">
                <X class="h-8 w-8" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePresensiStore } from '~/stores/presensi'
import { Clock, CheckCircle, XCircle, Search, Eye, X, FileText, Loader2,ChevronDown, ChevronLeft, ChevronRight } from 'lucide-vue-next'


const presensiStore = usePresensiStore()
const loading = ref(false)
const processing = ref(false)

const searchQuery = ref('')
const filterStatus = ref('all')
const filterDate = ref('')

const showDetailModal = ref(false)
const showImageModal = ref(false)
const selectedPresensi = ref(null)
const selectedImage = ref('')

onMounted(async () => {
    loading.value = true
    await presensiStore.getAllPresensi()
    loading.value = false
})

const filteredPresensi = computed(() => {
    let result = presensiStore.presensiList

    if (filterStatus.value !== 'all') {
        result = result.filter(p => p.status_approve === filterStatus.value)
    }

    if (filterDate.value) {
        result = result.filter(p => {
            const presensiDate = new Date(p.tanggal).toISOString().split('T')[0]
            return presensiDate === filterDate.value
        })
    }

    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(p => {
            const guruName = getGuruName(p).toLowerCase()
            const mapelName = getMapelName(p).toLowerCase()
            return guruName.includes(query) || mapelName.includes(query)
        })
    }

    return result
})

const getGuruName = (presensi) => {
    return presensi?.guru?.nama_guru || 'N/A'
}

const getMapelName = (presensi) => {
    return presensi?.guru?.mapel?.nama_mapel || 'N/A'
}

const formatDate = (date) => {
    if (!date) return '-'
    const d = new Date(date)
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return d.toLocaleDateString('id-ID', options)
}

const formatTime = (time) => {
    if (!time) return '-'
    return time.substring(0, 5)
}

const openDetailModal = (presensi) => {
    selectedPresensi.value = presensi
    showDetailModal.value = true
}

const closeDetailModal = () => {
    showDetailModal.value = false
    selectedPresensi.value = null
}

const openImageModal = (imageUrl) => {
    selectedImage.value = imageUrl
    showImageModal.value = true
}

const closeImageModal = () => {
    showImageModal.value = false
    selectedImage.value = ''
}

const handleApprove = async () => {
    if (!selectedPresensi.value) return

    const confirmed = confirm('Apakah Anda yakin ingin menyetujui presensi ini?')
    if (!confirmed) return

    processing.value = true

    const result = await presensiStore.approvePresensi(selectedPresensi.value.id_presensi, 'Approved')

    if (result.success) {
        alert('Presensi berhasil disetujui!')
        closeDetailModal()
    } else {
        alert(result.message || 'Gagal menyetujui presensi')
    }

    processing.value = false
}

const handleReject = async () => {
    if (!selectedPresensi.value) return

    const confirmed = confirm('Apakah Anda yakin ingin menolak presensi ini?')
    if (!confirmed) return

    processing.value = true

    const result = await presensiStore.approvePresensi(selectedPresensi.value.id_presensi, 'Rejected')

    if (result.success) {
        alert('Presensi berhasil ditolak!')
        closeDetailModal()
    } else {
        alert(result.message || 'Gagal menolak presensi')
    }

    processing.value = false
}
</script>