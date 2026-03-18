<template>
    <Transition name="modal">
        <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div class="relative bg-white rounded-sm shadow-xl max-w-md w-full" @click.stop>

                <!-- Header -->
                <div class="px-6 py-4 border-b border-gray-200">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                                <UserCheck class="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 class="text-base font-semibold text-gray-900">Lengkapi Profil Anda</h3>
                                <p class="text-xs text-gray-500 mt-0.5">Wajib diisi sebelum menggunakan aplikasi</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Body -->
                <div class="px-6 py-5">
                    <div class="mb-5 bg-amber-50 border border-amber-200 rounded-sm px-3 py-2.5 flex items-start gap-2">
                        <Info class="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                        <p class="text-xs text-amber-800">
                            Akun Anda baru dibuat oleh admin. Silakan perbarui nama dan buat password baru Anda
                            sekarang.
                        </p>
                    </div>

                    <!-- Alert error -->
                    <div v-if="errorMessage"
                        class="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-sm px-3 py-2.5 text-sm text-red-800">
                        <AlertCircle class="w-4 h-4 shrink-0" />
                        <span>{{ errorMessage }}</span>
                    </div>

                    <div class="space-y-4">
                        <!-- Nama -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">
                                Nama Lengkap <span class="text-red-500">*</span>
                            </label>
                            <input v-model="form.name" type="text" placeholder="Masukkan nama lengkap Anda"
                                class="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400" />
                        </div>

                        <!-- Password Baru -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">
                                Password Baru <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <input v-model="form.password" :type="showPassword ? 'text' : 'password'"
                                    placeholder="Minimal 8 karakter"
                                    class="w-full px-3 py-2.5 pr-10 text-sm border rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
                                    :class="passwordFieldClass" />
                                <button type="button" @click="showPassword = !showPassword"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Eye v-if="!showPassword" class="w-4 h-4" />
                                    <EyeOff v-else class="w-4 h-4" />
                                </button>
                            </div>
                            <p v-if="form.password && form.password.length < 8" class="mt-1 text-xs text-red-500">
                                Password minimal 8 karakter
                            </p>
                        </div>

                        <!-- Konfirmasi Password -->
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-1.5">
                                Konfirmasi Password <span class="text-red-500">*</span>
                            </label>
                            <div class="relative">
                                <input v-model="form.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                                    placeholder="Ulangi password baru"
                                    class="w-full px-3 py-2.5 pr-16 text-sm border rounded-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-400"
                                    :class="confirmPasswordFieldClass" />
                                <button type="button" @click="showConfirmPassword = !showConfirmPassword"
                                    class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                                    <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                                    <EyeOff v-else class="w-4 h-4" />
                                </button>
                                <div v-if="form.confirmPassword" class="absolute right-9 top-1/2 -translate-y-1/2">
                                    <CheckCircle v-if="passwordsMatch" class="w-4 h-4 text-green-500" />
                                    <XCircle v-else class="w-4 h-4 text-red-500" />
                                </div>
                            </div>
                            <p v-if="form.confirmPassword && !passwordsMatch" class="mt-1 text-xs text-red-500">
                                Password tidak cocok
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="px-6 py-4 border-t border-gray-200 space-y-2">
                    <button @click="handleSubmit" :disabled="loading || !isFormValid"
                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                        <Loader v-if="loading" class="w-4 h-4 animate-spin" />
                        <Save v-else class="w-4 h-4" />
                        {{ loading ? 'Menyimpan...' : 'Simpan & Lanjutkan' }}
                    </button>

                    <button @click="handleLogout"
                        class="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 bg-white border border-red-300 rounded-sm hover:bg-red-50 hover:border-red-400 transition-all">
                        <LogOut class="w-4 h-4" />
                        Keluar
                    </button>
                </div>

            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { UserCheck, Info, Eye, EyeOff, Save, Loader, AlertCircle, CheckCircle, XCircle, LogOut } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    }
})

watch(() => props.show, (val) => {
    if (process.client) {
        document.body.style.overflow = val ? 'hidden' : ''
    }
}, { immediate: true })

const authStore = useAuthStore()

const form = ref({ name: '', password: '', confirmPassword: '' })
const loading = ref(false)
const errorMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const passwordsMatch = computed(() => form.value.password === form.value.confirmPassword)

const passwordFieldClass = computed(() => {
    if (!form.value.password) return 'border-gray-300'
    if (form.value.password.length < 8) return 'border-red-400 bg-red-50'
    return 'border-green-400 bg-green-50'
})

const confirmPasswordFieldClass = computed(() => {
    if (!form.value.confirmPassword) return 'border-gray-300'
    return passwordsMatch.value ? 'border-green-400 bg-green-50' : 'border-red-400 bg-red-50'
})

const isFormValid = computed(() => {
    return (
        form.value.name.trim().length > 0 &&
        form.value.password.length >= 8 &&
        passwordsMatch.value
    )
})

const handleLogout = () => {
    document.body.style.overflow = ''
    authStore.logout()
    navigateTo('/login')
}

const handleSubmit = async () => {
    errorMessage.value = ''

    if (!isFormValid.value) return

    loading.value = true

    const result = await authStore.updateProfile({
        name: form.value.name.trim(),
        password: form.value.password
    })

    loading.value = false

    if (!result.success) {
        errorMessage.value = result.message || 'Gagal menyimpan. Silakan coba lagi.'
    }
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}
</style>