<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-5xl space-y-2 sm:space-y-3">
      <div v-if="loading" class="bg-white rounded-sm border border-gray-200">
        <div class="p-4 sm:p-6 lg:p-8">
          <div class="space-y-4 sm:space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <div class="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div class="h-10 sm:h-11 bg-gray-200 rounded-sm animate-pulse"></div>
              </div>
              <div>
                <div class="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                <div class="h-10 sm:h-11 bg-gray-200 rounded-sm animate-pulse"></div>
              </div>
            </div>

            <div>
              <div class="h-4 w-28 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div class="h-10 sm:h-11 bg-gray-200 rounded-sm animate-pulse"></div>
            </div>

            <div>
              <div class="h-4 w-32 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div class="h-20 bg-gray-200 rounded-sm animate-pulse"></div>
                <div class="h-20 bg-gray-200 rounded-sm animate-pulse"></div>
              </div>
            </div>

            <div>
              <div class="h-4 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div class="h-32 sm:h-40 bg-gray-200 rounded-sm animate-pulse"></div>
            </div>

            <div>
              <div class="h-4 w-36 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div class="h-24 bg-gray-200 rounded-sm animate-pulse"></div>
            </div>

            <hr class="border-gray-200" />

            <div class="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
              <div class="h-10 sm:h-11 w-full sm:w-24 bg-gray-200 rounded-sm animate-pulse"></div>
              <div class="h-10 sm:h-11 w-full sm:w-36 bg-gray-200 rounded-sm animate-pulse"></div>
            </div>
          </div>
        </div>

        <div class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 rounded-b-sm">
          <div class="flex items-start sm:items-center gap-2">
            <div class="h-3 w-3 sm:h-4 sm:w-4 bg-gray-200 rounded animate-pulse shrink-0"></div>
            <div class="flex-1 space-y-1">
              <div class="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
              <div class="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="bg-white rounded-sm border border-gray-200">
        <div class="p-4 sm:p-6 lg:p-8">
          <div class="space-y-4 sm:space-y-6">
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Nama Mata Pelajaran <span class="text-red-500">*</span>
                </label>
                <input v-model="presensiData.namaMapel" type="text" readonly
                  class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-sm focus:outline-none text-gray-700"
                  placeholder="Contoh: Matematika" />
              </div>

              <div>
                <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Nama Guru <span class="text-red-500">*</span>
                </label>
                <input v-model="presensiData.namaGuru" type="text" readonly
                  class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-sm focus:outline-none text-gray-700"
                  placeholder="Contoh: Pak Budi" />
              </div>
            </div>

            <div>
              <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Jam Pelajaran <span class="text-red-500">*</span>
              </label>
              <input v-model="presensiData.jamPelajaran" type="text" readonly
                class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-300 rounded-sm focus:outline-none text-gray-700"
                placeholder="Contoh: 07:00 - 08:30" />
            </div>

            <div>
              <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Status Kehadiran <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label :class="[
                  'relative flex items-center p-3 border-2 rounded-sm cursor-pointer transition-all',
                  presensiData.statusKehadiran === 'Hadir'
                    ? 'border-green-500 bg-green-50'
                    : 'border-gray-300 bg-white hover:border-gray-400 active:border-green-400'
                ]">
                  <input type="radio" v-model="presensiData.statusKehadiran" value="Hadir" class="sr-only" />
                  <div class="flex items-center gap-2 sm:gap-3 w-full">
                    <div :class="[
                      'h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                      presensiData.statusKehadiran === 'Hadir'
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-300'
                    ]">
                      <svg v-if="presensiData.statusKehadiran === 'Hadir'" class="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white"
                        fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <div class="text-xs sm:text-sm font-medium text-gray-900">Hadir</div>
                      <div class="text-[10px] sm:text-xs text-gray-500">Guru mengajar hari ini</div>
                    </div>
                  </div>
                </label>

                <label :class="[
                  'relative flex items-center p-3 border-2 rounded-sm cursor-pointer transition-all',
                  presensiData.statusKehadiran === 'Tidak Hadir'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 bg-white hover:border-gray-400 active:border-red-400'
                ]">
                  <input type="radio" v-model="presensiData.statusKehadiran" value="Tidak Hadir" class="sr-only" />
                  <div class="flex items-center gap-2 sm:gap-3 w-full">
                    <div :class="[
                      'h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                      presensiData.statusKehadiran === 'Tidak Hadir'
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300'
                    ]">
                      <svg v-if="presensiData.statusKehadiran === 'Tidak Hadir'"
                        class="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <div class="text-xs sm:text-sm font-medium text-gray-900">Tidak Hadir</div>
                      <div class="text-[10px] sm:text-xs text-gray-500">Guru berhalangan hadir</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div v-if="presensiData.statusKehadiran === 'Tidak Hadir'">
              <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Apakah Guru Memberi Tugas? <span class="text-red-500">*</span>
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label :class="[
                  'relative flex items-center p-3 border-2 rounded-sm cursor-pointer transition-all',
                  presensiData.memberikanTugas === 'ya'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-300 bg-white hover:border-gray-400 active:border-blue-400'
                ]">
                  <input type="radio" v-model="presensiData.memberikanTugas" value="ya" class="sr-only" />
                  <div class="flex items-center gap-2 sm:gap-3 w-full">
                    <div :class="[
                      'h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                      presensiData.memberikanTugas === 'ya'
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    ]">
                      <svg v-if="presensiData.memberikanTugas === 'ya'" class="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white"
                        fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <div class="text-xs sm:text-sm font-medium text-gray-900">Ya, Ada Tugas</div>
                      <div class="text-[10px] sm:text-xs text-gray-500">Guru menitipkan tugas</div>
                    </div>
                  </div>
                </label>

                <label :class="[
                  'relative flex items-center p-3 border-2 rounded-sm cursor-pointer transition-all',
                  presensiData.memberikanTugas === 'tidak'
                    ? 'border-gray-500 bg-gray-50'
                    : 'border-gray-300 bg-white hover:border-gray-400 active:border-gray-400'
                ]">
                  <input type="radio" v-model="presensiData.memberikanTugas" value="tidak" class="sr-only" />
                  <div class="flex items-center gap-2 sm:gap-3 w-full">
                    <div :class="[
                      'h-4 w-4 sm:h-5 sm:w-5 rounded-full border-2 flex items-center justify-center transition-all shrink-0',
                      presensiData.memberikanTugas === 'tidak'
                        ? 'border-gray-500 bg-gray-500'
                        : 'border-gray-300'
                    ]">
                      <svg v-if="presensiData.memberikanTugas === 'tidak'" class="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white"
                        fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clip-rule="evenodd" />
                      </svg>
                    </div>
                    <div class="flex-1">
                      <div class="text-xs sm:text-sm font-medium text-gray-900">Tidak Ada Tugas</div>
                      <div class="text-[10px] sm:text-xs text-gray-500">Tidak ada penugasan</div>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Bukti Foto
                <span v-if="presensiData.statusKehadiran === 'Hadir'" class="text-red-500">*</span>
                <span v-else-if="presensiData.statusKehadiran === 'Tidak Hadir'"
                  class="text-gray-500 text-[10px] sm:text-xs">(Opsional)</span>
              </label>

              <div v-if="!previewImage">
                <input id="foto" type="file" accept="image/*" capture="environment" @change="handleFileUpload"
                  class="hidden" />
                <label for="foto"
                  class="flex flex-col items-center justify-center w-full h-32 sm:h-40 border-2 border-dashed border-gray-300 rounded-sm cursor-pointer hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 transition-all">
                  <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <p class="mt-2 text-xs sm:text-sm font-medium text-gray-700">Klik untuk upload foto</p>
                  <p class="mt-1 text-[10px] sm:text-xs text-gray-500">PNG, JPG, JPEG (Max. 5MB)</p>
                </label>
              </div>

              <div v-else class="relative">
                <div class="relative border border-gray-300 rounded-sm overflow-hidden">
                  <img :src="previewImage" alt="Preview" class="w-full h-48 sm:h-56 object-cover" />
                  <div class="absolute top-2 right-2 flex gap-2">
                    <button type="button" @click="removeImage"
                      class="bg-red-500 text-white p-1.5 sm:p-2 rounded-sm hover:bg-red-600 active:bg-red-700 transition shadow-lg">
                      <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                    <label for="foto"
                      class="bg-blue-500 text-white p-1.5 sm:p-2 rounded-sm hover:bg-blue-600 active:bg-blue-700 transition cursor-pointer shadow-lg">
                      <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </label>
                  </div>
                </div>
                <p class="mt-1.5 text-[10px] sm:text-xs text-gray-600 truncate">
                  <span class="font-medium">{{ presensiData.foto?.name }}</span> • {{
                    formatFileSize(presensiData.foto?.size) }}
                </p>
              </div>
            </div>

            <div>
              <label class="flex items-center gap-2 text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Keterangan Tambahan
              </label>
              <textarea v-model="presensiData.keterangan" rows="4"
                class="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-gray-300 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all hover:border-gray-400 resize-none"
                placeholder="Tambahkan catatan atau keterangan jika diperlukan..."></textarea>
            </div>
          </div>

          <hr class="border-gray-200 my-4 sm:my-6" />

          <div class="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-3">
            <button type="button" @click="goBack"
              class="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 active:bg-gray-100 focus:outline-none transition-all">
              <svg class="h-3 h-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Batal
            </button>
            <button type="button" @click="handleSubmit" :disabled="!canSubmit || isSubmitting"
              class="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 active:bg-blue-800 focus:outline-none transition-all shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
              <svg v-if="!isSubmitting" class="h-3 h-3 sm:h-4 sm:w-4" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              <svg v-else class="animate-spin h-3 h-3 sm:h-4 sm:w-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isSubmitting ? 'Menyimpan...' : 'Simpan Presensi' }}
            </button>
          </div>
        </div>

        <div class="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-gray-50 border-t border-gray-200 rounded-b-sm">
          <div class="flex items-start sm:items-center gap-2 text-[10px] sm:text-xs text-gray-600">
            <svg class="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 shrink-0 mt-0.5 sm:mt-0" fill="currentColor"
              viewBox="0 0 20 20">
              <path fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clip-rule="evenodd" />
            </svg>
            <p>
              <span class="font-medium">Catatan:</span> Pastikan semua informasi yang dimasukkan sudah benar sebelum
              menyimpan. Data yang sudah disimpan dapat diubah melalui menu edit.
            </p>
          </div>
        </div>
      </div>


    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { usePresensiStore } from '~/stores/presensi'

