<template>
  <div class="bg-[#666361] min-h-screen w-full flex pt-16"> <!-- Agregado pt-16 para el navbar -->
    <!-- Sidebar Component con sticky -->
    <div class="w-64 flex-shrink-0">
      <SidebarLab :projects="projects" @goToDetail="goToDetail" ref="sidebarRef" />
    </div>
    
    <!-- Contenido principal -->
    <div class="flex-1 p-8 pt-4 min-h-screen bg-[#666361]"> <!-- Cambiado pt-20 a pt-4 -->
      <div v-if="loading" class="my-8" style="background-color: #666361; color: #fff;">Cargando proyectos...</div>
      <div v-if="mostrarRecientes">
        <div class="flex items-center gap-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span class="font-bold text-xl text-white">Proyectos recientes</span>
        </div>
  <div class="w-full flex justify-center">
          <Carousel
            :key="filteredProjects.length"
            :items-to-show="4"
            :wrap-around="filteredProjects.length > 4"
            :autoplay="filteredProjects.length > 1 ? 2500 : 0"
            :pause-autoplay-on-hover="true"
            class="mb-6 w-full max-w-[calc(100vw-20rem)] px-4"
          >
            <Slide v-for="project in filteredProjects" :key="project.id" :snap-align="'start'">
              <div class="bg-[#444] text-white rounded shadow p-3 flex flex-col gap-2 w-full h-[120px] justify-center items-center mx-2 transition-all duration-300" style="background-image: url('/fondo card.jpg'); background-size: cover; background-position: center;">
                <strong class="text-lg">{{ project.name }}</strong>
                <span v-if="project.status" class="text-sm text-blue-300">({{ project.status }})</span>
                <div v-if="project.description" class="text-sm text-gray-200 text-center line-clamp-2">{{ project.description }}</div>
                <button
                  class="mt-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                  @click="goToDetail(project.id)"
                >
                  Detalles
                </button>
              </div>
            </Slide>
          </Carousel>
        </div>
        <div v-if="filteredProjects.length === 0 && projects.length > 0" class="mt-8 p-4 rounded bg-[#444] text-white">No se encontraron proyectos que coincidan con tu busqueda.</div>
        <div v-else-if="projects.length === 0" class="mt-8 p-4 rounded bg-[#444] text-white">No tienes proyectos recientes.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

import { ref, onMounted, onUnmounted, computed } from 'vue';
import axios from 'axios';
import { Carousel, Slide } from 'vue3-carousel';
import 'vue3-carousel/dist/carousel.css';
import { useRouter } from 'vue-router';
import SidebarLab from '@/components/sidebarLabClean.vue';

// Props
const props = defineProps<{
  searchTerm?: string;
}>();

const projects = ref<any[]>([]);
const loading = ref(false);
const mostrarRecientes = ref(true);
const router = useRouter();
const sidebarRef = ref();

// Computed property para filtrar proyectos
const filteredProjects = computed(() => {
  if (!props.searchTerm || props.searchTerm.trim() === '') {
    return projects.value;
  }
  
  const term = props.searchTerm.toLowerCase().trim();
  return projects.value.filter(project => 
    project.name.toLowerCase().includes(term) ||
    (project.description && project.description.toLowerCase().includes(term))
  );
});

async function fetchProjects() {
  loading.value = true;
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get('http://127.0.0.1:8000/api/v1/proyectos/', {
      headers: { Authorization: `Bearer ${token}` },
    });
  // Ordenar por id descendente (más reciente primero)
  projects.value = [...(response.data as Array<{id: number}>).sort((a, b) => b.id - a.id)];
  } catch (error) {
    console.error('Error en fetchProjects:', error);
    projects.value = [];
  }
  loading.value = false;
}


function goToDetail(id: number) {
  router.push(`/proyecto/${id}`);
}

function handleRefresh() {
  fetchProjects();
  // Resetear la página del sidebar usando la referencia
  if (sidebarRef.value) {
    sidebarRef.value.resetPage();
  }
}

onMounted(() => {
  fetchProjects();
  
  // Escuchar eventos globales de proyecto creado
  window.addEventListener('projectCreated', handleRefresh);
});

onUnmounted(() => {
  // Limpiar el event listener
  window.removeEventListener('projectCreated', handleRefresh);
});
</script>
