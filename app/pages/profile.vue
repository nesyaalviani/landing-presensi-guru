<template>
  <div>
    <div class="max-w-5xl space-y-2 sm:space-y-3">

      <div v-if="loading" class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div class="lg:col-span-1">
          <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
            <div class="bg-gray-200 animate-pulse h-24 sm:h-32"></div>
            <div class="px-4 sm:px-6 pb-6">
              <div class="flex flex-col items-center -mt-12 sm:-mt-16">
                <div
                  class="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-gray-200 animate-pulse shadow-lg">
                </div>
                <div class="text-center mt-4 w-full flex flex-col items-center gap-2">
                  <div class="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-5 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-4">
            <div class="h-10 w-full bg-gray-200 rounded-sm animate-pulse"></div>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-4 sm:space-y-6">
          <div class="bg-white rounded-sm border border-gray-200">
            <div class="px-4 sm:px-6 py-4 border-b border-gray-200">
              <div class="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
            </div>
            <div class="px-4 sm:px-6 py-5">
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div v-for="i in 4" :key="'skeleton-' + i">
                  <div class="h-3 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div class="h-5 w-36 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </dl>
            </div>
          </div>
          <div class="h-20 bg-gray-200 rounded-sm animate-pulse"></div>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-sm p-4">
        <div class="flex items-center gap-2 text-sm text-red-800">
          <AlertCircle class="h-4 w-4 shrink-0" />
          <p>{{ error }}</p>
        </div>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div class="lg:col-span-1">
          <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
           <div class="bg-gradient-to-b from-blue-100 via-blue-50 to-white h-24 sm:h-32"></div>
            <div class="px-4 sm:px-6 pb-6">
              <div class="flex flex-col items-center -mt-12 sm:-mt-25">
                <div class="relative">
                  <div class="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
                    <img
                      :src="`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name || 'User')}&background=60a5fa&color=fff&size=128`"
                      :alt="userData.name" class="w-full h-full object-cover" />
                  </div>
                </div>

                <div class="text-center mt-4">
                  <h2 class="text-lg sm:text-xl font-bold text-gray-900">{{ userData.name }}</h2>
                  <div class="flex items-center justify-center gap-2 mt-2">
                    <span :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium',
                      getRoleBadgeClass(userData.role)
                    ]">
                      <User class="w-3 h-3 mr-1" />
                      {{ getRoleLabel(userData.role) }}
                    </span>
                  </div>

                  <div v-if="authStore.hasKelas" class="mt-2">
                    <span
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                      <BookOpen class="w-3 h-3 mr-1" />
                      {{ authStore.namaKelas }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 space-y-2">
            <button @click="openEditModal"
              class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-500 text-white rounded-sm hover:bg-blue-600 transition-all shadow-sm hover:shadow-md">
              <Edit class="w-4 h-4" />
              <span class="text-sm font-medium">Edit Profil</span>
            </button>
          </div>
        </div>

        <div class="lg:col-span-2 space-y-4 sm:space-y-6">
          <div class="bg-white rounded-sm border border-gray-200">
            <div class="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <UserCircle class="w-5 h-5 text-blue-600" />
                Informasi Pribadi
              </h3>
            </div>
            <div class="px-4 sm:px-6 py-5">
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt class="text-xs font-medium text-gray-500 mb-1">Nama Lengkap</dt>
                  <dd class="text-sm text-gray-900 font-medium">{{ userData.name }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 mb-1">Username</dt>
                  <dd class="text-sm text-gray-900 font-medium">{{ userData.username }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 mb-1">Role</dt>
                  <dd class="text-sm text-gray-900 font-medium">{{ getRoleLabel(userData.role) }}</dd>
                </div>

                <div v-if="authStore.hasKelas">
                  <dt class="text-xs font-medium text-gray-500 mb-1">Kelas</dt>
                  <dd class="text-sm text-gray-900 font-medium flex items-center gap-1.5">
                    <BookOpen class="w-3.5 h-3.5 text-indigo-500" />
                    {{ authStore.namaKelas }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-sm p-4">
            <div class="flex items-start gap-3">
              <Info class="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div class="flex-1">
                <h4 class="text-sm font-semibold text-amber-900 mb-1">Informasi Keamanan</h4>
                <p class="text-xs text-amber-800">
                  Pastikan untuk menjaga kerahasiaan akun Anda dan segera ubah password jika diperlukan.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Profile Modal -->
    <Transition name="modal">
      <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="closeEditModal">
        <div class="relative bg-white rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <div class="px-4 sm:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div class="flex items-center justify-between">
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">Edit Profil</h3>
              <button @click="closeEditModal" class="text-gray-400 hover:text-gray-500 transition">
                <X class="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          <div class="px-4 sm:px-6 py-4">
            <!-- Error alert -->
            <div v-if="editError"
              class="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-sm px-3 py-2.5 text-sm text-red-800">
              <AlertCircle class="w-4 h-4 shrink-0" />
              <span>{{ editError }}</span>
            </div>

            <!-- Success alert -->
            <div v-if="editSuccess"
              class="mb-4 flex items-center gap-2 bg-green-50 border border-green-200 rounded-sm px-3 py-2.5 text-sm text-green-800">
              <CheckCircle class="w-4 h-4 shrink-0" />
              <span>Profil berhasil diperbarui!</span>
            </div>

            <form @submit.prevent="handleUpdateProfile" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap <span class="text-red-500">*</span>
                </label>
                <input v-model="editForm.name" type="text" placeholder="Masukkan nama lengkap"
                  class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>

              <div class="border-t border-gray-100 pt-4">
                <p class="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
                  Ubah Password <span class="normal-case font-normal text-gray-400">(opsional)</span>
                </p>
                <div class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                    <div class="relative">
                      <input v-model="editForm.password" :type="showPassword ? 'text' : 'password'"
                        placeholder="Masukkan password baru"
                        class="w-full px-3 py-2 pr-10 text-sm border rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        :class="passwordFieldClass" />
                      <button type="button" @click="showPassword = !showPassword"
                        class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        <Eye v-if="!showPassword" class="w-4 h-4" />
                        <EyeOff v-else class="w-4 h-4" />
                      </button>
                    </div>
                    <p v-if="editForm.password && editForm.password.length < 6" class="mt-1 text-xs text-red-500">
                      Password minimal 6 karakter
                    </p>
                  </div>

                  <Transition name="slide-down">
                    <div v-if="editForm.password">
                      <label class="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                      <div class="relative">
                        <input v-model="editForm.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                          placeholder="Ulangi password baru"
                          class="w-full px-3 py-2 pr-10 text-sm border rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          :class="confirmPasswordFieldClass" />
                        <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                          <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                          <EyeOff v-else class="w-4 h-4" />
                        </button>
                        <div v-if="editForm.confirmPassword" class="absolute right-9 top-1/2 -translate-y-1/2">
                          <CheckCircle v-if="passwordsMatch" class="w-4 h-4 text-green-500" />
                          <XCircle v-else class="w-4 h-4 text-red-500" />
                        </div>
                      </div>
                      <p v-if="editForm.confirmPassword && !passwordsMatch" class="mt-1 text-xs text-red-500">
                        Password tidak cocok
                      </p>
                      <p v-if="editForm.confirmPassword && passwordsMatch" class="mt-1 text-xs text-green-600">
                        Password cocok
                      </p>
                    </div>
                  </Transition>
                </div>
              </div>
            </form>
          </div>

          <div
            class="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 sticky bottom-0 bg-white">
            <button @click="closeEditModal" :disabled="editLoading"
              class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition disabled:opacity-50">
              <X class="w-4 h-4" />
              Batal
            </button>
            <button @click="handleUpdateProfile" :disabled="editLoading || !isEditFormValid"
              class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-sm hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
              <Loader v-if="editLoading" class="w-4 h-4 animate-spin" />
              <Save v-else class="w-4 h-4" />
              {{ editLoading ? 'Menyimpan...' : 'Simpan Perubahan' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { User, UserCircle, Edit, Info, X, Save, Eye, EyeOff, BookOpen, AlertCircle, CheckCircle, XCircle, Loader } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const loading = ref(false)
const error = ref(null)

const showEditModal = ref(false)

const editLoading = ref(false)
const editError = ref(null)
const editSuccess = ref(false)

// Password visibility states
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const userData = computed(() => authStore.user || {
  name: '',
  username: '',
  role: '',
  kelas: null
})

const editForm = ref({
  name: '',
  password: '',
  confirmPassword: ''
})

const passwordsMatch = computed(() => {
  return editForm.value.password === editForm.value.confirmPassword
})

const passwordFieldClass = computed(() => {
  if (!editForm.value.password) return 'border-gray-300'
  if (editForm.value.password.length < 6) return 'border-red-400 bg-red-50'
  return 'border-green-400 bg-green-50'
})

const confirmPasswordFieldClass = computed(() => {
  if (!editForm.value.confirmPassword) return 'border-gray-300'
  return passwordsMatch.value
    ? 'border-green-400 bg-green-50'
    : 'border-red-400 bg-red-50'
})

const isEditFormValid = computed(() => {
  const nameOk = editForm.value.name?.trim().length > 0

  if (!editForm.value.password) return nameOk

  const passwordOk = editForm.value.password.length >= 6
  const confirmOk = passwordsMatch.value

  return nameOk && passwordOk && confirmOk
})

const getInitials = (name) => {
  if (!name) return '?'
  return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2)
}

const getRoleLabel = (role) => {
  const labels = {
    'admin': 'Administrator',
    'km': 'Ketua Murid',
    'petugas': 'Petugas',
    'kepala-sekolah': 'Kepala Sekolah',
    'guru': 'Guru'
  }
  return labels[role] || role
}

const getRoleBadgeClass = (role) => {
  const classes = {
    'admin': 'bg-purple-100 text-purple-800',
    'km': 'bg-blue-100 text-blue-800',
    'petugas': 'bg-green-100 text-green-800',
    'kepala-sekolah': 'bg-red-100 text-red-800',
    'guru': 'bg-orange-100 text-orange-800'
  }
  return classes[role] || 'bg-gray-100 text-gray-800'
}

const openEditModal = () => {
  editForm.value = { name: userData.value.name || '', password: '', confirmPassword: '' }
  editError.value = null
  editSuccess.value = false
  showPassword.value = false
  showConfirmPassword.value = false
  showEditModal.value = true
}

const closeEditModal = () => {
  if (editLoading.value) return
  showEditModal.value = false
  editError.value = null
  editSuccess.value = false
}

const handleUpdateProfile = async () => {
  editError.value = null
  editSuccess.value = false

  if (!editForm.value.name?.trim()) {
    editError.value = 'Nama lengkap tidak boleh kosong.'
    return
  }

  if (editForm.value.password) {
    if (editForm.value.password.length < 6) {
      editError.value = 'Password baru minimal 6 karakter.'
      return
    }
    if (!passwordsMatch.value) {
      editError.value = 'Konfirmasi password tidak cocok.'
      return
    }
  }

  editLoading.value = true

  const result = await authStore.updateProfile({
    name: editForm.value.name,
    password: editForm.value.password || undefined
  })

  editLoading.value = false

  if (result.success) {
    editSuccess.value = true
    setTimeout(() => {
      showEditModal.value = false
      editSuccess.value = false
    }, 1200)
  } else if (result.shouldLogout) {
    navigateTo('/login')
  } else {
    editError.value = result.message || 'Gagal memperbarui profil.'
  }
}

onMounted(async () => {
  loading.value = true
  error.value = null

  const result = await authStore.fetchProfile()

  if (result.success) {
    editForm.value = { name: userData.value.name || '', password: '', confirmPassword: '' }
  } else if (result.shouldLogout) {
    navigateTo('/login')
  } else {
    error.value = result.message || 'Gagal mengambil data profil.'
  }

  loading.value = false
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.slide-down-enter-active {
  transition: all 0.25s ease-out;
}

.slide-down-leave-active {
  transition: all 0.2s ease-in;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>