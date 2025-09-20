<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <ProjectSidebar 
      :projectId="proyectoId" 
      @projectSelected="handleProjectSelected" 
    />
    
    <!-- Contenido principal -->
    <div class="flex-1 ml-80 pt-28">
      <ProjectStagesNavbar 
        :projectTitle="projectTitle" 
        @crearEtapa="handleCreatePhase"
      />
      
      <!-- Header del Kanban Board -->
      <div class="p-6 border-b border-gray-200">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-gray-900">Tablero Kanban</h1>
            <p class="text-gray-600 mt-1">{{ projectTitle }}</p>
          </div>
          <div class="flex gap-3">
            <button 
              @click="showCreateTaskModal = true"
              class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Nueva Tarea
            </button>
            <button 
              @click="refreshBoard"
              class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Actualizar
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="p-6">
        <div class="flex justify-center items-center h-64">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Cargando tablero...</span>
        </div>
      </div>

      <!-- Kanban Board -->
      <div v-else class="p-6">
        <div class="flex gap-6 overflow-x-auto min-h-[calc(100vh-300px)]">
          <!-- Columna por cada fase -->
          <div 
            v-for="phase in kanbanBoard?.phases || []" 
            :key="phase.id"
            class="flex-shrink-0 w-80"
          >
            <!-- Header de la columna -->
            <div 
              class="rounded-t-lg p-4 text-white font-bold text-lg flex items-center justify-between"
              :style="{ backgroundColor: phase.color }"
            >
              <div class="flex items-center gap-3">
                <div v-html="getPhaseIcon(phase.name)"></div>
                <span>{{ phase.name }}</span>
                <span class="bg-black bg-opacity-30 px-2 py-1 rounded-full text-sm">
                  {{ phase.tasks.length }}
                </span>
              </div>
              <button 
                @click="showPhaseMenu(phase.id)"
                class="text-white hover:bg-black hover:bg-opacity-20 rounded p-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                </svg>
              </button>
            </div>

            <!-- Área de tareas -->
            <div 
              class="bg-gray-100 rounded-b-lg min-h-[500px] p-4 space-y-3"
              :data-phase-id="phase.id"
              @dragover.prevent
              @drop="handleDrop($event, phase.id)"
            >
              <!-- Tareas -->
              <div 
                v-for="task in phase.tasks" 
                :key="task.id"
                class="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
                draggable="true"
                @dragstart="handleDragStart($event, task)"
                @dragend="handleDragEnd"
              >
                <!-- Header de la tarea -->
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-semibold text-gray-900 text-sm leading-tight">{{ task.title }}</h4>
                  <div class="flex items-center gap-1">
                    <!-- Indicador de prioridad -->
                    <div 
                      v-if="task.priority"
                      class="w-3 h-3 rounded-full"
                      :class="{
                        'bg-red-500': task.priority === 'high',
                        'bg-yellow-500': task.priority === 'medium', 
                        'bg-green-500': task.priority === 'low'
                      }"
                      :title="`Prioridad: ${task.priority}`"
                    ></div>
                    <!-- Menú de la tarea -->
                    <button 
                      @click="showTaskMenu(task.id)"
                      class="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Descripción de la tarea -->
                <p v-if="task.description" class="text-gray-600 text-xs mb-3 line-clamp-2">
                  {{ task.description }}
                </p>

                <!-- Tags -->
                <div v-if="task.tags && task.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
                  <span 
                    v-for="tag in task.tags" 
                    :key="tag"
                    class="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Footer de la tarea -->
                <div class="flex justify-between items-center text-xs text-gray-500">
                  <span v-if="task.assignee">{{ task.assignee }}</span>
                  <span v-if="task.due_date" class="text-orange-600">
                    {{ formatDate(task.due_date) }}
                  </span>
                </div>
              </div>

              <!-- Botón para agregar tarea -->
              <button 
                @click="openCreateTaskModal(phase.id)"
                class="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                Agregar tarea
              </button>
            </div>
          </div>

          <!-- Columna para agregar nueva fase -->
          <div class="flex-shrink-0 w-80">
            <button 
              @click="showCreatePhaseModal = true"
              class="w-full h-20 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Agregar fase
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal para crear tarea -->
  <CreateTaskModal 
    v-if="showCreateTaskModal"
    :phaseId="selectedPhaseId"
    :projectId="proyectoId"
    @close="showCreateTaskModal = false"
    @created="handleTaskCreated"
  />

  <!-- Modal para crear fase -->
  <CreatePhaseModal 
    v-if="showCreatePhaseModal"
    :projectId="proyectoId"
    @close="showCreatePhaseModal = false"
    @created="handlePhaseCreated"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';

