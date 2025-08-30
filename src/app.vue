<script setup lang="ts">
import Navbar from './components/navbar.vue';
import Footer from './components/footer.vue';
import navbarLaboratorio from './components/navbarLaboratorio.vue';
import CreateProjectForm from './components/CreateProjectForm.vue';
import { ref } from 'vue';

const showModal = ref(false);
function abrirModalCrearProyecto() {
  showModal.value = true;
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <template v-if="$route.path === '/laboratorio'">
  <navbarLaboratorio @crearProyecto="abrirModalCrearProyecto" />
      <main class="flex-1">
        <router-view />
      </main>
      <CreateProjectForm v-if="showModal" @close="showModal = false" />
    </template>
    <template v-else-if="$route.path !== '/register'">
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