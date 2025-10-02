<template>
  <div class="kanban-board-container min-h-screen bg-gray-100 p-6">
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="text-xl text-gray-600">Cargando tablero Kanban...</div>
    </div>

    <div v-else-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
      <strong>Error:</strong> {{ error }}
    </div>

    <div v-else-if="kanbanBoard" class="kanban-board">
      <h1 class="text-3xl font-bold text-gray-800 mb-6">
        Tablero Kanban - Proyecto #{{ kanbanBoard.project_id }}
      </h1>

      <div class="phases-container flex gap-4 overflow-x-auto pb-4">
        <!-- Fase -->
        <div
          v-for="phase in kanbanBoard.phases"
          :key="phase.id"
          class="phase-column bg-gray-200 rounded-lg p-4 min-w-[300px] max-w-[300px]"
          @drop="handleDrop($event, phase)"
          @dragover.prevent
          @dragenter.prevent
        >
          <!-- Encabezado de la fase -->
          <div class="phase-header mb-4">
            <h2 class="text-xl font-semibold text-gray-700 flex justify-between items-center">
              <span>{{ phase.name }}</span>
              <span class="bg-blue-500 text-white text-sm px-2 py-1 rounded-full">
                {{ phase.task_count }}
              </span>
            </h2>
          </div>

          <!-- Tareas -->
          <div class="tasks-container space-y-3">
            <div
              v-for="task in phase.tasks"
              :key="task.id"
              class="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
              draggable="true"
              @dragstart="handleDragStart($event, task)"
              @dragend="handleDragEnd"
            >
              <h3 class="font-medium text-gray-800 mb-2">{{ task.title }}</h3>
              <p v-if="task.description" class="text-sm text-gray-600">
                {{ task.description }}
              </p>
              <div class="mt-2 text-xs text-gray-500">
                ID: {{ task.id }}
              </div>
            </div>

            <!-- Mensaje cuando no hay tareas -->
            <div
              v-if="phase.tasks.length === 0"
              class="text-center text-gray-500 py-8 border-2 border-dashed border-gray-300 rounded"
            >
              No hay tareas en esta fase
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import type { KanbanBoard, KanbanPhase, KanbanTask } from '../types';

// Props
const props = defineProps<{
  proyectoId: number;
}>();

// State
const kanbanBoard = ref<KanbanBoard | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);
const draggedTask = ref<KanbanTask | null>(null);

// API Base URL (configurable)
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api/v1';

/**
 * Obtiene el token de autenticación del almacenamiento local
 */
function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

/**
 * Carga los datos del proyecto y sus fases con tareas
 * Implementación optimizada que carga tareas por fase en paralelo
 */
async function fetchProjectData(): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    // 1. Obtener las fases del proyecto
    const phasesResponse = await axios.get(
      `${API_BASE_URL}/proyectos/${props.proyectoId}/phases`,
      { headers }
    );

    const phases: KanbanPhase[] = phasesResponse.data;

    // 2. Cargar tareas de todas las fases en paralelo (optimización clave)
    const tasks: KanbanTask[] = [];
    
    await Promise.all(
      phases.map(async (phase: KanbanPhase) => {
        const { id } = phase;
        
        try {
          const phaseTasksResponse = await axios.get(
            `${API_BASE_URL}/fases/${id}/tareas`,
            { headers }
          );
          
          // Agregar todas las tareas de esta fase al array general
          tasks.push(...phaseTasksResponse.data);
        } catch (err) {
          console.error(`Error cargando tareas para la fase ${id}:`, err);
          // Continuamos con las demás fases incluso si una falla
        }
      })
    );

    // 3. Asignar tareas a cada fase y calcular task_count
    const phasesWithTasks = phases.map((phase: KanbanPhase) => ({
      ...phase,
      tasks: tasks.filter(task => task.phase_id === phase.id),
      task_count: tasks.filter(task => task.phase_id === phase.id).length
    }));

    // 4. Construir el objeto KanbanBoard completo
    const { id, created_at } = phasesResponse.data[0] || { id: props.proyectoId, created_at: new Date().toISOString() };
    
    kanbanBoard.value = {
      id: props.proyectoId,
      project_id: props.proyectoId,
      phases: phasesWithTasks,
      created_at: created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

  } catch (err: any) {
    console.error('Error al cargar el tablero Kanban:', err);
    error.value = err.response?.data?.message || err.message || 'Error desconocido al cargar el tablero';
  } finally {
    loading.value = false;
  }
}

/**
 * Maneja el inicio del arrastre de una tarea
 */
function handleDragStart(event: DragEvent, task: KanbanTask): void {
  draggedTask.value = task;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', (event.target as HTMLElement).innerHTML);
  }
}

/**
 * Maneja el fin del arrastre
 */
function handleDragEnd(): void {
  draggedTask.value = null;
}

/**
 * Maneja el evento de soltar una tarea en una fase
 */
async function handleDrop(event: DragEvent, targetPhase: KanbanPhase): Promise<void> {
  event.preventDefault();
  
  if (!draggedTask.value) return;

  const task = draggedTask.value;
  const originalPhaseId = task.phase_id;

  // Si la tarea se suelta en la misma fase, no hacer nada
  if (originalPhaseId === targetPhase.id) {
    draggedTask.value = null;
    return;
  }

  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No se encontró el token de autenticación');
    }

    // Actualizar la tarea en el backend
    await axios.patch(
      `${API_BASE_URL}/tareas/${task.id}`,
      { phase_id: targetPhase.id },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Recargar los datos para reflejar el cambio
    await fetchProjectData();

  } catch (err: any) {
    console.error('Error al mover la tarea:', err);
    error.value = err.response?.data?.message || err.message || 'Error al mover la tarea';
  } finally {
    draggedTask.value = null;
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  fetchProjectData();
});
</script>

<style scoped>
.kanban-board-container {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
}

.phases-container::-webkit-scrollbar {
  height: 8px;
}

.phases-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.phases-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.phases-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.phase-column {
  flex-shrink: 0;
}
</style>
