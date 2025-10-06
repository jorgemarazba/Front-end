<template>
  <div class="relative flex items-center max-w-md mx-auto">
    <div class="relative w-full">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Buscar proyectos..."
        class="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
        @keyup.enter="handleSearch"
        @input="$emit('input', searchQuery)"
      />
      <button
        @click="handleSearch"
        class="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600 transition-colors"
        :disabled="!searchQuery.trim()"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps<{
  placeholder?: string
  modelValue?: string
}>()

const emit = defineEmits<{
  search: [query: string]
  input: [value: string]
}>()

const router = useRouter()
const searchQuery = ref(props.modelValue || '')

// Manejar búsqueda
function handleSearch() {
  const query = searchQuery.value.trim()
  if (!query) return

  // Emitir evento de búsqueda
  emit('search', query)
  
  // Navegar a página de resultados
  router.push({
    name: 'SearchResults',
    query: { q: query }
  })
}

// Watch para actualizar valor interno cuando cambie el prop
import { watch } from 'vue'
watch(() => props.modelValue, (newValue) => {
  if (newValue !== undefined) {
    searchQuery.value = newValue
  }
})
</script>

<style scoped>
/* Estilos adicionales si es necesario */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

button:disabled:hover {
  color: inherit;
}
</style>