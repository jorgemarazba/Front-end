<template>
  <aside class="project-sidebar bg-gray-900 text-white p-6 w-80 overflow-y-auto">
    <!-- 1. Nombre del semillero -->
    <div class="mb-6">
      <h2 class="text-xl font-bold text-blue-300">
        {{ semilleroName }}
      </h2>
    </div>

    <!-- 2. Nombre de la institución -->
    <div class="mb-6">
      <p class="text-gray-300 text-sm">
        {{ institucionName }}
      </p>
    </div>

    <!-- 3. Proyectos activos -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">Proyectos Activos</h3>
        <button 
          @click="toggleProyectos"
          class="text-gray-400 hover:text-white transition-colors p-1"
          :title="proyectosExpanded ? 'Contraer' : 'Expandir'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200" 
               :class="{ 'rotate-180': proyectosExpanded }" 
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <!-- Lista de proyectos -->
      <div v-show="proyectosExpanded" class="space-y-3">
        <div 
          v-for="proyecto in proyectosPaginados" 
          :key="proyecto.id"
          class="flex items-center gap-3 p-2 hover:bg-gray-800 rounded cursor-pointer"
          @click="selectProject(proyecto.id)"
        >
          <!-- Cuadro de color aleatorio -->
          <div 
            class="w-4 h-4 rounded"
            :style="{ backgroundColor: proyecto.color }"
          ></div>
          <!-- Nombre del proyecto -->
          <span class="text-sm text-gray-200 truncate">{{ proyecto.nombre }}</span>
        </div>
      </div>

      <!-- Paginador si hay más de 3 proyectos -->
      <div v-if="totalProyectos > 3" class="flex justify-center items-center mt-3 gap-2">
        <!-- Botón anterior -->
        <button
          @click="previousPage"
          :disabled="currentPage === 1"
          class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ← Ant
        </button>
        
        <!-- Contador de páginas con fondo negro redondeado -->
        <div class="bg-black text-white px-2 py-1 rounded-full text-xs font-medium">
          {{ currentPage }}/{{ totalPages }}
        </div>
        
        <!-- Botón siguiente -->
        <button
          @click="nextPage"
          :disabled="currentPage === totalPages"
          class="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Sig →
        </button>
      </div>
    </div>

    <!-- 4. Áreas de Investigación -->
    <div class="mb-8">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-white">Áreas de Investigación</h3>
        <button 
          @click="toggleAreas"
          class="text-gray-400 hover:text-white transition-colors p-1"
          :title="areasExpanded ? 'Contraer' : 'Expandir'"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 transition-transform duration-200" 
               :class="{ 'rotate-180': areasExpanded }" 
               fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
      
      <div v-show="areasExpanded" class="space-y-2">
        <!-- Primera fila: 2 columnas -->
        <div class="grid grid-cols-2 gap-2">
          <div 
            v-for="carrera in carreras.slice(0, 2)" 
            :key="carrera.id"
            class="flex justify-center"
          >
            <span
              class="rounded transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg text-sm text-white font-medium whitespace-nowrap"
              :style="{ backgroundColor: carrera.color }"
            >{{ carrera.nombre }}</span>
          </div>
        </div>
        
        <!-- Resto de filas: 3 columnas cada una -->
        <div class="grid grid-cols-3 gap-2">
          <div 
            v-for="carrera in carreras.slice(2)" 
            :key="carrera.id"
            class="flex justify-center"
          >
            <span
              class="rounded transition-all duration-200 cursor-pointer hover:scale-105 hover:shadow-lg text-sm text-white font-medium whitespace-nowrap"
              :style="{ backgroundColor: carrera.color }"
            >{{ carrera.nombre }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. Recuadro especial - Asistente de IA -->
    <div class="mb-6">
      <div class="bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg p-4 relative overflow-hidden">
        <!-- Icono del robot en la esquina superior izquierda -->
        <div class="flex items-start gap-3">
          <div class="bg-white bg-opacity-20 p-2 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          
          <div class="flex-1">
            <!-- Título -->
            <h4 class="text-white font-bold text-lg mb-2">
              Asistente de IA Disponible
            </h4>
            
            <!-- Descripción -->
            <p class="text-white text-sm opacity-90 mb-4 leading-relaxed">
              El asistente de IA está listo para ayudarte con investigaciones científicas, revisión documental y más.
            </p>
            
            <!-- Botón Activar Asistente -->
            <button 
              @click="activarAsistente"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Activar Asistente
            </button>
          </div>
        </div>
        
        <!-- Decoración de fondo -->
        <div class="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10"></div>
        <div class="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-5 rounded-full -ml-8 -mb-8"></div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

// Props
defineProps({
  projectId: {
    type: [String, Number],
    default: null
  }
});

// Emits
const emit = defineEmits(['projectSelected']);

// Router
const router = useRouter();

// Data reactiva
const semilleroName = ref('Semillero de Investigación IA+');
const institucionName = ref('Universidad Tecnológica Nacional');
const currentPage = ref(1);
const proyectosPerPage = 3; // Mínimo de 3 proyectos activos

// Estados de expansión para las secciones
const proyectosExpanded = ref(true); // Por defecto expandido
const areasExpanded = ref(true); // Por defecto expandido

// Proyectos activos (se cargarán desde la API)
const proyectosActivos = ref<Array<{id: number, nombre: string, color: string}>>([]);

// Áreas de investigación optimizadas para aprovechar el espacio
const carreras = ref([
  { id: 1, nombre: 'Ing. de Sistemas', usos: 12, color: '#3B82F6' },
  { id: 2, nombre: 'Ing. Industrial', usos: 8, color: '#EF4444' },
  { id: 3, nombre: 'Admin. de Empresas', usos: 5, color: '#10B981' },
  { id: 4, nombre: 'Psicología', usos: 3, color: '#F59E0B' },
  { id: 5, nombre: 'Medicina', usos: 7, color: '#8B5CF6' },
  { id: 6, nombre: 'Derecho', usos: 2, color: '#EC4899' },
  { id: 7, nombre: 'Contaduría', usos: 4, color: '#06B6D4' },
  { id: 8, nombre: 'Arquitectura', usos: 6, color: '#84CC16' },
  { id: 9, nombre: 'Marketing', usos: 3, color: '#F97316' },
  { id: 10, nombre: 'Enfermería', usos: 5, color: '#A855F7' },
  { id: 11, nombre: 'Educación', usos: 4, color: '#22D3EE' },
  { id: 12, nombre: 'Comunicación', usos: 2, color: '#FB7185' },
  { id: 13, nombre: 'Ing. Civil', usos: 6, color: '#FBBF24' },
  { id: 14, nombre: 'Economía', usos: 3, color: '#34D399' },
  { id: 15, nombre: 'Biología', usos: 4, color: '#818CF8' },
  { id: 16, nombre: 'Química', usos: 2, color: '#F472B6' },
]);

// Computed properties
const totalProyectos = computed(() => proyectosActivos.value.length);
const totalPages = computed(() => Math.ceil(totalProyectos.value / proyectosPerPage));

const proyectosPaginados = computed(() => {
  const start = (currentPage.value - 1) * proyectosPerPage;
  const end = start + proyectosPerPage;
  return proyectosActivos.value.slice(start, end);
});

// Methods
function selectProject(projectId: number) {
  // Navegar directamente al proyecto seleccionado usando Vue Router
  router.push(`/proyecto/${projectId}`);
  // También emitir el evento por si el componente padre necesita saberlo
  emit('projectSelected', projectId);
}

// Función para activar el asistente de IA
function activarAsistente() {
  // Aquí puedes implementar la lógica para activar el asistente
  console.log('Activando asistente de IA...');
  // Ejemplo: abrir modal, redirigir a chat, etc.
}

// Funciones para expandir/contraer secciones
function toggleProyectos() {
  proyectosExpanded.value = !proyectosExpanded.value;
}

function toggleAreas() {
  areasExpanded.value = !areasExpanded.value;
}

// Funciones de paginación
function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}

