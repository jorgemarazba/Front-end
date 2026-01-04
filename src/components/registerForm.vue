<template>
  <div
    class="w-full max-w-xl mx-auto p-12 rounded-3xl shadow-2xl bg-white text-black"
  >
    <div class="mb-8 relative flex flex-col items-center gap-2">
      <Button v-if="step === 1" variant="outline" class="absolute left-0 top-0" style="z-index:2;" @click="handleBack">
        <ArrowLeft class="w-6 h-6" />
      </Button>
      <!-- Logo registro -->
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
      </svg>
      <h2 class="text-2xl font-bold ml-14 mt-2">Registro de nuevos usuario</h2>
    </div>
    <form @submit.prevent="onSubmit">
      <div v-if="step === 1" class="space-y-4">
          <div>
            <label class="block mb-1 font-medium text-black" for="full_name">Nombre completo</label>
            <input v-model="full_name" id="full_name" name="full_name" type="text" autocomplete="name" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
          </div>
        <div>
          <label class="block mb-1 font-medium text-black" for="phone">Teléfono</label>
          <input v-model="phone" id="phone" name="phone" type="text" autocomplete="tel" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
        </div>
      </div>
      <div v-else-if="step === 2" class="space-y-4 text-black">
        <div>
          <label class="block mb-1 font-medium text-black" for="institution">Institución</label>
          <input v-model="institution" id="institution" name="institution" type="text" autocomplete="organization" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
        </div>
        <div>
          <label class="block mb-1 font-medium text-black" for="career">Carrera</label>
          <input v-model="career" id="career" name="career" type="text" autocomplete="organization-title" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
        </div>
        <div>
          <label class="block mb-1 font-medium text-black" for="seedbed">Semillero</label>
          <input v-model="seedbed" id="seedbed" name="seedbed" type="text" autocomplete="off" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
        </div>
      </div>
      <div v-else-if="step === 3" class="space-y-4 text-black">
        <div>
          <label class="block mb-1 font-medium text-black" for="email">Email</label>
          <input v-model="email" id="email" name="email" type="email" autocomplete="email" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
        </div>
        <div>
          <label class="block mb-1 font-medium text-black" for="password">Contraseña</label>
          <input v-model="password" id="password" name="password" type="password" autocomplete="new-password" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
        </div>
        <div>
          <label class="block mb-1 font-medium text-black" for="confirmPassword">Repetir contraseña</label>
          <input v-model="confirmPassword" id="confirmPassword" name="confirmPassword" type="password" autocomplete="new-password" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
        </div>
      </div>
      <div class="flex justify-between gap-x-4 mt-6">
        <Button v-if="step > 1" variant="outline" @click="handleBack" class="text-black px-4 py-1 text-base">Regresar</Button>
        <Button
          v-if="step < 3"
          class="text-black px-4 py-1 text-base"
          @click="() => { step++; }"
        >
          Siguiente
        </Button>
        <Button v-else type="submit" variant="default" class="px-4 py-1 text-base">Registrarse</Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
// ...existing code...
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { ref } from 'vue';
import Button from '@/components/ui/Button.vue';
import { ArrowLeft } from 'lucide-vue-next';
import type { UserCreate } from '../types';

const toast = useToast();

const step = ref(1);

const full_name = ref('');
const phone = ref('');
const institution = ref('');
const career = ref('');
const seedbed = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');

import { useRouter } from 'vue-router';
const router = useRouter();

function handleBack() {
  if (step.value === 1) {
    router.push('/');
  } else {
    step.value--;
  }
}

async function onSubmit() {
  if (password.value !== confirmPassword.value) {
    toast.error('Las contraseñas no coinciden');
    return;
  }
  const payload: UserCreate = {
    email: email.value,
    full_name: full_name.value,
    password: password.value,
    phone_number: phone.value,
    university: institution.value || null,
    research_group: seedbed.value || null,
    career: career.value || null,
  };
  try {
    console.log('Enviando registro:', payload);
  await axios.post('/api/v1/auth/register', payload);
    toast.success('¡Registro exitoso! Ahora inicia sesión.');
    router.push('/login');
  } catch (error: any) {
    console.error('Error en el registro:', error?.response?.data);
    const apiError = error?.response?.data;
    if (apiError?.detail && Array.isArray(apiError.detail)) {
      apiError.detail.forEach((err: any) => {
        toast.error(err.msg || 'Error de validación');
      });
    } else {
      toast.error(apiError?.message || 'Error en el registro. Verifica los datos o si el usuario ya existe.');
    }
  }
}
</script>

<style>
.bg-register {
  background: url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%226%22%20height%3D%226%22%20transform%3D%22rotate(45%205%205)%22%20fill%3D%22%23007bff%22/%3E%3C/svg%3E');
  background-color: white;
}
</style>
