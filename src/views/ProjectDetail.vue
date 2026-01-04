<template>
  <div class="flex h-screen">
    <!-- Sidebar -->
    <ProjectSidebar 
      :projectId="proyectoId" 
      @projectSelected="handleProjectSelected" 
    />
    
    <!-- Contenido principal -->
    <div class="flex-1 ml-80 pt-28"> <!-- pt-28 = 7rem = 112px para margen superior -->
      <ProjectStagesNavbar 
        :projectTitle="projectTitle" 
        @crearEtapa="agregarTarjetaEtapa"
      />
      
      <!-- Área de tarjetas de etapas -->
      <div class="p-6">
        <div v-if="tarjetasEtapas.length > 0" class="mb-8">
          <h2 class="text-2xl font-bold mb-6">Etapas de Investigación</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div 
              v-for="tarjeta in tarjetasEtapas" 
              :key="tarjeta.id"
              class="bg-black rounded-lg p-6 shadow-lg"
            >
              <!-- Header con icono y título -->
              <div class="flex justify-between items-start mb-4">
                <div 
                  class="inline-flex items-center gap-2 px-3 py-2 rounded-lg"
                  :style="{ backgroundColor: tarjeta.color + '80' }"
                >
                  <div 
                    class="text-white"
                    v-html="getIconoEtapa(tarjeta.nombre)"
                  ></div>
                  <h3 class="font-bold text-lg text-white">{{ tarjeta.nombre }}</h3>
                </div>
                <button 
                  @click="eliminarTarjeta(tarjeta.id)"
                  class="text-gray-400 hover:text-red-400 font-bold text-xl"
                >
                  ×
                </button>
              </div>
              
              <!-- Descripción con fondo blanco -->
              <div class="bg-white rounded-lg p-3 mb-4">
                <p class="text-gray-800 text-sm">{{ tarjeta.descripcion }}</p>
              </div>
              
              <!-- Botones superiores -->
              <div class="flex items-center justify-between mb-4">
                <!-- Lado izquierdo: Botón + y texto -->
                <div class="flex items-center gap-2">
                  <button class="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded flex items-center justify-center transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                  <span class="text-gray-300 text-sm">Añade una tarjeta</span>
                </div>
                
                <!-- Lado derecho: Botón = -->
                <button class="bg-gray-700 hover:bg-gray-600 text-white w-8 h-8 rounded flex items-center justify-center transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a1.994 1.994 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                </button>
              </div>
              
              <!-- Botones inferiores -->
              <div class="flex gap-3">
                <!-- Botón Cargar Documento -->
                <button 
                  @click="openFileDialog"
                  :disabled="!BACKEND_ENDPOINTS.uploadDocuments"
                  :class="BACKEND_ENDPOINTS.uploadDocuments 
                    ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer' 
                    : 'bg-gray-400 cursor-not-allowed'"
                  class="flex items-center gap-2 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex-1"
                  :title="BACKEND_ENDPOINTS.uploadDocuments ? 'Cargar documento' : 'Funcionalidad no disponible - Backend en desarrollo'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {{ BACKEND_ENDPOINTS.uploadDocuments ? 'Cargar Documento' : 'No Disponible' }}
                </button>
                
                <!-- Botón Visualizar y Editar -->
                <button class="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-semibold transition-colors flex-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  Visualizar y Editar
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Lista de Documentos del Proyecto o Mensaje Informativo -->
        <div v-if="BACKEND_ENDPOINTS.fetchDocuments && documentos.length > 0" class="mb-8">
          <!-- Lista de documentos cuando esté implementado -->
          <h2 class="text-2xl font-bold mb-6 text-gray-800">Documentos del Proyecto</h2>
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="grid grid-cols-1 gap-1">
              <div 
                v-for="doc in documentos" 
                :key="doc.id"
                class="flex items-center justify-between p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
              >
                <!-- Información del documento -->
                <div class="flex items-center gap-4 flex-1">
                  <!-- Icono del tipo de archivo -->
                  <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold"
                       :class="{
                         'bg-red-500': getTipoArchivo(doc.nombre) === 'PDF',
                         'bg-blue-500': getTipoArchivo(doc.nombre) === 'Word',
                         'bg-orange-500': getTipoArchivo(doc.nombre) === 'PowerPoint',
                         'bg-green-500': getTipoArchivo(doc.nombre) === 'Excel',
                         'bg-gray-500': getTipoArchivo(doc.nombre) === 'Texto',
                         'bg-purple-500': getTipoArchivo(doc.nombre) === 'Imagen',
                         'bg-yellow-500': getTipoArchivo(doc.nombre) === 'CSV'
                       }">
                    {{ getTipoArchivo(doc.nombre).substring(0, 3).toUpperCase() }}
                  </div>
                  
                  <!-- Detalles del archivo -->
                  <div class="flex-1">
                    <h3 class="font-semibold text-gray-900 truncate">{{ doc.nombre }}</h3>
                    <div class="flex items-center gap-4 text-sm text-gray-500">
                      <span>{{ getTipoArchivo(doc.nombre) }}</span>
                      <span v-if="doc.tamaño">{{ formatTamaño(doc.tamaño) }}</span>
                      <span>{{ formatFecha(doc.fecha_carga) }}</span>
                    </div>
                  </div>
                </div>
                
                <!-- Acciones del documento -->
                <div class="flex items-center gap-2">
                  <!-- Botón Descargar -->
                  <button class="flex items-center gap-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded text-sm font-medium transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Descargar
                  </button>
                  
                  <!-- Botón Eliminar -->
                  <button 
                    v-if="BACKEND_ENDPOINTS.deleteDocuments"
                    @click="eliminarDocumento(doc.id)"
                    class="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-700 px-3 py-1 rounded text-sm font-medium transition-colors"
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
        
        <!-- Mensaje informativo cuando los endpoints no están disponibles -->
        <div v-if="!BACKEND_ENDPOINTS.uploadDocuments || !BACKEND_ENDPOINTS.fetchDocuments" class="mb-8">
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="text-yellow-800 font-semibold mb-2">Funcionalidad de Documentos en Desarrollo</h3>
                <p class="text-yellow-700 text-sm mb-3">
                  La gestión de documentos estará disponible cuando el backend implemente los siguientes endpoints:
                </p>
                <ul class="text-yellow-700 text-sm space-y-1 ml-4">
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    <code class="bg-yellow-100 px-2 py-1 rounded text-xs">POST /api/v1/proyectos/{id}/documentos</code>
                    <span class="text-xs">- Subir documentos</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    <code class="bg-yellow-100 px-2 py-1 rounded text-xs">GET /api/v1/proyectos/{id}/documentos</code>
                    <span class="text-xs">- Listar documentos</span>
                  </li>
                  <li class="flex items-center gap-2">
                    <span class="w-2 h-2 bg-yellow-400 rounded-full"></span>
                    <code class="bg-yellow-100 px-2 py-1 rounded text-xs">DELETE /api/v1/proyectos/{id}/documentos/{doc_id}</code>
                    <span class="text-xs">- Eliminar documentos</span>
                  </li>
                </ul>
                <p class="text-yellow-700 text-xs mt-3">
                  💡 Para habilitar cuando esté listo, cambiar <code>BACKEND_ENDPOINTS</code> en el código.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Input oculto para cargar archivos (necesario para la funcionalidad) -->
        <input 
          ref="fileInput" 
          type="file" 
          class="hidden" 
          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.csv,.rtf,.odt,.jpg,.jpeg,.png,.svg"
          @change="handleFileChange" 
        />
        
        <!-- Estados de carga (solo si hay archivos siendo procesados) -->
        <div v-if="uploadState !== 'idle'" class="max-w-3xl mx-auto mt-4">
          <div v-if="uploadState === 'loading'" class="text-blue-600 bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-center gap-2">
            <svg class="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Subiendo documento...
          </div>
          <div v-if="uploadState === 'success'" class="text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            ¡Documento subido con éxito!
          </div>
          <div v-if="uploadState === 'error'" class="text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Error al subir el documento. Verifique el formato y tamaño.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import ProjectStagesNavbar from '@/components/ProjectStagesNavbar.vue';
