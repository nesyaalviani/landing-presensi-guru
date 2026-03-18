<template>
  <div class="min-h-screen bg-gray-50">
    <div class="max-w-7xl space-y-2 sm:space-y-3">
      <!-- Summary Cards -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div class="bg-white rounded-sm shadow-sm border border-gray-200 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="bg-blue-100 p-2 sm:p-3 rounded-sm flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-600">Total Jadwal</p>
              <div v-if="isLoading" class="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
              <p v-else class="text-xl sm:text-2xl font-bold text-gray-900">{{ totalSlot }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-sm shadow-sm border border-gray-200 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="bg-green-100 p-2 sm:p-3 rounded-sm flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-600">Hadir</p>
              <div v-if="isLoading" class="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
              <p v-else class="text-xl sm:text-2xl font-bold text-green-600">{{ totalHadir }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-sm shadow-sm border border-gray-200 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="bg-red-100 p-2 sm:p-3 rounded-sm flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-600">Tidak Hadir</p>
              <div v-if="isLoading" class="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
              <p v-else class="text-xl sm:text-2xl font-bold text-red-600">{{ totalTidakHadir }}</p>
            </div>
          </div>
        </div>

        <div class="bg-white rounded-sm shadow-sm border border-gray-200 p-4 sm:p-5">
          <div class="flex items-center gap-3">
            <div class="bg-gray-100 p-2 sm:p-3 rounded-sm flex-shrink-0">
              <svg class="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p class="text-xs sm:text-sm text-gray-600">Tdk Dipresensi</p>
              <div v-if="isLoading" class="h-8 w-16 bg-gray-200 rounded animate-pulse mt-1"></div>
              <p v-else class="text-xl sm:text-2xl font-bold text-gray-500">{{ totalBelum }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- History Cards -->
      <div class="space-y-3 sm:space-y-4">

        <!-- Loading Skeleton -->
        <template v-if="isLoading">
          <div v-for="i in perPage" :key="'skeleton-' + i"
            class="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden">
            <div class="p-4 sm:p-6">
              <div class="block sm:hidden space-y-3">
                <div class="flex items-start justify-between">
                  <div class="space-y-2">
                    <div class="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div class="flex gap-2">
                    <div class="h-9 w-9 bg-gray-200 rounded-sm animate-pulse"></div>
                  </div>
                </div>
                <div class="space-y-2">
                  <div class="h-5 w-40 bg-gray-200 rounded animate-pulse"></div>
                  <div class="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                  <div class="flex gap-2 mt-1">
                    <div class="h-6 w-16 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>
              </div>
              <div class="hidden sm:flex items-start justify-between">
                <div class="flex gap-6 flex-1">
                  <div class="space-y-2 min-w-[140px]">
                    <div class="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div class="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div class="flex-1 space-y-3">
                    <div class="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div class="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                    <div class="flex gap-2">
                      <div class="h-7 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
                <div class="h-9 w-28 bg-gray-200 rounded-sm animate-pulse"></div>
              </div>
            </div>
            <div class="bg-gray-50 px-4 sm:px-6 py-2.5 sm:py-3 border-t border-gray-200">
              <div class="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </template>

        <!-- Actual Data -->
        <template v-else>
          <div v-for="history in historyData" :key="`${history.id_jadwal}-${history.date}`"
            class="bg-white rounded-sm shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
            :class="{ 'opacity-70': history.status === 'belum' }">
            <div class="p-4 sm:p-6">

              <!-- Mobile Layout -->
              <div class="block sm:hidden space-y-3">
                <div class="flex items-start justify-between">
                  <div>
                    <p class="text-base font-medium text-gray-900">{{ history.timeRange }}</p>
                    <p class="text-sm text-gray-500">{{ history.date }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button v-if="history.photo" @click="viewPhoto(history)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition" title="Lihat Foto">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <div>
                  <div class="flex items-center gap-2 mb-2">
                    <h3 class="text-base font-semibold text-gray-900">{{ history.subject }}</h3>
                  </div>
                  <div class="flex items-center gap-2 text-gray-600 mb-3">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span class="text-sm">{{ history.teacher }}</span>
                  </div>

                  <div class="flex items-center gap-2 flex-wrap">
                    <span v-if="history.status === 'hadir'"
                      class="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      Hadir
                    </span>
                    <span v-else-if="history.status === 'tidak-hadir'"
                      class="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Tidak Hadir
                    </span>
                    <span v-else
                      class="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs px-2.5 py-1 rounded-full">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Tdk Dipresensi
                    </span>

                    <span v-if="history.hasTugas"
                      class="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2.5 py-1 rounded-full">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Ada Tugas
                    </span>

                    <template v-if="history.status !== 'belum'">
                      <span v-if="history.statusApprove === 'Pending'"
                        class="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-xs px-2.5 py-1 rounded-full">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Pending
                      </span>
                      <span v-else-if="history.statusApprove === 'Approved'"
                        class="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2.5 py-1 rounded-full">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        Disetujui
                      </span>
                      <span v-else-if="history.statusApprove === 'Rejected'"
                        class="inline-flex items-center gap-1 bg-red-100 text-red-700 text-xs px-2.5 py-1 rounded-full">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Ditolak
                      </span>
                    </template>
                  </div>
                </div>

                <div v-if="history.keterangan" class="text-sm text-gray-600 bg-gray-50 p-3 rounded-sm">
                  <p class="font-medium text-gray-700 mb-1">Keterangan:</p>
                  <p>{{ history.keterangan }}</p>
                </div>

                <div v-if="history.alasanReject"
                  class="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-sm">
                  <p class="font-medium text-red-700 mb-1">Alasan Penolakan:</p>
                  <p>{{ history.alasanReject }}</p>
                </div>

                <!-- Tombol Kirim Ulang Mobile -->
                <button v-if="history.statusApprove === 'Rejected'" :disabled="isBandingExpired(history)" :class="[
                  'w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-sm transition-all shadow-sm',
                  isBandingExpired(history)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'text-white bg-orange-500 hover:bg-orange-600 focus:outline-none hover:shadow-md'
                ]" @click="!isBandingExpired(history) && handleResubmit(history)">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  {{ isBandingExpired(history) ? 'Banding Kedaluwarsa' : 'Kirim Ulang' }}
                </button>
              </div>

              <!-- Desktop Layout -->
              <div class="hidden sm:block">
                <div class="flex items-start justify-between">
                  <div class="flex gap-6 flex-1">
                    <div class="text-gray-700 min-w-[140px]">
                      <p class="text-lg font-medium">{{ history.timeRange }}</p>
                      <p class="text-sm text-gray-500">{{ history.date }}</p>
                    </div>

                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-semibold">{{ history.subject }}</h3>
                      </div>
                      <div class="flex items-center gap-2 text-gray-600 mb-3">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span class="text-sm">{{ history.teacher }}</span>
                      </div>

                      <div class="flex items-center gap-2 flex-wrap">
                        <span v-if="history.status === 'hadir'"
                          class="inline-flex items-center gap-1 bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                          </svg>
                          Hadir
                        </span>
                        <span v-else-if="history.status === 'tidak-hadir'"
                          class="inline-flex items-center gap-1 bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Tidak Hadir
                        </span>
                        <span v-else
                          class="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-sm px-3 py-1 rounded-full">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Tidak Dipresensi
                        </span>

                        <span v-if="history.hasTugas"
                          class="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Ada Tugas
                        </span>

                        <template v-if="history.status !== 'belum'">
                          <span v-if="history.statusApprove === 'Pending'"
                            class="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 text-sm px-3 py-1 rounded-full">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Pending
                          </span>
                          <span v-else-if="history.statusApprove === 'Approved'"
                            class="inline-flex items-center gap-1 bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M5 13l4 4L19 7" />
                            </svg>
                            Disetujui
                          </span>
                          <span v-else-if="history.statusApprove === 'Rejected'"
                            class="inline-flex items-center gap-1 bg-red-100 text-red-700 text-sm px-3 py-1 rounded-full">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Ditolak
                          </span>
                        </template>
                      </div>
                    </div>
                  </div>

                  <!-- Actions Desktop -->
                  <div class="flex items-center gap-2 flex-shrink-0">
                    <button v-if="history.photo" @click="viewPhoto(history)"
                      class="p-2 text-blue-600 hover:bg-blue-50 rounded-sm transition" title="Lihat Foto">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </button>

                    <!-- Tombol Kirim Ulang Desktop -->
                    <button v-if="history.statusApprove === 'Rejected'" :disabled="isBandingExpired(history)" :class="[
                      'flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-sm transition-all shadow-sm',
                      isBandingExpired(history)
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'text-white bg-orange-500 hover:bg-orange-600 focus:outline-none hover:shadow-md'
                    ]" @click="!isBandingExpired(history) && handleResubmit(history)">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      {{ isBandingExpired(history) ? 'Banding Kedaluwarsa' : 'Kirim Ulang' }}
                    </button>
                  </div>
                </div>

                <!-- Keterangan & Alasan full width di bawah row -->
                <div v-if="history.keterangan" class="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-sm ml-[164px]">
                  <p class="font-medium text-gray-700 mb-1">Keterangan:</p>
                  <p>{{ history.keterangan }}</p>
                </div>
                <div v-if="history.alasanReject"
                  class="mt-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-sm ml-[164px]">
                  <p class="font-medium text-red-700 mb-1">Alasan Penolakan:</p>
                  <p>{{ history.alasanReject }}</p>
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div class="bg-gray-50 px-4 sm:px-6 py-2.5 sm:py-3 border-t border-gray-200">
              <div class="flex items-center gap-2 text-xs text-gray-500">
                <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span v-if="history.status === 'belum'" class="truncate text-gray-400 italic">
                  Presensi tidak dilakukan
                </span>
                <span v-else class="truncate">
                  Diinput pada: {{ history.createdAt }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && historyData.length === 0"
        class="bg-white rounded-sm shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
        <svg class="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 class="text-base sm:text-lg font-medium text-gray-900 mb-2">Tidak Ada Riwayat</h3>
        <p class="text-sm sm:text-base text-gray-600">Belum ada riwayat presensi yang sesuai dengan filter yang dipilih.
        </p>
      </div>

      <!-- Pagination -->
      <div v-if="!isLoading && totalPages > 1"
        class="bg-white px-3 sm:px-6 py-3 border-t border-gray-200 rounded-sm mt-4 sm:mt-6">
        <div class="flex items-center justify-between">
          <div class="flex flex-1 justify-between sm:hidden">
            <button @click="previousPage" :disabled="currentPage === 1"
              class="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Previous
            </button>
            <span class="relative inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700">
              {{ currentPage }} / {{ totalPages }}
            </span>
            <button @click="nextPage" :disabled="currentPage === totalPages"
              class="relative inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              Next
            </button>
          </div>

          <div class="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p class="text-sm text-gray-700">
                Menampilkan <span class="font-medium">{{ (currentPage - 1) * perPage + 1 }}</span> sampai
                <span class="font-medium">{{ Math.min(currentPage * perPage, totalSlot) }}</span> dari
                <span class="font-medium">{{ totalSlot }}</span> hasil
              </p>
            </div>
            <div>
              <nav class="relative z-0 inline-flex rounded-sm shadow-sm -space-x-px">
                <button @click="previousPage" :disabled="currentPage === 1"
                  class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronLeft class="h-5 w-5" />
                </button>
                <button v-for="page in displayPages" :key="page" @click="goToPage(page)" :class="[
                  'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                  page === currentPage
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                ]">
                  {{ page }}
                </button>
                <button @click="nextPage" :disabled="currentPage === totalPages"
                  class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                  <ChevronRight class="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Photo Modal -->
    <div v-if="showPhotoModal" class="fixed inset-0 bg-black flex items-center justify-center z-50"
      @click="closePhotoModal">
      <button @click="closePhotoModal"
        class="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 bg-black bg-opacity-50 rounded-full p-1">
        <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img :src="selectedPhoto" alt="Bukti Foto" class="max-w-full max-h-screen object-contain" @click.stop />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ChevronRight, ChevronLeft } from 'lucide-vue-next'
import { usePresensiStore } from '@/stores/presensi'
import { useRouter } from 'vue-router'

const presensiStore = usePresensiStore()
const router = useRouter()

const isLoading = ref(false)
const currentPage = ref(1)
const perPage = ref(10)
const showPhotoModal = ref(false)
const selectedPhoto = ref(null)
const historyData = ref([])
const totalSlot = ref(0)
const totalHadir = ref(0)
const totalTidakHadir = ref(0)
const totalBelum = ref(0)
const totalPages = ref(1)

const formatDate = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}

