<template>
  <div class="flex flex-col items-center">
    <div class="relative group">
      <!-- Avatar Display -->
      <div 
        class="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
        @click="triggerFileInput"
      >
        <img 
          v-if="avatarUrl" 
          :src="avatarUrl" 
          :alt="fullName || 'User avatar'"
          class="w-full h-full object-cover"
        />
        <Icon 
          v-else 
          name="heroicons:user-circle-20-solid" 
          class="w-20 h-20 text-teal-600"
        />
      </div>

      <!-- Upload Button Overlay -->
      <button
        @click="triggerFileInput"
        class="absolute bottom-0 right-0 bg-teal-600 hover:bg-teal-700 text-white rounded-full p-2 shadow-lg transition-colors cursor-pointer"
        :disabled="uploading"
      >
        <Icon 
          v-if="!uploading"
          name="heroicons:camera-20-solid" 
          class="w-5 h-5"
        />
        <Icon 
          v-else
          name="heroicons:arrow-path-20-solid" 
          class="w-5 h-5 animate-spin"
        />
      </button>
    </div>

    <!-- Hidden File Input -->
    <input
      ref="fileInput"
      type="file"
      accept="image/jpeg,image/png,image/webp,image/gif"
      class="hidden"
      @change="handleFileSelect"
    />

    <!-- Error Message -->
    <p v-if="error" class="mt-2 text-sm text-red-600">{{ error }}</p>
    
    <!-- Success Message -->
    <p v-if="success" class="mt-2 text-sm text-green-600">{{ t.profile.avatar.uploadSuccess }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  avatarUrl?: string | null
  fullName?: string | null
}>()

const emit = defineEmits<{
  (e: 'update', url: string): void
}>()

const { t } = useTranslations()
const fileInput = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const error = ref('')
const success = ref(false)

function triggerFileInput() {
  if (!uploading.value) {
    fileInput.value?.click()
  }
}

async function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return

  error.value = ''
  success.value = false

  // Validate file size (5MB)
  if (file.size > 5 * 1024 * 1024) {
    error.value = t.value.profile.avatar.fileTooLarge
    return
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowedTypes.includes(file.type)) {
    error.value = t.value.profile.avatar.invalidFileType
    return
  }

  try {
    uploading.value = true

    const formData = new FormData()
    formData.append('avatar', file)

    const response = await $fetch<{ success: boolean; avatar_url: string }>('/api/upload-avatar', {
      method: 'POST',
      body: formData
    })

    if (response.success && response.avatar_url) {
      emit('update', response.avatar_url)
      success.value = true
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        success.value = false
      }, 3000)
    }
  } catch (err: any) {
    console.error('Upload error:', err)
    error.value = err.data?.statusMessage || t.value.profile.avatar.uploadError
  } finally {
    uploading.value = false
    // Reset input
    if (fileInput.value) {
      fileInput.value.value = ''
    }
  }
}
</script>