// Componentes
import ProjectSidebar from '@/components/ProjectSidebar.vue';
import ProjectStagesNavbar from '@/components/ProjectStagesNavbar.vue';
import CreateTaskModal from '@/components/CreateTaskModal.vue';
import CreatePhaseModal from '@/components/CreatePhaseModal.vue';

// Tipos
import type { KanbanBoard, KanbanTask, KanbanPhase, MoveTaskRequest } from '../types/index';

// Configuración de etapas
import { RESEARCH_STAGES, getStageIcon } from '../config/research-stages';

const route = useRoute();
const router = useRouter();
const toast = useToast();

// Estados reactivos
const proyectoId = ref(Number(route.params.id));
const projectTitle = ref<string>('Cargando proyecto...');
const loading = ref(false);
const kanbanBoard = ref<KanbanBoard | null>(null);
const draggedTask = ref<KanbanTask | null>(null);

// Estados de modales
const showCreateTaskModal = ref(false);
const showCreatePhaseModal = ref(false);
const selectedPhaseId = ref<number | null>(null);

// Función para obtener icono de fase (reutilizando del sistema actual)
function getPhaseIcon(phaseName: string): string {
  return getStageIcon(phaseName);
}

// Función para formatear fecha
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    month: 'short', 
    day: 'numeric' 
  });
}

// Cargar datos del proyecto
async function fetchProjectData() {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/proyectos/${proyectoId.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    projectTitle.value = response.data.name || 'Proyecto sin título';
  } catch (error) {
    console.error('Error al cargar proyecto:', error);
    toast.error('Error al cargar los datos del proyecto');
  }
}

// Cargar tablero Kanban
async function fetchKanbanBoard() {
  loading.value = true;
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`http://127.0.0.1:8000/api/v1/proyectos/${proyectoId.value}/phases`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    kanbanBoard.value = response.data;
  } catch (error) {
    console.error('Error al cargar tablero Kanban:', error);
    toast.error('Error al cargar el tablero Kanban');
    // Fallback: crear tablero inicial basado en etapas predefinidas
    await createInitialBoard();
  } finally {
    loading.value = false;
  }
}

// Crear tablero inicial si no existe
async function createInitialBoard() {
  try {
    const initialPhases: KanbanPhase[] = RESEARCH_STAGES.slice(0, 4).map((stage, index) => ({
      id: index + 1,
      name: stage.nombre,
      description: stage.descripcion,
      color: stage.color,
      position: index,
      project_id: proyectoId.value,
      tasks: [],
      task_count: 0
    }));

    kanbanBoard.value = {
      id: 1,
      project_id: proyectoId.value,
      phases: initialPhases,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    toast.info('Tablero inicializado con fases predeterminadas');
  } catch (error) {
    console.error('Error al crear tablero inicial:', error);
  }
}

// Actualizar tablero
async function refreshBoard() {
  await fetchKanbanBoard();
  toast.success('Tablero actualizado');
}

// Manejo de drag and drop
function handleDragStart(event: DragEvent, task: KanbanTask) {
  draggedTask.value = task;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html', (event.target as HTMLElement).outerHTML);
  }
}