import ProjectSidebar from '@/components/ProjectSidebar.vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const proyectoId = ref(route.params.id);
const projectTitle = ref<string>('Cargando proyecto...');
const uploadState = ref<'idle' | 'loading' | 'success' | 'error'>('idle');
const fileInput = ref<HTMLInputElement | null>(null);
const documentos = ref<Array<{id: number, nombre: string, fecha_carga: string, tipo?: string, tamaño?: number}>>([]);

// Array para las tarjetas de etapas
const tarjetasEtapas = ref<Array<{
  id: number, 
  nombre: string, 
  color: string, 
  descripcion: string,
  contenido: string
}>>([]);

// Descripciones para cada etapa
const descripcionesEtapas: {[key: string]: string} = {
  'Seleccionar Tema': 'Define el tema principal de tu investigación',
  'Revisión de Bibliografía': 'Analiza fuentes académicas relevantes al tema',
  'Planteamiento del Problema': 'Formula claramente el problema a investigar',
  'Definir Objetivos': 'Establece objetivos generales y específicos',
  'Justificación y Delimitación': 'Justifica la importancia del estudio',
  'Marco Teórico': 'Construye el fundamento teórico de la investigación',
  'Metodología de la Investigación': 'Define el enfoque y métodos a utilizar',
  'Población y Muestra': 'Determina la población objetivo y muestra'
};

