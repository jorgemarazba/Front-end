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
      
      <!-- Contenedor centrado con texto y botón -->
      <div class="flex-1 flex justify-center items-center gap-4">
        <!-- Botón "Etapas de investigación" que abre modal -->
        <button 
          @click="abrirModalEtapas"
          class="bg-yellow-400 bg-opacity-50 px-4 py-1 rounded-full flex items-center gap-2 hover:bg-opacity-70 transition-all duration-200"
        >
          <span class="text-black font-bold text-sm uppercase">
            ETAPAS DE INVESTIGACIÓN
          </span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
        </button>
        
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
      
      <!-- Espacio vacío a la derecha para equilibrar -->
      <div class="w-32"></div>
    </div>
  </div>

  <!-- Modal de Etapas de Investigación -->
  <div 
    v-if="modalEtapasOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
    @click="cerrarModalEtapas"
  >
    <div 
      class="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
      @click.stop
    >
      <!-- Header del modal -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Seleccionar Etapa de Investigación</h2>
        <button 
          @click="cerrarModalEtapas"
          class="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      <!-- Grid de etapas con colores de la imagen -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <!-- Seleccionar Tema -->
        <div 
          @click="crearTarjetaEtapa({id: 1, nombre: 'Seleccionar Tema', color: '#8B5CF6'})"
          class="bg-purple-500 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform duration-200 text-white flex flex-col items-center justify-center gap-3"
        >
          <!-- Icono de bombilla -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 class="font-bold text-lg text-center">Seleccionar Tema</h3>
        </div>

        <!-- Revisión de Bibliografía -->
        <div 
          @click="crearTarjetaEtapa({id: 2, nombre: 'Revisión de Bibliografía', color: '#3B82F6'})"
          class="bg-blue-500 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform duration-200 text-white flex flex-col items-center justify-center gap-3"
        >
          <!-- Icono de libros -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <h3 class="font-bold text-lg text-center">Revisión de Bibliografía</h3>
        </div>

        <!-- Planteamiento del Problema -->
        <div 
          @click="crearTarjetaEtapa({id: 3, nombre: 'Planteamiento del Problema', color: '#EF4444'})"
          class="bg-red-500 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform duration-200 text-white flex flex-col items-center justify-center gap-3"
        >
          <!-- Icono de interrogación -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="font-bold text-lg text-center">Planteamiento del Problema</h3>
        </div>

        <!-- Definir Objetivos -->
        <div 
          @click="crearTarjetaEtapa({id: 4, nombre: 'Definir Objetivos', color: '#10B981'})"
          class="bg-green-500 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform duration-200 text-white flex flex-col items-center justify-center gap-3"
        >
          <!-- Icono de objetivo/diana -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <h3 class="font-bold text-lg text-center">Definir Objetivos</h3>
        </div>

        <!-- Justificación y Delimitación -->
        <div 
          @click="crearTarjetaEtapa({id: 5, nombre: 'Justificación y Delimitación', color: '#F59E0B'})"
          class="bg-yellow-500 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform duration-200 text-white flex flex-col items-center justify-center gap-3"
        >
          <!-- Icono de escala/balance -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
          <h3 class="font-bold text-lg text-center">Justificación y Delimitación</h3>
        </div>

        <!-- Marco Teórico -->
        <div 
          @click="crearTarjetaEtapa({id: 6, nombre: 'Marco Teórico', color: '#EC4899'})"
          class="bg-pink-500 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform duration-200 text-white flex flex-col items-center justify-center gap-3"
        >
          <!-- Icono de estructura/bloques -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <h3 class="font-bold text-lg text-center">Marco Teórico</h3>
        </div>

        <!-- Metodología de la Investigación -->
        <div 
          @click="crearTarjetaEtapa({id: 7, nombre: 'Metodología de la Investigación', color: '#06B6D4'})"
          class="bg-cyan-500 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform duration-200 text-white flex flex-col items-center justify-center gap-3"
        >
          <!-- Icono de engranajes/proceso -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <h3 class="font-bold text-lg text-center">Metodología de la Investigación</h3>
        </div>

        <!-- Población y Muestra -->
        <div 
          @click="crearTarjetaEtapa({id: 8, nombre: 'Población y Muestra', color: '#84CC16'})"
          class="bg-lime-500 rounded-lg p-6 cursor-pointer hover:scale-105 transition-transform duration-200 text-white flex flex-col items-center justify-center gap-3"
        >
          <!-- Icono de grupo de personas -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <h3 class="font-bold text-lg text-center">Población y Muestra</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

// Props
const props = defineProps({
  projectTitle: {
    type: String,
    default: ''
  }
});

// Emits
const emit = defineEmits(['crearEtapa']);

const router = useRouter();
const menuOpen = ref(false);
const modalEtapasOpen = ref(false);
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

function abrirModalEtapas() {
  modalEtapasOpen.value = true;
  console.log('Modal de etapas abierto');
}

function cerrarModalEtapas() {
  modalEtapasOpen.value = false;
}

function crearTarjetaEtapa(etapa) {
  console.log('Creando tarjeta para:', etapa.nombre);
  // Emitir evento al componente padre (ProjectDetail)
  emit('crearEtapa', etapa);
  cerrarModalEtapas(); // Cerrar el modal
}

function goToLaboratorio() {
  router.push('/laboratorio');
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
