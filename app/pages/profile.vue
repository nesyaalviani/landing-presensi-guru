<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-5xl space-y-2 sm:space-y-3">
      <!-- Header Section -->
      <!-- <div class="mb-6">
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">Profil Pengguna</h1>
        <p class="text-sm sm:text-base text-gray-600 mt-1">Kelola informasi akun Anda</p>
      </div> -->

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <!-- Left Column: Profile Card -->
        <div class="lg:col-span-1">
          <div class="bg-white rounded-sm border border-gray-200 overflow-hidden">
            <!-- Profile Header with Gradient -->
            <div class="bg-gradient-to-br from-blue-500 to-blue-600 h-24 sm:h-32"></div>

            <!-- Profile Picture & Info -->
            <div class="px-4 sm:px-6 pb-6">
              <div class="flex flex-col items-center -mt-12 sm:-mt-16">
                <!-- Avatar -->
                <div class="relative">
                  <div
                    class="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white bg-white shadow-lg overflow-hidden">
                    <img v-if="userData.avatar" :src="userData.avatar" :alt="userData.name"
                      class="w-full h-full object-cover" />
                    <div v-else
                      class="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span class="text-3xl sm:text-4xl font-bold text-white">
                        {{ getInitials(userData.name) }}
                      </span>
                    </div>
                  </div>
                  <!-- Status Badge -->
                  <div
                    class="absolute bottom-1 right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 border-2 border-white rounded-full">
                  </div>
                </div>

                <!-- Name & Role -->
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
                </div>

                <!-- Quick Stats -->
                <!-- <div class="w-full mt-6 pt-6 border-t border-gray-200">
                  <div class="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p class="text-2xl font-bold text-gray-900">{{ userData.stats.attendance }}</p>
                      <p class="text-xs text-gray-600 mt-1">Presensi</p>
                    </div>
                    <div>
                      <p class="text-2xl font-bold text-gray-900">{{ userData.stats.classes }}</p>
                      <p class="text-xs text-gray-600 mt-1">Kelas</p>
                    </div>
                  </div>
                </div> -->
              </div>
            </div>
          </div>

          <!-- Action Buttons (Mobile & Desktop) -->
          <div class="mt-4 space-y-2">
            <button @click="showEditModal = true"
              class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-sm hover:bg-blue-700 transition-all shadow-sm hover:shadow-md">
              <Edit class="w-4 h-4" />
              <span class="text-sm font-medium">Edit Profil</span>
            </button>
            <button @click="showPasswordModal = true"
              class="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-sm hover:bg-gray-50 transition-all">
              <Lock class="w-4 h-4" />
              <span class="text-sm font-medium">Ubah Password</span>
            </button>
          </div>
        </div>

        <!-- Right Column: Details -->
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
                  <dt class="text-xs font-medium text-gray-500 mb-1">NIP / NIK</dt>
                  <dd class="text-sm text-gray-900 font-medium">{{ userData.nip || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 mb-1">Email</dt>
                  <dd class="text-sm text-gray-900 font-medium">{{ userData.email }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Account Information -->
          <div class="bg-white rounded-sm border border-gray-200">
            <div class="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <IdCard class="w-5 h-5 text-blue-600" />
                Informasi Akun
              </h3>
            </div>
            <div class="px-4 sm:px-6 py-5">
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <dt class="text-xs font-medium text-gray-500 mb-1">Username</dt>
                  <dd class="text-sm text-gray-900 font-medium">{{ userData.username }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 mb-1">Role / Jabatan</dt>
                  <dd class="text-sm text-gray-900 font-medium">{{ getRoleLabel(userData.role) }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 mb-1">Status Akun</dt>
                  <dd>
                    <span :class="[
                      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                      userData.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    ]">
                      {{ userData.status === 'active' ? 'Aktif' : 'Nonaktif' }}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 mb-1">Dibuat Oleh</dt>
                  <dd class="text-sm text-gray-900 font-medium">{{ userData.createdBy }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 mb-1">Tanggal Dibuat</dt>
                  <dd class="text-sm text-gray-900">{{ formatDate(userData.createdAt) }}</dd>
                </div>
                <div>
                  <dt class="text-xs font-medium text-gray-500 mb-1">Terakhir Login</dt>
                  <dd class="text-sm text-gray-900">{{ formatDate(userData.lastLogin) }}</dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- Additional Info based on Role -->
          <!-- <div v-if="userData.role === 'guru'" class="bg-white rounded-sm border border-gray-200">
            <div class="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 class="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen class="w-5 h-5 text-blue-600" />
                Informasi Mengajar
              </h3>
            </div>
            <div class="px-4 sm:px-6 py-5">
              <dl class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <div class="sm:col-span-2">
                  <dt class="text-xs font-medium text-gray-500 mb-2">Mata Pelajaran</dt>
                  <dd class="flex flex-wrap gap-2">
                    <span
                      v-for="subject in userData.subjects"
                      :key="subject"
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {{ subject }}
                    </span>
                  </dd>
                </div>
                <div class="sm:col-span-2">
                  <dt class="text-xs font-medium text-gray-500 mb-2">Kelas yang Diampu</dt>
                  <dd class="flex flex-wrap gap-2">
                    <span
                      v-for="kelas in userData.classes"
                      :key="kelas"
                      class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {{ kelas }}
                    </span>
                  </dd>
                </div>
              </dl>
            </div>
          </div> -->

          <div class="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-sm p-4">
            <div class="flex items-start gap-3">
              <Info class="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div class="flex-1">
                <h4 class="text-sm font-semibold text-amber-900 mb-1">Informasi Keamanan</h4>
                <p class="text-xs text-amber-800">
                  Akun Anda dibuat oleh <span class="font-semibold">{{ userData.createdBy }}</span>.
                  Pastikan untuk mengubah password default dan menjaga kerahasiaan akun Anda.
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
        @click.self="showEditModal = false">
        <div class="relative bg-white rounded-sm shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <!-- Modal Header -->
          <div class="px-4 sm:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div class="flex items-center justify-between">
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">Edit Profil</h3>
              <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-500 transition">
                <X class="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="px-4 sm:px-6 py-4">
            <form @submit.prevent="handleUpdateProfile" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                  <input v-model="editForm.name" type="text"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input v-model="editForm.email" type="email"
                    class="w-full px-3 py-2 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div
            class="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 sticky bottom-0 bg-white">
            <button @click="showEditModal = false"
              class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition">
              <X class="w-4 h-4" />
              Batal
            </button>
            <button @click="handleUpdateProfile"
              class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700 transition">
              <Save class="w-4 h-4" />
              Simpan Perubahan
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Change Password Modal -->
    <Transition name="modal">
      <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
        @click.self="showPasswordModal = false">
        <div class="relative bg-white rounded-sm shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto" @click.stop>
          <!-- Modal Header -->
          <div class="px-4 sm:px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            <div class="flex items-center justify-between">
              <h3 class="text-base sm:text-lg font-semibold text-gray-900">Ubah Password</h3>
              <button @click="showPasswordModal = false" class="text-gray-400 hover:text-gray-500 transition">
                <X class="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="px-4 sm:px-6 py-4">
            <form @submit.prevent="handleChangePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password Lama</label>
                <div class="relative">
                  <input v-model="passwordForm.oldPassword" :type="showOldPassword ? 'text' : 'password'"
                    class="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  <button type="button" @click="showOldPassword = !showOldPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <Eye v-if="!showOldPassword" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Password Baru</label>
                <div class="relative">
                  <input v-model="passwordForm.newPassword" :type="showNewPassword ? 'text' : 'password'"
                    class="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  <button type="button" @click="showNewPassword = !showNewPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <Eye v-if="!showNewPassword" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Konfirmasi Password Baru</label>
                <div class="relative">
                  <input v-model="passwordForm.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                    class="w-full px-3 py-2 pr-10 text-sm border border-gray-300 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </form>
          </div>

          <!-- Modal Footer -->
          <div
            class="px-4 sm:px-6 py-4 border-t border-gray-200 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 sticky bottom-0 bg-white">
            <button @click="showPasswordModal = false"
              class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition">
              <X class="w-4 h-4" />
              Batal
            </button>
            <button @click="handleChangePassword"
              class="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-sm hover:bg-blue-700 transition">
              <Lock class="w-4 h-4" />
              Ubah Password
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User, UserCircle, Edit, Lock, IdCard, Info, X, Save, Eye, EyeOff, BookOpen } from 'lucide-vue-next'


const userData = ref({
  name: 'Siti Nurhaliza',
  username: 'siti.nurhaliza',
  email: 'siti.nurhaliza@school.com',
  nip: '198501012010012001',
  role: 'guru', // admin, km (ketua murid), petugas, kepala-sekolah, guru
  status: 'active',
  avatar: null,
  createdBy: 'Admin Sistem',
  createdAt: '2024-01-15T08:00:00',
  lastLogin: '2026-02-11T14:30:00',
  stats: {
    attendance: 156,
    classes: 4
  },
  subjects: ['Matematika', 'Fisika'],
  classes: ['XII RPL 1', 'XII RPL 2', 'XI RPL 1', 'XI RPL 2']
})

// Modal states
const showEditModal = ref(false)
const showPasswordModal = ref(false)

// Password visibility states
const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

// Edit form
const editForm = ref({
  name: userData.value.name,
  email: userData.value.email
})

// Password form
const passwordForm = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// Helper functions
const getInitials = (name) => {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
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

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString('id-ID', options)
}

// Handle functions
const handleUpdateProfile = async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    userData.value.name = editForm.value.name
    userData.value.email = editForm.value.email
    userData.value.phone = editForm.value.phone
    userData.value.address = editForm.value.address

    showEditModal.value = false
    alert('Profil berhasil diperbarui!')
  } catch (error) {
    console.error('Error updating profile:', error)
    alert('Gagal memperbarui profil')
  }
}

const handleChangePassword = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert('Password baru dan konfirmasi password tidak cocok!')
    return
  }

  if (passwordForm.value.newPassword.length < 6) {
    alert('Password baru minimal 6 karakter!')
    return
  }

  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    passwordForm.value = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }

    // Reset visibility states
    showOldPassword.value = false
    showNewPassword.value = false
    showConfirmPassword.value = false

    showPasswordModal.value = false
    alert('Password berhasil diubah!')
  } catch (error) {
    console.error('Error changing password:', error)
    alert('Gagal mengubah password')
  }
}
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
</style>