// Iconos para cada etapa
const iconosEtapas: {[key: string]: string} = {
  'Seleccionar Tema': `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>`,
  'Revisión de Bibliografía': `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>`,
  'Planteamiento del Problema': `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`,
  'Definir Objetivos': `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>`,
  'Justificación y Delimitación': `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
  </svg>`,
  'Marco Teórico': `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
  </svg>`,
  'Metodología de la Investigación': `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>`,
  'Población y Muestra': `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>`
};

function openFileDialog() {
  fileInput.value?.click();
}

// Función para obtener el icono de cada etapa
function getIconoEtapa(nombreEtapa: string): string {
  return iconosEtapas[nombreEtapa] || `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>`;
}

// Función para manejar la selección de proyecto desde el sidebar
function handleProjectSelected(newProjectId: number) {
  // Guardar las tarjetas del proyecto actual antes de cambiar
  saveTarjetasToStorage();
  router.push(`/proyecto/${newProjectId}`);
}

// Función para agregar una nueva tarjeta de etapa
function agregarTarjetaEtapa(etapa: {id: number, nombre: string, color: string}) {
  // Verificar si ya existe una tarjeta para esta etapa
  const existe = tarjetasEtapas.value.find(t => t.nombre === etapa.nombre);
  if (existe) {
    alert('Esta etapa ya ha sido agregada');
    return;
  }

  // Crear nueva tarjeta
  const nuevaTarjeta = {
    id: Date.now(), // ID único basado en timestamp
    nombre: etapa.nombre,
    color: etapa.color,
    descripcion: descripcionesEtapas[etapa.nombre] || 'Desarrolla esta etapa de investigación',
    contenido: ''
  };

  tarjetasEtapas.value.push(nuevaTarjeta);
  // Guardar en localStorage después de agregar
  saveTarjetasToStorage();
  console.log('Tarjeta creada:', nuevaTarjeta);
}

// Función para eliminar una tarjeta
function eliminarTarjeta(tarjetaId: number) {
  const index = tarjetasEtapas.value.findIndex(t => t.id === tarjetaId);
  if (index > -1) {
    tarjetasEtapas.value.splice(index, 1);
    // Guardar en localStorage después de eliminar
    saveTarjetasToStorage();
  }
}

// Función para guardar tarjetas en localStorage por proyecto
function saveTarjetasToStorage() {
  const key = `tarjetas_proyecto_${proyectoId.value}`;
  localStorage.setItem(key, JSON.stringify(tarjetasEtapas.value));
}

