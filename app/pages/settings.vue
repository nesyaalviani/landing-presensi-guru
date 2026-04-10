<template>
  <div class="min-h-screen bg-slate-50">
    <main class="w-full">

      <!-- Page Title -->
      <div>
        <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 leading-tight">Pengaturan Sistem</h2>
        <p class="text-slate-500 text-xs sm:text-sm mt-0.5">Kelola konfigurasi dan preferensi sistem presensi sekolah.</p>
      </div>

      <!-- Settings Grid -->
      <div class="space-y-5 sm:space-y-6">

        <!-- Section: Manajemen Persetujuan -->
        <section>
          <div class="flex items-center gap-2 mb-3 sm:mb-4">
            <div class="h-px flex-1 bg-slate-200"></div>
            <span class="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest px-2">Manajemen Persetujuan</span>
            <div class="h-px flex-1 bg-slate-200"></div>
          </div>

          <!-- Bulk Approval Card -->
          <div
            class="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300"
            :class="settingsStore.bulkApprovalEnabled ? 'ring-2 ring-blue-500 ring-offset-1' : ''">

            <div class="p-4 sm:p-5 lg:p-6">
              <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">

                <!-- Left side: icon + all content -->
                <div class="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">

                  <!-- Icon -->
                  <div
                    class="shrink-0 w-9 h-9 sm:w-11 sm:h-11 lg:w-12 lg:h-12 rounded-lg sm:rounded-xl flex items-center justify-center transition-all duration-300"
                    :class="settingsStore.bulkApprovalEnabled ? 'bg-blue-100' : 'bg-slate-100'">
                    <svg
                      class="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 transition-colors duration-300"
                      :class="settingsStore.bulkApprovalEnabled ? 'text-blue-600' : 'text-slate-400'"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  <!-- Text block -->
                  <div class="flex-1 min-w-0">
                    <!-- Title row: badge + mobile toggle -->
                    <div class="flex items-center justify-between gap-2">
                      <div class="flex items-center gap-2 flex-wrap min-w-0">
                        <h3 class="text-sm sm:text-base font-semibold text-slate-800 leading-tight">Persetujuan Massal Presensi</h3>
                        <span
                          v-if="settingsStore.bulkApprovalEnabled"
                          class="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-1.5 sm:px-2 py-0.5 rounded-full animate-pulse">
                          <span class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-500 inline-block"></span>
                          Aktif
                        </span>
                        <span
                          v-else
                          class="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-1.5 sm:px-2 py-0.5 rounded-full">
                          <span class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-400 inline-block"></span>
                          Nonaktif
                        </span>
                      </div>

                      <!-- Toggle: mobile only -->
                      <div class="flex items-center gap-1.5 sm:hidden shrink-0">
                        <span class="text-[10px] font-semibold transition-colors duration-300"
                          :class="settingsStore.bulkApprovalEnabled ? 'text-blue-600' : 'text-slate-400'">
                          {{ settingsStore.bulkApprovalEnabled ? 'ON' : 'OFF' }}
                        </span>
                        <button
                          @click="toggleApproveAll"
                          :disabled="settingsStore.loading"
                          :aria-pressed="settingsStore.bulkApprovalEnabled"
                          aria-label="Toggle persetujuan massal presensi"
                          class="relative inline-flex items-center w-11 h-6 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60"
                          :class="settingsStore.bulkApprovalEnabled ? 'bg-blue-600' : 'bg-slate-300'">
                          <span
                            class="inline-block w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300"
                            :class="settingsStore.bulkApprovalEnabled ? 'translate-x-6' : 'translate-x-1'">
                          </span>
                        </button>
                      </div>
                    </div>

                    <p class="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                      Ketika diaktifkan, admin dan piket dapat menyetujui atau menolak banyak presensi
                      sekaligus tanpa harus memproses satu per satu.
                    </p>

                    <!-- Info boxes -->
                    <div class="mt-3 sm:mt-4 grid grid-cols-2 gap-2 sm:gap-3">
                      <div class="rounded-lg p-2.5 sm:p-3 border transition-all duration-300"
                        :class="settingsStore.bulkApprovalEnabled ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'">
                        <div class="flex items-center gap-1.5 sm:gap-2">
                          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors duration-300"
                            :class="settingsStore.bulkApprovalEnabled ? 'text-green-600' : 'text-slate-400'"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span class="text-[10px] sm:text-xs font-medium transition-colors duration-300 leading-tight"
                            :class="settingsStore.bulkApprovalEnabled ? 'text-green-700' : 'text-slate-500'">
                            Proses lebih efisien
                          </span>
                        </div>
                        <p class="text-[10px] sm:text-[11px] mt-1 transition-colors duration-300 leading-relaxed"
                          :class="settingsStore.bulkApprovalEnabled ? 'text-green-600' : 'text-slate-400'">
                          Banyak presensi bisa diproses sekaligus.
                        </p>
                      </div>
                      <div class="rounded-lg p-2.5 sm:p-3 border transition-all duration-300"
                        :class="settingsStore.bulkApprovalEnabled ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200'">
                        <div class="flex items-center gap-1.5 sm:gap-2">
                          <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-colors duration-300"
                            :class="settingsStore.bulkApprovalEnabled ? 'text-amber-600' : 'text-slate-400'"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          <span class="text-[10px] sm:text-xs font-medium transition-colors duration-300 leading-tight"
                            :class="settingsStore.bulkApprovalEnabled ? 'text-amber-700' : 'text-slate-500'">
                            Perlu kehati-hatian
                          </span>
                        </div>
                        <p class="text-[10px] sm:text-[11px] mt-1 transition-colors duration-300 leading-relaxed"
                          :class="settingsStore.bulkApprovalEnabled ? 'text-amber-600' : 'text-slate-400'">
                          Semua yang dipilih langsung diproses.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Right: Toggle — desktop only -->
                <div class="hidden sm:flex shrink-0 flex-col items-center gap-1.5">
                  <button
                    @click="toggleApproveAll"
                    :disabled="settingsStore.loading"
                    :aria-pressed="settingsStore.bulkApprovalEnabled"
                    aria-label="Toggle persetujuan massal presensi"
                    class="relative inline-flex items-center w-12 h-6 lg:w-14 lg:h-7 rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-60"
                    :class="settingsStore.bulkApprovalEnabled ? 'bg-blue-600' : 'bg-slate-300'">
                    <span
                      class="inline-block w-4 h-4 lg:w-5 lg:h-5 bg-white rounded-full shadow-md transform transition-transform duration-300"
                      :class="settingsStore.bulkApprovalEnabled ? 'translate-x-7 lg:translate-x-8' : 'translate-x-1'">
                    </span>
                  </button>
                  <span class="text-[10px] sm:text-[11px] font-medium transition-colors duration-300"
                    :class="settingsStore.bulkApprovalEnabled ? 'text-blue-600' : 'text-slate-400'">
                    {{ settingsStore.bulkApprovalEnabled ? 'ON' : 'OFF' }}
                  </span>
                </div>

              </div>
            </div>

            <!-- Footer bar saat aktif -->
            <Transition name="slide-down">
              <div
                v-if="settingsStore.bulkApprovalEnabled"
                class="bg-blue-600 px-4 sm:px-6 py-2.5 sm:py-3 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2">
                <div class="flex items-start gap-2 min-w-0">
                  <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-200 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-[11px] sm:text-xs text-blue-100 leading-relaxed">
                    Aktif sejak <strong class="text-white">{{ activeSince }}</strong>. Admin dan piket dapat memproses presensi secara massal.
                  </p>
                </div>
                <button
                  @click="toggleApproveAll"
                  :disabled="settingsStore.loading"
                  class="shrink-0 text-[11px] sm:text-xs font-semibold text-white bg-white/20 hover:bg-white/30 border border-white/30 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-all duration-200 whitespace-nowrap disabled:opacity-60">
                  Nonaktifkan
                </button>
              </div>
            </Transition>

          </div>
        </section>

        <!-- Section: Log Aktivitas -->
        <section>
          <div class="flex items-center gap-2 mb-3 sm:mb-4">
            <div class="h-px flex-1 bg-slate-200"></div>
            <span class="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-widest px-2">Informasi</span>
            <div class="h-px flex-1 bg-slate-200"></div>
          </div>

          <div class="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-5 lg:p-6">
            <div class="flex items-start gap-3 sm:gap-4">
              <div class="w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-lg sm:rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                <svg class="w-4 h-4 lg:w-5 lg:h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-semibold text-slate-700">Log Aktivitas</h3>
                <p class="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  Setiap perubahan pengaturan tercatat dalam log sistem dan dapat dilihat oleh administrator sekolah.
                </p>
                <div class="mt-3 space-y-1.5 sm:space-y-2">
                  <div
                    v-for="log in activityLogs"
                    :key="log.id"
                    class="flex items-center gap-2 sm:gap-3">
                    <span class="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-slate-300 shrink-0"></span>
                    <span class="flex-1 text-[11px] sm:text-xs text-slate-500 truncate">{{ log.message }}</span>
                    <span class="text-[10px] sm:text-xs text-slate-400 shrink-0">{{ log.time }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>

    <!-- Confirm Modal -->
    <Transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
        @click.self="cancelToggle">
        <Transition name="sheet-up">
          <div
            v-if="showModal"
            class="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-5 sm:p-6">

            <!-- Drag handle: mobile only -->
            <div class="flex justify-center mb-4 sm:hidden">
              <div class="w-9 h-1 rounded-full bg-slate-200"></div>
            </div>

            <div class="flex items-start gap-3 sm:gap-4">
              <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0"
                :class="settingsStore.bulkApprovalEnabled ? 'bg-red-100' : 'bg-blue-100'">
                <svg class="w-5 h-5 sm:w-6 sm:h-6"
                  :class="settingsStore.bulkApprovalEnabled ? 'text-red-600' : 'text-blue-600'"
                  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm sm:text-base font-bold text-slate-800">
                  {{ settingsStore.bulkApprovalEnabled ? 'Nonaktifkan Persetujuan Massal?' : 'Aktifkan Persetujuan Massal?' }}
                </h4>
                <p class="text-xs sm:text-sm text-slate-500 mt-1 leading-relaxed">
                  <template v-if="!settingsStore.bulkApprovalEnabled">
                    Admin dan piket dapat <strong>menyetujui atau menolak banyak presensi sekaligus</strong>.
                    Pastikan fitur ini digunakan dengan bijak.
                  </template>
                  <template v-else>
                    Fitur persetujuan massal akan dimatikan. Admin dan piket harus memproses presensi satu per satu kembali.
                  </template>
                </p>
              </div>
            </div>

            <!-- Actions -->
            <div class="mt-5 sm:mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 sm:justify-end">
              <button
                @click="cancelToggle"
                :disabled="settingsStore.loading"
                class="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors duration-200 disabled:opacity-60">
                Batal
              </button>
              <button
                @click="confirmToggle"
                :disabled="settingsStore.loading"
                class="w-full sm:w-auto px-4 py-2.5 sm:py-2 text-sm font-semibold text-white rounded-xl transition-all duration-200 disabled:opacity-60 flex items-center justify-center gap-2"
                :class="settingsStore.bulkApprovalEnabled ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-600 hover:bg-blue-700'">
                <svg v-if="settingsStore.loading" class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                {{ settingsStore.loading ? 'Menyimpan...' : (settingsStore.bulkApprovalEnabled ? 'Ya, Nonaktifkan' : 'Ya, Aktifkan') }}
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSettingsStore } from '~/stores/settings'

