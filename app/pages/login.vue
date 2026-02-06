<template>
    <div class="flex min-h-screen w-full items-center justify-center bg-[rgb(248,248,248)] px-4 py-8">
        <div class="w-full max-w-md">
            <div class="rounded-lg border border-gray-200 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
                <div class="flex items-center justify-center mb-6">
                    <img class="h-16 w-auto sm:h-20 max-w-full align-middle"
                        src="https://media.cake.me/image/upload/s--T4D1SVbM--/c_pad,fl_png8,h_400,w_400/v1696135770/z1d2uzgbr1faa8rzwaye.png"
                        alt="Logo Presensi Guru" />
                </div>

                <div class="mb-6 space-y-2 text-center">
                    <h1 class="text-2xl sm:text-3xl font-semibold text-gray-800">Presensi Guru</h1>
                    <p class="text-gray-500 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
                </div>

                <Transition enter-active-class="transition ease-out duration-100"
                    enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                    leave-active-class="transition ease-in duration-75"
                    leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
                    <div v-if="errorMessage"
                        class="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-6 animate-shake"
                        role="alert">
                        <div class="flex items-center">
                            <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clip-rule="evenodd" />
                            </svg>
                            <span class="block sm:inline text-sm">{{ errorMessage }}</span>
                        </div>
                    </div>
                </Transition>

                <form @submit.prevent="handleLogin" class="space-y-5">
                    <div>
                        <div class="relative w-full">
                            <input type="text" id="username" v-model="formData.username"
                                class="peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 transition-all"
                                placeholder=" " required />
                            <label for="username"
                                class="origin-[0] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 absolute left-1 top-2 z-10 -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300">
                                Masukkan Username Anda
                            </label>
                        </div>
                    </div>

                    <div>
                        <div class="relative w-full">
                            <input type="password" id="password" v-model="formData.password"
                                class="peer block w-full appearance-none rounded-lg border border-gray-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 transition-all"
                                placeholder=" " required />
                            <label for="password"
                                class="origin-[0] peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 absolute left-1 top-2 z-10 -translate-y-4 scale-75 transform cursor-text select-none bg-white px-2 text-sm text-gray-500 duration-300">
                                Masukkan Password Anda
                            </label>
                        </div>
                    </div>

                    <div class="flex w-full items-center pt-2">
                        <button type="submit" :disabled="isLoading"
                            class="w-full rounded-lg bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">
                            {{ isLoading ? 'Memproses...' : 'Masuk' }}
                        </button>
                    </div>
                </form>

                <div class="text-center pt-6">
                    <p class="text-xs text-gray-500">
                        Sistem Absensi Guru &copy; 2024
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useRouter } from 'vue-router'

definePageMeta({
    layout: false
})

const authStore = useAuthStore()
const router = useRouter()

const formData = ref({
    username: '',
    password: ''
})

const errorMessage = ref('')
const isLoading = ref(false)

const handleLogin = async () => {
    errorMessage.value = ''
    isLoading.value = true

    const result = await authStore.login(formData.value)

    isLoading.value = false

    if (result.success) {
        router.push('/')
    } else {
        errorMessage.value = result.message
    }
}
</script>