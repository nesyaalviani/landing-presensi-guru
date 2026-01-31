<template>
<section class="w-full">
  <div class="m-4 sm:m-10 grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mx-auto max-w-screen-lg">
    <!-- Card Jumlah Guru -->
    <div class="px-4 py-6 shadow-lg shadow-blue-100 bg-white rounded-lg">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-500">Jumlah Guru</p>
          <p class="mt-2 text-3xl font-semibold text-gray-800">25</p>
          <div class="mt-2 flex items-center gap-1">
            <ArrowUp class="h-4 w-4 text-green-500" />
            <span class="text-sm font-medium text-green-500">4.9%</span>
            <span class="text-xs text-gray-400">vs last month</span>
          </div>
        </div>
        <div class="h-12 w-12 rounded-xl bg-blue-50 p-2.5 text-blue-400 flex items-center justify-center flex-shrink-0">
          <CircleUserRound class="h-7 w-7" />
        </div>
      </div>
    </div>

    <!-- Card Presensi Masuk -->
    <div class="px-4 py-6 shadow-lg shadow-green-100 bg-white rounded-lg">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-500">Presensi Masuk</p>
          <p class="mt-2 text-3xl font-semibold text-gray-800">35</p>
          <div class="mt-2 flex items-center gap-1">
            <ArrowUp class="h-4 w-4 text-green-500" />
            <span class="text-sm font-medium text-green-500">4.9%</span>
            <span class="text-xs text-gray-400">vs last month</span>
          </div>
        </div>
        <div class="h-12 w-12 rounded-xl bg-green-50 p-2.5 text-green-400 flex items-center justify-center flex-shrink-0">
          <UserCheck class="h-7 w-7" />
        </div>
      </div>
    </div>

    <!-- Card Belum Presensi -->
    <div class="px-4 py-6 shadow-lg shadow-rose-100 bg-white rounded-lg">
      <div class="flex items-start justify-between">
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-500">Belum Presensi</p>
          <p class="mt-2 text-3xl font-semibold text-gray-800">10</p>
          <div class="mt-2 flex items-center gap-1">
            <ArrowUp class="h-4 w-4 text-green-500" />
            <span class="text-sm font-medium text-green-500">10</span>
            <span class="text-xs text-gray-400">vs last month</span>
          </div>
        </div>
        <div class="h-12 w-12 rounded-xl bg-rose-50 p-2.5 text-rose-400 flex items-center justify-center flex-shrink-0">
          <UserX class="h-7 w-7" />
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Table Section -->
<section class="px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-lg">
  <div class="mx-auto max-w-7xl">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Monitoring Presensi Guru Hari Ini</h1>
    </div>

    <!-- Search and Filter Bar -->
    <div class="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
      <!-- Search -->
      <div class="relative w-full sm:max-w-md">
        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input 
          type="text" 
          placeholder="Cari nama guru, NIP..." 
          class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        />
      </div>
    </div>

    <!-- Table Card -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Jam
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kelas
              </th>
              <!-- <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mapel
              </th> -->
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Guru
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Verifikasi
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <!-- Row 1 -->
            <tr class="hover:bg-gray-50 transition-colors">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                07:15 - 16:30 WIB
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                XII RPL 1
              </td>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                Pendidikan Agama Islam
              </td> -->
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <div class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                      SN
                    </div>
                  </div>
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900">Siti Nurhaliza</div>
                    <div class="text-sm text-gray-500">Guru Senior</div>
                  </div>
                </div>
              </td>
               <td class="px-6 py-4 whitespace-nowrap">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Hadir
                </span>
              </td>
               <td class="whitespace-no-wrap hidden py-4 text-sm font-normal text-gray-500 sm:px-6 lg:table-cell">
            <div class="inline-flex items-center rounded-full bg-blue-600 py-2 px-3 text-xs text-white">Disetujui</div>
          </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex-1 flex justify-between sm:hidden">
            <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Previous
            </button>
            <button class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              Next
            </button>
          </div>
          <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <ChevronLeft class="h-5 w-5" />
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                  1
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                  3
                </button>
                <button class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

</template>

<script setup>
import { CircleUserRound, UserCheck, UserX, ArrowUp, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-vue-next'
</script>