<template>
    <Teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/40" @click="onCancel" />

            <!-- Modal -->
            <div class="relative z-10 w-full max-w-sm bg-white rounded-sm shadow-xl mx-4">
                <div class="p-6">
                    <!-- Icon -->
                    <div class="flex justify-center mb-4">
                        <div :class="['rounded-full p-3', iconBg]">
                            <component :is="iconComponent" :class="['h-6 w-6', iconColor]" />
                        </div>
                    </div>

                    <!-- Title -->
                    <h3 class="text-base font-semibold text-gray-900 text-center">
                        {{ confirmOptions.title }}
                    </h3>

                    <!-- Message -->
                    <p class="mt-2 text-sm text-gray-500 text-center">
                        {{ confirmOptions.message }}
                    </p>
                </div>

                <!-- Actions -->
                <div class="flex gap-3 px-6 pb-6">
                    <button @click="onCancel"
                        class="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors">
                        {{ confirmOptions.cancelText }}
                    </button>
                    <button @click="onConfirm"
                        :class="['flex-1 px-4 py-2 text-sm font-medium text-white rounded-sm transition-colors', confirmBtnClass]">
                        {{ confirmOptions.confirmText }}
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { Trash2, AlertTriangle, HelpCircle, XCircle } from 'lucide-vue-next'
import { useConfirm } from '~/composables/useConfirm'

const { isOpen, confirmOptions, onConfirm, onCancel } = useConfirm()

const iconComponent = computed(() => ({
    danger: Trash2,
    warning: AlertTriangle,
    info: HelpCircle,
    reject: XCircle,
}[confirmOptions.value.type] ?? HelpCircle))

const iconBg = computed(() => ({
    danger: 'bg-red-100',
    warning: 'bg-yellow-100',
    info: 'bg-blue-100',
    reject: 'bg-red-100'
}[confirmOptions.value.type] ?? 'bg-blue-100'))

const iconColor = computed(() => ({
    danger: 'text-red-600',
    warning: 'text-yellow-600',
    info: 'text-blue-600',
    reject: 'text-red-600'
}[confirmOptions.value.type] ?? 'text-blue-600'))

const confirmBtnClass = computed(() => ({
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    info: 'bg-blue-600 hover:bg-blue-700',
    reject: 'bg-red-600 hover:bg-red-700'
}[confirmOptions.value.type] ?? 'bg-blue-600 hover:bg-blue-700'))
</script>