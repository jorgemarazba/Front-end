
<template>
  <nav v-if="!isLoginRoute" class="shadow" style="background-color: #7c7c7c;">
    <div class="w-full flex items-center justify-between h-16 px-2">
      <!-- Logo e icono -->
      <div class="flex items-center gap-2">
  <img class="h-12 w-12 bg-blue-200 rounded-xl p-2 ml-4" src="/favicon.png" alt="Logo" sizes="200x200" />
  <span class="font-bold text-xl text-white">IA+Inv</span>
      </div>
      <!-- Links de navegación centrados -->
      <div class="flex flex-1 justify-center space-x-4">
  <a href="#" class="text-white hover:bg-gray-600 px-3 py-2 rounded-md text-lg font-semibold">Sobre Nosotros</a>
  <a href="#" class="text-white hover:bg-gray-600 px-3 py-2 rounded-md text-lg font-semibold">Proyectos</a>
  <a href="#" class="text-white hover:bg-gray-600 px-3 py-2 rounded-md text-lg font-semibold">Contacto</a>
  <a href="#" class="text-white hover:bg-gray-600 px-3 py-2 rounded-md text-lg font-semibold">Precing</a>
      </div>
      <!-- Icono y botones de sesión -->
      <div class="flex items-center space-x-3.5">
        <!-- Icono de usuario (Heroicons) -->
        <img src="/login.png" alt="Login" class="w-8 h-8" />
  <router-link to="/login" class="text-white text-sm font-medium mr-4 hover:underline cursor-pointer">Inicia sesión</router-link>
  <router-link to="/register" class="bg-white text-gray-900 px-4 py-2 rounded-md hover:bg-gray-200 text-sm font-medium ml-6">Registrarse</router-link>
      </div>
    </div>
  </nav>
  <div v-if="!isLoginRoute" class="w-full h-0.5 bg-blue-600"></div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed } from 'vue';
const route = useRoute();
const isLoginRoute = computed(() => route.path === '/login');
</script>


