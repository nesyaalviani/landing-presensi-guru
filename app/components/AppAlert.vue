<template>
    <div v-if="visible && message" :class="[
        'flex items-start gap-3 rounded-sm border px-4 py-3 text-sm',
        styles[type].wrapper
    ]" role="alert">
        <component :is="styles[type].icon" class="mt-0.5 h-4 w-4 flex-shrink-0" />

        <span class="flex-1 leading-relaxed">{{ message }}</span>

        <button type="button" @click="close"
            :class="['flex-shrink-0 rounded-sm p-0.5 transition-colors', styles[type].closeBtn]" aria-label="Tutup">
            <X class="h-4 w-4" />
        </button>
    </div>
</template>

<script setup>
import { CheckCircle, AlertCircle, AlertTriangle, Info, X } from 'lucide-vue-next'

const props = defineProps({
    type: {
        type: String,
        default: 'info',
        validator: (v) => ['success', 'error', 'warning', 'info'].includes(v)
    },
    message: {
        type: String,
        default: ''
    },
    redirectDelay: {
        type: Number,
        default: 0
    },
    onClose: {
        type: Function,
        default: null
    },
    onRedirect: {
        type: Function,
        default: null
    }
})

const styles = {
    success: {
        wrapper: 'border-green-300 bg-green-50 text-green-800',
        closeBtn: 'text-green-500 hover:bg-green-100 hover:text-green-700',
        icon: CheckCircle
    },
    error: {
        wrapper: 'border-red-300 bg-red-50 text-red-700',
        closeBtn: 'text-red-400 hover:bg-red-100 hover:text-red-600',
        icon: AlertCircle
    },
    warning: {
        wrapper: 'border-yellow-300 bg-yellow-50 text-yellow-800',
        closeBtn: 'text-yellow-500 hover:bg-yellow-100 hover:text-yellow-700',
        icon: AlertTriangle
    },
    info: {
        wrapper: 'border-blue-300 bg-blue-50 text-blue-700',
        closeBtn: 'text-blue-400 hover:bg-blue-100 hover:text-blue-600',
        icon: Info
    }
}

const visible = ref(false)
let redirectTimer = null

const close = () => {
    visible.value = false
    clearTimeout(redirectTimer)
    props.onClose?.()
}

watch(
    () => props.message,
    (msg) => {
        if (msg) {
            visible.value = true
            clearTimeout(redirectTimer)

            if (props.type === 'success' && props.redirectDelay > 0) {
                redirectTimer = setTimeout(() => {
                    visible.value = false
                    props.onRedirect?.()
                }, props.redirectDelay)
            }
        } else {
            visible.value = false
            clearTimeout(redirectTimer)
        }
    },
    { immediate: true }
)

onUnmounted(() => clearTimeout(redirectTimer))
</script>