function handleDragEnd() {
  draggedTask.value = null;
}

async function handleDrop(event: DragEvent, targetPhaseId: number) {
  event.preventDefault();
  
  if (!draggedTask.value || draggedTask.value.phase_id === targetPhaseId) {
    return;
  }

  try {
    const moveRequest: MoveTaskRequest = {
      task_id: draggedTask.value.id,
      target_phase_id: targetPhaseId,
      new_position: 0 // Posición al final de la columna
    };

    const token = localStorage.getItem('access_token');
    await axios.patch(`http://127.0.0.1:8000/api/v1/proyectos/${proyectoId.value}/tasks/move`, moveRequest, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Actualizar estado local
    const sourcePhase = kanbanBoard.value?.phases.find(p => p.id === draggedTask.value!.phase_id);
    const targetPhase = kanbanBoard.value?.phases.find(p => p.id === targetPhaseId);
    
    if (sourcePhase && targetPhase) {
      const taskIndex = sourcePhase.tasks.findIndex(t => t.id === draggedTask.value!.id);
      if (taskIndex !== -1) {
        const [task] = sourcePhase.tasks.splice(taskIndex, 1);
        task.phase_id = targetPhaseId;
        targetPhase.tasks.push(task);
      }
    }

    toast.success('Tarea movida exitosamente');
  } catch (error) {
    console.error('Error al mover tarea:', error);
    toast.error('Error al mover la tarea');
  }
}

// Abrir modal de crear tarea
function openCreateTaskModal(phaseId?: number) {
  selectedPhaseId.value = phaseId || null;
  showCreateTaskModal.value = true;
}

// Manejar eventos de creación
function handleTaskCreated(newTask: KanbanTask) {
  showCreateTaskModal.value = false;
  selectedPhaseId.value = null;
  
  // Agregar la tarea directamente a la fase correspondiente
  if (kanbanBoard.value && newTask) {
    const targetPhase = kanbanBoard.value.phases.find(phase => phase.id === newTask.phase_id);
    if (targetPhase) {
      // Verificar que la tarea no exista ya para evitar duplicados
      const taskExists = targetPhase.tasks.some(task => task.id === newTask.id);
      if (!taskExists) {
        targetPhase.tasks.push(newTask);
        targetPhase.task_count = targetPhase.tasks.length;
      }
    } else {
      // Si no se encuentra la fase, recargar el tablero como fallback
      console.warn('Fase no encontrada, recargando tablero...');
      fetchKanbanBoard();
    }
  }
}

function handlePhaseCreated() {
  showCreatePhaseModal.value = false;
  fetchKanbanBoard();
}

function handleCreatePhase(etapa: {id: number, nombre: string, color: string}) {
  // Reutilizar el sistema actual de crear etapas para crear fases
  console.log('Crear fase desde etapa:', etapa);
  // TODO: Implementar creación de fase basada en etapa seleccionada
}

// Manejar selección de proyecto
function handleProjectSelected(newProjectId: number) {
  router.push(`/proyecto/${newProjectId}/kanban`);
}

// Mostrar menús contextuales (placeholder)
function showTaskMenu(taskId: number) {
  console.log('Mostrar menú de tarea:', taskId);
  // TODO: Implementar menú contextual de tarea
}

function showPhaseMenu(phaseId: number) {
  console.log('Mostrar menú de fase:', phaseId);
  // TODO: Implementar menú contextual de fase
}

onMounted(() => {
  fetchProjectData();
  fetchKanbanBoard();
});
</script>

<style scoped>
/* Estilos personalizados para drag and drop */
.dragging {
  opacity: 0.5;
  transform: rotate(5deg);
}

.drop-zone-active {
  background-color: #e0f2fe;
  border: 2px dashed #0284c7;
}

/* Limitación de líneas para texto */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Scrollbar personalizado para el área de tablero */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>