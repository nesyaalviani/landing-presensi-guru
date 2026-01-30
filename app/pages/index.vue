<template>
<section class="w-full">
    <div class="m-4 sm:m-10 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-screen-lg">
      <!-- Sessions Card -->
      <div class="px-4 py-6 shadow-lg shadow-blue-100 bg-white rounded-lg">
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-500">Jumlah Guru</p>
              <p class="mt-2 text-2xl sm:text-3xl font-semibold text-gray-800">25</p>
              <div class="mt-2 flex items-center gap-1 flex-wrap">
                <ArrowUp class="h-4 w-4 text-green-500 flex-shrink-0" />
                <span class="text-sm font-medium text-green-500">4.9%</span>
                <span class="text-xs text-gray-400">vs last month</span>
              </div>
            </div>
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-blue-50 p-2 sm:p-2.5 text-blue-400 flex items-center justify-center flex-shrink-0 ml-2">
              <CircleUser class="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </div>
        </div>

        <!-- Users Card -->
        <div class="px-4 py-6 shadow-lg shadow-green-100 bg-white rounded-lg">
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-500">Presensi Masuk</p>
              <p class="mt-2 text-2xl sm:text-3xl font-semibold text-gray-800">15</p>
              <div class="mt-2 flex items-center gap-1 flex-wrap">
                <ArrowUp class="h-4 w-4 text-green-500 flex-shrink-0" />
                <span class="text-sm font-medium text-green-500">4.9%</span>
                <span class="text-xs text-gray-400">vs last month</span>
              </div>
            </div>
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-green-50 p-2 sm:p-2.5 text-green-400 flex items-center justify-center flex-shrink-0 ml-2">
              <UserCheck class="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </div>
        </div>

        <!-- Revenue Card -->
        <div class="px-4 py-6 shadow-lg shadow-rose-100 bg-white rounded-lg">
          <div class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-500">Belum Presensi</p>
              <p class="mt-2 text-2xl sm:text-3xl font-semibold text-gray-800">10</p>
              <div class="mt-2 flex items-center gap-1 flex-wrap">
                <ArrowUp class="h-4 w-4 text-green-500 flex-shrink-0" />
                <span class="text-sm font-medium text-green-500">4.9%</span>
                <span class="text-xs text-gray-400">vs last month</span>
              </div>
            </div>
            <div class="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-rose-50 p-2 sm:p-2.5 text-rose-400 flex items-center justify-center flex-shrink-0 ml-2">
              <UserRoundX class="h-6 w-6 sm:h-7 sm:w-7" />
            </div>
          </div>
        </div>
      </div>
    </section>
</template>

<script setup>
import { Eye, CircleUser, UserCheck, UserRoundX } from 'lucide-vue-next'
</script>