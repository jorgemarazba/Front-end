<template>
  <nav class="bg-gray-300 shadow">
    <div class="w-full flex items-center justify-between h-16 px-2">
      <!-- Logo e icono -->
      <div class="flex items-center gap-2">
        <img class="h-8 w-8" src="/favicon.png" alt="Logo" sizes="200x200" />
        <span class="font-bold text-xl text-gray-900">IA+Inv</span>
      </div>
      <!-- Links de navegación centrados -->
      <div class="flex flex-1 justify-center space-x-4">
        <a href="#" class="text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Sobre Nosotros</a>
        <a href="#" class="text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Proyectos</a>
        <a href="#" class="text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Contacto</a>
        <a href="#" class="text-gray-900 hover:bg-gray-200 px-3 py-2 rounded-md text-lg font-semibold">Precing</a>
      </div>
      <!-- Icono y botones de sesión -->
      <div class="flex items-center space-x-3.5">
        <!-- Icono de usuario (Heroicons) -->
        <img src="/login.png" alt="Login" class="w-8 h-8" />
  <router-link to="/login" class="text-gray-700 text-sm font-medium mr-4 hover:underline cursor-pointer">Inicia sesión</router-link>
        <router-link to="/register" class="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 text-sm font-medium ml-6">Registrarse</router-link>
      </div>
    </div>
  </nav>
  <div class="w-full h-0.5 bg-blue-600"></div>
</template>


