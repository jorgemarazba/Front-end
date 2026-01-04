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
        <h2 class="text-xl font-bold text-gray-800">Nueva Tarea</h2>
        <button 
          @click="$emit('close')"
          class="text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          ×
        </button>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit">
        <!-- Título -->
        <div class="mb-4">
          <label for="title" class="block text-sm font-medium text-gray-700 mb-2">
            Título de la tarea *
          </label>
          <input
            id="title"
            v-model="taskData.title"
            type="text"
            required
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Ingresa el título de la tarea"
          />
        </div>

        <!-- Descripción -->
        <div class="mb-4">
          <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="description"
            v-model="taskData.description"
            rows="3"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe la tarea (opcional)"
          ></textarea>
        </div>

        <!-- Fase -->
        <div class="mb-4">
          <label for="phase" class="block text-sm font-medium text-gray-700 mb-2">
            Fase
          </label>
          <select
            id="phase"
            v-model="taskData.phase_id"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option :value="null" disabled>Selecciona una fase</option>
            <option 
              v-for="phase in availablePhases" 
              :key="phase.id"
              :value="phase.id"
            >
              {{ phase.name }}
            </option>
          </select>
        </div>

        <!-- Prioridad -->
        <div class="mb-4">
          <label for="priority" class="block text-sm font-medium text-gray-700 mb-2">
            Prioridad
          </label>
          <select
            id="priority"
            v-model="taskData.priority"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sin prioridad</option>
            <option value="low">Baja</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
          </select>
        </div>

        <!-- Fecha límite -->
        <div class="mb-4">
          <label for="due_date" class="block text-sm font-medium text-gray-700 mb-2">
            Fecha límite
          </label>
          <input
            id="due_date"
            v-model="taskData.due_date"
            type="date"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Asignado a -->
        <div class="mb-6">
          <label for="assignee" class="block text-sm font-medium text-gray-700 mb-2">
            Asignado a
          </label>
          <input
            id="assignee"
            v-model="taskData.assignee"
            type="text"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nombre del responsable (opcional)"
          />
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
            :disabled="isSubmitting || !taskData.title.trim()"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {{ isSubmitting ? 'Creando...' : 'Crear Tarea' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useToast } from 'vue-toastification';
import type { KanbanPhase } from '../types/index';

const props = defineProps<{
  phaseId?: number | null;
  projectId: number;
}>();

const emit = defineEmits<{
  close: [];
  created: [task: any];
}>();

const toast = useToast();

// Estados reactivos
const isSubmitting = ref(false);
const availablePhases = ref<KanbanPhase[]>([]);

// Datos del formulario
const taskData = ref({
  title: '',
  description: '',
  phase_id: props.phaseId || null as number | null,
  due_date: '',
  priority: undefined as 'low' | 'medium' | 'high' | undefined,
  assignee: '',
  tags: [] as string[]
});

// Cargar fases disponibles
async function fetchAvailablePhases() {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`/api/v1/proyectos/${props.projectId}/phases`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    availablePhases.value = response.data.phases || [];
  } catch (error) {
    // Fallback con fases básicas
    availablePhases.value = [
      { id: 1, name: 'Por hacer', color: '#ef4444', position: 0, project_id: props.projectId, tasks: [] },
      { id: 2, name: 'En progreso', color: '#f59e0b', position: 1, project_id: props.projectId, tasks: [] },
      { id: 3, name: 'Completado', color: '#10b981', position: 2, project_id: props.projectId, tasks: [] }
    ];
  }
}

// Manejar envío del formulario
async function handleSubmit() {
  if (!taskData.value.title.trim() || taskData.value.phase_id === null) {
    toast.error('Por favor completa los campos requeridos');
    return;
  }

  isSubmitting.value = true;

  try {
    const token = localStorage.getItem('access_token');
    // Calcular posición basada en las tareas existentes de la fase
    const selectedPhase = availablePhases.value.find(p => p.id === taskData.value.phase_id);
    const nextPosition = selectedPhase?.tasks ? selectedPhase.tasks.length : 0;

    // Crear payload básico - solo campos esenciales
    const payload: any = {
      title: taskData.value.title.trim(),
      phase_id: taskData.value.phase_id!,
      project_id: props.projectId,
      position: nextPosition // Posición calculada automáticamente
    };

    // Agregar campos opcionales solo si tienen valor
    if (taskData.value.description?.trim()) {
      payload.description = taskData.value.description.trim();
    }
    
    if (taskData.value.due_date) {
      payload.due_date = taskData.value.due_date;
    }
    
    if (taskData.value.priority) {
      payload.priority = taskData.value.priority;
    }
    
    if (taskData.value.assignee?.trim()) {
      payload.assignee = taskData.value.assignee.trim();
    }
    
    if (taskData.value.tags && taskData.value.tags.length > 0) {
      payload.tags = taskData.value.tags;
    }

    // Debug: Mostrar payload que se envía
    const response = await axios.post(`/api/v1/tareas/`, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success('Tarea creada exitosamente');
    emit('created', response.data);
  } catch (error: any) {
    if (error.response?.status === 422) {
      const validationErrors = error.response.data?.detail || [];
      
      if (Array.isArray(validationErrors)) {
        const errorMessages = validationErrors.map((err: any) => `${err.loc?.join('.')}: ${err.msg}`).join(', ');
        toast.error(`Error de validación: ${errorMessages}`);
      } else {
        toast.error(`Error de validación: ${error.response.data?.detail || 'Datos inválidos'}`);
      }
    } else {
      toast.error('Error al crear la tarea. Inténtalo de nuevo.');
    }
  } finally {
    isSubmitting.value = false;
  }
}

// Manejar clic fuera del modal
function handleClickOutside() {
  emit('close');
}

onMounted(() => {
  fetchAvailablePhases();
});
</script>