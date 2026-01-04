<template>
  <div class="min-h-screen">
    <!-- Navbar de etapas de proyecto -->
    <ProjectStagesNavbar 
      project-title="Resultados de búsqueda"
    />
    
    <!-- Contenido principal con padding top para el navbar fijo -->
    <div class="pt-28 bg-gray-50 min-h-screen">
      <!-- Info de búsqueda -->
      <div class="px-6 py-4 bg-white border-b">
        <p class="text-sm text-gray-600">
          <span v-if="loading">Buscando</span>
          <span v-else-if="results.length > 0">{{ results.length }} resultado{{ results.length !== 1 ? 's' : '' }}</span>
          <span v-else>No se encontraron resultados</span>
          <span v-if="currentQuery"> para "<strong>{{ currentQuery }}</strong>"</span>
        </p>
      </div>

      <!-- Contenido principal -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Loading state -->
        <div v-if="loading" class="flex items-center justify-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <span class="ml-3 text-gray-600">Buscando proyectos...</span>
        </div>

        <!-- Resultados -->
        <div v-else-if="results.length > 0" class="space-y-4">
          <div
            v-for="project in results"
            :key="project.id"
            class="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            @click="goToProject(project.id)"
          >
            <div class="p-6">
              <div class="flex items-start justify-between">
                <div class="flex-1">
                  <!-- Título del proyecto -->
                  <h3 class="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                    {{ project.name }}
                  </h3>
                  
                  <!-- Descripción -->
                  <p v-if="project.description" class="text-gray-600 mb-3 line-clamp-2">
                    {{ project.description }}
                  </p>
                  
                  <!-- Metadata -->
                  <div class="flex items-center space-x-4 text-sm text-gray-500">
                    <span v-if="project.status" class="flex items-center">
                      <div 
                        class="w-2 h-2 rounded-full mr-2"
                        :class="{
                          'bg-green-500': project.status === 'active',
                          'bg-yellow-500': project.status === 'in_progress',
                          'bg-gray-500': project.status === 'completed',
                          'bg-red-500': project.status === 'cancelled'
                        }"
                      ></div>
                      {{ getStatusText(project.status) }}
                    </span>
                    
                    <span v-if="project.category" class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      {{ project.category }}
                    </span>
                    
                    <span v-if="project.institution" class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      {{ project.institution }}
                    </span>
                    
                    <span v-if="project.created_at" class="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {{ formatDate(project.created_at) }}
                    </span>
                  </div>
                </div>
                
                <!-- Icono de enlace -->
                <div class="ml-4">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-else-if="!loading" class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron proyectos</h3>
          <p class="text-gray-500 mb-6">
            No hay proyectos que coincidan con tu búsqueda "{{ currentQuery }}".
          </p>
          <div class="space-y-2 text-sm text-gray-500">
            <p>Intenta:</p>
            <ul class="list-disc list-inside space-y-1">
              <li>Verificar la ortografía</li>
              <li>Usar términos más generales</li>
              <li>Buscar por categoría o institución</li>
            </ul>
          </div>
        </div>

        <!-- Error state -->
        <div v-if="error" class="text-center py-12">
          <div class="bg-red-50 rounded-lg p-6 max-w-md mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-red-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h3 class="text-lg font-medium text-red-800 mb-2">Error en la búsqueda</h3>
            <p class="text-red-600 mb-4">{{ error }}</p>
            <button
              @click="performSearch"
              class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'
import { useToast } from 'vue-toastification'
import ProjectStagesNavbar from '@/components/ProjectStagesNavbar.vue'

interface Project {
  id: number
  name: string
  description?: string
  status?: string
  category?: string
  institution?: string
  created_at: string
}

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Estados reactivos
const loading = ref(false)
const results = ref<Project[]>([])
const currentQuery = ref('')
const error = ref('')

// Obtener query de la URL
onMounted(() => {
  currentQuery.value = (route.query.q as string) || ''
  if (currentQuery.value) {
    performSearch()
  }
})

// Watch para cambios en la query de la URL
watch(() => route.query.q, (newQuery) => {
  if (newQuery && newQuery !== currentQuery.value) {
    currentQuery.value = newQuery as string
    performSearch()
  }
})

// Realizar búsqueda
async function performSearch() {
  if (!currentQuery.value.trim()) return

  loading.value = true
  error.value = ''
  
  try {
    const token = localStorage.getItem('access_token')
    
    // TEMPORAL: Usar endpoint de proyectos existente para simular búsqueda
    const response = await axios.get(`/api/v1/proyectos/`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    
    // Filtrar proyectos localmente por el término de búsqueda
    const searchTerm = currentQuery.value.trim().toLowerCase()
    const filteredResults = response.data.filter((project: Project) => 
      project.name.toLowerCase().includes(searchTerm) ||
      (project.description && project.description.toLowerCase().includes(searchTerm)) ||
      (project.category && project.category.toLowerCase().includes(searchTerm)) ||
      (project.institution && project.institution.toLowerCase().includes(searchTerm))
    )
    
    results.value = filteredResults
    
  } catch (err: any) {
    console.error('Error en búsqueda:', err)
    error.value = err.response?.data?.detail || 'Error al realizar la búsqueda'
    results.value = []
    toast.error('Error al buscar proyectos')
  } finally {
    loading.value = false
  }
}

// Navegar al detalle del proyecto
function goToProject(projectId: number) {
  router.push(`/proyecto/${projectId}`)
}

// Formatear fecha
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Obtener texto del estado
function getStatusText(status: string): string {
  const statusMap: { [key: string]: string } = {
    'active': 'Activo',
    'in_progress': 'En progreso',
    'completed': 'Completado',
    'cancelled': 'Cancelado'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
/* Limitación de líneas para descripción */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>