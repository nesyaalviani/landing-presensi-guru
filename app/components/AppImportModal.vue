<template>
    <Teleport to="body">
        <Transition name="modal-fade">
            <div v-if="modelValue"
                class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                @click.self="handleClose">
                <div class="bg-white rounded-sm shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">

                    <!-- Modal Header -->
                    <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                        <div class="flex items-center gap-2">
                            <FileSpreadsheet class="h-5 w-5 text-blue-500" />
                            <h2 class="text-base font-semibold text-gray-900">{{ title }}</h2>
                        </div>
                        <button @click="handleClose"
                            class="p-1 rounded-sm hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                            <X class="h-5 w-5" />
                        </button>
                    </div>

                    <!-- Modal Body -->
                    <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">

                        <!-- Info Format & Download Template -->
                        <div class="rounded-sm bg-blue-50 border border-blue-200 p-4">
                            <div class="flex items-start justify-between gap-4">
                                <div class="flex items-start gap-3">
                                    <Info class="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p class="text-xs font-medium text-blue-800 mb-1">Format File Excel</p>
                                        <p class="text-xs text-blue-700">
                                            <slot name="format-info">
                                                Pastikan file sesuai dengan template yang tersedia.
                                            </slot>
                                        </p>
                                    </div>
                                </div>
                                <button @click="emit('download-template')"
                                    class="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-700 bg-white border border-blue-300 rounded-sm hover:bg-blue-50 transition-colors whitespace-nowrap">
                                    <Download class="h-3.5 w-3.5" />
                                    Download Template
                                </button>
                            </div>
                        </div>

                        <!-- Drop Zone -->
                        <div v-if="!importFile" @click="triggerFileInput" @dragover.prevent="isDragging = true"
                            @dragleave.prevent="isDragging = false" @drop.prevent="onFileDrop" :class="[
                                'border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-all',
                                isDragging
                                    ? 'border-blue-400 bg-blue-50'
                                    : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                            ]">
                            <FileUp class="h-8 w-8 mx-auto mb-3 text-gray-400" />
                            <p class="text-sm font-medium text-gray-700 mb-1">Klik atau seret file ke sini</p>
                            <p class="text-xs text-gray-400">Format: .xlsx atau .xls (maks. 5MB)</p>
                            <input ref="fileInputRef" type="file" accept=".xlsx,.xls" class="hidden"
                                @change="onFileChange" />
                        </div>

                        <!-- File Selected State -->
                        <div v-else
                            class="flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm">
                            <div class="flex items-center gap-3">
                                <FileSpreadsheet class="h-5 w-5 text-green-600 flex-shrink-0" />
                                <div>
                                    <p class="text-sm font-medium text-gray-800">{{ importFile.name }}</p>
                                    <p class="text-xs text-gray-500">{{ formatFileSize(importFile.size) }}</p>
                                </div>
                            </div>
                            <button @click="resetImport"
                                class="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-sm transition-colors">
                                <X class="h-4 w-4" />
                            </button>
                        </div>

                        <!-- Preview Error -->
                        <div v-if="previewError"
                            class="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-sm">
                            <AlertCircle class="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p class="text-xs text-red-700">{{ previewError }}</p>
                        </div>

                        <!-- Validating indicator -->
                        <div v-if="validating"
                            class="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-sm">
                            <Loader2 class="h-4 w-4 text-blue-500 animate-spin flex-shrink-0" />
                            <p class="text-xs text-gray-600">Memvalidasi data...</p>
                        </div>

                        <!-- Preview Table -->
                        <div v-if="previewRows.length > 0 && !validating">
                            <div class="flex items-center justify-between mb-2">
                                <p class="text-xs font-medium text-gray-700">
                                    Preview Data
                                    <span class="ml-1.5 text-xs text-gray-500">({{ previewRows.length }} baris
                                        ditemukan)</span>
                                </p>
                                <div class="flex items-center gap-3">
                                    <!-- Summary valid/error -->
                                    <span v-if="errorCount > 0" class="text-xs text-red-500">
                                        {{ errorCount }} baris bermasalah
                                    </span>
                                    <span v-if="validCount > 0" class="text-xs text-green-600">
                                        {{ validCount }} baris valid
                                    </span>
                                    <span v-if="previewRows.length > 5" class="text-xs text-gray-400">
                                        Menampilkan 5 dari {{ previewRows.length }} baris
                                    </span>
                                </div>
                            </div>
                            <div class="border border-gray-200 rounded-sm overflow-hidden">
                                <div class="overflow-x-auto max-h-52">
                                    <table class="min-w-full text-xs divide-y divide-gray-200">
                                        <thead class="bg-gray-100 sticky top-0">
                                            <tr>
                                                <th
                                                    class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                                    #</th>
                                                <th v-for="col in previewColumns" :key="col"
                                                    class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                                    {{ col }}
                                                </th>
                                                <th
                                                    class="px-3 py-2 text-left font-medium text-gray-500 uppercase tracking-wider">
                                                    Status</th>
                                            </tr>
                                        </thead>
                                        <tbody class="divide-y divide-gray-100 bg-white">
                                            <tr v-for="(row, idx) in previewRows.slice(0, 5)" :key="idx"
                                                :class="row._error ? 'bg-red-50' : 'hover:bg-gray-50'">
                                                <td class="px-3 py-2 text-gray-400">{{ idx + 1 }}</td>
                                                <td v-for="col in previewColumns" :key="col"
                                                    class="px-3 py-2 text-gray-700">
                                                    <span v-if="row[col]">{{ row[col] }}</span>
                                                    <span v-else class="text-gray-300 italic">-</span>
                                                </td>
                                                <td class="px-3 py-2">
                                                    <span v-if="row._error"
                                                        class="inline-flex items-center gap-1 text-red-600">
                                                        <AlertCircle class="h-3 w-3 flex-shrink-0" />
                                                        {{ row._error }}
                                                    </span>
                                                    <span v-else class="inline-flex items-center gap-1 text-green-600">
                                                        <CheckCircle class="h-3 w-3" />
                                                        Valid
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <!-- Warning jika ada error tapi masih bisa import baris valid -->
                            <p v-if="hasPreviewErrors && validCount > 0" class="mt-2 text-xs text-amber-600">
                                Baris yang bermasalah akan dilewati saat import.
                            </p>
                            <p v-else-if="hasPreviewErrors && validCount === 0" class="mt-2 text-xs text-red-600">
                                Semua baris bermasalah. Perbaiki file sebelum import.
                            </p>
                        </div>

                        <!-- Import Result -->
                       <div v-if="importResult">
                            <!-- Success -->
                            <div v-if="importResult.success" class="space-y-3">
                                <div
                                    class="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-sm">
                                    <CheckCircle class="h-4 w-4 text-green-600 flex-shrink-0" />
                                    <p class="text-xs text-green-700 font-medium">
                                        Berhasil mengimport {{ importResult.total }} data.
                                        <span v-if="importResult.skipped > 0" class="font-normal">
                                            ({{ importResult.skipped }} dilewati karena duplikat)
                                        </span>
                                    </p>
                                </div>

                                <!-- Tampilkan errors jika ada baris yang gagal -->
                                <div v-if="importResult.errors?.length > 0"
                                    class="px-4 py-3 bg-amber-50 border border-amber-200 rounded-sm">
                                    <div class="flex items-center gap-2 mb-2">
                                        <AlertCircle class="h-4 w-4 text-amber-600 flex-shrink-0" />
                                        <p class="text-xs font-medium text-amber-700">
                                            {{ importResult.errors.length }} baris dilewati karena ada masalah:
                                        </p>
                                    </div>
                                    <ul class="space-y-1 max-h-32 overflow-y-auto">
                                        <li v-for="(err, i) in importResult.errors" :key="i"
                                            class="text-xs text-amber-700 pl-2 border-l-2 border-amber-300">
                                            {{ err }}
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Failed -->
                            <div v-else class="space-y-3">
                                <div
                                    class="flex items-start gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-sm">
                                    <AlertCircle class="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p class="text-xs font-medium text-red-700 mb-0.5">Import gagal</p>
                                        <p class="text-xs text-red-600">{{ importResult.message }}</p>
                                    </div>
                                </div>
                                <!-- Daftar error per baris -->
                                <div v-if="importResult.errors?.length > 0"
                                    class="px-4 py-3 bg-red-50 border border-red-200 rounded-sm">
                                    <p class="text-xs font-medium text-red-700 mb-2">Detail error:</p>
                                    <ul class="space-y-1 max-h-32 overflow-y-auto">
                                        <li v-for="(err, i) in importResult.errors" :key="i"
                                            class="text-xs text-red-700 pl-2 border-l-2 border-red-300">
                                            {{ err }}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>

                    <!-- Modal Footer -->
                    <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200 bg-gray-50">
                        <button @click="handleClose" :disabled="importing"
                            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 disabled:opacity-50 transition-colors">
                            {{ importResult?.success ? 'Tutup' : 'Batal' }}
                        </button>
                        <button v-if="!importResult?.success" @click="handleImport"
                            :disabled="!importFile || previewRows.length === 0 || validCount === 0 || importing || validating"
                            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                            <Loader2 v-if="importing" class="h-4 w-4 animate-spin" />
                            <Upload v-else class="h-4 w-4" />
                            {{ importing ? 'Mengimport...' : 'Import Data' }}
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import {
    FileSpreadsheet, FileUp, X, Info, Download,
    AlertCircle, CheckCircle, Loader2, Upload
} from 'lucide-vue-next'

