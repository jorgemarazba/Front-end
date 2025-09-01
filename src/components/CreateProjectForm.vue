<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="p-6 rounded shadow-lg w-full max-w-md" style="background-color: #fff; color: #222;">
      <h3 class="text-xl font-bold mb-4">Crear Proyecto</h3>
      <form @submit.prevent="onSubmit">
        <div class="mb-3">
          <label class="block mb-1">Nombre del proyecto</label>
          <input v-model="newInvestigation" type="text" id="project-name" name="name" class="w-full border rounded px-3 py-2" placeholder="Nombre de la investigación" />
        </div>
        <div class="mb-3">
          <label class="block mb-1">Descripción</label>
          <input v-model="description" type="text" id="project-description" name="description" class="w-full border rounded px-3 py-2" placeholder="Descripción del proyecto" />
        </div>
        <div class="mb-3">
          <label class="block mb-1" for="project-research-type">Tipo de investigación</label>
          <select v-model="research_type" id="project-research-type" name="research_type" class="w-full border rounded px-3 py-2" autocomplete="research-type">
            <option value="">Selecciona un tipo</option>
            <option value="basic">Básica</option>
            <option value="applied">Aplicada</option>
            <option value="experimental">Experimental</option>
            <option value="theoretical">Teórica</option>
            <option value="qualitative">Cualitativa</option>
            <option value="quantitative">Cuantitativa</option>
            <option value="mixed">Mixta</option>
          </select>
        </div>
        <div class="mb-3">
          <label class="block mb-1">Institución</label>
          <input v-model="institution" type="text" id="project-institution" name="institution" class="w-full border rounded px-3 py-2" placeholder="Institución" />
        </div>
        <div class="mb-3">
          <label class="block mb-1">Grupo de investigación</label>
          <input v-model="research_group" type="text" id="project-research-group" name="research_group" class="w-full border rounded px-3 py-2" placeholder="Grupo de investigación" />
        </div>
        <div class="mb-3">
          <label class="block mb-1">Categoría</label>
          <input v-model="category" type="text" id="project-category" name="category" class="w-full border rounded px-3 py-2" placeholder="Categoría" />
        </div>
        <div class="mb-3">
          <label class="block mb-1">Estado</label>
          <input v-model="status" type="text" id="project-status" name="status" class="w-full border rounded px-3 py-2" placeholder="Estado (ej: planning)" />
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
import { useToast } from 'vue-toastification';
import axios from 'axios';
import Button from '@/components/ui/Button.vue';

const newInvestigation = ref('');
const description = ref('');
const research_type = ref('');
const institution = ref('');
const research_group = ref('');
const category = ref('');
const status = ref('planning');

const emit = defineEmits(['close', 'created']);
const toast = useToast();

function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false;
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true;
  }
}

async function onSubmit() {
  const token = localStorage.getItem('access_token');
  if (!newInvestigation.value.trim()) {
    alert('El nombre del proyecto es obligatorio.');
    return;
  }
  if (!token || isTokenExpired(token)) {
    toast.error('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
    emit('close');
    return;
  }
  try {
    const payload = {
      name: newInvestigation.value,
      description: description.value || "",
      research_type: research_type.value || "",
      institution: institution.value || "",
      research_group: research_group.value || "",
      category: category.value || "",
      status: status.value || "planning",
    };
    console.log('Payload enviado:', JSON.stringify(payload, null, 2));
    const response = await axios.post('http://127.0.0.1:8000/api/v1/proyectos/', payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    emit('created', response.data);
  newInvestigation.value = '';
  description.value = '';
  research_type.value = '';
  institution.value = '';
  research_group.value = '';
  category.value = '';
  status.value = 'planning';
  } catch (error) {
    alert('Error al crear el proyecto. Verifica los datos e intenta nuevamente.');
    const err = error as any;
    if (err.response) {
      console.error('Respuesta error backend:', JSON.stringify(err.response.data, null, 2));
    }
  }
}
</script>
