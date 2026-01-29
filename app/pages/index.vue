<template>
    <div class="w-full">
        <div class="mb-6">
            <h1 class="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p class="text-gray-500 mt-1">Selamat datang di sistem presensi guru</p>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard 
                :icon="School" 
                label="Total Kelas" 
                :value="stats.totalKelas" 
                color="blue" 
            />
            <StatsCard 
                :icon="BookOpen" 
                label="Total Mapel" 
                :value="stats.totalMapel" 
                color="emerald" 
            />
            <StatsCard 
                :icon="Calendar" 
                label="Total Jadwal" 
                :value="stats.totalJadwal" 
                color="orange" 
            />
            <StatsCard 
                :icon="Users" 
                label="Total Guru" 
                :value="stats.totalGuru" 
                color="purple" 
            />
        </div>

        <div class="mt-8">
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { School, BookOpen, Calendar, Users } from 'lucide-vue-next'
import StatsCard from '~/components/StatsCard.vue'

const stats = ref({
    totalKelas: 24,
    totalMapel: 15,
    totalJadwal: 120,
    totalGuru: 45
})

// onMounted(async () => {
//     const response = await fetch('/api/dashboard/stats')
//     stats.value = await response.json()
// })
</script>