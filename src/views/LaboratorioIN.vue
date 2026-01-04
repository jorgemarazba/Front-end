<template>
  <AuthenticatedLayout>
    <div class="container mx-auto py-10">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold">Proyectos</h2>
        <button @click="showModal = true" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Crear Proyecto</button>
      </div>
      <div v-if="loading" class="text-center py-8">Cargando proyectos...</div>
      <div v-else>
        <div v-if="projects.length === 0" class="text-center py-8 text-gray-500">No hay proyectos registrados.</div>
        <ul class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <li v-for="project in projects" :key="project.id" class="bg-white rounded shadow p-4">
            <h3 class="font-semibold text-lg mb-2">{{ project.name }}</h3>
            <p class="mb-1"><span class="font-medium">Descripción:</span> {{ project.description }}</p>
            <p class="mb-1"><span class="font-medium">Tipo:</span> {{ project.research_type }}</p>
            <p class="mb-1"><span class="font-medium">Institución:</span> {{ project.institution }}</p>
            <p class="mb-1"><span class="font-medium">Grupo:</span> {{ project.research_group }}</p>
            <p class="mb-1"><span class="font-medium">Categoría:</span> {{ project.category }}</p>
            <p class="mb-1"><span class="font-medium">Estado:</span> {{ project.status }}</p>
          </li>
        </ul>
      </div>
      <CreateProjectForm v-if="showModal" @close="showModal = false" @created="handleCreated" />
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
import CreateProjectForm from '@/components/CreateProjectForm.vue';

const projects = ref<any[]>([]);
const loading = ref(true);
const showModal = ref(false);

async function fetchProjects() {
  loading.value = true;
  try {
    const token = localStorage.getItem('access_token');
    const res = await axios.get('/api/v1/proyectos/', {
      headers: { Authorization: `Bearer ${token}` },
    });
    projects.value = res.data;
  } catch (error) {
    projects.value = [];
  } finally {
    loading.value = false;
  }
}

function handleCreated() {
  showModal.value = false;
  fetchProjects();
}

onMounted(() => {
  fetchProjects();
});
</script>