const settingsStore = useSettingsStore()

const showModal = ref(false)
const activatedAt = ref(null)

const activeSince = computed(() => {
  if (!activatedAt.value) return '-'
  return activatedAt.value.toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  })
})

const activityLogs = ref([
  { id: 1, message: 'Persetujuan massal dinonaktifkan oleh Admin', time: '08:32' },
  { id: 2, message: 'Persetujuan massal diaktifkan oleh Admin', time: '07:15' },
  { id: 3, message: 'Pengaturan sistem dibuka', time: '07:10' },
])

const toggleApproveAll = () => {
  if (settingsStore.loading) return
  showModal.value = true
}

const confirmToggle = async () => {
  const newVal = !settingsStore.bulkApprovalEnabled
  const result = await settingsStore.setBulkApprovalStatus(newVal)

  if (result.success) {
    if (newVal) activatedAt.value = new Date()
    const action = newVal ? 'diaktifkan' : 'dinonaktifkan'
    const now = new Date()
    const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    activityLogs.value.unshift({
      id: Date.now(),
      message: `Persetujuan massal ${action} oleh Admin`,
      time: timeStr
    })
    if (activityLogs.value.length > 5) activityLogs.value = activityLogs.value.slice(0, 5)
  }

  showModal.value = false
}

const cancelToggle = () => {
  showModal.value = false
}

onMounted(async () => {
  await settingsStore.fetchBulkApprovalStatus()
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}
.slide-down-enter-from,
.slide-down-leave-to { max-height: 0; opacity: 0; }
.slide-down-enter-to,
.slide-down-leave-from { max-height: 120px; opacity: 1; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.25s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.sheet-up-enter-active,
.sheet-up-leave-active {
  transition: all 0.3s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.sheet-up-enter-from,
.sheet-up-leave-to {
  opacity: 0;
  transform: translateY(24px);
}
@media (min-width: 640px) {
  .sheet-up-enter-from,
  .sheet-up-leave-to {
    transform: scale(0.95) translateY(0);
  }
}
</style>