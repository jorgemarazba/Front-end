<template>
  <nav class="bg-black shadow">
    <div class="w-full flex items-center justify-between h-16 px-2">
      <!-- Logo e icono -->
      <div class="flex items-center gap-2">
        <div class="bg-blue-300 rounded-none h-12 w-12 flex items-center justify-center">
          <img class="h-10 w-10" src="/favicon.png" alt="Logo" sizes="200x200" />
        </div>
        <span class="font-bold text-xl text-white">IA+Inv</span>
      </div>
      <!-- Botón, barra de búsqueda y texto centrados -->
      <div class="flex items-center justify-center flex-1 gap-4">
  <button @click="$emit('crear-proyecto')" class="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 text-sm font-medium">Crear nuevo proyecto</button>
  <span class="font-bold text-2xl text-blue-200 ml-8">Laboratorio de Proyectos</span>
      </div>
      <!-- Barra de búsqueda junto al menú de usuario -->
      <div class="flex items-center" style="margin-right:8px;">
  <input type="text" placeholder="Buscar proyectos..." class="px-3 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-black w-64 mr-6" />
        <div class="relative">
          <button class="flex items-center gap-2 focus:outline-none" @click="toggleMenu">
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
  <div class="w-full bg-red-600" style="height:1px;"></div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
const router = useRouter();
const menuOpen = ref(false);

// Datos de usuario simulados (puedes reemplazar por los reales)
const userName = ref('Persona Ejemplo');
const userEmail = ref('persona@correo.com');

// Generar color aleatorio para el icono
function getRandomColor() {
  const colors = ['#e57373', '#64b5f6', '#81c784', '#ffd54f', '#ba68c8', '#4db6ac', '#f06292', '#9575cd', '#ff8a65', '#a1887f'];
  return colors[Math.floor(Math.random() * colors.length)];
}
const userColor = getRandomColor();
const userInitial = userName.value.charAt(0).toUpperCase();

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

function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  menuOpen.value = false;
  router.push('/');
}
</script>
