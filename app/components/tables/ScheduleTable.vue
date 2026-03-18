<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white rounded-sm border border-gray-200">
        <div class="mx-auto max-w-7xl">

            <!-- Header -->
            <div class="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div class="relative w-full sm:w-56">
                    <input v-model="search" type="text" placeholder="Cari kelas atau jurusan..."
                        class="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-sm outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all" />
                    <Search
                        class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div class="mb-3">
                <AppAlert :type="alertType" :message="alertMessage" :on-close="clearAlert" />
            </div>

            <!-- Loading Skeleton (first load) -->
            <div v-if="isFirstLoad" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <div v-for="i in 8" :key="'sk-' + i" class="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
                    <div class="flex items-start justify-between mb-4">
                        <div class="space-y-2">
                            <div class="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                            <div class="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                        <div class="h-8 w-8 bg-gray-200 rounded-sm animate-pulse"></div>
                    </div>
                    <div class="h-px bg-gray-100 my-3"></div>
                    <div class="flex items-center gap-2">
                        <div class="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                        <div class="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="classrooms.length === 0 && !classroomsStore.loading"
                class="flex flex-col items-center justify-center py-20 text-center">
                <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <CalendarDays class="h-8 w-8 text-gray-400" />
                </div>
                <h3 class="text-sm font-medium text-gray-900 mb-1">Tidak ada kelas</h3>
                <p class="text-sm text-gray-500">
                    {{ search ? `Tidak ada kelas yang cocok dengan "${search}"` : 'Belum ada data kelas.' }}
                </p>
            </div>

            <!-- Card Grid -->
            <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <NuxtLink v-for="kelas in classrooms" :key="kelas.id" :to="`/schedule/${kelas.id}`"
                    class="group bg-white border border-gray-200 rounded-sm p-5 shadow-sm hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">

                    <div class="flex items-start justify-between mb-3">
                        <div class="flex-1 min-w-0">
                            <h3
                                class="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {{ kelas.name }}
                            </h3>
                            <p class="text-xs text-gray-500 mt-0.5 truncate">
                                {{ kelas.tingkat }} · {{ kelas.nama_jurusan || '-' }}
                            </p>
                        </div>
                        <div
                            class="w-8 h-8 bg-blue-50 group-hover:bg-blue-100 rounded-sm flex items-center justify-center transition-colors flex-shrink-0 ml-2">
                            <ChevronRight class="h-4 w-4 text-blue-500" />
                        </div>
                    </div>

                    <div class="h-px bg-gray-100 mb-3"></div>

                    <div class="flex items-center gap-1.5 text-xs"
                        :class="parseInt(kelas.schedule_count) === 0 ? 'text-gray-400 italic' : 'text-gray-500'">
                        <CalendarDays class="h-3.5 w-3.5 flex-shrink-0" />
                        <span>
                            {{
                                parseInt(kelas.schedule_count) === 0
                                    ? 'Belum ada jadwal terdaftar'
                                    : `${kelas.schedule_count} jadwal terdaftar`
                            }}
                        </span>
                    </div>
                </NuxtLink>

                <!-- Skeleton cards saat load more -->
                <template v-if="classroomsStore.loading && !isFirstLoad">
                    <div v-for="i in 4" :key="'loadmore-' + i"
                        class="bg-white border border-gray-200 rounded-sm p-5 shadow-sm">
                        <div class="flex items-start justify-between mb-4">
                            <div class="space-y-2">
                                <div class="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
                                <div class="h-4 w-36 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                            <div class="h-8 w-8 bg-gray-200 rounded-sm animate-pulse"></div>
                        </div>
                        <div class="h-px bg-gray-100 my-3"></div>
                        <div class="flex items-center gap-2">
                            <div class="h-4 w-4 bg-gray-200 rounded animate-pulse"></div>
                            <div class="h-4 w-28 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    </div>
                </template>
            </div>

            <!-- Load more indicator -->
            <div v-if="classroomsStore.hasMore && !classroomsStore.loading" ref="loadMoreRef" class="h-8 mt-4">
            </div>

            <!-- No more data -->
            <div v-if="!classroomsStore.hasMore && classrooms.length > 0 && !isFirstLoad"
                class="text-center text-xs text-gray-400 mt-6">
                Semua kelas sudah ditampilkan
            </div>

        </div>
    </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { Search, ChevronRight, CalendarDays } from 'lucide-vue-next'
import { useClassroomsStore } from '~/stores/classrooms'

const classroomsStore = useClassroomsStore()
const { alertType, alertMessage, showAlert, clearAlert } = useAlert()

const search = ref('')
const isFirstLoad = ref(true)
const loadMoreRef = ref(null)
let searchTimeout = null
let observer = null

const classrooms = computed(() => classroomsStore.classrooms)

// Server-side search dengan debounce
watch(search, (val) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(async () => {
        isFirstLoad.value = true
        await classroomsStore.resetAndFetch({ search: val, limit: 12 })
        isFirstLoad.value = false
    }, 400)
})

// Infinite scroll via IntersectionObserver
const setupObserver = () => {
    if (!process.client) return
    observer = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting && classroomsStore.hasMore && !classroomsStore.loading) {
            await classroomsStore.loadMore({ search: search.value, limit: 12 })
        }
    }, { threshold: 0.1 })

    if (loadMoreRef.value) observer.observe(loadMoreRef.value)
}

// Re-observe ketika loadMoreRef muncul
watch(loadMoreRef, (el) => {
    if (el && observer) observer.observe(el)
})

onMounted(async () => {
    isFirstLoad.value = true
    await classroomsStore.resetAndFetch({ limit: 12 })
    isFirstLoad.value = false
    setupObserver()
})

onUnmounted(() => {
    if (observer) observer.disconnect()
    clearTimeout(searchTimeout)
})
</script>