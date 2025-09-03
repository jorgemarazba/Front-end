<template>
  <div class="w-full max-w-xl mx-auto p-12 rounded-3xl shadow-2xl bg-white text-black flex flex-col items-center gap-8">
    <!-- Icono login -->
    <div class="flex flex-col items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-20 w-20 text-blue-500 mb-4 transition-transform duration-300 cursor-pointer hover:scale-110 active:scale-95"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        @click="handleIconClick"
        title="Haz clic para iniciar sesión"
      >
        <template v-if="!eyeOpen">
          <!-- Ojo cerrado -->
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12s4-8 9-8 9 8 9 8-4 8-9 8-9-8-9-8zm9 4a4 4 0 100-8 4 4 0 000 8zm0 0v2m0-2v-2" />
        </template>
        <template v-else>
          <!-- Ojo abierto -->
          <ellipse cx="12" cy="12" rx="9" ry="8" stroke-width="2" />
          <circle cx="12" cy="12" r="4" stroke-width="2" />
        </template>
      </svg>
      <span class="text-2xl font-bold text-blue-600">Iniciar sesión</span>
    </div>
    <form @submit.prevent="onLoginSubmit" class="w-full flex flex-col gap-6">
      <div class="space-y-6">
        <div>
          <label class="block mb-2 font-medium text-black text-lg" for="email">Email</label>
          <input v-model="email" id="email" name="email" type="email" autocomplete="email" class="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-lg" required />
        </div>
        <div>
          <label class="block mb-2 font-medium text-black text-lg" for="password">Contraseña</label>
          <input v-model="password" id="password" name="password" type="password" autocomplete="current-password" class="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 text-lg" required />
          <div class="flex flex-col items-start gap-1 mt-2">
              <div class="flex flex-row justify-between items-center w-full">
                <router-link to="/recuperar" class="text-blue-600 hover:underline text-sm">¿No puedes iniciar sesión?</router-link>
                <router-link to="/register" class="text-blue-600 hover:underline text-sm">Crear una cuenta</router-link>
              </div>
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-8">
        <Button type="submit" variant="default" class="px-6 py-2 text-lg">Entrar</Button>
      </div>
      <div class="flex flex-wrap justify-center gap-4 mt-4 w-full text-xs text-gray-500">
        <router-link to="/privacidad" class="hover:underline">Política de privacidad</router-link>
        <span>|</span>
        <router-link to="/terminos" class="hover:underline">Términos y condiciones</router-link>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import type { Token } from '../types';
import Button from '@/components/ui/Button.vue';

const toast = useToast();
const router = useRouter();

const email = ref('');
const password = ref('');
const eyeOpen = ref(false);

function handleIconClick() {
  toast.info('¡Bienvenido! Ingresa tus credenciales para iniciar sesión.');
}

const onLoginSubmit = async () => {
  try {
    const body = new URLSearchParams();
    body.append('username', email.value);
    body.append('password', password.value);
    const response = await axios.post<Token>(
      'http://127.0.0.1:8000/api/v1/auth/login',
      body,
      { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
    );
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    toast.success('¡Login exitoso!');
    eyeOpen.value = true; // Abrir el ojo al iniciar sesión
    setTimeout(() => { router.push('/laboratorio'); }, 700); // Pequeña pausa para mostrar el ojo abierto
  } catch (error: any) {
    const apiError = error?.response?.data;
    if (apiError?.detail && Array.isArray(apiError.detail)) {
      apiError.detail.forEach((err: any) => {
        toast.error(err.msg || 'Error de validación');
      });
    } else {
      toast.error(apiError?.detail || 'Error en el login, verifica los datos ingresados.');
    }
    eyeOpen.value = false; // Mantener el ojo cerrado si falla
  }
};

</script>


