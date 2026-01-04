<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <ProjectSidebar 
      :projectId="projectId" 
      @projectSelected="handleProjectSelected" 
    />
    
    <!-- Contenido principal -->
    <div class="flex-1 ml-80 pt-28">
      <ProjectStagesNavbar 
        :projectTitle="projectTitle" 
        @crearEtapa="handleCreatePhase"
      />
      
      <!-- Header del Kanban Board -->
      <div class="p-6 border-b border-gray-200 bg-gray-900 bg-opacity-80">
        <div class="flex justify-between items-center">
          <div>
            <h1 class="text-3xl font-bold text-white">Tablero Kanban</h1>
            <p class="text-gray-300 mt-1">{{ projectTitle }}</p>
          </div>
          <div class="flex gap-3">
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
      <div v-else class="p-6 bg-gray-500 min-h-screen">
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
              <div class="flex items-center gap-2">
                <!-- Indicador de error de carga con botón de retry -->
                <div 
                  v-if="phase.loading_error"
                  class="flex items-center gap-1"
                >
                  <span 
                    class="text-yellow-300 cursor-help"
                    title="Error al cargar tareas de esta fase"
                  >
                    ⚠️
                  </span>
                  <button
                    @click="refreshPhase(phase.id)"
                    class="text-yellow-300 hover:text-yellow-100 text-xs bg-black bg-opacity-20 px-2 py-1 rounded transition-colors"
                    title="Reintentar carga"
                  >
                    🔄
                  </button>
                </div>
                <!-- Botón de opciones -->
                <button 
                  @click="showPhaseMenu(phase.id)"
                  class="text-white hover:bg-black hover:bg-opacity-20 rounded p-1 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Área de tareas -->
            <div 
              class="bg-gray-700 rounded-b-lg min-h-[500px] p-4 space-y-3"
              :data-phase-id="phase.id"
              @dragover.prevent
              @drop="handleDrop($event, phase.id)"
            >
              <!-- Mensaje de error de carga -->
              <div 
                v-if="phase.loading_error && phase.tasks.length === 0"
                class="bg-yellow-900 border border-yellow-700 rounded-lg p-3 text-center"
              >
                <div class="text-yellow-300 text-sm">
                  ⚠️ Error al cargar las tareas de esta fase
                </div>
                <button
                  @click="refreshPhase(phase.id)"
                  class="mt-2 text-yellow-300 hover:text-yellow-100 text-xs underline"
                >
                  Reintentar carga
                </button>
              </div>

              <!-- Tareas -->
              <div 
                v-for="task in phase.tasks" 
                :key="task.id"
                class="bg-gray-600 rounded-lg p-3 shadow-sm border border-gray-500 cursor-pointer hover:shadow-md hover:bg-gray-550 transition-all text-white"
                draggable="true"
                @dragstart="handleDragStart($event, task)"
                @dragend="handleDragEnd"
                @click="handleTaskClick($event, task)"
              >
                <!-- Header compacto con avatar y menú -->
                <div class="flex justify-between items-center mb-2">
                  <!-- Avatar de la persona encargada -->
                  <div class="flex items-center gap-2">
                    <div 
                      class="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                      :class="getAvatarColor(task.assignee || '')"
                    >
                      {{ getAssigneeInitials(task.assignee || '') }}
                    </div>
                    <span class="text-xs text-gray-300">{{ task.assignee || 'Sin asignar' }}</span>
                  </div>
                  
                  <!-- Menú de la tarea -->
                  <button 
                    @click.stop="showTaskMenu(task.id)"
                    class="text-gray-300 hover:text-gray-100 transition-colors p-1 rounded"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                    </svg>
                  </button>
                </div>

                <!-- Descripción (principal) -->
                <p v-if="task.description" class="text-gray-100 text-sm mb-3 line-clamp-3 leading-relaxed">
                  {{ task.description }}
                </p>
                <p v-else class="text-gray-400 text-sm mb-3 italic">Sin descripción</p>

                <!-- Footer con fecha y contador de subtareas -->
                <div class="flex justify-between items-center text-xs">
                  <!-- Fecha de creación -->
                  <div class="flex items-center gap-1 text-gray-300">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{{ formatShortDate(task.created_at) }}</span>
                  </div>

                  <!-- Indicadores de progreso -->
                  <div class="flex items-center gap-2">
                    <!-- Contador de subtareas -->
                    <div v-if="task.subtasks_count && task.subtasks_count > 0" class="flex items-center gap-1 bg-gray-500 bg-opacity-50 px-2 py-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                      <span class="text-gray-300">{{ task.completed_subtasks || 0 }}/{{ task.subtasks_count }}</span>
                    </div>

                    <!-- Indicador de documentos -->
                    <button 
                      v-if="task.documents_count && task.documents_count > 0"
                      @click.stop="toggleTaskDocuments(task.id)"
                      class="flex items-center gap-1 bg-blue-500 bg-opacity-50 px-2 py-1 rounded-full hover:bg-opacity-70 transition-colors"
                      title="Documentos de la tarea"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <span class="text-blue-300">{{ task.documents_count }}</span>
                    </button>

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
                  </div>
                </div>
              </div>

              <!-- Botón/Formulario para agregar tarea estilo Trello -->
              <div class="add-task-container">
                <!-- Botón para mostrar formulario -->
                <button 
                  @click="openCreateTaskModal(phase.id)"
                  class="w-full text-left p-2 text-white hover:text-gray-200 hover:bg-gray-600 rounded-lg transition-colors text-sm"
                >
                  + Agregar nueva tarea
                </button>
              </div>
            </div>
          </div>

          <!-- Columna para agregar nueva fase -->
          <div class="flex-shrink-0 w-80">
            <button 
              @click="showCreatePhaseModal = true"
              class="w-full h-20 border-2 border-dashed border-gray-500 rounded-lg text-white hover:border-gray-300 hover:text-gray-200 transition-colors flex items-center justify-center gap-2"
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
    :projectId="projectId"
    @close="showCreateTaskModal = false; selectedPhaseId = null"
    @created="handleTaskCreated"
  />

  <!-- Modal para crear fase -->
  <CreatePhaseModal 
    v-if="showCreatePhaseModal"
    :projectId="projectId"
    @close="showCreatePhaseModal = false"
    @created="handlePhaseCreated"
  />

  <!-- Modal para documentos de tarea -->
  <DocumentsModal
    v-if="taskDocumentPanelOpen !== null"
    :task-id="taskDocumentPanelOpen"
    :title="`Documentos de la Tarea`"
    :subtitle="getTaskNameById(taskDocumentPanelOpen)"
    @close="taskDocumentPanelOpen = null"
    @uploaded="handleDocumentUploaded"
  />

  <!-- Modal para detalle de tarea -->
  <TaskDetailModal
    v-if="showTaskDetailModal && selectedTask"
    :isOpen="showTaskDetailModal"
    :task="selectedTask"
    @close="closeTaskDetail"
    @editTask="handleTaskUpdated"
    @deleteTask="handleTaskDeleted"
    @openDocuments="toggleTaskDocuments"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useToast } from 'vue-toastification';