// ===================== Props & Emits =====================
const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    },
    title: {
        type: String,
        default: 'Import Data'
    },
    // Kolom yang wajib ada & tidak boleh kosong
    requiredColumns: {
        type: Array,
        default: () => []
    },
    // Semua kolom yang ditampilkan di preview
    previewColumns: {
        type: Array,
        default: () => []
    },
    // Fungsi async untuk handle import, harus return { success, data/message }
    importFn: {
        type: Function,
        required: true
    },
    // Fungsi validasi per baris (opsional).
    // Menerima raw row object, return string pesan error atau null jika valid.
    // Bisa async (misal fetch ke API) atau sync (validasi data lokal).
    validateRow: {
        type: Function,
        default: null
    }
})

const emit = defineEmits(['update:modelValue', 'download-template', 'imported'])

// ===================== State =====================
const importFile = ref(null)
const previewRows = ref([])
const previewError = ref(null)
const importing = ref(false)
const validating = ref(false)
const importResult = ref(null)
const isDragging = ref(false)
const fileInputRef = ref(null)

// ===================== Computed =====================
const hasPreviewErrors = computed(() => previewRows.value.some(r => r._error))
const errorCount = computed(() => previewRows.value.filter(r => r._error).length)
const validCount = computed(() => previewRows.value.filter(r => !r._error).length)

