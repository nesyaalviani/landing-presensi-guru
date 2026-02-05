<template>
    <section>
        <div class="mx-auto max-w-7xl">
            <div class="mb-6">
                <h1 class="text-2xl font-bold text-gray-900">Jadwal Pelajaran - XII RPL 1</h1>
                <p class="text-sm text-gray-500 mt-1">Semester Genap 2025/2026</p>
            </div>

            <!-- Wrapper untuk horizontal scroll -->
            <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
                <div class="overflow-x-auto custom-scrollbar">
                    <div class="inline-block min-w-full align-middle">
                        <div class="schedule-grid">
                            <!-- Header Row -->
                            <div class="schedule-header">
                                <div class="day-header">Hari</div>
                                <div v-for="(schedule, index) in timeSchedule" :key="index" class="time-header">
                                    <div class="font-bold">Jam {{ index + 1 }}</div>
                                    <div class="time-range">{{ schedule }}</div>
                                </div>
                            </div>

                            <!-- Schedule Rows -->
                            <div v-for="(day, dayIndex) in days" :key="dayIndex" class="schedule-row">
                                <div class="day-cell">{{ day }}</div>

                                <!-- Grid cells untuk setiap jam pelajaran -->
                                <div class="periods-container">
                                    <template v-for="(period, periodIndex) in 12" :key="periodIndex">
                                        <div v-if="shouldRenderCell(dayIndex, periodIndex)"
                                            :style="getSubjectStyle(dayIndex, periodIndex)" class="subject-cell">
                                            <div class="subject-name">{{ getSubject(dayIndex, periodIndex)?.subject }}
                                            </div>
                                            <div class="teacher-name">{{ getSubject(dayIndex, periodIndex)?.teacher }}
                                            </div>
                                        </div>
                                        <div v-else-if="!isPartOfSubject(dayIndex, periodIndex)" class="empty-cell">
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Legend -->
            <!-- <div class="mt-6 bg-white rounded-lg shadow border border-gray-200 p-5">
                <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                    <div class="w-1 h-4 bg-blue-600 rounded"></div>
                    Keterangan Mata Pelajaran
                </h3>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    <div v-for="(subject, index) in uniqueSubjects" :key="index"
                        class="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                        <div class="w-3 h-3 rounded-sm flex-shrink-0" :style="{ backgroundColor: subject.color }"></div>
                        <span class="text-xs text-gray-700 font-medium truncate">{{ subject.name }}</span>
                    </div>
                </div>
            </div> -->
        </div>
    </section>
</template>

<script setup>
import { computed } from 'vue'

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat']

const timeSchedule = [
    '07:15 - 08:00',
    '08:00 - 08:45',
    '08:45 - 09:30',
    '09:30 - 10:15',
    '10:15 - 11:00',
    '11:00 - 11:45',
    '11:45 - 12:30',
    '12:30 - 13:15',
    '13:15 - 14:00',
    '14:00 - 14:45',
    '14:45 - 15:30',
    '15:30 - 16:15'
]

// Data jadwal pelajaran - format: { subject, teacher, startPeriod, duration, color }
const scheduleData = {
    0: [ // Senin
        { subject: 'Upacara', teacher: 'GURU PIKET', startPeriod: 0, duration: 1, color: '#dc2626' },
        { subject: 'PPB', teacher: 'SANDI', startPeriod: 1, duration: 2, color: '#0ea5e9' },
        { subject: 'PPB', teacher: 'SANDI', startPeriod: 3, duration: 2, color: '#0ea5e9' },
        { subject: 'PKK RPL', teacher: 'YAYA', startPeriod: 5, duration: 2, color: '#06b6d4' },
        { subject: 'PKK RPL', teacher: 'YAYA', startPeriod: 7, duration: 3, color: '#06b6d4' },
        { subject: 'BK', teacher: 'MEGA', startPeriod: 10, duration: 2, color: '#84cc16' },
    ],
    1: [ // Selasa
        { subject: 'B INDO', teacher: 'LIPIK', startPeriod: 0, duration: 3, color: '#0ea5e9' },
        { subject: 'PABP', teacher: 'NURON', startPeriod: 3, duration: 3, color: '#f0abfc' },
        { subject: 'PROG WEB', teacher: 'INDRI', startPeriod: 6, duration: 3, color: '#f97316' },
        { subject: 'PROG WEB', teacher: 'INDRI', startPeriod: 9, duration: 3, color: '#fb923c' },
    ],
    2: [ // Rabu
        { subject: 'PBTGM', teacher: 'BONNY', startPeriod: 0, duration: 4, color: '#eab308' },
        { subject: 'PBTGM', teacher: 'BONNY', startPeriod: 4, duration: 2, color: '#eab308' },
        { subject: 'MTK', teacher: 'RESTRI', startPeriod: 6, duration: 2, color: '#94a3b8' },
        { subject: 'MTK', teacher: 'RESTRI', startPeriod: 8, duration: 2, color: '#94a3b8' },
        { subject: 'PP', teacher: 'ARLI', startPeriod: 10, duration: 1, color: '#a78bfa' },
        { subject: 'BK', teacher: 'MEGA', startPeriod: 11, duration: 1, color: '#84cc16' },
    ],
    3: [ // Kamis
        { subject: 'BASDAT', teacher: 'TETI', startPeriod: 0, duration: 4, color: '#22c55e' },
        { subject: 'B JPG', teacher: 'WINDA', startPeriod: 4, duration: 2, color: '#dc2626' },
        { subject: 'B INGG', teacher: 'RINA', startPeriod: 6, duration: 3, color: '#0ea5e9' },
        { subject: 'B INGG', teacher: 'RINA', startPeriod: 9, duration: 3, color: '#0ea5e9' },
    ],
    4: [ // Jumat
        { subject: 'B SUND', teacher: 'RIKKA', startPeriod: 0, duration: 2, color: '#06b6d4' },
        { subject: 'MAPIL-D ESGRAF', teacher: 'HANDY', startPeriod: 2, duration: 3, color: '#eab308' },
        { subject: 'MAPIL-D ESGRAF', teacher: 'HANDY', startPeriod: 5, duration: 3, color: '#eab308' },
    ],
}