// Props del router
const props = defineProps<{
  id: string;
}>();

// Componentes
import ProjectSidebar from '@/components/ProjectSidebar.vue';
import ProjectStagesNavbar from '@/components/ProjectStagesNavbar.vue';
import CreateTaskModal from '@/components/CreateTaskModal.vue';
import CreatePhaseModal from '@/components/CreatePhaseModal.vue';
import DocumentsModal from '@/components/DocumentsModal.vue';
import TaskDetailModal from '@/components/TaskDetailModal.vue';

// Tipos
import type { KanbanBoard, KanbanTask } from '../types/index';

// Configuración de etapas
import { getStageIcon } from '../config/research-stages';

const router = useRouter();
const toast = useToast();

// Estados reactivos
const projectId = ref(Number(props.id));
const projectTitle = ref<string>('Cargando proyecto...');
const loading = ref(false);
const kanbanBoard = ref<KanbanBoard | null>(null);
const draggedTask = ref<KanbanTask | null>(null);

// Estados de modales
const showCreateTaskModal = ref(false);
const showCreatePhaseModal = ref(false);
const selectedPhaseId = ref<number | null>(null);

// Estados para documentos (solo para tareas)
const taskDocumentPanelOpen = ref<number | null>(null);

// Estados para modal de detalle de tarea
const showTaskDetailModal = ref(false);
const selectedTask = ref<KanbanTask | null>(null);

// Función para obtener icono de fase (reutilizando del sistema actual)
function getPhaseIcon(phaseName: string): string {
  return getStageIcon(phaseName);
}

