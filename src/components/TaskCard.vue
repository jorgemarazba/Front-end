<template>
  <div
    class="task-card bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-move hover:shadow-md transition-shadow"
    :class="{ 'opacity-50': isDragging }"
  >
    <h3 class="font-medium text-gray-800 mb-2">{{ task.title }}</h3>
    
    <p v-if="task.description" class="text-sm text-gray-600 mb-3">
      {{ task.description }}
    </p>
    
    <div class="flex justify-between items-center text-xs text-gray-500">
      <span class="bg-gray-100 px-2 py-1 rounded">ID: {{ task.id }}</span>
      <span>{{ formatDate(task.created_at) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { KanbanTask } from '../types';

// Props
interface Props {
  task: KanbanTask;
  isDragging?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isDragging: false,
});

/**
 * Formatea una fecha ISO a formato legible
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
</script>

<style scoped>
.task-card {
  transition: all 0.2s ease;
}

.task-card:hover {
  transform: translateY(-2px);
}
</style>
