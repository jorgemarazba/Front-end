<template>
  <div class="max-w-md mx-auto p-8 rounded-lg shadow-lg border border-black bg-white text-black">
    <h2 class="text-2xl font-bold mb-6">Iniciar sesión</h2>
    <form @submit.prevent="onLoginSubmit">
      <div class="space-y-4">
        <div>
          <label class="block mb-1 font-medium text-black" for="email">Email</label>
          <input v-model="email" id="email" type="email" autocomplete="email" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" required />
        </div>
        <div>
          <label class="block mb-1 font-medium text-black" for="password">Contraseña</label>
          <input v-model="password" id="password" type="password" autocomplete="current-password" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" required />
        </div>
      </div>
      <div class="flex justify-end mt-6">
        <Button type="submit" variant="default" class="px-4 py-1 text-base">Entrar</Button>
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
    router.push('/dashboard');
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Error en el login');
  }
};
</script>

<style>
/* Puedes agregar estilos personalizados aquí */
</style>