// Fungsi untuk mendapatkan subject pada period tertentu
const getSubject = (dayIndex, periodIndex) => {
    const daySchedule = scheduleData[dayIndex]
    if (!daySchedule) return null

    return daySchedule.find(item => {
        const endPeriod = item.startPeriod + item.duration - 1
        return periodIndex >= item.startPeriod && periodIndex <= endPeriod
    })
}

// Fungsi untuk cek apakah cell harus di-render
const shouldRenderCell = (dayIndex, periodIndex) => {
    const subject = getSubject(dayIndex, periodIndex)
    if (!subject) return false
    return subject.startPeriod === periodIndex
}

// Fungsi untuk cek apakah period adalah bagian dari subject
const isPartOfSubject = (dayIndex, periodIndex) => {
    return getSubject(dayIndex, periodIndex) !== null
}

// Fungsi untuk mendapatkan style subject
const getSubjectStyle = (dayIndex, periodIndex) => {
    const subject = getSubject(dayIndex, periodIndex)
    if (!subject) return {}

    return {
        gridColumn: `span ${subject.duration}`,
        backgroundColor: subject.color,
    }
}

// Computed untuk unique subjects
const uniqueSubjects = computed(() => {
    const subjects = new Map()

    Object.values(scheduleData).forEach(daySchedule => {
        daySchedule.forEach(item => {
            if (!subjects.has(item.subject)) {
                subjects.set(item.subject, {
                    name: item.subject,
                    color: item.color
                })
            }
        })
    })

    return Array.from(subjects.values()).sort((a, b) => a.name.localeCompare(b.name))
})
</script>

<style scoped>
/* Schedule Grid Layout */
.schedule-grid {
    display: grid;
    grid-template-columns: 140px repeat(12, minmax(110px, 1fr));
    min-width: max-content;
}

/* Header Styling */
.schedule-header {
    display: contents;
}

.day-header {
    position: sticky;
    left: 0;
    z-index: 10;
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    font-weight: 700;
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 1rem 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 2px solid #1e40af;
    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
}

.time-header {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    color: white;
    padding: 0.75rem 0.5rem;
    text-align: center;
    font-size: 0.75rem;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 0.25rem;
}

.time-range {
    font-size: 0.65rem;
    opacity: 0.9;
    font-weight: 400;
}

/* Schedule Row */
.schedule-row {
    display: contents;
}

.schedule-row:hover .day-cell {
    background-color: #f9fafb;
}

.day-cell {
    position: sticky;
    left: 0;
    z-index: 10;
    background: white;
    font-weight: 600;
    font-size: 0.875rem;
    color: #1f2937;
    padding: 1rem 1.5rem;
    border-right: 2px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color 0.2s;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
}

/* Periods Container */
.periods-container {
    display: contents;
}

/* Subject Cell */
.subject-cell {
    background: #3b82f6;
    color: white;
    padding: 0.75rem;
    border-right: 1px solid rgba(255, 255, 255, 0.2);
    border-bottom: 1px solid #e5e7eb;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    gap: 0.25rem;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
    min-height: 80px;
}

.subject-cell::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 100%);
    pointer-events: none;
}

.subject-cell:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 5;
}

.subject-name {
    font-weight: 700;
    font-size: 0.8125rem;
    line-height: 1.3;
    position: relative;
    z-index: 1;
}

.teacher-name {
    font-size: 0.6875rem;
    opacity: 0.95;
    font-weight: 500;
    position: relative;
    z-index: 1;
}

/* Empty Cell */
.empty-cell {
    background: #fafafa;
    border-right: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
    min-height: 80px;
    transition: background-color 0.2s;
}

.empty-cell:hover {
    background: #f3f4f6;
}

/* Custom Scrollbar */
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: #cbd5e1 #f1f5f9;
}

.custom-scrollbar::-webkit-scrollbar {
    height: 10px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f1f5f9;
    border-radius: 5px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 5px;
    transition: background 0.2s;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: #94a3b8;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .schedule-grid {
        grid-template-columns: 100px repeat(12, minmax(90px, 1fr));
    }

    .day-cell {
        font-size: 0.75rem;
        padding: 0.75rem 1rem;
    }

    .subject-name {
        font-size: 0.75rem;
    }

    .teacher-name {
        font-size: 0.625rem;
    }
}
</style>