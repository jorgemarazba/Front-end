/**
 * Datos de ejemplo para testing y desarrollo
 * Ilustra la estructura completa del tablero Kanban con tareas cargadas por fase
 */

import type { KanbanBoard, KanbanPhase, KanbanTask } from './types';

// Ejemplo de tareas
export const mockTasks: KanbanTask[] = [
  {
    id: 1,
    title: 'Diseñar interfaz de usuario',
    description: 'Crear mockups y prototipos en Figma',
    phase_id: 1, // Fase "Por Hacer"
    project_id: 1,
    order: 1,
    created_at: '2025-08-01T10:00:00Z',
    updated_at: '2025-08-01T10:00:00Z',
  },
  {
    id: 2,
    title: 'Implementar autenticación',
    description: 'JWT y manejo de sesiones',
    phase_id: 1, // Fase "Por Hacer"
    project_id: 1,
    order: 2,
    created_at: '2025-08-01T11:00:00Z',
    updated_at: '2025-08-01T11:00:00Z',
  },
  {
    id: 3,
    title: 'Configurar base de datos',
    description: 'PostgreSQL con migraciones iniciales',
    phase_id: 2, // Fase "En Progreso"
    project_id: 1,
    order: 1,
    created_at: '2025-08-02T09:00:00Z',
    updated_at: '2025-08-02T14:00:00Z',
  },
  {
    id: 4,
    title: 'Crear API REST',
    description: 'Endpoints para CRUD de tareas',
    phase_id: 2, // Fase "En Progreso"
    project_id: 1,
    order: 2,
    created_at: '2025-08-02T10:00:00Z',
    updated_at: '2025-08-02T15:00:00Z',
  },
  {
    id: 5,
    title: 'Testing unitario',
    description: 'Pruebas con Jest',
    phase_id: 3, // Fase "En Revisión"
    project_id: 1,
    order: 1,
    created_at: '2025-08-03T09:00:00Z',
    updated_at: '2025-08-03T16:00:00Z',
  },
  {
    id: 6,
    title: 'Documentación API',
    description: 'Swagger/OpenAPI',
    phase_id: 4, // Fase "Completado"
    project_id: 1,
    order: 1,
    created_at: '2025-08-01T08:00:00Z',
    updated_at: '2025-08-04T17:00:00Z',
  },
];

// Ejemplo de fases CON tareas asignadas (después de la optimización)
export const mockPhasesWithTasks: KanbanPhase[] = [
  {
    id: 1,
    name: 'Por Hacer',
    order: 1,
    project_id: 1,
    tasks: mockTasks.filter(task => task.phase_id === 1), // ✅ 2 tareas
    task_count: 2, // ✅ Contador sincronizado
    created_at: '2025-08-01T08:00:00Z',
    updated_at: '2025-08-01T08:00:00Z',
  },
  {
    id: 2,
    name: 'En Progreso',
    order: 2,
    project_id: 1,
    tasks: mockTasks.filter(task => task.phase_id === 2), // ✅ 2 tareas
    task_count: 2, // ✅ Contador sincronizado
    created_at: '2025-08-01T08:00:00Z',
    updated_at: '2025-08-02T15:00:00Z',
  },
  {
    id: 3,
    name: 'En Revisión',
    order: 3,
    project_id: 1,
    tasks: mockTasks.filter(task => task.phase_id === 3), // ✅ 1 tarea
    task_count: 1, // ✅ Contador sincronizado
    created_at: '2025-08-01T08:00:00Z',
    updated_at: '2025-08-03T16:00:00Z',
  },
  {
    id: 4,
    name: 'Completado',
    order: 4,
    project_id: 1,
    tasks: mockTasks.filter(task => task.phase_id === 4), // ✅ 1 tarea
    task_count: 1, // ✅ Contador sincronizado
    created_at: '2025-08-01T08:00:00Z',
    updated_at: '2025-08-04T17:00:00Z',
  },
];

// Ejemplo de tablero Kanban completo (estructura final)
export const mockKanbanBoard: KanbanBoard = {
  id: 1,
  project_id: 1,
  phases: mockPhasesWithTasks, // ✅ Fases con tareas incluidas
  created_at: '2025-08-01T08:00:00Z',
  updated_at: '2025-08-04T17:00:00Z',
};

/**
 * Ejemplo del PROBLEMA ANTERIOR (antes de la optimización)
 * Las fases venían sin el array de tareas
 */
export const mockPhasesWithoutTasks: Partial<KanbanPhase>[] = [
  {
    id: 1,
    name: 'Por Hacer',
    order: 1,
    project_id: 1,
    // ❌ tasks: undefined <- Causaba el error
    // ❌ task_count: undefined
    created_at: '2025-08-01T08:00:00Z',
    updated_at: '2025-08-01T08:00:00Z',
  },
  // ... más fases sin tareas
];

/**
 * Simula la respuesta del endpoint de tareas por fase
 */
export function getMockTasksByPhaseId(phaseId: number): KanbanTask[] {
  return mockTasks.filter(task => task.phase_id === phaseId);
}

/**
 * Simula el proceso optimizado de carga
 */
export async function simulateOptimizedLoading(
  phases: KanbanPhase[]
): Promise<KanbanPhase[]> {
  // Simula carga paralela de tareas
  const tasks: KanbanTask[] = [];
  
  await Promise.all(
    phases.map(async (phase) => {
      // Simula delay de red
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const phaseTasks = getMockTasksByPhaseId(phase.id);
      tasks.push(...phaseTasks);
    })
  );

  // Asigna tareas a cada fase
  return phases.map((phase) => ({
    ...phase,
    tasks: tasks.filter(task => task.phase_id === phase.id),
    task_count: tasks.filter(task => task.phase_id === phase.id).length,
  }));
}

/**
 * Visualización de la estructura de datos
 */
export const dataStructureExample = {
  description: 'Estructura completa del tablero Kanban',
  example: {
    kanbanBoard: {
      id: 1,
      project_id: 1,
      phases: [
        {
          id: 1,
          name: 'Por Hacer',
          tasks: [
            { id: 1, title: 'Tarea 1', phase_id: 1 },
            { id: 2, title: 'Tarea 2', phase_id: 1 },
          ],
          task_count: 2, // ← Sincronizado con tasks.length
        },
      ],
    },
  },
};
