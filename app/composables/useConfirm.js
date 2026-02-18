import { ref } from 'vue'

const isOpen = ref(false)
const confirmOptions = ref({
    title: '',
    message: '',
    confirmText: 'Ya',
    cancelText: 'Batal',
    type: 'danger',
})

let resolveFn = null

export function useConfirm() {
    const confirm = (options = {}) => {
        confirmOptions.value = {
            title: '',
            message: '',
            confirmText: 'Ya',
            cancelText: 'Batal',
            type: 'danger',
            ...options,
        }
        isOpen.value = true

        return new Promise((resolve) => {
            resolveFn = resolve
        })
    }

    const onConfirm = () => {
        isOpen.value = false
        resolveFn?.(true)
    }

    const onCancel = () => {
        isOpen.value = false
        resolveFn?.(false)
    }

    return { isOpen, confirmOptions, confirm, onConfirm, onCancel }
}