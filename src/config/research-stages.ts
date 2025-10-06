/**
 * Configuración centralizada de etapas de investigación
 * Extraído del sistema actual para reutilizar en el tablero Kanban
 */

export interface ResearchStage {
  id: number;
  nombre: string;
  color: string;
  backgroundColor: string;
  descripcion: string;
  icono: string;
  orden: number;
}

// Iconos SVG para cada etapa 
export const STAGE_ICONS = {
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
} as const;

// Configuración completa de etapas de investigación
export const RESEARCH_STAGES: ResearchStage[] = [
  {
    id: 1,
    nombre: 'Seleccionar Tema',
    color: '#8B5CF6',
    backgroundColor: 'bg-purple-500',
    descripcion: 'Define el tema principal de tu investigación',
    icono: STAGE_ICONS['Seleccionar Tema'],
    orden: 1
  },
  {
    id: 2,
    nombre: 'Revisión de Bibliografía',
    color: '#3B82F6',
    backgroundColor: 'bg-blue-500',
    descripcion: 'Analiza fuentes académicas relevantes al tema',
    icono: STAGE_ICONS['Revisión de Bibliografía'],
    orden: 2
  },
  {
    id: 3,
    nombre: 'Planteamiento del Problema',
    color: '#EF4444',
    backgroundColor: 'bg-red-500',
    descripcion: 'Formula claramente el problema a investigar',
    icono: STAGE_ICONS['Planteamiento del Problema'],
    orden: 3
  },
  {
    id: 4,
    nombre: 'Definir Objetivos',
    color: '#10B981',
    backgroundColor: 'bg-green-500',
    descripcion: 'Establece objetivos claros y alcanzables',
    icono: STAGE_ICONS['Definir Objetivos'],
    orden: 4
  },
  {
    id: 5,
    nombre: 'Justificación y Delimitación',
    color: '#F59E0B',
    backgroundColor: 'bg-yellow-500',
    descripcion: 'Justifica la importancia y delimita el alcance',
    icono: STAGE_ICONS['Justificación y Delimitación'],
    orden: 5
  },
  {
    id: 6,
    nombre: 'Marco Teórico',
    color: '#EC4899',
    backgroundColor: 'bg-pink-500',
    descripcion: 'Desarrolla el fundamento teórico de la investigación',
    icono: STAGE_ICONS['Marco Teórico'],
    orden: 6
  },
  {
    id: 7,
    nombre: 'Metodología de la Investigación',
    color: '#06B6D4',
    backgroundColor: 'bg-cyan-500',
    descripcion: 'Define métodos y técnicas de investigación',
    icono: STAGE_ICONS['Metodología de la Investigación'],
    orden: 7
  },
  {
    id: 8,
    nombre: 'Población y Muestra',
    color: '#84CC16',
    backgroundColor: 'bg-lime-500',
    descripcion: 'Identifica población objetivo y muestra de estudio',
    icono: STAGE_ICONS['Población y Muestra'],
    orden: 8
  }
];

// Función helper para obtener una etapa por nombre
export function getStageByName(name: string): ResearchStage | undefined {
  return RESEARCH_STAGES.find(stage => stage.nombre === name);
}

// Función helper para obtener icono de una etapa
export function getStageIcon(name: string): string {
  return STAGE_ICONS[name as keyof typeof STAGE_ICONS] || STAGE_ICONS['Seleccionar Tema'];
}

// Función helper para obtener color de una etapa
export function getStageColor(name: string): string {
  const stage = getStageByName(name);
  return stage?.color || '#8B5CF6';
}