const formatDateTime = (isoString) => {
  if (!isoString) return ''
  const date = new Date(isoString)
  const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
  const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  return `${dateStr}, ${timeStr}`
}

const mapToHistory = (item) => {
  const jamMulai = item.jadwal?.jam_mulai?.substring(0, 5) || ''
  const jamSelesai = item.jadwal?.jam_selesai?.substring(0, 5) || ''
  const isBelum = item.presensi === null

  return {
    id_jadwal: item.jadwal?.id_jadwal,
    id_presensi: item.id_presensi,
    date: formatDate(item.tanggal),
    timeRange: `${jamMulai} – ${jamSelesai}`,
    subject: item.jadwal?.mapel || 'N/A',
    teacher: item.jadwal?.guru || 'N/A',
    status: isBelum ? 'belum' : item.presensi?.status === 'Hadir' ? 'hadir' : 'tidak-hadir',
    statusApprove: item.presensi?.status_approve || null,
    hasTugas: item.presensi?.memberikan_tugas || false,
    keterangan: item.presensi?.catatan || '',
    alasanReject: item.presensi?.alasan_reject || null,
    rejectedAt: item.presensi?.rejected_at || null,
    photo: item.presensi?.foto_bukti || null,
    createdAt: formatDateTime(item.created_at),
    duration: null
  }
}

