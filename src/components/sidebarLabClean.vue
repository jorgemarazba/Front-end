<template>
  <aside class="sidebar-lab">
    <div class="flex items-center gap-2 mb-6">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-2v2a4 4 0 004 4h.01a4 4 0 004-4v-2m-8-6a4 4 0 100-8 4 4 0 000 8zm0 0v6" />
      </svg>
      <span class="font-bold text-xl">Tus Proyectos</span>
    </div>
    
    <nav class="flex flex-col gap-2">
      <div>
        <button class="w-full text-left px-4 py-2 rounded hover:bg-blue-600 font-semibold" @click="mostrarRecientes = !mostrarRecientes">
          Recientes
        </button>
        <ul v-if="mostrarRecientes" :key="projects.length" class="mt-2">
          <li v-for="project in projects.slice(sidebarStart, sidebarEnd)" :key="project.id" 
              class="text-white text-sm py-1 px-2 hover:bg-blue-700 rounded cursor-pointer flex justify-between items-center">
            <span>{{ project.name }}</span>
            <button class="text-blue-300 text-xs ml-2" @click.stop="$emit('goToDetail', project.id)">Ver</button>
          </li>
        </ul>
        <div v-if="projects.length > 10" class="flex justify-between items-center mt-2">
          <button @click="sidebarPage = Math.max(sidebarPage - 1, 1)" 
                  :disabled="sidebarPage === 1" 
                  class="px-2 py-1 text-xs bg-gray-700 text-white rounded disabled:opacity-50">◀</button>
          <span class="text-xs text-white">Página {{ sidebarPage }} de {{ Math.ceil(projects.length / 10) }}</span>
          <button @click="sidebarPage = Math.min(sidebarPage + 1, Math.ceil(projects.length / 10))" 
                  :disabled="sidebarEnd >= projects.length" 
                  class="px-2 py-1 text-xs bg-gray-700 text-white rounded disabled:opacity-50">▶</button>
        </div>
      </div>
      
      <div>
        <button class="w-full text-left px-4 py-2 rounded hover:bg-blue-600 font-semibold" @click="mostrarFavoritos = !mostrarFavoritos">
          Favoritos
        </button>
      </div>
      
      <hr class="border-t border-gray-600 my-2" />
      
      <div>
        <button class="w-full text-left px-4 py-2 rounded hover:bg-blue-600 font-semibold" @click="mostrarBibliografias = !mostrarBibliografias">
          Tus bibliografías
        </button>
      </div>
      
      <div>
        <button class="w-full text-left px-4 py-2 rounded hover:bg-blue-600 font-semibold" @click="mostrarCitaciones = !mostrarCitaciones">
          Citaciones
        </button>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

defineProps<{
  projects: any[]
}>();

const emit = defineEmits(['goToDetail']);

const sidebarPage = ref(1);
const mostrarRecientes = ref(true);
const mostrarFavoritos = ref(false);
const mostrarBibliografias = ref(false);
const mostrarCitaciones = ref(false);

const sidebarStart = computed(() => (sidebarPage.value - 1) * 10);
const sidebarEnd = computed(() => sidebarStart.value + 10);

defineExpose({
  resetPage: () => {
    sidebarPage.value = 1;
  }
});
</script>

<style scoped>
.sidebar-lab {
  position: sticky;
  top: 0px; 
  left: 0;
  width: 256px;
  height: calc(100vh - 65px);
  background-color: #111;
  color: white;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  border-top-right-radius: 1rem;
  border-bottom-right-radius: 1rem;
  overflow-y: auto;
  z-index: 9999;
  align-self: flex-start;
}
</style>
