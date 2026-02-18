export function useAlert() {
    const alertType = ref('info')
    const alertMessage = ref('')
    const alertRedirectDelay = ref(0)
    const alertRedirectFn = ref(null)

    /**
     * @param {'success'|'error'|'warning'|'info'} type
     * @param {string} message
     * @param {{ redirectDelay?: number, redirectFn?: Function }} options
     */
    const showAlert = (type, message, options = {}) => {
        alertType.value = type
        alertMessage.value = message
        alertRedirectDelay.value = options.redirectDelay ?? 0
        alertRedirectFn.value = options.redirectFn ?? null
    }

    const clearAlert = () => {
        alertMessage.value = ''
        alertRedirectDelay.value = 0
        alertRedirectFn.value = null
    }

    /**
     * Auto-close error saat user mulai ngetik.
     * @param {ReturnType<typeof ref>} source - ref formData
     * @param {string} [field] - nama field spesifik (opsional)
     */
    const watchInputClearError = (source, field = null) => {
        const target = field ? () => source.value?.[field] : source
        watch(target, () => {
            if (alertType.value === 'error' && alertMessage.value) {
                clearAlert()
            }
        }, { deep: true })
    }

    return {
        alertType,
        alertMessage,
        alertRedirectDelay,
        alertRedirectFn,
        showAlert,
        clearAlert,
        watchInputClearError
    }
}