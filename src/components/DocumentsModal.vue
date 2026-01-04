<!-- Componente para mostrar y gestionar documentos -->
<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" @click="$emit('close')">
    <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-hidden" @click.stop>
      <!-- Header -->
      <div class="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 class="text-xl font-semibold text-gray-900">
            {{ title }}
          </h2>
          <p class="text-sm text-gray-500 mt-1">
            {{ subtitle }}
          </p>
        </div>
        <button 
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Contenido -->
      <div class="p-6">
        <!-- Área de subida de archivos -->
        <div class="mb-6">
          <div class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <div class="mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <div class="mb-4">
              <label for="file-upload" class="cursor-pointer">
                <span class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                  Seleccionar archivos
                </span>
                <input 
                  id="file-upload" 
                  type="file" 
                  class="hidden" 
                  multiple 
                  accept=".pdf,.docx,.doc"
                  @change="handleFileSelect"
                />
              </label>
            </div>
            <p class="text-sm text-gray-500">
              O arrastra y suelta archivos aquí
            </p>
            <p class="text-xs text-gray-400 mt-2">
              Archivos permitidos: PDF, DOCX (máximo 10MB cada uno)
            </p>
          </div>
        </div>

        <!-- Lista de documentos -->
        <div v-if="documents.length > 0">
          <h3 class="text-lg font-medium text-gray-900 mb-4">
            Documentos ({{ documents.length }})
          </h3>
          <div class="space-y-3 max-h-64 overflow-y-auto">
            <div 
              v-for="doc in documents" 
              :key="doc.id"
              class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="flex items-center space-x-3">
                <div class="flex-shrink-0">
                  <svg 
                    v-if="doc.file_type === 'pdf'" 
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-8 w-8 text-red-500" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M8,2V22L16,18V6L8,2M16,8V16L20,14V10L16,8Z" />
                  </svg>
                  <svg 
                    v-else
                    xmlns="http://www.w3.org/2000/svg" 
                    class="h-8 w-8 text-blue-500" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                  </svg>
                </div>
                <div class="min-w-0 flex-1">
                  <p class="text-sm font-medium text-gray-900 truncate">
                    {{ doc.filename }}
                  </p>
                  <p class="text-xs text-gray-500">
                    <span v-if="!doc.isPlaceholder">{{ formatFileSize(doc.file_size) }} • {{ formatDate(doc.uploaded_at) }}</span>
                    <span v-else class="text-orange-600 font-medium">Documento existente (backend no permite listarlo)</span>
                  </p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <button 
                  v-if="!doc.isPlaceholder"
                  @click="downloadDocument(doc.id)"
                  class="text-blue-600 hover:text-blue-800 transition-colors"
                  title="Descargar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </button>
                <span v-else class="text-gray-400 text-xs">Acciones no disponibles</span>
                <button 
                  v-if="!doc.isPlaceholder"
                  @click="deleteDocument(doc.id)"
                  class="text-red-600 hover:text-red-800 transition-colors"
                  title="Eliminar"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío -->
        <div v-else class="text-center py-8">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No hay documentos</h3>
          <p class="text-gray-500">Sube tu primer documento para comenzar</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import axios from 'axios'
import { useToast } from 'vue-toastification'

interface Document {
  id: number
  filename: string
  file_size: number
  file_type: string
  uploaded_at: string
  isPlaceholder?: boolean // Propiedad opcional para documentos placeholder
}

const props = defineProps<{
  projectId?: number
  phaseId?: number
  taskId?: number
  title: string
  subtitle: string
}>()

const emit = defineEmits<{
  close: []
  uploaded: [doc: Document]
  uploadError: [error: any, phaseId: number]
}>()

const toast = useToast()
const documents = ref<Document[]>([])
const uploading = ref(false)

// Formatear tamaño de archivo
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Formatear fecha
function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Manejar selección de archivos
async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  if (!input.files) return

  for (const file of Array.from(input.files)) {
    await uploadFile(file)
  }
  
  // Limpiar input
  input.value = ''
}