// Función para generar colores aleatorios
function generateRandomColor(): string {
  const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Función para cargar proyectos activos desde la API
async function fetchProyectosActivos() {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No hay token de autenticación');
      proyectosActivos.value = [];
      return;
    }

    const response = await axios.get('http://127.0.0.1:8000/api/v1/proyectos', {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Mapear los proyectos reales del usuario y asignar colores aleatorios
    if (response.data && Array.isArray(response.data)) {
      proyectosActivos.value = response.data.map((proyecto: any) => ({
        id: proyecto.id,
        nombre: proyecto.name || `Proyecto ${proyecto.id}`,
        color: generateRandomColor()
      }));
      console.log('Proyectos cargados:', proyectosActivos.value);
    } else {
      proyectosActivos.value = [];
    }
  } catch (error) {
    console.error('Error al cargar proyectos del usuario:', error);
    proyectosActivos.value = [];
  }
}

onMounted(() => {
  fetchProyectosActivos();
  
  // Asignar colores aleatorios a carreras si no tienen
  carreras.value.forEach(carrera => {
    if (!carrera.color) {
      carrera.color = generateRandomColor();
    }
  });
});
</script>

<style scoped>
.project-sidebar {
  position: fixed;
  top: 104px; /* Altura del navbar (64px) + línea azul (40px) */
  left: 0;
  z-index: 999; /* Debajo del navbar pero sobre el contenido */
  height: calc(100vh - 104px); /* Altura completa menos navbar + línea azul */
}

/* Scrollbar personalizado */
.project-sidebar::-webkit-scrollbar {
  width: 6px;
}

.project-sidebar::-webkit-scrollbar-track {
  background: #374151;
}

.project-sidebar::-webkit-scrollbar-thumb {
  background: #6B7280;
  border-radius: 3px;
}

.project-sidebar::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}
</style>
