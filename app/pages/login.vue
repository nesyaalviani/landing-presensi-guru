<template>
    <div class="flex min-h-screen w-full items-center justify-center bg-[rgb(248,248,248)] px-4 py-8">
        <div class="w-full max-w-md">
            <div class="rounded-sm border border-gray-200 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">

                <div class="flex items-center justify-center mb-6">
                    <img class="h-16 w-auto sm:h-20 max-w-full align-middle"
                        src="https://media.cake.me/image/upload/s--T4D1SVbM--/c_pad,fl_png8,h_400,w_400/v1696135770/z1d2uzgbr1faa8rzwaye.png"
                        alt="Logo Presensi Guru" />
                </div>

                <div class="mb-6 space-y-2 text-center">
                    <h1 class="text-2xl sm:text-3xl font-semibold text-gray-800">Presensi Guru</h1>
                    <p class="text-gray-500 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
                </div>

                <div class="mb-5">
                    <AppAlert :type="alertType" :message="alertMessage" :redirect-delay="alertRedirectDelay"
                        :on-close="clearAlert" :on-redirect="alertRedirectFn" />
                </div>

                <form @submit.prevent="handleLogin" class="space-y-5">
                    <div class="relative w-full">
                        <input type="text" id="username" v-model="formData.username"
                            class="peer block w-full appearance-none rounded-sm border border-gray-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 transition-all"
                            placeholder=" " required />
                        <label for="username"
                            class="origin-[0] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 absolute left-1 top-2 z-10 -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300">
                            Masukkan Username Anda
                        </label>
                    </div>

                    <div class="relative w-full">
                        <input :type="showPassword ? 'text' : 'password'" id="password" v-model="formData.password"
                            class="peer block w-full appearance-none rounded-sm border border-gray-300 bg-transparent px-2.5 pt-4 pb-2.5 pr-10 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 transition-all"
                            placeholder=" " required />
                        <label for="password"
                            class="origin-[0] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 absolute left-1 top-2 z-10 -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300">
                            Masukkan Password Anda
                        </label>
                        <button type="button" @click="showPassword = !showPassword"
                            class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-colors">
                            <Eye v-if="!showPassword" class="h-5 w-5" />
                            <EyeOff v-else class="h-5 w-5" />
                        </button>
                    </div>

                    <div class="pt-2">
                        <button type="submit" :disabled="isLoading"
                            class="w-full rounded-sm bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                            {{ isLoading ? 'Memproses...' : 'Masuk' }}
                        </button>
                    </div>
                </form>

                <div class="text-center pt-6">
                    <p class="text-xs text-gray-500">SMKN 1 Cisarua &copy; {{ new Date().getFullYear() }}</p>
                </div>

            </div>
        </div>
    </div>
</template>

<script setup>
import { Eye, EyeOff } from 'lucide-vue-next'

definePageMeta({ layout: false })

const authStore = useAuthStore()
const router = useRouter()

const formData = ref({ username: '', password: '' })
const showPassword = ref(false)
const isLoading = ref(false)

const {
    alertType,
    alertMessage,
    alertRedirectDelay,
    alertRedirectFn,
    showAlert,
    clearAlert,
    watchInputClearError
} = useAlert()

watchInputClearError(formData)

useHead({ title: 'Login | SMKN 1 Cisarua' })

const handleLogin = async () => {
    clearAlert()
    isLoading.value = true

    const result = await authStore.login(formData.value)
    isLoading.value = false

    if (result.success) {
        showAlert('success', 'Login berhasil!', {
            redirectDelay: 1000,
            redirectFn: () => router.push('/')
        })
    } else {
        showAlert('error', result.message)
    }
}
</script>