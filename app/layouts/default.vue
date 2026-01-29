<template>
   <div class="w-screen bg-gray-100">
  <!-- Sidebar -->
  <div class="fixed left-0 top-0 h-screen w-64 z-30">
  <div class="flex h-full flex-col overflow-y-auto rounded-br-lg rounded-tr-lg bg-white pt-5 shadow-md">
    <div class="flex mt-2 items-center px-4 shadow-sm pb-2">
      <img class="h-12 w-auto max-w-full align-middle" src="https://media.cake.me/image/upload/s--T4D1SVbM--/c_pad,fl_png8,h_400,w_400/v1696135770/z1d2uzgbr1faa8rzwaye.png" alt="" />
      <div class="flex ml-3 flex-col">
        <h3 class="font-medium">Presensi Guru</h3>
        <p class="text-xs text-gray-500">Sistem Absensi</p>
      </div>
    </div>

    <div class="flex mt-10 flex-1 flex-col pb-10">
      <div class="">
        <nav class="flex-1">
          <NuxtLink 
            to="/" 
            :class="getLinkClass('/')"
          >
            <Home class="mr-4 h-5 w-5 align-middle" />
            Dashboard
          </NuxtLink>

          <NuxtLink 
            to="/settings" 
            :class="getLinkClass('/settings')"
          >
            <School class="mr-4 h-5 w-5 align-middle" />
            Data Kelas
          </NuxtLink>

          <NuxtLink 
            to="/mata-pelajaran" 
            :class="getLinkClass('/mata-pelajaran')"
          >
            <BookOpen class="mr-4 h-5 w-5 align-middle" />
            Mata Pelajaran
          </NuxtLink>

          <NuxtLink 
            to="/jadwal" 
            :class="getLinkClass('/jadwal')"
          >
            <Calendar class="mr-4 h-5 w-5 align-middle" />
            Jadwal Pelajaran
          </NuxtLink>
        </nav>
      </div>
    </div>
  </div>
</div>

<!-- Main Content Area -->
<div class="ml-64 min-h-screen">
  <nav class="fixed top-0 right-0 left-64 bg-white shadow-sm z-20">
    <div class="px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
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

  <div class="pt-25 p-6">
    <slot />
  </div>
</div>

</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Home, School, BookOpen, Calendar, ChevronDown } from 'lucide-vue-next'

const route = useRoute()

// Compute page title based on current route
const pageTitle = computed(() => {
  const titles = {
    '/': 'Dashboard',
    '/settings': 'Data Kelas',
    '/mata-pelajaran': 'Mata Pelajaran',
    '/jadwal': 'Jadwal Pelajaran'
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
    return `${baseClasses} border-l-4 border-l-rose-600 text-rose-600 focus:border-l-4`
  }
  
  return `${baseClasses} border-l-rose-600 text-gray-600 hover:border-l-4 hover:border-l-rose-600 hover:text-rose-600 focus:border-l-4`
}

const drawerCheckbox = ref(null)

onMounted(() => {
    const handleResize = () => {
        if (drawerCheckbox.value) {
            drawerCheckbox.value.checked = window.innerWidth >= 1024
        }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
})
</script>