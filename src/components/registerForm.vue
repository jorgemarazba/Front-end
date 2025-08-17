<template>
  <div
    class="max-w-md mx-auto p-8 rounded-lg shadow-lg border border-black bg-white text-black"
  >
    <div class="mb-8 relative">
  <Button v-if="step === 1" variant="outline" class="absolute left-0 top-0" style="z-index:2;" @click="handleBack">
    <ArrowLeft class="w-6 h-6" />
  </Button>
  <h2 class="text-2xl font-bold ml-14 mt-2">Registro de nuevos usuario</h2>
    </div>
    <form @submit.prevent="onSubmit">
      <div v-if="step === 1" class="space-y-4">
        <div>
          <label class="block mb-1 font-medium text-black" for="name">Nombre</label>
          <Field name="name" v-slot="{ field, errors }">
            <input v-bind="field" id="name" type="text" autocomplete="given-name" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
            <span class="text-red-400 text-xs">{{ errors[0] }}</span>
          </Field>
        </div>
        <div>
          <label class="block mb-1 font-medium text-black" for="lastname">Apellidos</label>
          <Field name="lastname" v-slot="{ field, errors }">
            <input v-bind="field" id="lastname" type="text" autocomplete="family-name" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
            <span class="text-red-400 text-xs">{{ errors[0] }}</span>
          </Field>
        </div>
        <div>
          <label class="block mb-1 font-medium text-black" for="phone">Teléfono</label>
          <Field name="phone" v-slot="{ field, errors }">
            <input v-bind="field" id="phone" type="text" autocomplete="tel" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
            <span class="text-red-400 text-xs">{{ errors[0] }}</span>
          </Field>
        </div>
      </div>
      <div v-else-if="step === 2" class="space-y-4 text-black">
        <div>
          <label class="block mb-1 font-medium text-black" for="institution">Institución</label>
          <Field name="institution" v-slot="{ field, errors }">
            <input v-bind="field" id="institution" type="text" autocomplete="organization" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
            <span class="text-red-400 text-xs">{{ errors[0] }}</span>
          </Field>
        </div>
        <div>
          <label class="block mb-1 font-medium text-black" for="career">Carrera</label>
          <Field name="career" v-slot="{ field, errors }">
            <input v-bind="field" id="career" type="text" autocomplete="organization-title" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
            <span class="text-red-400 text-xs">{{ errors[0] }}</span>
          </Field>
        </div>
        <div>
          <label class="block mb-1 font-medium text-black" for="seedbed">Semillero</label>
          <Field name="seedbed" v-slot="{ field, errors }">
            <input v-bind="field" id="seedbed" type="text" autocomplete="off" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
            <span class="text-red-400 text-xs">{{ errors[0] }}</span>
          </Field>
        </div>
      </div>
      <div v-else-if="step === 3" class="space-y-4 text-black">
        <div>
          <label class="block mb-1 font-medium text-black" for="email">Email</label>
          <Field name="email" v-slot="{ field, errors }">
            <input v-bind="field" id="email" type="email" autocomplete="email" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
            <span class="text-red-400 text-xs">{{ errors[0] }}</span>
          </Field>
        </div>
        <div>
          <label class="block mb-1 font-medium text-black" for="password">Contraseña</label>
          <Field name="password" v-slot="{ field, errors }">
            <input v-bind="field" id="password" type="password" autocomplete="new-password" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
            <span class="text-red-400 text-xs">{{ errors[0] }}</span>
          </Field>
        </div>
        <div>
          <label class="block mb-1 font-medium text-black" for="confirmPassword">Repetir contraseña</label>
          <Field name="confirmPassword" v-slot="{ field, errors }">
            <input v-bind="field" id="confirmPassword" type="password" autocomplete="new-password" class="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900" />
            <span class="text-red-400 text-xs">{{ errors[0] }}</span>
          </Field>
        </div>
      </div>
      <div class="flex justify-between gap-x-4 mt-6">
  <Button v-if="step > 1" variant="outline" @click="handleBack" class="text-black px-4 py-1 text-base">Regresar</Button>
        <Button
          v-if="step < 3"
          variant="default"
          @click="async () => {
    await validate();
    if (step === 1) {
      if (!errors.name && !errors.lastname && !errors.phone && values.name && values.lastname && values.phone) step++;
    } else if (step === 2) {
      if (!errors.institution && !errors.career && !errors.seedbed && values.institution && values.career && values.seedbed) step++;
    }
  }"
          class="text-black px-4 py-1 text-base"
        >
          Siguiente
        </Button>
        <Button v-else type="submit" variant="default" class="px-4 py-1 text-base">Registrarse</Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { useForm, Field } from 'vee-validate';
import { z } from 'zod';
import { toFormValidator } from '@vee-validate/zod';
import { useToast } from 'vue-toastification';
import axios from 'axios';
import { ref } from 'vue';
import Button from '@/components/ui/Button.vue';
import { ArrowLeft } from 'lucide-vue-next';

const toast = useToast();

const schema = z
  .object({
    name: z.string().min(2, 'El nombre es obligatorio'),
    lastname: z.string().min(2, 'Los apellidos son obligatorios'),
    phone: z
      .string()
      .regex(/^\+57[13-8]\d{7,9}$|^\+573\d{9}$/,
        'El número debe tener formato colombiano válido: +57 seguido del número (ej: +573001234567 para móvil, +5714567890 para fijo)'
      ),
    institution: z.string().min(2, 'La institución es obligatoria'),
    career: z.string().min(2, 'La carrera es obligatoria'),
    seedbed: z.string().min(2, 'El semillero es obligatorio'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string().min(6, 'Repite la contraseña'),
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Las contraseñas no coinciden',
        path: ['confirmPassword'],
      });
    }
  });

const { handleSubmit, validate, values, errors, setFieldError } = useForm({
  validationSchema: toFormValidator(schema),
});

const step = ref(1);

const fieldNames: Array<
  'name' | 'lastname' | 'phone' | 'institution' | 'career' | 'seedbed' | 'email' | 'password' | 'confirmPassword'
> = [
  'name',
  'lastname',
  'phone',
  'institution',
  'career',
  'seedbed',
  'email',
  'password',
  'confirmPassword',
];

import { useRouter } from 'vue-router';
const router = useRouter();

function handleBack() {
  if (step.value === 1) {
    router.push('/');
  } else {
    step.value--;
    // Limpiar errores solo de los campos válidos
    fieldNames.forEach((key) => setFieldError(key, undefined));
  }
}

const onSubmit = handleSubmit(async (values) => {
  try {
    await axios.post('/auth/register', values);
    toast.success('¡Registro exitoso!');
  } catch (error: any) {
    toast.error(error?.response?.data?.message || 'Error en el registro');
  }
});
</script>

<style>
.bg-register {
  background: url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Crect%20x%3D%222%22%20y%3D%222%22%20width%3D%226%22%20height%3D%226%22%20transform%3D%22rotate(45%205%205)%22%20fill%3D%22%23007bff%22/%3E%3C/svg%3E');
  background-color: white;
}
</style>
