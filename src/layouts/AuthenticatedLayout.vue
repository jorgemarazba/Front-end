<template>
  <div>
    <header class="flex justify-between items-center px-6 py-4 bg-blue-600 text-white">
      <h1 class="text-xl font-bold">Panel de Usuario</h1>
      <button @click="logout" class="bg-white text-blue-600 px-4 py-2 rounded hover:bg-gray-100">Cerrar Sesión</button>
    </header>
    <main class="p-6">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function logout() {
  localStorage.removeItem('jwt');
  router.push('/login');
}
</script>
