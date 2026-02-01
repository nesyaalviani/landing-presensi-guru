<template>
  <div class="w-full bg-[rgb(248,248,248)]">
    <!-- Mobile Overlay -->
    <div 
      v-if="isMobile && isSidebarOpen" 
      @click="closeSidebar" 
      class="fixed inset-0 z-20 lg:hidden"
    />

    <!-- Sidebar -->
    <div 
      class="fixed left-0 top-0 h-screen w-64 z-30 transition-transform duration-300"
      :class="isMobile ? (isSidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'"
    >
      <div class="flex h-full flex-col overflow-y-auto bg-white pt-4 shadow-md">
        <div class="flex mt-2 items-center px-4 pb-3">
          <img class="h-12 w-auto max-w-full align-middle" src="https://media.cake.me/image/upload/s--T4D1SVbM--/c_pad,fl_png8,h_400,w_400/v1696135770/z1d2uzgbr1faa8rzwaye.png" alt="" />
          <div class="flex ml-3 flex-col">
            <h3 class="font-medium">Presensi Guru</h3>
            <p class="text-xs text-gray-500">Sistem Absensi</p>
          </div>
        </div>

        <div class="flex mt-4 flex-1 flex-col pb-10">
          <div class="">
            <nav class="flex-1">
              <NuxtLink 
                to="/" 
                :class="getLinkClass('/')"
                @click="closeSidebar"
              >
                <Home class="mr-4 h-5 w-5 align-middle" />
                Dashboard
              </NuxtLink>

              <span class="ml-3 mt-4 mb-2 block text-xs font-semibold text-gray-500">
                Classroom Management
              </span>

              <NuxtLink 
                to="/classroom" 
                :class="getLinkClass('/classroom')"
                @click="closeSidebar"
              >
                <School class="mr-4 h-5 w-5 align-middle" />
                Data Kelas
              </NuxtLink>

              <NuxtLink 
                to="/subjects" 
                :class="getLinkClass('/subjects')"
                @click="closeSidebar"
              >
                <BookOpen class="mr-4 h-5 w-5 align-middle" />
                Mata Pelajaran
              </NuxtLink>

              <NuxtLink 
                to="/schedule" 
                :class="getLinkClass('/schedule')"
                @click="closeSidebar"
              >
                <Calendar class="mr-4 h-5 w-5 align-middle" />
                Jadwal Pelajaran
              </NuxtLink>
            </nav>

            <span class="ml-3 mt-4 mb-2 block text-xs font-semibold text-gray-500">User Management</span>

            <nav class="flex-1">
              <NuxtLink 
                to="/users" 
                :class="getLinkClass('/users')"
                @click="closeSidebar"
              >
                <Users class="mr-4 h-5 w-5 align-middle" />
                User
              </NuxtLink>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Area -->
    <div class="lg:ml-64 min-h-screen">
      <nav class="sticky top-0 right-0 left-0 lg:left-64 bg-white shadow-sm z-20">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <!-- Hamburger Menu Button - Mobile Only -->
              <button 
                v-if="isMobile"
                @click="toggleSidebar"
                class="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-800 focus:outline-none"
                aria-label="Toggle menu"
              >
                <svg 
                  class="h-5 w-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    stroke-linecap="round" 
                    stroke-linejoin="round" 
                    stroke-width="2" 
                    :d="isSidebarOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
                  />
                </svg>
              </button>

              <h2 class="text-xl font-semibold text-gray-800">{{ pageTitle }}</h2>
            </div>

            <!-- Right side - User menu -->
            <div class="flex items-center space-x-4">
              <!-- User Profile -->
              <div class="flex items-center space-x-3 cursor-pointer hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors">
                <img class="h-8 w-8 rounded-full object-cover" src="https://ui-avatars.com/api/?name=Admin+User&background=fb7185&color=fff" alt="User" />
                <div class="hidden md:block">
                  <p class="text-sm font-medium text-gray-700">Admin User</p>
                  <p class="text-xs text-gray-500">Administrator</p>
                </div>
                <ChevronDown class="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div class="p-6">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { Home, School, BookOpen, Calendar, ChevronDown, Users } from 'lucide-vue-next'

const route = useRoute()
const isMobile = ref(false)
const isSidebarOpen = ref(false)

// Compute page title based on current route
const pageTitle = computed(() => {
  const titles = {
    '/': 'Dashboard',
    '/classroom': 'Data Kelas',
    '/subjects': 'Mata Pelajaran',
    '/schedule': 'Jadwal Pelajaran',
    '/users': 'User Management'
  }
  return titles[route.path] || 'Dashboard'
})

// Function to determine if a link is active
const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// Function to get link classes based on active state
const getLinkClass = (path) => {
  const baseClasses = 'flex cursor-pointer items-center py-3 px-4 text-sm font-medium outline-none transition-all duration-100 ease-in-out'
  
  if (isActive(path)) {
    return `${baseClasses} border-l-4 border-l-blue-600 text-blue-600 focus:border-l-4`
  }
  
  return `${baseClasses} border-l-blue-600 text-gray-600 hover:border-l-4 hover:border-l-blue-600 hover:text-blue-600 focus:border-l-4`
}

// Methods
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}

const closeSidebar = () => {
  if (isMobile.value) {
    isSidebarOpen.value = false
  }
}

// Check screen size
const checkScreenSize = () => {
  if (process.client) {
    const mobile = window.innerWidth < 1024
    isMobile.value = mobile
    
    // On desktop: sidebar always open
    // On mobile: sidebar closed by default
    if (!mobile) {
      isSidebarOpen.value = true
    } else {
      isSidebarOpen.value = false
    }
  }
}

// Close sidebar on escape key
const handleEscapeKey = (e) => {
  if (e.key === 'Escape' && isMobile.value && isSidebarOpen.value) {
    closeSidebar()
  }
}

// Lifecycle hooks
onMounted(() => {
  if (process.client) {
    checkScreenSize()
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

// Close sidebar when route changes (mobile)
watch(() => route.path, () => {
  closeSidebar()
})
</script>