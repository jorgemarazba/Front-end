<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
  <div class="p-6 rounded shadow-lg w-full max-w-md" style="background-color: #fff; color: #222;">
      <h3 class="text-xl font-bold mb-4">Crear Proyecto</h3>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="block mb-1">Crear una nueva investigación</label>
          <input v-model="newInvestigation" type="text" class="w-full border rounded px-3 py-2" placeholder="Nombre de la investigación" />
        </div>
        <div class="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" @click="$emit('close')">Cancelar</Button>
          <Button type="submit" variant="default">Crear</Button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import Button from '@/components/ui/Button.vue';

const name = ref('');
const description = ref('');
const status = ref('planning');
const newInvestigation = ref('');

import { useRouter } from 'vue-router';
const router = useRouter();

const emit = defineEmits(['close', 'created']);

async function onSubmit() {
  const token = localStorage.getItem('access_token');
  try {
    if (newInvestigation.value) {
      // Redirigir a la vista de investigación (ajusta la ruta según tu router)
      router.push({ path: '/investigacion', query: { nombre: newInvestigation.value } });
      emit('close');
      newInvestigation.value = '';
      return;
    }
    await axios.post('http://127.0.0.1:8000/api/v1/proyectos/', {
      name: name.value,
      description: description.value,
      status: status.value,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    emit('created');
    emit('close');
    name.value = '';
    description.value = '';
    status.value = 'planning';
  } catch (error) {
    // Puedes mostrar un toast aquí si lo deseas
  }
}
</script>