// Función para cargar tarjetas desde localStorage por proyecto
function loadTarjetasFromStorage() {
  const key = `tarjetas_proyecto_${proyectoId.value}`;
  const stored = localStorage.getItem(key);
  if (stored) {
    try {
      tarjetasEtapas.value = JSON.parse(stored);
    } catch (error) {
      console.error('Error al cargar tarjetas del almacenamiento:', error);
      tarjetasEtapas.value = [];
    }
  } else {
    tarjetasEtapas.value = [];
  }
}

// Función para obtener los datos del proyecto
async function fetchProjectData() {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`/api/v1/proyectos/${proyectoId.value}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    projectTitle.value = response.data.name || 'Proyecto Sin Nombre';
  } catch (error) {
    console.error('Error al obtener datos del proyecto:', error);
    projectTitle.value = 'Error al cargar proyecto';
  }
}

// NOTA: Los siguientes endpoints del backend deben estar implementados para funcionalidad completa de documentos:
// GET /api/v1/proyectos/{id}/documentos - Para obtener lista de documentos
// POST /api/v1/proyectos/{id}/documentos - Para subir documentos (puede estar implementado)
// DELETE /api/v1/proyectos/{id}/documentos/{doc_id} - Para eliminar documentos

// Configuración para habilitar/deshabilitar funcionalidades según disponibilidad del backend
const BACKEND_ENDPOINTS = {
  uploadDocuments: true, // POST - Habilitado según documentación del backend
  fetchDocuments: true, // GET - Habilitado según documentación del backend  
  deleteDocuments: true // DELETE - Habilitado según documentación del backend
};

// Función para cargar documentos del proyecto
async function fetchDocumentos() {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get(`/api/v1/proyectos/${proyectoId.value}/documentos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    documentos.value = response.data || [];
    console.log('Documentos cargados:', documentos.value);
  } catch (error: any) {
    // Si el endpoint no existe (404), simplemente inicializar array vacío sin mostrar error
    if (error.response && error.response.status === 404) {
      console.warn('Endpoint de documentos no implementado en el backend. Usando lista vacía.');
      documentos.value = [];
    } else {
      console.error('Error al cargar documentos:', error);
      documentos.value = [];
    }
  }
}

// Watcher para detectar cambios en la ruta y recargar datos
watch(() => route.params.id, (newId) => {
  if (newId) {
    proyectoId.value = newId;
    // Cargar las tarjetas específicas del nuevo proyecto
    loadTarjetasFromStorage();
    fetchProjectData();
    if (BACKEND_ENDPOINTS.fetchDocuments) {
      fetchDocumentos(); // Cargar documentos si el endpoint está disponible
    }
  }
});

// Watcher para guardar automáticamente cuando se modifique el contenido de las tarjetas
watch(tarjetasEtapas, () => {
  saveTarjetasToStorage();
}, { deep: true });

// Función para formatear fechas
function formatFecha(fecha: string): string {
  try {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return fecha; // Retornar fecha original si hay error
  }
}

