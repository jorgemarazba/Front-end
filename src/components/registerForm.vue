<template>
  <form @submit.prevent="onSubmit" class="max-w-md mx-auto bg-white p-8 rounded shadow-md space-y-6">
    <h2 class="text-2xl font-bold mb-4 text-center">Registro</h2>
    <div>
      <label class="block mb-1 font-medium">Nombre</label>
      <Field name="name" v-slot="{ field, errors }">
        <input v-bind="field" type="text" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <span class="text-red-500 text-xs">{{ errors[0] }}</span>
      </Field>
    </div>
    <div>
      <label class="block mb-1 font-medium">Email</label>
      <Field name="email" v-slot="{ field, errors }">
        <input v-bind="field" type="email" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <span class="text-red-500 text-xs">{{ errors[0] }}</span>
      </Field>
    </div>
    <div>
      <label class="block mb-1 font-medium">Contraseña</label>
      <Field name="password" v-slot="{ field, errors }">
        <input v-bind="field" type="password" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <span class="text-red-500 text-xs">{{ errors[0] }}</span>
      </Field>
    </div>
    <button type="submit" class="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold">Registrarse</button>
  </form>
</template>

<script setup lang="ts">
import { useForm, Field } from 'vee-validate';
import { z } from 'zod';
import { toFormValidator } from '@vee-validate/zod';
import useToast from 'vue-toastification';
import axios from 'axios';

const toast = useToast();

const schema = z.object({
  name: z.string().min(2, 'El nombre es obligatorio'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const { handleSubmit } = useForm({
  validationSchema: toFormValidator(schema),
});

const onSubmit = handleSubmit(async (values) => {
  try {
  await axios.post('/auth/register', values);
    toast.success('¡Registro exitoso!');
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Error en el registro');
  }
});
</script>
