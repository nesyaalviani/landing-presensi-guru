<template>
  <div class="w-screen bg-gray-100">
    <div v-if="isMobile && isSidebarOpen" @click="closeSidebar" class="fixed inset-0 z-20 lg:hidden" />

    <aside ref="sidebar" class="fixed left-0 top-0 h-screen w-64 z-30 transition-transform duration-300"
      :class="sidebarClasses">
      <div class="flex h-full flex-col overflow-y-auto rounded-br-lg rounded-tr-lg bg-white pt-5 shadow-md">
        <div class="flex mt-2 items-center px-4 shadow-sm pb-2">
          <img class="h-12 w-auto max-w-full align-middle"
            src="https://media.cake.me/image/upload/s--T4D1SVbM--/c_pad,fl_png8,h_400,w_400/v1696135770/z1d2uzgbr1faa8rzwaye.png"
            alt="" />
          <div class="flex ml-3 flex-col">
            <h3 class="font-medium">Presensi Guru</h3>
            <p class="text-xs text-gray-500">Sistem Absensi</p>
          </div>
        </div>

        <div class="flex mt-10 flex-1 flex-col pb-10">
          <nav class="flex-1">
            <NuxtLink to="/" :class="getLinkClass('/')" @click="closeSidebar">
              <Home class="mr-4 h-5 w-5 align-middle" />
              Dashboard
            </NuxtLink>

            <NuxtLink to="/settings" :class="getLinkClass('/settings')" @click="closeSidebar">
              <School class="mr-4 h-5 w-5 align-middle" />
              Data Kelas
            </NuxtLink>

            <NuxtLink to="/mata-pelajaran" :class="getLinkClass('/mata-pelajaran')" @click="closeSidebar">
              <BookOpen class="mr-4 h-5 w-5 align-middle" />
              Mata Pelajaran
            </NuxtLink>

            <NuxtLink to="/jadwal" :class="getLinkClass('/jadwal')" @click="closeSidebar">
              <Calendar class="mr-4 h-5 w-5 align-middle" />
              Jadwal Pelajaran
            </NuxtLink>
          </nav>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div :class="contentClasses" class="min-h-screen transition-all duration-300">
      <nav class="fixed top-0 right-0 bg-white shadow-sm z-20 transition-all duration-300" :class="navClasses">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <!-- Hamburger Button - Visible only on mobile -->
              <button v-if="isMobile" @click="toggleSidebar"
                class="p-2 -ml-2 text-gray-600 hover:text-gray-800 focus:outline-none" aria-label="Toggle sidebar">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    :d="isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'" />
                </svg>
              </button>

              <h2 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h2>
            </div>

            <!-- Right side - User menu -->
            <div class="flex items-center space-x-4">
              <div v-if="user"
                class="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                <img class="h-8 w-8 rounded-full object-cover" :src="avatarUrl" :alt="user.name" />
                <div class="hidden md:block">
                  <p class="text-sm font-medium text-gray-700">{{ user.name }}</p>
                  <p class="text-xs text-gray-500 capitalize">{{ user.role }}</p>
                </div>
                <ChevronDown class="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div class="pt-25 p-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Home, School, BookOpen, Calendar, ChevronDown } from 'lucide-vue-next'

const route = useRoute()
const user = ref(null)
const isSidebarOpen = ref(true)
const isMobile = ref(false)

// Computed properties
const sidebarClasses = computed(() => {
  if (!isMobile.value) return '' // Always visible on desktop
  return isSidebarOpen.value ? 'translate-x-0' : '-translate-x-full'
})

const contentClasses = computed(() => {
  return isMobile.value || !isSidebarOpen.value ? 'ml-0' : 'ml-64'
})

const navClasses = computed(() => {
  return isMobile.value || !isSidebarOpen.value ? 'left-0' : 'left-64'
})

const pageTitle = computed(() => {
  const titles = {
    '/': 'Dashboard',
    '/settings': 'Data Kelas',
    '/mata-pelajaran': 'Mata Pelajaran',
    '/jadwal': 'Jadwal Pelajaran'
  }
  return titles[route.path] || 'Dashboard'
})

const avatarUrl = computed(() => {
  if (!user.value) return ''
  const name = encodeURIComponent(user.value.name)
  return `https://ui-avatars.com/api/?name=${name}&background=fb7185&color=fff&size=128`
})

// Methods
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  if (isMobile.value) {
    isSidebarOpen.value = false
  }
}

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const getLinkClass = (path) => {
  const baseClasses = 'flex cursor-pointer items-center py-3 px-4 text-sm font-medium outline-none transition-all duration-100 ease-in-out'

  return isActive(path)
    ? `${baseClasses} border-l-4 border-l-rose-600 text-rose-600 focus:border-l-4`
    : `${baseClasses} border-l-rose-600 text-gray-600 hover:border-l-4 hover:border-l-rose-600 hover:text-rose-600 focus:border-l-4`
}

const checkScreenSize = () => {
  if (process.client) {
    const mobile = window.innerWidth < 1024
    isMobile.value = mobile

    if (mobile) {
      isSidebarOpen.value = false
    } else {
      isSidebarOpen.value = true
    }
  }
}

const loadUserData = () => {
  if (process.client) {
    const userData = localStorage.getItem('user')
    if (userData) user.value = JSON.parse(userData)
  }
}

const handleEscapeKey = (e) => {
  if (e.key === 'Escape' && isMobile.value && isSidebarOpen.value) {
    closeSidebar()
  }
}

onMounted(() => {
  loadUserData()
  checkScreenSize()

  if (process.client) {
    window.addEventListener('resize', checkScreenSize)
    window.addEventListener('keydown', handleEscapeKey)
  }
})

onUnmounted(() => {
  if (process.client) {
    window.removeEventListener('resize', checkScreenSize)
    window.removeEventListener('keydown', handleEscapeKey)
  }
})

watch(() => route.path, () => {
  closeSidebar()
})
</script>