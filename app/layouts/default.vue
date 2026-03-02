<template>
  <div class="w-full bg-[rgb(248,248,248)]">
    <div v-if="isMobile && isSidebarOpen" @click="closeSidebar" class="fixed inset-0 z-20 lg:hidden" />

    <!-- Sidebar -->
    <div class="fixed left-0 top-0 h-screen w-64 z-30 transition-transform duration-300"
      :class="isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'">
      <div class="flex h-full flex-col overflow-y-auto bg-white pt-4 shadow-md relative">
        <button v-if="isMobile" @click="closeSidebar"
          class="absolute top-[0.3rem] right-1 p-2 text-gray-600 rounded-sm transition-colors lg:hidden z-10"
          aria-label="Close sidebar">
          <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <NuxtLink to="/" class="flex mt-2 items-center px-4 pb-3 cursor-pointer" @click="closeSidebar">
          <img class="h-12 w-auto max-w-full align-middle"
            src="https://media.cake.me/image/upload/s--T4D1SVbM--/c_pad,fl_png8,h_400,w_400/v1696135770/z1d2uzgbr1faa8rzwaye.png"
            alt="Logo Presensi Guru" />
          <div class="flex ml-3 flex-col">
            <h3 class="font-medium">Presensi Guru</h3>
            <p class="text-xs text-gray-500">Sistem Absensi</p>
          </div>
        </NuxtLink>

        <div class="flex mt-4 flex-1 flex-col pb-10">
          <div class="">
            <nav class="flex-1">
              <template v-for="(item, index) in menuItems" :key="index">
                <span v-if="item.type === 'divider'" class="ml-3 mt-4 mb-2 block text-xs font-semibold text-gray-500">
                  {{ item.label }}
                </span>

                <NuxtLink v-else :to="item.path" :class="getLinkClass(item.path)" @click="closeSidebar">
                  <component :is="iconComponents[item.icon]" class="mr-4 h-5 w-5 align-middle" />
                  {{ item.label }}
                </NuxtLink>
              </template>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="lg:ml-64 min-h-screen">
      <nav class="sticky top-0 right-0 left-0 lg:left-64 bg-white shadow-sm z-20">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <button v-if="isMobile" @click="toggleSidebar"
                class="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                aria-label="Toggle menu">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    :d="isSidebarOpen ? 'M4 6h16M4 12h16M4 18h16' : 'M4 6h16M4 12h16M4 18h16'" />
                </svg>
              </button>

              <h2 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h2>
            </div>

            <div class="flex items-center space-x-4">
              <div class="relative">
                <div @click="isDropdownOpen = !isDropdownOpen"
                  class="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-sm transition-colors">
                  <img class="h-8 w-8 rounded-full object-cover" :src="userAvatar" :alt="userName" />
                  <div class="hidden md:block">
                    <p class="text-sm font-medium text-gray-700">{{ userName }}</p>
                    <p class="text-xs text-gray-500">{{ userRoleLabel }}</p>
                  </div>
                  <ChevronDown
                    :class="['h-4 w-4 text-gray-600 transition-transform duration-200', isDropdownOpen ? 'rotate-180' : '']" />
                </div>

                <Transition enter-active-class="transition ease-out duration-100"
                  enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                  leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100"
                  leave-to-class="transform opacity-0 scale-95">
                  <div v-if="isDropdownOpen"
                    class="absolute right-0 mt-2 w-48 rounded-sm shadow-lg bg-white ring-1 ring-gray-200 ring-opacity-5 z-50">
                    <div class="py-1">
                      <NuxtLink to="/profile" @click="handleProfile"
                        class="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        <UserCircle class="h-4 w-4 mr-3 text-gray-500" />
                        Profil Saya
                      </NuxtLink>

                      <div class="border-t border-gray-100 my-1"></div>

                      <button @click="handleLogout"
                        class="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                        <LogOut class="h-4 w-4 mr-3" />
                        Keluar
                      </button>
                    </div>
                  </div>
                </Transition>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div class="p-6">
        <slot />
      </div>
    </div>
    <CompleteProfileModal :show="showCompleteProfileModal" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { Home, School, BookOpen, Calendar, ChevronDown, Users, UserCircle, LogOut, ClipboardCheck, FileText, History, ClipboardList } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { getMenuByRole, getRoleLabel } from '~/utils/roles'

