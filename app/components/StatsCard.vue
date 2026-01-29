<template>
    <div class="max-w-md rounded-lg border px-6 pt-6 pb-10 bg-white shadow-sm hover:shadow-md transition-shadow">
        <div :class="iconClasses">
            <component :is="icon" class="h-6 w-6" />
        </div>
        <p class="text-sm font-medium text-gray-500 mt-4">{{ label }}</p>
        <p class="text-4xl font-medium text-gray-800 mt-2">{{ formatNumber(value) }}</p>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { School, BookOpen, Calendar, Users } from 'lucide-vue-next'

const props = defineProps({
    icon: {
        type: [Object, String],
        required: true
    },
    label: {
        type: String,
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    color: {
        type: String,
        default: 'emerald',
        validator: (value) => ['blue', 'emerald', 'orange', 'purple', 'rose', 'indigo'].includes(value)
    }
})

const colorVariants = {
    blue: 'border-blue-50 bg-blue-200 text-blue-500',
    emerald: 'border-emerald-50 bg-emerald-200 text-emerald-500',
    orange: 'border-orange-50 bg-orange-200 text-orange-500',
    purple: 'border-purple-50 bg-purple-200 text-purple-500',
    rose: 'border-rose-50 bg-rose-200 text-rose-500',
    indigo: 'border-indigo-50 bg-indigo-200 text-indigo-500'
}

const iconClasses = computed(() => {
    return `inline-block rounded-full border-8 p-2 ${colorVariants[props.color]}`
})

const formatNumber = (num) => {
    return num.toLocaleString('id-ID')
}
</script>