// Cargar datos del proyecto
async function fetchProjectData() {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`/api/v1/proyectos/${projectId.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    projectTitle.value = response.data.name || 'Proyecto sin título';
  } catch (error) {
    console.error('Error al cargar proyecto:', error);
    toast.error('Error al cargar los datos del proyecto');
    projectTitle.value = `Proyecto ${projectId.value}`;
  }
}

// Carga paralela optimizada
async function fetchKanbanBoard() {
  loading.value = true;
  try {
    const token = localStorage.getItem('access_token');
    
    // Cargar información básica de las fases
    const phasesResponse = await axios.get(`/api/v1/proyectos/${projectId.value}/phases`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const projectData = phasesResponse.data;
    const phases = projectData.phases || [];

    // Carga paralela de tareas para cada fase
    const taskPromises = phases.map(async (phase: any) => {
      try {
        const tasksResponse = await axios.get(`/api/v1/fases/${phase.id}/tareas`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return {
          phaseId: phase.id,
          tasks: tasksResponse.data || [],
          success: true
        };
      } catch (error) {
        return {
          phaseId: phase.id,
          tasks: [],
          success: false
        };
      }
    });

    // Ejecutar todas las cargas de tareas en paralelo
    const taskResults = await Promise.all(taskPromises);
    
    //Fusionar tareas con fases
    const phasesWithTasks = phases.map((phase: any) => {
      const taskResult = taskResults.find(result => result.phaseId === phase.id);
      const tasks = taskResult?.tasks || [];
      
      return {
        ...phase,
        tasks: tasks,
        task_count: tasks.length,
        loading_error: !taskResult?.success
      };
    });

    // Crear estructura final del tablero
    kanbanBoard.value = {
      id: projectData.id,
      project_id: projectData.id,
      phases: phasesWithTasks,
      created_at: projectData.created_at || new Date().toISOString(),
      updated_at: projectData.updated_at || new Date().toISOString()
    };

    // Estadísticas de carga
    const phasesWithErrors = phasesWithTasks.filter((phase: any) => phase.loading_error).length;
    
    if (phasesWithErrors > 0) {
      toast.warning(`Tablero cargado con ${phasesWithErrors} fases con errores`);
    } else {
      toast.success('Tablero Kanban cargado exitosamente');
    }

    // AGREGAR ESTA LÍNEA para forzar re-renderizado:
    await nextTick();
  } catch (error) {
    console.error('💥 Error crítico al cargar tablero Kanban:', error);
    toast.error('Error al cargar el tablero Kanban');
    
    // Fallback: Crear estructura básica vacía
    kanbanBoard.value = {
      id: 0,
      project_id: projectId.value,
      phases: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  } finally {
    loading.value = false;
  }
}

// Actualizar tablero completo
async function refreshBoard() {
  await fetchKanbanBoard();
  toast.success('Tablero actualizado');
}

// Recargar tareas de una fase específica (útil para manejar errores)
async function refreshPhase(phaseId: number) {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`/api/v1/fases/${phaseId}/tareas`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Actualizar solo la fase específica
    if (kanbanBoard.value) {
      const phaseIndex = kanbanBoard.value.phases.findIndex(p => p.id === phaseId);
      if (phaseIndex !== -1) {
        const phase = kanbanBoard.value.phases[phaseIndex];
        phase.tasks = response.data || [];
        phase.task_count = phase.tasks.length;
        phase.loading_error = false; // Limpiar error
        
        toast.success(`Fase "${phase.name}" actualizada exitosamente`);
      }
    }
  } catch (error) {
    console.error(`Error al recargar fase ${phaseId}:`, error);
    toast.error('Error al recargar la fase');
  }
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

// Handler para click en tarea (sin interferir con drag)
function handleTaskClick(_event: MouseEvent, task: KanbanTask) {
  // Solo abrir modal si no se está arrastrando
  if (!draggedTask.value) {
    openTaskDetail(task);
  }
}

async function handleDrop(event: DragEvent, targetPhaseId: number) {
  event.preventDefault();
  
  if (!draggedTask.value || draggedTask.value.phase_id === targetPhaseId) {
    return;
  }

  try {
    const token = localStorage.getItem('access_token');
    await axios.put(`/api/v1/tareas/${draggedTask.value.id}`, {
      phase_id: targetPhaseId
    }, {
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

// Manejar eventos de creación de tareas
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
  // Implementar creación de fase basada en etapa seleccionada
}

// Manejar selección de proyecto
function handleProjectSelected(newProjectId: number) {
  router.push(`/proyecto/${newProjectId}`);
}

// Mostrar menús contextuales
function showTaskMenu(taskId: number) {
  // TODO: Implementar menú contextual de tarea
  console.log('Mostrar menú de tarea:', taskId);
}

function showPhaseMenu(phaseId: number) {
  // TODO: Implementar menú contextual de fase
  console.log('Mostrar menú de fase:', phaseId);
}

// Función para abrir modal de detalle de tarea
function openTaskDetail(task: KanbanTask) {
  selectedTask.value = task;
  showTaskDetailModal.value = true;
}

// Función para cerrar modal de detalle de tarea
function closeTaskDetail() {
  selectedTask.value = null;
  showTaskDetailModal.value = false;
}

// Función para manejar actualización de tarea desde el modal
async function handleTaskUpdated(_taskId: number) {
  try {
    // Cerrar el modal y recargar el tablero para obtener los datos actualizados
    closeTaskDetail();
    await fetchKanbanBoard();
    toast.success('Tarea actualizada exitosamente');
  } catch (error) {
    console.error('Error al actualizar tarea:', error);
    toast.error('Error al actualizar la tarea');
  }
}

// Función para manejar eliminación de tarea desde el modal
function handleTaskDeleted(taskId: number) {
  // Encontrar y eliminar la tarea del tablero
  if (kanbanBoard.value) {
    for (const phase of kanbanBoard.value.phases) {
      const taskIndex = phase.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        phase.tasks.splice(taskIndex, 1);
        break;
      }
    }
  }
  
  closeTaskDetail();
  toast.success('Tarea eliminada exitosamente');
}

// Función para formatear fecha en formato corto
function formatShortDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric',
    month: 'short'
  });
}

// Función para obtener iniciales del asignado
function getAssigneeInitials(assignee: string): string {
  if (!assignee) return 'N/A';
  return assignee.split(' ')
    .map(name => name.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
}

// Función para obtener color del avatar basado en el nombre
function getAvatarColor(assignee: string): string {
  if (!assignee) return 'bg-gray-500';
  
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500',
    'bg-yellow-500', 'bg-indigo-500', 'bg-pink-500', 'bg-teal-500'
  ];
  
  const charCode = assignee.charCodeAt(0);
  return colors[charCode % colors.length];
}

// Función para abrir modal de crear tarea con fase preseleccionada
function openCreateTaskModal(phaseId: number) {
  selectedPhaseId.value = phaseId;
  showCreateTaskModal.value = true;
}

// Métodos para manejo de documentos de tareas
function toggleTaskDocuments(taskId: number) {
  if (taskDocumentPanelOpen.value === taskId) {
    taskDocumentPanelOpen.value = null;
  } else {
    taskDocumentPanelOpen.value = taskId;
    // Los documentos se cargan automáticamente cuando se abre el modal
  }
}

// Métodos auxiliares para los modals de documentos de tareas
function getTaskNameById(taskId: number): string {
  if (!kanbanBoard.value?.phases) return 'Tarea';
  
  for (const phase of kanbanBoard.value.phases) {
    const task = phase.tasks.find(t => t.id === taskId);
    if (task) return task.title;
  }
  return 'Tarea';
}

function handleDocumentUploaded() {
  // Recargar el tablero para actualizar los contadores de documentos
  fetchKanbanBoard();
}

// Función para cargar todos los datos del proyecto
function loadProjectData() {
  fetchProjectData();
  fetchKanbanBoard();
}

// Observar cambios en el prop id para recargar datos
watch(() => props.id, (newId) => {
  if (newId) {
    projectId.value = Number(newId);
    loadProjectData();
  }
}, { immediate: false });

onMounted(() => {
  loadProjectData();
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

/* Estilos para contenedor de agregar tarea */
.add-task-container {
  margin-top: 8px;
}

/* Estilos para badges de documentos */
.badge, .badge-small {
  font-size: 10px;
  line-height: 1;
  min-width: 16px;
  height: 16px;
}

.badge-small {
  font-size: 8px;
  min-width: 12px;
  height: 12px;
}

/* Hover effects para botones de documentos */
button[title*="Documentos"] {
  transition: all 0.2s ease;
}

button[title*="Documentos"]:hover {
  transform: scale(1.1);
}
</style>