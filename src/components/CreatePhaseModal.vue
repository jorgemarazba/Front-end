<template>
  <div 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]"
    @click="handleClickOutside"
  >
    <div 
      class="bg-white rounded-lg p-6 max-w-md w-full mx-4"
      @click.stop
    >
      <!-- Header del modal -->
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold text-gray-800">Nueva Fase</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit">
        <!-- Nombre -->
        <div class="mb-4">
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la fase *
          </label>
          <input
            id="name"
            v-model="phaseData.name"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa el nombre de la fase"
          />
        </div>

        <!-- Descripción -->
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            v-model="phaseData.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe la fase (opcional)"
          ></textarea>
        </div>

        <!-- Color -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Color de la fase
          </label>
          <div class="grid grid-cols-4 gap-2">
            <div 
              v-for="color in colorOptions" 
              :key="color.value"
              class="relative"
            >
              <input
                :id="`color-${color.value}`"
                v-model="phaseData.color"
                type="radio"
                :value="color.value"
                class="sr-only"
              />
              <label
                :for="`color-${color.value}`"
                class="block w-full h-10 rounded cursor-pointer border-2 transition-all"
                :class="[
                  color.class,
                  phaseData.color === color.value 
                    ? 'border-gray-800 ring-2 ring-offset-2 ring-gray-800' 
                    : 'border-gray-300 hover:border-gray-400'
                ]"
                :title="color.name"
              >
                <div 
                  v-if="phaseData.color === color.value"
                  class="absolute inset-0 flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </label>
            </div>
          </div>
        </div>

        <!-- Plantilla de etapa -->
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Usar plantilla de etapa (opcional)
          </label>
          <select
            v-model="selectedTemplate"
            @change="applyTemplate"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Crear fase personalizada</option>
            <option 
              v-for="stage in researchStages" 
              :key="stage.id"
              :value="stage.id"
            >
              {{ stage.nombre }}
            </option>
          </select>
          <p class="text-xs text-gray-500 mt-1">
            Las plantillas aplicarán automáticamente nombre, descripción y color
          </p>
        </div>

        <!-- Botones -->
        <div class="flex gap-3">
          <button
            type="button"
            @click="$emit('close')"
            class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            :disabled="isSubmitting || !phaseData.name.trim()"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {{ isSubmitting ? 'Creando...' : 'Crear Fase' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import type { CreatePhaseRequest } from '../types/index';
import { RESEARCH_STAGES } from '../config/research-stages';

const props = defineProps<{
  projectId: number;
}>();

const emit = defineEmits<{
  close: [];
  created: [];
}>();

const toast = useToast();

// Estados reactivos
const isSubmitting = ref(false);
const selectedTemplate = ref<number | ''>('');

// Opciones de color
const colorOptions = [
  { value: '#8B5CF6', name: 'Violeta', class: 'bg-purple-500' },
  { value: '#3B82F6', name: 'Azul', class: 'bg-blue-500' },
  { value: '#EF4444', name: 'Rojo', class: 'bg-red-500' },
  { value: '#10B981', name: 'Verde', class: 'bg-green-500' },
  { value: '#F59E0B', name: 'Amarillo', class: 'bg-yellow-500' },
  { value: '#EC4899', name: 'Rosa', class: 'bg-pink-500' },
  { value: '#06B6D4', name: 'Cian', class: 'bg-cyan-500' },
  { value: '#84CC16', name: 'Lima', class: 'bg-lime-500' },
  { value: '#6B7280', name: 'Gris', class: 'bg-gray-500' },
  { value: '#DC2626', name: 'Rojo oscuro', class: 'bg-red-600' },
  { value: '#7C3AED', name: 'Violeta oscuro', class: 'bg-violet-600' },
  { value: '#059669', name: 'Verde oscuro', class: 'bg-emerald-600' }
];

// Etapas de investigación para plantillas
const researchStages = RESEARCH_STAGES;

// Datos del formulario
const phaseData = ref<CreatePhaseRequest>({
  name: '',
  description: '',
  color: '#8B5CF6',
  position: 0,
  project_id: props.projectId
});

// Aplicar plantilla de etapa
function applyTemplate() {
  if (!selectedTemplate.value) return;
  
  const template = researchStages.find(stage => stage.id === selectedTemplate.value);
  if (template) {
    phaseData.value.name = template.nombre;
    phaseData.value.description = template.descripcion;
    phaseData.value.color = template.color;
  }
}

// Manejar envío del formulario
async function handleSubmit() {
  if (!phaseData.value.name.trim()) {
    toast.error('Por favor ingresa un nombre para la fase');
    return;
  }

  isSubmitting.value = true;

  try {
    const token = localStorage.getItem('access_token');
    
    const payload: CreatePhaseRequest = {
      name: phaseData.value.name.trim(),
      description: phaseData.value.description?.trim() || undefined,
      color: phaseData.value.color,
      position: phaseData.value.position,
      project_id: phaseData.value.project_id
    };

    await axios.post(`http://localhost:8000/api/v1/fases/`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success('Fase creada exitosamente');
    emit('created');
  } catch (error) {
    console.error('Error al crear fase:', error);
    toast.error('Error al crear la fase. Inténtalo de nuevo.');
  } finally {
    isSubmitting.value = false;
  }
}

// Manejar clic fuera del modal
function handleClickOutside() {
  emit('close');
}
</script>