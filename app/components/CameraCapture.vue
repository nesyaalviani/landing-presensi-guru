<template>
    <div>
        <!-- Trigger Button -->
        <div v-if="!isOpen">
            <div v-if="!capturedImage">
                <input id="foto" type="file" accept="image/*" @change="handleFileUpload" class="hidden" />
                <div class="grid grid-cols-2 gap-2">
                    <button type="button" @click="openCamera"
                        class="flex flex-col items-center justify-center h-32 sm:h-40 border border-dashed border-gray-300 rounded-sm cursor-pointer hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 transition-all">
                        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p class="mt-2 text-xs sm:text-sm font-medium text-gray-700">Buka Kamera</p>
                        <p class="mt-1 text-[10px] sm:text-xs text-gray-500">Ambil foto langsung</p>
                    </button>
                    <label for="foto"
                        class="flex flex-col items-center justify-center h-32 sm:h-40 border border-dashed border-gray-300 rounded-sm cursor-pointer hover:border-blue-500 hover:bg-blue-50 active:bg-blue-100 transition-all">
                        <svg class="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor"
                            viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p class="mt-2 text-xs sm:text-sm font-medium text-gray-700">Upload File</p>
                        <p class="mt-1 text-[10px] sm:text-xs text-gray-500">Dari galeri</p>
                    </label>
                </div>
            </div>

            <!-- Preview captured image -->
            <div v-else class="relative">
                <div class="relative border border-gray-300 rounded-sm overflow-hidden">
                    <img :src="capturedImage" alt="Preview" class="w-full h-48 sm:h-56 object-cover cursor-zoom-in"
                        @click="openPreview" />
                    <div class="absolute top-2 right-2 flex gap-2">
                        <button type="button" @click="retake"
                            class="bg-blue-500 text-white p-1.5 sm:p-2 rounded-sm hover:bg-blue-600 transition shadow-lg">
                            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            </svg>
                        </button>
                        <button type="button" @click="removeCapture"
                            class="bg-red-500 text-white p-1.5 sm:p-2 rounded-sm hover:bg-red-600 transition shadow-lg">
                            <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>
                </div>
                <p class="mt-1.5 text-[10px] sm:text-xs text-gray-600">
                    <span class="font-medium">{{ capturedFileName }}</span> • {{ capturedFileSize }}
                </p>
            </div>
        </div>

        <!-- Camera Overlay -->
        <Teleport to="body">
            <Transition name="camera-overlay">
                <div v-if="isOpen" class="fixed inset-0 z-50 flex flex-col bg-black" @click.self="closeCamera">

                    <!-- Flash Effect -->
                    <div v-if="flashActive" class="absolute inset-0 bg-white z-30 pointer-events-none flash-anim"></div>

                    <!-- Top Bar -->
                    <div class="relative z-10 flex items-center justify-between px-4 pt-safe pt-4 pb-3">
                        <button @click="closeCamera"
                            class="w-10 h-10 flex items-center justify-center rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 transition">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div class="text-white text-xs font-medium tracking-widest uppercase opacity-70">Kamera</div>

                        <!-- Grid toggle -->
                        <button @click="toggleGrid"
                            :class="['w-10 h-10 flex items-center justify-center rounded-full backdrop-blur transition', showGrid ? 'bg-yellow-400/80 text-black' : 'bg-black/40 text-white hover:bg-black/60']">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
                            </svg>
                        </button>
                    </div>

                    <!-- Camera Viewfinder -->
                    <div class="flex-1 relative overflow-hidden">
                        <video ref="videoRef" autoplay playsinline muted
                            class="absolute inset-0 w-full h-full object-cover" />

                        <!-- Grid Overlay -->
                        <Transition name="fade">
                            <div v-if="showGrid" class="absolute inset-0 pointer-events-none">
                                <div class="absolute inset-0 grid grid-cols-3">
                                    <div class="border-r border-white/25"></div>
                                    <div class="border-r border-white/25"></div>
                                    <div></div>
                                </div>
                                <div class="absolute inset-0 flex flex-col">
                                    <div class="flex-1 border-b border-white/25"></div>
                                    <div class="flex-1 border-b border-white/25"></div>
                                    <div class="flex-1"></div>
                                </div>
                            </div>
                        </Transition>

                        <!-- Corner brackets -->
                        <div class="absolute inset-0 pointer-events-none p-8">
                            <div class="relative w-full h-full">
                                <div
                                    class="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white/60 rounded-tl-sm">
                                </div>
                                <div
                                    class="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white/60 rounded-tr-sm">
                                </div>
                                <div
                                    class="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white/60 rounded-bl-sm">
                                </div>
                                <div
                                    class="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/60 rounded-br-sm">
                                </div>
                            </div>
                        </div>

                        <!-- No Camera Error -->
                        <div v-if="cameraError"
                            class="absolute inset-0 flex flex-col items-center justify-center text-white gap-3">
                            <svg class="w-16 h-16 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                            </svg>
                            <p class="text-sm font-medium opacity-70">{{ cameraError }}</p>
                            <button @click="startCamera"
                                class="mt-2 px-4 py-2 bg-white/20 rounded-full text-sm hover:bg-white/30 transition">
                                Coba Lagi
                            </button>
                        </div>

                        <!-- Loading camera -->
                        <div v-if="cameraLoading && !cameraError"
                            class="absolute inset-0 flex items-center justify-center text-white">
                            <div class="flex flex-col items-center gap-3">
                                <div
                                    class="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin">
                                </div>
                                <p class="text-xs opacity-60">Memuat kamera...</p>
                            </div>
                        </div>
                    </div>

                    <!-- Bottom Controls -->
                    <div class="relative z-10 pb-safe pb-8 pt-6 px-8">
                        <div class="flex items-center justify-between">

                            <!-- Placeholder kiri -->
                            <div
                                class="w-14 h-14 rounded-xl border-2 border-white/20 bg-black/40 flex items-center justify-center">
                                <svg class="w-5 h-5 text-white/30" fill="none" stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>

                            <!-- Shutter Button -->
                            <button @click="capturePhoto" :disabled="cameraLoading || !!cameraError"
                                class="relative w-20 h-20 flex items-center justify-center disabled:opacity-40 group">
                                <div
                                    class="absolute inset-0 rounded-full border-4 border-white/80 group-hover:border-white group-active:scale-95 transition-transform duration-100">
                                </div>
                                <div
                                    class="w-14 h-14 rounded-full bg-white group-hover:bg-white/90 group-active:scale-90 transition-all duration-100 shadow-lg">
                                </div>
                            </button>

                            <!-- Switch Camera -->
                            <button @click="switchCamera" :disabled="cameraLoading"
                                class="w-14 h-14 flex items-center justify-center rounded-full bg-black/40 backdrop-blur text-white hover:bg-black/60 active:scale-95 transition disabled:opacity-40">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>

                </div>
            </Transition>
        </Teleport>

        <!-- Photo Preview Modal -->
        <Teleport to="body">
            <Transition name="fade">
                <div v-if="showPreview" class="fixed inset-0 bg-black flex items-center justify-center z-50"
                    @click="closePreview">
                    <button @click="closePreview"
                        class="absolute top-4 right-4 text-white hover:text-gray-300 transition z-10 bg-black bg-opacity-50 rounded-full p-1.5">
                        <svg class="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img :src="capturedImage" alt="Preview" class="max-w-full max-h-screen object-contain"
                        @click.stop />
                </div>
            </Transition>
        </Teleport>

        <canvas ref="canvasRef" class="hidden" />
    </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const emit = defineEmits(['captured', 'removed', 'error'])

