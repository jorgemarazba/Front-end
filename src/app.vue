<script setup lang="ts">
import Navbar from './components/navbar.vue';
import Footer from './components/footer.vue';
import navbarLaboratorio from './components/navbarLaboratorio.vue';
import CreateProjectForm from './components/CreateProjectForm.vue';
import { ref, nextTick } from 'vue';

const showModal = ref(false);
const searchTerm = ref('');

function abrirModalCrearProyecto() {
  showModal.value = true;
}

function handleSearch(term: string) {
  searchTerm.value = term;
}

// Función para manejar eventos de proyecto creado
function handleProjectCreated() {
  // Buscar el componente Laboratorio y llamar su método de actualización
  nextTick(() => {
    // Disparar un evento global que Laboratorio pueda escuchar
    window.dispatchEvent(new CustomEvent('projectCreated'));
  });
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
  <template v-if="$route.path === '/laboratorio'">
  <navbarLaboratorio @crearProyecto="abrirModalCrearProyecto" @search="handleSearch" />
      <main class="flex-1">
        <router-view :searchTerm="searchTerm" />
      </main>
      <CreateProjectForm v-if="showModal" @close="showModal = false" @created="handleProjectCreated" @refresh="handleProjectCreated" />
    </template>
    <template v-else-if="$route.path !== '/register' && !$route.path.startsWith('/proyecto/')">
      <Navbar />
      <main class="flex-1">
        <router-view />
      </main>
      <Footer />
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<style>
</style>