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
                <!-- Botón de documentos de la fase -->
                <button 
                  @click="togglePhaseDocuments(phase.id)"
                  class="text-white hover:bg-black hover:bg-opacity-20 rounded p-1 transition-colors relative"
                  title="Documentos de la fase"
                >
                  📎
                  <span v-if="phase.documents_count && phase.documents_count > 0" class="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {{ phase.documents_count }}
                  </span>
                </button>
                <!-- Menú de la fase -->
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
                class="bg-gray-600 rounded-lg p-4 shadow-sm border border-gray-500 cursor-move hover:shadow-md transition-shadow text-white"
                draggable="true"
                @dragstart="handleDragStart($event, task)"
                @dragend="handleDragEnd"
              >
                <!-- Header de la tarea -->
                <div class="flex justify-between items-start mb-2">
                  <h4 class="font-semibold text-gray-100 text-sm leading-tight">{{ task.title }}</h4>
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
                      class="text-gray-300 hover:text-gray-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <!-- Descripción de la tarea -->
                <p v-if="task.description" class="text-gray-300 text-xs mb-3 line-clamp-2">
                  {{ task.description }}
                </p>

                <!-- Tags -->
                <div v-if="task.tags && task.tags.length > 0" class="flex flex-wrap gap-1 mb-3">
                  <span 
                    v-for="tag in task.tags" 
                    :key="tag"
                    class="bg-blue-600 text-blue-200 text-xs px-2 py-1 rounded-full"
                  >
                    {{ tag }}
                  </span>
                </div>

                <!-- Footer de la tarea -->
                <div class="flex justify-between items-center text-xs text-gray-400">
                  <div class="flex items-center gap-2">
                    <span v-if="task.assignee">{{ task.assignee }}</span>
                    <span v-if="task.due_date" class="text-orange-400">
                      {{ formatDate(task.due_date) }}
                    </span>
                  </div>
                  <!-- Botón de documentos de la tarea -->
                  <button 
                    @click="toggleTaskDocuments(task.id)"
                    class="text-gray-300 hover:text-gray-100 transition-colors relative"
                    title="Documentos de la tarea"
                  >
                    📎
                    <span v-if="task.documents_count && task.documents_count > 0" class="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                      {{ task.documents_count }}
                    </span>
                  </button>
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
    :projectId="proyectoId"
    @close="showCreateTaskModal = false; selectedPhaseId = null"
    @created="handleTaskCreated"
  />

  <!-- Modal para crear fase -->
  <CreatePhaseModal 
    v-if="showCreatePhaseModal"
    :projectId="proyectoId"
    @close="showCreatePhaseModal = false"
    @created="handlePhaseCreated"
  />

  <!-- Modal para documentos de fase -->
  <DocumentsModal
    v-if="documentPanelOpen !== null"
    :phase-id="documentPanelOpen"
    :title="`Documentos de la Fase`"
    :subtitle="getPhaseNameById(documentPanelOpen)"
    @close="documentPanelOpen = null"
    @uploaded="handleDocumentUploaded"
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
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
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

// Tipos
import type { KanbanBoard, KanbanTask } from '../types/index';

// Configuración de etapas
import { getStageIcon } from '../config/research-stages';

const router = useRouter();
const toast = useToast();

// Estados reactivos
const proyectoId = ref(Number(props.id));
const projectTitle = ref<string>('Cargando proyecto...');
const loading = ref(false);
const kanbanBoard = ref<KanbanBoard | null>(null);
const draggedTask = ref<KanbanTask | null>(null);

// Estados de modales
const showCreateTaskModal = ref(false);
const showCreatePhaseModal = ref(false);
const selectedPhaseId = ref<number | null>(null);

// Estados para documentos
const documentPanelOpen = ref<number | null>(null);
const taskDocumentPanelOpen = ref<number | null>(null);

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
    const response = await axios.get(`http://localhost:8000/api/v1/proyectos/${proyectoId.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    projectTitle.value = response.data.name || 'Proyecto sin título';
  } catch (error) {
    console.error('Error al cargar proyecto:', error);
    toast.error('Error al cargar los datos del proyecto');
    projectTitle.value = `Proyecto ${proyectoId.value}`;
  }
}

// Carga paralela optimizada
async function fetchKanbanBoard() {
  loading.value = true;
  try {
    const token = localStorage.getItem('access_token');
    
    // Cargar información básica de las fases
    const phasesResponse = await axios.get(`http://localhost:8000/api/v1/proyectos/${proyectoId.value}/phases`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    const projectData = phasesResponse.data;
    const phases = projectData.phases || [];

    // Carga paralela de tareas para cada fase
    const taskPromises = phases.map(async (phase: any) => {
      try {
        const tasksResponse = await axios.get(`http://localhost:8000/api/v1/fases/${phase.id}/tareas`, {
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
    }  } catch (error) {
    console.error('💥 Error crítico al cargar tablero Kanban:', error);
    toast.error('Error al cargar el tablero Kanban');
    
    // Fallback: Crear estructura básica vacía
    kanbanBoard.value = {
      id: 0,
      project_id: proyectoId.value,
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
    const response = await axios.get(`http://localhost:8000/api/v1/fases/${phaseId}/tareas`, {
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

async function handleDrop(event: DragEvent, targetPhaseId: number) {
  event.preventDefault();
  
  if (!draggedTask.value || draggedTask.value.phase_id === targetPhaseId) {
    return;
  }

  try {
    const token = localStorage.getItem('access_token');
    await axios.put(`http://localhost:8000/api/v1/tareas/${draggedTask.value.id}`, {
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

// Mostrar menús contextuales (placeholder)
function showTaskMenu(taskId: number) {
  console.log('Mostrar menú de tarea:', taskId);
  
}

function showPhaseMenu(phaseId: number) {
  console.log('Mostrar menú de fase:', phaseId);
  // Implementar menú contextual de fase
}

// Función para abrir modal de crear tarea con fase preseleccionada
function openCreateTaskModal(phaseId: number) {
  selectedPhaseId.value = phaseId;
  showCreateTaskModal.value = true;
}

// Métodos para manejo de documentos
function togglePhaseDocuments(phaseId: number) {
  if (documentPanelOpen.value === phaseId) {
    documentPanelOpen.value = null;
  } else {
    documentPanelOpen.value = phaseId;
    // TODO: Cargar documentos de la fase
    console.log('Cargar documentos de la fase:', phaseId);
  }
}

function toggleTaskDocuments(taskId: number) {
  if (taskDocumentPanelOpen.value === taskId) {
    taskDocumentPanelOpen.value = null;
  } else {
    taskDocumentPanelOpen.value = taskId;
    // TODO: Cargar documentos de la tarea
    console.log('Cargar documentos de la tarea:', taskId);
  }
}

// Métodos auxiliares para los modals de documentos
function getPhaseNameById(phaseId: number): string {
  const phase = kanbanBoard.value?.phases.find(p => p.id === phaseId);
  return phase ? phase.name : 'Fase';
}

function getTaskNameById(taskId: number): string {
  for (const phase of kanbanBoard.value?.phases || []) {
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
    proyectoId.value = Number(newId);
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