const isOpen = ref(false)
const showPreview = ref(false)
const videoRef = ref(null)
const canvasRef = ref(null)
const capturedImage = ref(null)
const capturedFileName = ref('')
const capturedFileSize = ref('')
const cameraError = ref('')
const cameraLoading = ref(false)
const flashActive = ref(false)
const showGrid = ref(false)
const facingMode = ref('environment')
let stream = null

const openCamera = async () => {
    isOpen.value = true
    cameraError.value = ''
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    await startCamera()
}

const startCamera = async () => {
    cameraLoading.value = true
    cameraError.value = ''
    stopStream()

    try {
        stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: facingMode.value,
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            },
            audio: false
        })
        if (videoRef.value) {
            videoRef.value.srcObject = stream
            await videoRef.value.play()
        }
    } catch (err) {
        if (err.name === 'NotAllowedError') {
            cameraError.value = 'Akses kamera ditolak. Izinkan akses kamera di browser.'
        } else if (err.name === 'NotFoundError') {
            cameraError.value = 'Kamera tidak ditemukan.'
        } else {
            cameraError.value = 'Tidak dapat mengakses kamera.'
        }
    } finally {
        cameraLoading.value = false
    }
}

const switchCamera = async () => {
    facingMode.value = facingMode.value === 'environment' ? 'user' : 'environment'
    await startCamera()
}

const toggleGrid = () => {
    showGrid.value = !showGrid.value
}

const openPreview = () => {
    showPreview.value = true
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
}

const closePreview = () => {
    showPreview.value = false
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
}

const capturePhoto = () => {
    if (!videoRef.value || !canvasRef.value) return

    flashActive.value = true
    setTimeout(() => { flashActive.value = false }, 150)

    const video = videoRef.value
    const canvas = canvasRef.value
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)

    canvas.toBlob((blob) => {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const fileName = `foto-presensi-${timestamp}.jpg`
        const file = new File([blob], fileName, { type: 'image/jpeg' })

        capturedImage.value = canvas.toDataURL('image/jpeg', 0.85)
        capturedFileName.value = fileName
        capturedFileSize.value = formatFileSize(file.size)

        emit('captured', file, capturedImage.value)
        closeCamera()
    }, 'image/jpeg', 0.85)
}

const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
        emit('error', 'Ukuran file terlalu besar! Maksimal 5MB')
        event.target.value = ''
        return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
        capturedImage.value = e.target.result
        capturedFileName.value = file.name
        capturedFileSize.value = formatFileSize(file.size)
        emit('captured', file, capturedImage.value)
    }
    reader.readAsDataURL(file)
}

const retake = () => {
    capturedImage.value = null
    capturedFileName.value = ''
    capturedFileSize.value = ''
    emit('removed')
    openCamera()
}

const removeCapture = () => {
    capturedImage.value = null
    capturedFileName.value = ''
    capturedFileSize.value = ''
    emit('removed')
}

const closeCamera = () => {
    stopStream()
    isOpen.value = false
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
}

const stopStream = () => {
    if (stream) {
        stream.getTracks().forEach(t => t.stop())
        stream = null
    }
}

onUnmounted(() => {
    stopStream()
    document.body.style.overflow = ''
    document.documentElement.style.overflow = ''
})
</script>

<style scoped>
.camera-overlay-enter-active,
.camera-overlay-leave-active {
    transition: opacity 0.25s ease, transform 0.25s ease;
}

.camera-overlay-enter-from,
.camera-overlay-leave-to {
    opacity: 0;
    transform: scale(0.98);
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.flash-anim {
    animation: flash 0.15s ease-out forwards;
}

@keyframes flash {
    0% {
        opacity: 0.9;
    }

    100% {
        opacity: 0;
    }
}

video {
    transform: scaleX(var(--mirror, 1));
}
</style>