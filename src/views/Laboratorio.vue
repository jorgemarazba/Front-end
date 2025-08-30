<template>
  <div class="bg-[#666361] min-h-screen w-full flex">
    <!-- Sidebar -->
    <aside class="w-64 bg-[#222] text-white h-full p-6 flex flex-col gap-6">
      <div class="flex items-center gap-2 mb-6">
        <!-- Icono de proyectos -->
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2m16-2v2a4 4 0 004 4h.01a4 4 0 004-4v-2m-8-6a4 4 0 100-8 4 4 0 000 8zm0 0v6" /></svg>
        <span class="font-bold text-xl">Tus proyectos</span>
      </div>
      <nav class="flex flex-col gap-2">
        <div>
          <button class="w-full text-left px-4 py-2 rounded hover:bg-blue-600 font-semibold" @click="mostrarRecientes = !mostrarRecientes">
            Recientes
          </button>
        </div>
        <div>
          <button class="w-full text-left px-4 py-2 rounded hover:bg-blue-600 font-semibold" @click="mostrarFavoritos = !mostrarFavoritos">
            Favoritos
          </button>
        </div>
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
    <!-- Contenido principal -->
    <div class="flex-1 p-8">
      <CreateProjectForm v-if="showModal" @close="showModal = false" @created="fetchProjects" />
      <div v-if="loading" class="my-8" style="background-color: #666361; color: #fff;">Cargando proyectos...</div>
      <div v-if="mostrarRecientes">
        <div class="flex items-center gap-2 mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
          <span class="font-bold text-xl text-white">Proyectos recientes</span>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="project in projects" :key="project.id" class="bg-[#444] text-white rounded shadow p-6 flex flex-col gap-2">
            <strong class="text-lg">{{ project.name }}</strong>
            <span v-if="project.status" class="text-sm text-blue-300">({{ project.status }})</span>
            <div v-if="project.description" class="text-sm text-gray-200">{{ project.description }}</div>
          </div>
        </div>
        <div v-if="projects.length === 0" class="mt-8 p-4 rounded bg-[#444] text-white">No tienes proyectos recientes.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import CreateProjectForm from '@/components/CreateProjectForm.vue';

const projects = ref<any[]>([]);
const loading = ref(false);
const showModal = ref(false);
const mostrarRecientes = ref(false);
const mostrarFavoritos = ref(false);
const mostrarBibliografias = ref(false);
const mostrarCitaciones = ref(false);

async function fetchProjects() {
  loading.value = true;
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get('http://127.0.0.1:8000/api/v1/proyectos/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    projects.value = response.data;
  } catch (error) {
    projects.value = [];
  }
  loading.value = false;
}

onMounted(fetchProjects);
</script>