const route = useRoute()
const authStore = useAuthStore()

const isMobile = ref(false)
const isSidebarOpen = ref(false)
const isDropdownOpen = ref(false)

const iconComponents = {
  Home,
  School,
  BookOpen,
  Calendar,
  Users,
  ClipboardCheck,
  FileText,
  History,
  ClipboardList
}

const userRole = computed(() => authStore.user?.role)
const userName = computed(() => authStore.user?.name || 'User')
const userRoleLabel = computed(() => getRoleLabel(userRole.value))
const menuItems = computed(() => getMenuByRole(userRole.value))
const userAvatar = computed(() => `https://ui-avatars.com/api/?name=${encodeURIComponent(userName.value)}&background=60a5fa&color=fff`)

const pageTitle = computed(() => {
  const titles = {
    '/': 'Dashboard',
    '/classroom': 'Data Kelas',
    '/classroom/create': 'Tambah Kelas',
    '/classroom/edit': 'Edit Kelas',
    '/subjects': 'Mata Pelajaran',
    '/subjects/create': 'Tambah Mata Pelajaran',
    '/subjects/edit': 'Edit Mata Pelajaran',
    '/schedule': 'Jadwal Pelajaran',
    '/schedule/create': 'Tambah Jadwal Pelajaran',
    '/schedule/edit': 'Edit Jadwal Pelajaran',
    '/users': 'User Management',
    '/users/create': 'Tambah User',
    '/users/edit': 'Edit User',
    '/teacher': 'Data Guru',
    '/teacher/create': 'Tambah Guru',
    '/teacher/edit': 'Edit Guru',
    '/approval': 'Absensi',
    '/reports': 'Laporan',
    '/presensi': 'Presensi',
    '/presensi/create': 'Buat Presensi',
    '/riwayat-presensi': 'Riwayat Presensi',
    '/profile': 'Profil Saya',
  }

  if (route.path === '/presensi/create' && route.query.mode === 'resubmit') {
    return 'Resubmit Presensi'
  }

  if (titles[route.path]) return titles[route.path]

  const matched = Object.keys(titles)
    .filter(key => key !== '/' && route.path.startsWith(key))
    .sort((a, b) => b.length - a.length)

  return matched.length ? titles[matched[0]] : 'Dashboard'
})

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const getLinkClass = (path) => {
  const baseClasses = 'flex cursor-pointer items-center py-3 px-4 text-sm font-medium outline-none transition-all duration-100 ease-in-out'

  if (isActive(path)) {
    return `${baseClasses} border-l-4 border-l-blue-600 text-blue-600 focus:border-l-4`
  }

  return `${baseClasses} border-l-blue-600 text-gray-600 hover:border-l-4 hover:border-l-blue-600 hover:text-blue-600 focus:border-l-4`
}

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  if (isMobile.value) {
    isSidebarOpen.value = false
  }
}

const handleProfile = () => {
  isDropdownOpen.value = false
}

const handleLogout = () => {
  isDropdownOpen.value = false
  authStore.logout()
  navigateTo('/login')
}

const checkScreenSize = () => {
  if (process.client) {
    const mobile = window.innerWidth < 1024
    isMobile.value = mobile

    if (!mobile) {
      isSidebarOpen.value = true
    } else {
      isSidebarOpen.value = false
    }
  }
}

const handleClickOutside = (event) => {
  if (isDropdownOpen.value) {
    const dropdown = event.target.closest('.relative')
    if (!dropdown || !dropdown.querySelector('.absolute')) {
      isDropdownOpen.value = false
    }
  }
}

const handleEscapeKey = (e) => {
  if (e.key === 'Escape') {
    if (isMobile.value && isSidebarOpen.value) {
      closeSidebar()
    }
    if (isDropdownOpen.value) {
      isDropdownOpen.value = false
    }
  }
}

const showCompleteProfileModal = computed(() => {
  return authStore.user?.role === 'km' && !authStore.user?.is_profile_complete
})

onMounted(() => {
  if (process.client) {
    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)
    window.addEventListener('keydown', handleEscapeKey)
    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', checkScreenSize)
    window.removeEventListener('keydown', handleEscapeKey)
    document.removeEventListener('click', handleClickOutside)
  }
})

watch(() => route.path, () => {
  closeSidebar()
  isDropdownOpen.value = false
})
</script>