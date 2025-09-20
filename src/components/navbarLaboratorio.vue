<template>
  <nav class="navbar-laboratorio bg-black shadow">
    <div class="w-full flex items-center justify-between h-16 px-6">
      <!-- Logo e icono -->
      <div class="flex items-center gap-2">
        <div class="bg-blue-300 rounded-none h-12 w-12 flex items-center justify-center">
          <img class="h-10 w-10" src="/favicon.png" alt="Logo" sizes="200x200" />
        </div>
        <span class="font-bold text-xl text-white">IA+Inv</span>
      </div>
      <!-- Botón, barra de búsqueda y texto centrados -->
      <div class="flex items-center justify-center flex-1 gap-4">
        <button @click="$emit('crearProyecto')" class="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm font-medium">Crear nuevo proyecto</button>
        <span class="font-bold text-2xl text-blue-200 ml-8">Laboratorio de Proyectos</span>
      </div>
      <!-- Barra de búsqueda junto al menú de usuario -->
      <div class="flex items-center gap-4 pr-6">
        <input 
          type="text" 
          v-model="searchTerm"
          @input="handleSearch"
          placeholder="Buscar proyectos..." 
          class="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black w-64" 
        />
        <div class="relative">
          <button class="flex items-center gap-2 focus:outline-none p-2" @click="toggleMenu">
            <div :style="{ backgroundColor: userColor }" class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {{ userInitial }}
            </div>
          </button>
          <div v-if="menuOpen" class="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg py-4 z-10">
            <div class="flex flex-col items-center mb-4">
              <div :style="{ backgroundColor: userColor }" class="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2">
                {{ userInitial }}
              </div>
              <span class="font-semibold text-lg" :style="{ color: userColor }">{{ userName }}</span>
              <span class="text-gray-500 text-sm">{{ userEmail }}</span>
            </div>
            <router-link to="/" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Inicio</router-link>
            <router-link to="/perfil" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Perfil</router-link>
            <router-link to="/configuracion" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Configuración</router-link>
            <button @click="logout" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </div>
  </nav>
  <div class="red-line bg-red-600"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const menuOpen = ref(false);
const searchTerm = ref('');

const emit = defineEmits(['crearProyecto', 'search']);

// Datos de usuario simulados (puedes reemplazar por los reales)
const userName = ref('Persona Ejemplo');
const userEmail = ref('persona@correo.com');

// Mapa de colores por inicial
const colorMap = {
  A: '#e57373', B: '#64b5f6', C: '#81c784', D: '#ffd54f', E: '#ba68c8', F: '#4db6ac', G: '#f06292', H: '#9575cd', I: '#ff8a65', J: '#a1887f',
  K: '#f44336', L: '#2196f3', M: '#4caf50', N: '#ffeb3b', O: '#9c27b0', P: '#009688', Q: '#e91e63', R: '#3f51b5', S: '#ff9800', T: '#795548',
  U: '#607d8b', V: '#8bc34a', W: '#00bcd4', X: '#cddc39', Y: '#ffc107', Z: '#673ab7'
};
const userInitial = userName.value.charAt(0).toUpperCase();
const userColor = colorMap[userInitial as keyof typeof colorMap] || '#666';

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function handleClickOutside(event: MouseEvent) {
  const menu = document.querySelector('.relative');
  if (menu && !menu.contains(event.target as Node)) {
    menuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

function handleSearch() {
  emit('search', searchTerm.value);
}

function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  menuOpen.value = false;
  router.push('/');
}
</script>

<style scoped>
/* Navbar fijo que no se mueve con scroll horizontal */
.navbar-laboratorio {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  z-index: 10000;
  min-width: 100%;
}

/* Línea roja fija */
.red-line {
  position: fixed;
  top: 64px; /* Justo debajo del navbar */
  left: 0;
  right: 0;
  width: 100vw;
  height: 1px;
  z-index: 10000;
  min-width: 100%;
}
</style>