const isBandingExpired = (history) => {
  if (history.statusApprove !== 'Rejected') return false
  if (!history.rejectedAt) return false
  const diff = (new Date() - new Date(history.rejectedAt)) / (1000 * 60 * 60)
  return diff > 24
}

const handleResubmit = (history) => {
  if (!history.id_presensi) return
  router.push({
    path: '/presensi/create',
    query: {
      jadwalId: history.id_jadwal,
      presensiId: history.id_presensi,
      mode: 'resubmit'
    }
  })
}

const fetchRiwayat = async () => {
  isLoading.value = true
  const result = await presensiStore.getRiwayatPresensiKM({
    page: currentPage.value,
    limit: perPage.value
  })
  if (result.success) {
    historyData.value = (result.data.data || []).map(mapToHistory)
    totalSlot.value = result.data.summary?.totalSlot || 0
    totalHadir.value = result.data.summary?.totalHadir || 0
    totalTidakHadir.value = result.data.summary?.totalTidakHadir || 0
    totalBelum.value = result.data.summary?.totalBelum || 0
    totalPages.value = result.data.pagination?.totalPages || 1
  } else {
    historyData.value = []
    totalSlot.value = 0
    totalHadir.value = 0
    totalTidakHadir.value = 0
    totalBelum.value = 0
    totalPages.value = 1
  }
  isLoading.value = false
}

const displayPages = computed(() => {
  const pages = []
  const maxDisplay = 5
  let startPage = Math.max(1, currentPage.value - 2)
  let endPage = Math.min(totalPages.value, startPage + maxDisplay - 1)
  if (endPage - startPage < maxDisplay - 1) startPage = Math.max(1, endPage - maxDisplay + 1)
  for (let i = startPage; i <= endPage; i++) pages.push(i)
  return pages
})

const viewPhoto = (history) => {
  selectedPhoto.value = history.photo
  showPhotoModal.value = true
  document.body.style.overflow = 'hidden'
}

const closePhotoModal = () => {
  showPhotoModal.value = false
  selectedPhoto.value = null
  document.body.style.overflow = ''
}

const previousPage = () => { if (currentPage.value > 1) currentPage.value-- }
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const goToPage = (page) => { currentPage.value = page }

watch(currentPage, () => { fetchRiwayat() })
onMounted(() => { fetchRiwayat() })
</script>