// Función para formatear tamaño de archivo
function formatTamaño(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Función para obtener el tipo de archivo por extensión
function getTipoArchivo(nombre: string): string {
  const extension = nombre.split('.').pop()?.toLowerCase();
  const tipos: {[key: string]: string} = {
    'pdf': 'PDF',
    'doc': 'Word',
    'docx': 'Word',
    'ppt': 'PowerPoint',
    'pptx': 'PowerPoint',
    'xls': 'Excel',
    'xlsx': 'Excel',
    'txt': 'Texto',
    'csv': 'CSV',
    'rtf': 'RTF',
    'odt': 'OpenDocument',
    'jpg': 'Imagen',
    'jpeg': 'Imagen',
    'png': 'Imagen',
    'svg': 'Imagen'
  };
  return tipos[extension || ''] || 'Archivo';
}

// Función para eliminar documento
async function eliminarDocumento(documentoId: number) {
  if (!confirm('¿Estás seguro de que deseas eliminar este documento?')) {
    return;
  }
  
  try {
    const token = localStorage.getItem('access_token');
    await axios.delete(`/api/v1/proyectos/${proyectoId.value}/documentos/${documentoId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    
    // Recargar la lista de documentos
    fetchDocumentos();
    
    // Mostrar mensaje de éxito temporal
    uploadState.value = 'success';
    setTimeout(() => {
      uploadState.value = 'idle';
    }, 2000);
    
  } catch (error) {
    console.error('Error al eliminar documento:', error);
    alert('Error al eliminar el documento');
  }
}

function handleFileChange(e: Event) {
  // Verificar si el endpoint está disponible
  if (!BACKEND_ENDPOINTS.uploadDocuments) {
    alert('La funcionalidad de carga de documentos aún no está disponible en el backend.');
    // Limpiar el input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    return;
  }

  const files = (e.target as HTMLInputElement).files;
  if (!files || files.length === 0) return;
  
  const file = files[0];
  
  // Validaciones de archivo
  const maxSize = 10 * 1024 * 1024; // 10MB en bytes
  const allowedTypes = [
    'application/pdf',                    // PDF
    'application/msword',                 // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'application/vnd.ms-powerpoint',      // PPT
    'application/vnd.openxmlformats-officedocument.presentationml.presentation', // PPTX
    'application/vnd.ms-excel',           // XLS
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'text/plain',                         // TXT
    'text/csv',                           // CSV
    'application/rtf',                    // RTF
    'application/vnd.oasis.opendocument.text', // ODT
    'image/jpeg',                         // JPG
    'image/png',                          // PNG
    'image/svg+xml'                       // SVG
  ];
  
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt', '.csv', '.rtf', '.odt', '.jpg', '.jpeg', '.png', '.svg'];
  
  // Verificar tamaño del archivo
  if (file.size > maxSize) {
    uploadState.value = 'error';
    alert('El archivo es demasiado grande. Tamaño máximo: 10MB');
    setTimeout(() => {
      uploadState.value = 'idle';
    }, 3000);
    return;
  }
  
  // Verificar tipo de archivo por MIME type
  if (!allowedTypes.includes(file.type)) {
    // Verificar también por extensión como respaldo
    const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedExtensions.includes(fileExtension || '')) {
      uploadState.value = 'error';
      alert('Tipo de archivo no permitido. Formatos aceptados: PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, TXT, CSV, RTF, ODT, JPG, PNG, SVG');
      setTimeout(() => {
        uploadState.value = 'idle';
      }, 3000);
      return;
    }
  }
  
  // Si pasa todas las validaciones, proceder con la carga
  const formData = new FormData();
  formData.append('file', file);
  uploadState.value = 'loading';
  
  const token = localStorage.getItem('access_token');
  axios.post(`/api/v1/proyectos/${proyectoId.value}/documentos`, formData, {
    headers: { 
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data'
    },
  })
    .then(() => {
      uploadState.value = 'success';
      // Recargar la lista de documentos si el endpoint está disponible
      if (BACKEND_ENDPOINTS.fetchDocuments) {
        fetchDocumentos();
      }
      // Limpiar el input para permitir cargar el mismo archivo otra vez
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      // Resetear estado después de 3 segundos
      setTimeout(() => {
        uploadState.value = 'idle';
      }, 3000);
    })
    .catch((error) => {
      console.error('Error al subir archivo:', error);
      uploadState.value = 'error';
      // Resetear estado después de 3 segundos
      setTimeout(() => {
        uploadState.value = 'idle';
      }, 3000);
    });
}

onMounted(() => {
  fetchProjectData(); // Obtener datos del proyecto
  if (BACKEND_ENDPOINTS.fetchDocuments) {
    fetchDocumentos(); // Cargar documentos si el endpoint está disponible
  }
  loadTarjetasFromStorage(); // Cargar tarjetas específicas del proyecto
});
</script>