// ===================== Body Scroll Lock =====================
watch(() => props.modelValue, (val) => {
    if (process.client) {
        document.body.style.overflow = val ? 'hidden' : ''
    }
})

// ===================== Methods =====================
const handleClose = () => {
    if (importing.value) return
    emit('update:modelValue', false)
    setTimeout(resetImport, 300)
}

const resetImport = () => {
    importFile.value = null
    previewRows.value = []
    previewError.value = null
    importResult.value = null
    isDragging.value = false
    if (fileInputRef.value) fileInputRef.value.value = ''
}

const triggerFileInput = () => fileInputRef.value?.click()

const onFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
}

const onFileDrop = (e) => {
    isDragging.value = false
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
}

const processFile = async (file) => {
    const allowedExt = ['.xlsx', '.xls']
    const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase()

    if (!allowedExt.includes(ext)) {
        previewError.value = 'Format file tidak didukung. Gunakan file .xlsx atau .xls.'
        return
    }
    if (file.size > 5 * 1024 * 1024) {
        previewError.value = 'Ukuran file melebihi 5MB.'
        return
    }

    importFile.value = file
    previewError.value = null
    importResult.value = null
    previewRows.value = []

    try {
        const XLSX = await import('xlsx')
        const buffer = await file.arrayBuffer()
        const workbook = XLSX.read(buffer, { type: 'array' })
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(worksheet)

        if (data.length === 0) {
            previewError.value = 'File tidak memiliki data.'
            return
        }

        validating.value = true

        // Proses tiap baris: cek kosong dulu, lalu jalankan validateRow jika ada
        const rows = []
        for (const row of data) {
            // Petakan ke previewColumns
            const mapped = {}
            for (const col of props.previewColumns) {
                mapped[col] = row[col] !== undefined ? String(row[col]) : ''
            }

            // 1. Cek kolom wajib tidak kosong
            let error = null
            for (const col of props.requiredColumns) {
                const val = row[col] !== undefined ? String(row[col]).trim() : ''
                if (!val) {
                    error = `${col} kosong`
                    break
                }
            }

            // 2. Jalankan validateRow dari parent jika lolos cek kosong
            if (!error && props.validateRow) {
                error = await props.validateRow(row) ?? null
            }

            rows.push({ ...mapped, _error: error })
        }

        previewRows.value = rows
        validating.value = false

    } catch (e) {
        previewError.value = 'Gagal membaca file. Pastikan format file benar.'
        previewRows.value = []
        validating.value = false
    }
}

const handleImport = async () => {
    if (!importFile.value || importing.value) return

    importing.value = true
    importResult.value = null

    const result = await props.importFn(importFile.value)

    importing.value = false

    if (result.success) {
        const inserted = result.inserted ?? result.data?.inserted ?? 0
        const skipped = result.skipped ?? result.data?.skipped ?? 0
        const errors = result.errors ?? result.data?.errors ?? []

        // ← Kalau tidak ada yang berhasil diinsert, anggap gagal
        if (inserted === 0) {
            importResult.value = {
                success: false,
                message: errors.length > 0
                    ? `Semua baris gagal diimport. Periksa detail error di bawah.`
                    : 'Tidak ada data yang berhasil diimport.'
            }
            // Simpan errors supaya tetap tampil
            importResult.value.errors = errors
            return
        }

        importResult.value = { success: true, total: inserted, skipped, errors }
        emit('imported', importResult.value)
    } else {
        importResult.value = { success: false, message: result.message }
    }
}

const formatFileSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
</script>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.2s ease;
}

.modal-fade-enter-active .bg-white,
.modal-fade-leave-active .bg-white {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.modal-fade-enter-from .bg-white {
    transform: scale(0.97) translateY(-8px);
    opacity: 0;
}
</style>