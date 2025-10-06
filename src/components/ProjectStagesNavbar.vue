<template>
  <div class="fixed top-0 left-0 w-full z-50">
    <!-- Navbar negro -->
    <nav class="shadow w-full" style="background-color: #000;">
      <div class="w-full flex items-center justify-between h-16 px-2">
        <!-- Logo, texto y links alineados a la izquierda -->
        <div class="flex items-center gap-6">
          <img class="h-12 w-12 bg-blue-200 rounded-xl p-2 ml-4" src="/favicon.png" alt="Logo" sizes="200x200" />
          <span class="font-bold text-xl text-white">IA+Inv
</span>
          <div class="flex gap-2 ml-4">
            <a href="#" class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-lg font-semibold">Proyectos recientes</a>
            <a href="#" class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-lg font-semibold">Favoritos</a>
            <a href="#" class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-lg font-semibold">Bibliografías</a>
            <a href="#" class="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-lg font-semibold">Citas</a>
          </div>
        </div>
        <!-- Menú de usuario -->
        <div ref="userMenuContainer" class="flex items-center space-x-3.5 relative">
          <!-- Barra de búsqueda -->
          <div class="w-80 mr-4">
            <SearchBar 
              placeholder="Buscar proyectos..."
              @search="handleSearch"
            />
          </div>
          
          <button class="flex items-center gap-2 focus:outline-none" @click="toggleMenu">
            <div :style="{ backgroundColor: userColor }" class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {{ userInitial }}
            </div>
          </button>
          <div v-if="menuOpen" class="absolute right-0 mt-2 w-64 bg-white rounded shadow-lg py-4 z-[9999]">
            <div class="flex flex-col items-center mb-4">
              <div :style="{ backgroundColor: userColor }" class="w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-2">
                {{ userInitial }}
              </div>
              <span class="font-semibold text-lg" :style="{ color: userColor }">{{ userName }}</span>
              <span class="text-gray-500 text-sm">{{ userEmail }}</span>
            </div>
            <router-link to="/laboratorio" @click="menuOpen = false" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Inicio</router-link>
            <router-link to="/perfil" @click="menuOpen = false" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Perfil</router-link>
            <router-link to="/configuracion" @click="menuOpen = false" class="block px-4 py-2 text-gray-800 hover:bg-gray-100">Configuración</router-link>
            <button @click="logout" class="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100">Cerrar sesión</button>
          </div>
        </div>
      </div>
    </nav>
    
    <!-- Línea azul con título del proyecto, texto y botón centrado -->
    <div class="w-full h-10 flex items-center px-6" style="background-color: #2461BE;">
      <!-- Título del proyecto a la izquierda con fondo -->
      <div class="bg-white bg-opacity-50 px-3 py-1 rounded">
        <h2 class="text-black font-bold text-base uppercase">
          {{ projectTitle || 'PROYECTO SIN TÍTULO' }}
        </h2>
      </div>
      
      <!-- Contenedor centrado con botón -->
      <div class="flex-1 flex justify-center items-center">
        <!-- Botón "Laboratorio" centrado -->
        <button 
          @click="goToLaboratorio" 
          class="bg-black text-white px-4 py-1 rounded flex items-center gap-2 hover:bg-gray-800 transition-colors duration-200"
        >
          <!-- Icono de laboratorio -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
          Laboratorio
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import SearchBar from '@/components/SearchBar.vue';

// Props
const props = defineProps({
  projectTitle: {
    type: String,
    default: ''
  }
});

const router = useRouter();
const menuOpen = ref(false);
const userMenuContainer = ref(null);

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
const userColor = colorMap[userInitial] || '#666';

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function goToLaboratorio() {
  router.push('/laboratorio');
}

function handleSearch(query) {
  console.log('Búsqueda realizada:', query);
  // La navegación se maneja automáticamente en el componente SearchBar
}

function handleClickOutside(event) {
  if (userMenuContainer.value && !userMenuContainer.value.contains(event.target)) {
    menuOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  menuOpen.value = false;
  router.push('/');
}
</script>