// Subir archivo
async function uploadFile(file: File) {
  if (file.size > 10 * 1024 * 1024) {
    toast.error('El archivo excede el tamaño máximo de 10MB')
    return
  }

  if (!file.type.includes('pdf') && !file.type.includes('document')) {
    toast.error('Solo se permiten archivos PDF y DOCX')
    return
  }

  uploading.value = true

  try {
    const formData = new FormData()
    formData.append('file', file)

    let endpoint = ''
    if (props.projectId) {
      endpoint = `/api/v1/proyectos/${props.projectId}/documentos`
    } else if (props.phaseId) {
      endpoint = `/api/v1/fases/${props.phaseId}/documentos`
    } else if (props.taskId) {
      endpoint = `/api/v1/tareas/${props.taskId}/documentos`
    }

    console.log('📤 Intentando subir archivo:')
    console.log('- Archivo:', { name: file.name, size: file.size, type: file.type })
    console.log('- Endpoint:', `${endpoint}`)
    console.log('- Props:', { projectId: props.projectId, phaseId: props.phaseId, taskId: props.taskId })

    const token = localStorage.getItem('access_token')
    const response = await axios.post(`${endpoint}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    documents.value.push(response.data)
    emit('uploaded', response.data)
    toast.success('Documento subido exitosamente')

  } catch (error: any) {
    console.error('Error al subir documento:', error)
    console.error('Detalles del error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    })
    console.error('📋 Respuesta completa del servidor:', error.response?.data)

    let errorMessage = 'Error al subir el documento'
    
    if (error.response?.status === 400) {
      const detail = error.response.data?.detail
      console.error('🚨 Error 400 específico:', detail)
      
      if (detail && detail.includes('ya tiene un documento adjunto')) {
        errorMessage = 'Esta fase ya tiene un documento adjunto. Solo se permite un documento por fase.'
      } else {
        errorMessage = `Error 400: ${detail || 'Solicitud incorrecta'}`
      }
    } else {
      errorMessage = error.response?.data?.detail || 'Error al subir el documento'
    }

    toast.error(errorMessage)
    
    // Emitir error para que el componente padre pueda manejarlo
    if (props.phaseId && error.response?.status === 400) {
      emit('uploadError', error, props.phaseId)
    }
  } finally {
    uploading.value = false
  }
}

// Descargar documento
async function downloadDocument(documentId: number) {
  try {
    const token = localStorage.getItem('access_token')
    const response = await axios.get(`/api/v1/documentos/${documentId}/download`, {
      headers: { 'Authorization': `Bearer ${token}` },
      responseType: 'blob'
    })

    // Crear URL de descarga
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    
    // Obtener nombre del archivo del header
    const contentDisposition = response.headers['content-disposition']
    const filename = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || 'documento'
    
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

  } catch (error) {
    console.error('Error al descargar documento:', error)
    toast.error('Error al descargar el documento')
  }
}

// Eliminar documento
async function deleteDocument(documentId: number) {
  if (!confirm('¿Estás seguro de que quieres eliminar este documento?')) {
    return
  }

  try {
    const token = localStorage.getItem('access_token')
    await axios.delete(`/api/v1/documentos/${documentId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    documents.value = documents.value.filter(doc => doc.id !== documentId)
    toast.success('Documento eliminado exitosamente')

  } catch (error) {
    console.error('Error al eliminar documento:', error)
    toast.error('Error al eliminar el documento')
  }
}

// Cargar documentos al montar el componente
async function loadDocuments() {
  try {
    let endpoint = ''
    if (props.projectId) {
      endpoint = `/api/v1/proyectos/${props.projectId}/documentos`
    } else if (props.phaseId) {
      endpoint = `/api/v1/fases/${props.phaseId}/documentos`
    } else if (props.taskId) {
      endpoint = `/api/v1/tareas/${props.taskId}/documentos`
    }

    const token = localStorage.getItem('access_token')
    const response = await axios.get(`${endpoint}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })

    documents.value = response.data || []

  } catch (error: any) {
    if (error.response?.status === 400 && 
        error.response?.data?.detail?.includes('documento adjunto')) {
      
      // Crear documento placeholder para mostrar que existe
      const placeholderDoc = {
        id: -1, // ID temporal negativo
        filename: 'Documento existente (no listable)',
        file_size: 0,
        file_type: 'application/pdf',
        uploaded_at: new Date().toISOString(),
        isPlaceholder: true
      }
      
      // Limpiar array primero
      documents.value = []
      await nextTick()
      
      // Asignar placeholder
      documents.value = [placeholderDoc]
      await nextTick()
      
      toast.info('Esta fase tiene un documento adjunto. El backend no permite listarlo, pero está presente.')
    } else if (error.response?.status !== 404) {
      toast.error('Error al cargar los documentos')
      documents.value = []
    } else {
      documents.value = []
    }
  }
}

onMounted(() => {
  loadDocuments()
})
</script>

<style scoped>
/* Estilos para scrollbar personalizado */
.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>