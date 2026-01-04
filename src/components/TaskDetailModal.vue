<template>
  <div 
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-hidden">
      <!-- Header del Modal -->
      <div class="flex justify-between items-center p-6 border-b border-gray-200">
        <div class="flex items-center gap-4">
          <div 
            v-if="task.priority"
            class="w-4 h-4 rounded-full"
            :class="{
              'bg-red-500': task.priority === 'high',
              'bg-yellow-500': task.priority === 'medium', 
              'bg-green-500': task.priority === 'low'
            }"
            :title="`Prioridad: ${task.priority}`"
          ></div>
          <h2 class="text-2xl font-bold text-gray-800">{{ task.title }}</h2>
        </div>
        <button 
          @click="closeModal"
          class="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Contenido del Modal -->
      <div class="flex">
        <!-- Columna Principal -->
        <div class="flex-1 p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <!-- Descripción -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Descripción</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <p v-if="task.description" class="text-gray-700 whitespace-pre-wrap">{{ task.description }}</p>
              <p v-else class="text-gray-500 italic">Sin descripción</p>
            </div>
          </div>

          <!-- Tags -->
          <div v-if="task.tags && task.tags.length > 0" class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Etiquetas</h3>
            <div class="flex flex-wrap gap-2">
              <span 
                v-for="tag in task.tags" 
                :key="tag"
                class="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
              >
                {{ tag }}
              </span>
            </div>
          </div>

          <!-- Subtareas -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Lista de verificación</h3>
            <div class="bg-gray-50 rounded-lg p-4">
              <div class="flex items-center gap-2 mb-3">
                <div class="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    class="bg-green-500 h-2 rounded-full transition-all duration-300"
                    :style="{ width: `${subtaskProgress}%` }"
                  ></div>
                </div>
                <span class="text-sm text-gray-600 whitespace-nowrap">
                  {{ completedSubtasks }}/{{ totalSubtasks }}
                </span>
              </div>
              <div class="space-y-2">
                <div 
                  v-for="(subtask, index) in mockSubtasks" 
                  :key="index"
                  class="flex items-center gap-2 p-2 hover:bg-gray-100 rounded"
                >
                  <input 
                    type="checkbox" 
                    :checked="subtask.completed"
                    @change="toggleSubtask(index)"
                    class="w-4 h-4 text-blue-600 rounded"
                  >
                  <span 
                    :class="{ 'line-through text-gray-500': subtask.completed }"
                    class="flex-1"
                  >
                    {{ subtask.text }}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actividad/Comentarios -->
          <div class="mb-6">
            <h3 class="text-lg font-semibold text-gray-800 mb-3">Actividad</h3>
            <div class="space-y-3">
              <div class="flex gap-3">
                <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span class="text-xs font-medium">{{ task.assignee?.charAt(0) || 'U' }}</span>
                </div>
                <div class="flex-1">
                  <div class="bg-gray-50 rounded-lg p-3">
                    <p class="text-sm text-gray-600">Tarea creada</p>
                    <p class="text-xs text-gray-500 mt-1">{{ formatDate(task.created_at) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar con información -->
        <div class="w-80 bg-gray-50 p-6 border-l border-gray-200">
          <div class="space-y-6">
            <!-- Información de la tarea -->
            <div>
              <h4 class="text-sm font-semibold text-gray-800 mb-3">Información</h4>
              <div class="space-y-3">
                <!-- Asignado a -->
                <div>
                  <p class="text-xs text-gray-600 mb-1">Asignado a</p>
                  <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span class="text-white text-sm font-medium">
                        {{ task.assignee?.charAt(0) || 'U' }}
                      </span>
                    </div>
                    <span class="text-sm text-gray-800">{{ task.assignee || 'Sin asignar' }}</span>
                  </div>
                </div>

                <!-- Fecha de vencimiento -->
                <div v-if="task.due_date">
                  <p class="text-xs text-gray-600 mb-1">Fecha de vencimiento</p>
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span class="text-sm text-gray-800">{{ formatDate(task.due_date) }}</span>
                  </div>
                </div>

                <!-- Fecha de creación -->
                <div>
                  <p class="text-xs text-gray-600 mb-1">Creada</p>
                  <div class="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm text-gray-800">{{ formatDate(task.created_at) }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Acciones -->
            <div>
              <h4 class="text-sm font-semibold text-gray-800 mb-3">Acciones</h4>
              <div class="space-y-2">
                <!-- Documentos -->
                <button 
                  @click="openDocuments"
                  class="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  Documentos
                  <span v-if="task.documents_count && task.documents_count > 0" class="ml-auto bg-gray-300 text-gray-700 text-xs px-2 py-1 rounded-full">
                    {{ task.documents_count }}
                  </span>
                </button>

                <!-- Editar -->
                <button 
                  @click="editTask"
                  class="w-full text-left p-2 text-sm text-gray-700 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>

                <!-- Eliminar -->
                <button 
                  @click="deleteTask"
                  class="w-full text-left p-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { KanbanTask } from '../types/index';

// Props
const props = defineProps<{
  isOpen: boolean;
  task: KanbanTask;
}>();

// Emits
const emit = defineEmits<{
  close: [];
  openDocuments: [taskId: number];
  editTask: [taskId: number];
  deleteTask: [taskId: number];
}>();

// Estado local para subtareas (mock data por ahora)
const mockSubtasks = ref([
  { text: 'Revisar documentación', completed: true },
  { text: 'Implementar funcionalidad', completed: true },
  { text: 'Realizar pruebas', completed: false },
  { text: 'Documentar cambios', completed: false }
]);

// Computed properties
const totalSubtasks = computed(() => mockSubtasks.value.length);
const completedSubtasks = computed(() => mockSubtasks.value.filter(s => s.completed).length);
const subtaskProgress = computed(() => {
  if (totalSubtasks.value === 0) return 0;
  return Math.round((completedSubtasks.value / totalSubtasks.value) * 100);
});

// Métodos
function closeModal() {
  emit('close');
}

function toggleSubtask(index: number) {
  mockSubtasks.value[index].completed = !mockSubtasks.value[index].completed;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    year: 'numeric',
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function openDocuments() {
  emit('openDocuments', props.task.id);
}

function editTask() {
  emit('editTask', props.task.id);
  // Aquí podrías abrir un modal de edición
}

function deleteTask() {
  if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
    emit('deleteTask', props.task.id);
  }
}
</script>

<style scoped>
/* Estilos para scroll personalizado */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animaciones */
.transition-all {
  transition: all 0.3s ease;
}
</style>