const route = useRoute()
const router = useRouter()
const presensiStore = usePresensiStore()

const loading = ref(true)
const presensiData = ref({
  id_jadwal: null,
  namaMapel: '',
  namaGuru: '',
  jamPelajaran: '',
  statusKehadiran: '',
  memberikanTugas: '',
  foto: null,
  keterangan: ''
})

const previewImage = ref(null)
const isSubmitting = ref(false)

onMounted(async () => {
  const jadwalId = route.query.jadwalId

  if (!jadwalId) {
    router.push('/presensi')
    return
  }

  const result = await presensiStore.getJadwalById(jadwalId)

  if (result.success) {
    presensiData.value.id_jadwal = result.data.id_jadwal
    presensiData.value.namaMapel = result.data.namaMapel
    presensiData.value.namaGuru = result.data.namaGuru
    presensiData.value.jamPelajaran = result.data.jamPelajaran
  } else {
    alert(result.message)
    router.push('/presensi')
  }

  loading.value = false
})

watch(() => presensiData.value.statusKehadiran, (newValue) => {
  if (newValue === 'Hadir') {
    presensiData.value.memberikanTugas = 'ya'
  } else {
    presensiData.value.memberikanTugas = ''
  }
})

const canSubmit = computed(() => {
  if (!presensiData.value.statusKehadiran) return false

  if (presensiData.value.statusKehadiran === 'Hadir') {
    if (!presensiData.value.foto) return false
  }

  if (presensiData.value.statusKehadiran === 'Tidak Hadir') {
    if (!presensiData.value.memberikanTugas) return false
  }

  return true
})

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file terlalu besar! Maksimal 5MB')
      event.target.value = ''
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('File harus berupa gambar!')
      event.target.value = ''
      return
    }

    presensiData.value.foto = file

    const reader = new FileReader()
    reader.onload = (e) => {
      previewImage.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const removeImage = () => {
  presensiData.value.foto = null
  previewImage.value = null
  const fileInput = document.getElementById('foto')
  if (fileInput) fileInput.value = ''
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const handleSubmit = async () => {
  if (!canSubmit.value) {
    alert('Mohon lengkapi semua data yang diperlukan!')
    return
  }

  isSubmitting.value = true

  try {
    const formData = new FormData()
    formData.append('id_jadwal', presensiData.value.id_jadwal)
    formData.append('status', presensiData.value.statusKehadiran)
    formData.append('memberikan_tugas', presensiData.value.memberikanTugas)

    if (presensiData.value.foto) {
      formData.append('foto', presensiData.value.foto)
    }

    if (presensiData.value.keterangan) {
      formData.append('keterangan', presensiData.value.keterangan)
    }

    const result = await presensiStore.createPresensi(formData)

    if (result.success) {
      router.push('/presensi')
    } else {
      alert(result.message)
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Terjadi kesalahan saat mengirim data. Silakan coba lagi.')
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.push('/presensi')
}
</script>