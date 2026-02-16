<template>
    <div class="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div class="max-w-7xl mx-auto">
            <div class="mb-6">
                <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Approve Presensi Guru</h1>
                <p class="mt-1 text-sm text-gray-600">Kelola dan approve presensi guru yang masuk</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-yellow-600 uppercase">Pending</p>
                            <p class="text-2xl font-bold text-yellow-900 mt-1">{{ presensiStore.totalPending }}</p>
                        </div>
                        <div class="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                            <svg class="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-green-600 uppercase">Approved</p>
                            <p class="text-2xl font-bold text-green-900 mt-1">{{ presensiStore.totalApproved }}</p>
                        </div>
                        <div class="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                            <svg class="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    </div>
                </div>

                <div class="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs font-medium text-red-600 uppercase">Rejected</p>
                            <p class="text-2xl font-bold text-red-900 mt-1">{{ presensiStore.totalRejected }}</p>
                        </div>
                        <div class="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center">
                            <svg class="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div class="lg:col-span-2">
                        <label class="block text-xs font-medium text-gray-700 mb-1">Cari</label>
                        <input v-model="searchQuery" type="text"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Cari nama guru atau mata pelajaran..." />
                    </div>

                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Status</label>
                        <select v-model="filterStatus"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                            <option value="all">Semua Status</option>
                            <option value="Pending">Pending</option>
                            <option value="Approved">Approved</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>

                    <div>
                        <label class="block text-xs font-medium text-gray-700 mb-1">Tanggal</label>
                        <input v-model="filterDate" type="date"
                            class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tanggal
                                </th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Guru & Mapel
                                </th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Kelas
                                </th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jam
                                </th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status Kehadiran
                                </th>
                                <th
                                    class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status Approve
                                </th>
                                <th
                                    class="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-if="loading" v-for="i in 5" :key="i" class="animate-pulse">
                                <td class="px-4 py-4" v-for="j in 7" :key="j">
                                    <div class="h-4 bg-gray-200 rounded"></div>
                                </td>
                            </tr>

                            <tr v-else-if="filteredPresensi.length === 0">
                                <td colspan="7" class="px-4 py-8 text-center text-sm text-gray-500">
                                    <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor"
                                        viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <p class="mt-2 font-medium">Tidak ada data presensi</p>
                                    <p class="text-xs">Presensi akan muncul di sini setelah KM menginput</p>
                                </td>
                            </tr>

                            <tr v-else v-for="presensi in filteredPresensi" :key="presensi.id_presensi"
                                class="hover:bg-gray-50 transition">
                                <td class="px-4 py-4 text-sm text-gray-900">
                                    {{ formatDate(presensi.tanggal) }}
                                </td>
                                <td class="px-4 py-4">
                                    <div class="text-sm font-medium text-gray-900">{{ getGuruName(presensi) }}</div>
                                    <div class="text-xs text-gray-500">{{ getMapelName(presensi) }}</div>
                                </td>
                                <td class="px-4 py-4 text-sm text-gray-500">
                                    {{ presensi.guru?.kelas || '-' }}
                                </td>
                                <td class="px-4 py-4 text-sm text-gray-500">
                                    {{ formatTime(presensi.jam_mulai) }} - {{ formatTime(presensi.jam_selesai) }}
                                </td>
                                <td class="px-4 py-4">
                                    <span :class="[
                                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                                        presensi.status === 'Hadir'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    ]">
                                        {{ presensi.status }}
                                    </span>
                                </td>
                                <td class="px-4 py-4">
                                    <span :class="[
                                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                                        presensi.status_approve === 'Pending'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : presensi.status_approve === 'Approved'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                    ]">
                                        {{ presensi.status_approve }}
                                    </span>
                                </td>
                                <td class="px-4 py-4 text-center">
                                    <button @click="openDetailModal(presensi)"
                                        class="text-blue-600 hover:text-blue-800 font-medium text-sm">
                                        Detail
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div v-if="showDetailModal" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeDetailModal">
            <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" @click="closeDetailModal"></div>

                <div
                    class="relative inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-lg">
                    <div class="flex items-start justify-between mb-4">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">Detail Presensi</h3>
                            <p class="text-sm text-gray-500 mt-1">ID: #{{ selectedPresensi?.id_presensi }}</p>
                        </div>
                        <button @click="closeDetailModal" class="text-gray-400 hover:text-gray-600">
                            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-xs font-medium text-gray-500">Tanggal</label>
                                <p class="text-sm font-medium text-gray-900 mt-1">{{
                                    formatDate(selectedPresensi?.tanggal) }}</p>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-gray-500">Jam Pelajaran</label>
                                <p class="text-sm font-medium text-gray-900 mt-1">
                                    {{ formatTime(selectedPresensi?.jam_mulai) }} - {{
                                        formatTime(selectedPresensi?.jam_selesai) }}
                                </p>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-gray-500">Nama Guru</label>
                                <p class="text-sm font-medium text-gray-900 mt-1">{{ getGuruName(selectedPresensi) }}
                                </p>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-gray-500">Mata Pelajaran</label>
                                <p class="text-sm font-medium text-gray-900 mt-1">{{ getMapelName(selectedPresensi) }}
                                </p>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-gray-500">Status Kehadiran</label>
                                <p class="mt-1">
                                    <span :class="[
                                        'inline-flex px-2 py-1 text-xs font-semibold rounded-full',
                                        selectedPresensi?.status === 'Hadir'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                    ]">
                                        {{ selectedPresensi?.status }}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label class="text-xs font-medium text-gray-500">Memberikan Tugas</label>
                                <p class="text-sm font-medium text-gray-900 mt-1">
                                    {{ selectedPresensi?.memberikan_tugas === true ? 'Ya' :
                                        selectedPresensi?.memberikan_tugas === false
                                    ? 'Tidak' : '-' }}
                                </p>
                            </div>
                        </div>

                        <div v-if="selectedPresensi?.foto_bukti">
                            <label class="text-xs font-medium text-gray-500">Foto Bukti</label>
                            <div class="mt-2 border border-gray-200 rounded-lg overflow-hidden">
                                <img :src="selectedPresensi.foto_bukti" alt="Foto Bukti"
                                    class="w-full h-64 object-cover cursor-pointer"
                                    @click="openImageModal(selectedPresensi.foto_bukti)" />
                            </div>
                        </div>

                        <div v-if="selectedPresensi?.catatan">
                            <label class="text-xs font-medium text-gray-500">Catatan</label>
                            <p class="text-sm text-gray-900 mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                {{ selectedPresensi.catatan }}
                            </p>
                        </div>

                        <div class="border-t pt-4">
                            <label class="text-xs font-medium text-gray-500">Status Approval</label>
                            <p class="mt-2">
                                <span :class="[
                                    'inline-flex px-3 py-1.5 text-sm font-semibold rounded-full',
                                    selectedPresensi?.status_approve === 'Pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : selectedPresensi?.status_approve === 'Approved'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                ]">
                                    {{ selectedPresensi?.status_approve }}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div v-if="selectedPresensi?.status_approve === 'Pending'" class="flex gap-3 mt-6 pt-6 border-t">
                        <button @click="handleReject" :disabled="processing"
                            class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                            <span v-if="!processing">Reject</span>
                            <span v-else class="flex items-center justify-center">
                                <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Processing...
                            </span>
                        </button>
                        <button @click="handleApprove" :disabled="processing"
                            class="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition">
                            <span v-if="!processing">Approve</span>
                            <span v-else class="flex items-center justify-center">
                                <svg class="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                    </path>
                                </svg>
                                Processing...
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="showImageModal"
            class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-90"
            @click="closeImageModal">
            <img :src="selectedImage" alt="Full Image" class="max-w-full max-h-full object-contain" />
            <button @click="closeImageModal" class="absolute top-4 right-4 text-white hover:text-gray-300 transition">
                <svg class="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePresensiStore } from '~/stores/presensi'

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