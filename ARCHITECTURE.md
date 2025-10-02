# 🏗️ Arquitectura de la Solución - Issue #2

## 📊 Diagrama de Flujo de Datos

```
┌─────────────────────────────────────────────────────────────────┐
│                      KanbanBoard Component                       │
│                     (src/views/KanbanBoard.vue)                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ onMounted()
                              ▼
                    ┌──────────────────────┐
                    │  fetchProjectData()  │
                    └──────────────────────┘
                              │
                              │
                ┌─────────────┴─────────────┐
                │                           │
                ▼                           │
    ┌─────────────────────────┐            │
    │  1. GET /proyectos/{id} │            │
    │      /phases            │            │
    └─────────────────────────┘            │
                │                           │
                │ Response: phases[]        │
                ▼                           │
    ┌───────────────────────────────────┐  │
    │  2. Promise.all() - PARALLEL      │  │
    │     Load Tasks for Each Phase     │  │
    └───────────────────────────────────┘  │
                │                           │
        ┌───────┼───────┬───────┐          │
        │       │       │       │          │
        ▼       ▼       ▼       ▼          │
    ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐      │
    │ GET │ │ GET │ │ GET │ │ GET │      │
    │fase1│ │fase2│ │fase3│ │fase4│      │
    │/tarea│ │/tarea│ │/tarea│ │/tarea│      │
    └─────┘ └─────┘ └─────┘ └─────┘      │
        │       │       │       │          │
        └───────┴───────┴───────┘          │
                │                           │
                │ Response: tasks[]         │
                ▼                           │
    ┌───────────────────────────┐          │
    │  3. Merge and Filter      │          │
    │     - Assign tasks to     │          │
    │       respective phases   │◄─────────┘
    │     - Calculate task_count│
    └───────────────────────────┘
                │
                │ phasesWithTasks[]
                ▼
    ┌───────────────────────────┐
    │  4. Update kanbanBoard    │
    │     Reactive State        │
    └───────────────────────────┘
                │
                │
                ▼
    ┌───────────────────────────┐
    │      Render UI            │
    │  - Show phases            │
    │  - Show tasks per phase   │
    │  - Show task_count badge  │
    └───────────────────────────┘
```

## 🔄 Flujo de Carga de Datos (Secuencia)

```
Frontend                API Backend              Database
   │                         │                       │
   ├─1─ GET /proyectos/1/phases                     │
   │   ─────────────────────>│                       │
   │                         │                       │
   │                         ├─────────────────────> │
   │                         │  SELECT * FROM phases │
   │                         │   WHERE project_id=1  │
   │                         │                       │
   │                         │ <─────────────────────┤
   │   <─────────────────────┤  [phase1, phase2...]  │
   │    [phases without tasks]                       │
   │                         │                       │
   ├─2─ Promise.all([       │                       │
   │     GET /fases/1/tareas │                       │
   │     GET /fases/2/tareas │                       │
   │     GET /fases/3/tareas │                       │
   │     GET /fases/4/tareas │                       │
   │   ])                    │                       │
   │                         │                       │
   │ ─────────────────────>  │                       │
   │ ─────────────────────>  │                       │
   │ ─────────────────────>  │                       │
   │ ─────────────────────>  │                       │
   │                         │                       │
   │                         ├─────────────────────> │
   │                         │ SELECT * FROM tasks   │
   │                         │  WHERE phase_id IN    │
   │                         │  (1,2,3,4)            │
   │                         │                       │
   │                         │ <─────────────────────┤
   │   <─────────────────────┤                       │
   │   <─────────────────────┤  All tasks           │
   │   <─────────────────────┤                       │
   │   <─────────────────────┤                       │
   │                         │                       │
   ├─3─ Client-side merge    │                       │
   │     phases + tasks      │                       │
   │                         │                       │
   ├─4─ Render UI            │                       │
   │                         │                       │
```

## 🧩 Estructura de Componentes

```
App.vue
  │
  └─> Router
       │
       └─> KanbanBoard.vue (Main View)
            │
            ├─> Phase Column (v-for)
            │    │
            │    ├─> Phase Header
            │    │    └─> Task Count Badge
            │    │
            │    └─> Tasks Container (v-for)
            │         └─> TaskCard.vue (Component)
            │              ├─> Title
            │              ├─> Description
            │              └─> Metadata
            │
            └─> Drag & Drop Handlers
                 ├─> handleDragStart
                 ├─> handleDragEnd
                 └─> handleDrop
                      └─> PATCH /tareas/{id}
```

## 📦 Estructura de Datos

### Antes (❌ Problema)

```typescript
// Response de GET /proyectos/1/phases
{
  phases: [
    {
      id: 1,
      name: "Por Hacer",
      order: 1,
      project_id: 1,
      // ❌ tasks: undefined
      // ❌ task_count: undefined
    }
  ]
}

// Al intentar renderizar:
phase.tasks.map(...) // ERROR: Cannot read properties of undefined
```

### Después (✅ Solución)

```typescript
// Step 1: GET /proyectos/1/phases
const phases = [
  { id: 1, name: "Por Hacer", ... },
  { id: 2, name: "En Progreso", ... }
];

// Step 2: Promise.all() - Parallel loading
const allTasks = [
  // GET /fases/1/tareas
  { id: 1, title: "Task A", phase_id: 1 },
  { id: 2, title: "Task B", phase_id: 1 },
  // GET /fases/2/tareas
  { id: 3, title: "Task C", phase_id: 2 }
];

// Step 3: Merge and structure
const kanbanBoard = {
  id: 1,
  project_id: 1,
  phases: [
    {
      id: 1,
      name: "Por Hacer",
      tasks: [
        { id: 1, title: "Task A", phase_id: 1 },
        { id: 2, title: "Task B", phase_id: 1 }
      ],
      task_count: 2 // ✅ Calculated correctly
    },
    {
      id: 2,
      name: "En Progreso",
      tasks: [
        { id: 3, title: "Task C", phase_id: 2 }
      ],
      task_count: 1 // ✅ Calculated correctly
    }
  ]
};
```

## ⚡ Optimización: Carga Paralela

### Antes (Secuencial - Lento)

```typescript
// ❌ Tiempo total: n * T (segundos)
for (const phase of phases) {
  const tasks = await getTasks(phase.id); // Espera cada petición
  phase.tasks = tasks;
}
// Si hay 4 fases y cada petición toma 500ms:
// Tiempo total = 4 * 500ms = 2000ms (2 segundos)
```

### Después (Paralelo - Rápido)

```typescript
// ✅ Tiempo total: max(T) (segundos)
await Promise.all(
  phases.map(async (phase) => {
    const tasks = await getTasks(phase.id); // Todas en paralelo
    return tasks;
  })
);
// Si hay 4 fases y cada petición toma 500ms:
// Tiempo total = 500ms (solo 0.5 segundos!)
```

**Mejora de rendimiento:** ~75% más rápido con 4 fases

## 🎯 Puntos Clave de la Arquitectura

### 1. Separación de Responsabilidades

```
┌─────────────────────────────────────────┐
│          Presentation Layer             │
│         (KanbanBoard.vue)               │
│  - UI rendering                         │
│  - User interactions                    │
│  - State management                     │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│          Data Layer                     │
│       (fetchProjectData)                │
│  - API calls                            │
│  - Data transformation                  │
│  - Error handling                       │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│          Type Layer                     │
│        (src/types/index.ts)             │
│  - TypeScript interfaces                │
│  - Type safety                          │
└─────────────────────────────────────────┘
```

### 2. Estado Reactivo (Vue 3 Composition API)

```typescript
// Reactive state
const kanbanBoard = ref<KanbanBoard | null>(null);
const loading = ref(false);
const error = ref<string | null>(null);

// Cuando se actualiza kanbanBoard.value
// → Vue reactivamente re-renderiza el template
// → UI se actualiza automáticamente
```

### 3. Manejo de Errores Multi-nivel

```typescript
try {
  // Nivel 1: Error general de carga
  const phases = await getPhases();
  
  // Nivel 2: Error por fase individual
  await Promise.all(phases.map(async (phase) => {
    try {
      const tasks = await getTasks(phase.id);
    } catch (err) {
      // Continúa con otras fases
      console.error(`Error en fase ${phase.id}:`, err);
    }
  }));
  
} catch (err) {
  // Nivel 3: Error catastrófico
  error.value = err.message;
}
```

## 🔐 Flujo de Autenticación

```
┌──────────────┐
│   Frontend   │
└──────────────┘
       │
       │ 1. Obtener token de localStorage
       ▼
┌──────────────────────────────┐
│  authToken =                 │
│  localStorage.getItem(...)   │
└──────────────────────────────┘
       │
       │ 2. Incluir en headers
       ▼
┌──────────────────────────────┐
│  headers: {                  │
│    Authorization: `Bearer    │
│      ${token}`               │
│  }                           │
└──────────────────────────────┘
       │
       │ 3. Enviar con cada petición
       ▼
┌──────────────┐
│  Backend API │
└──────────────┘
       │
       │ 4. Validar token
       ▼
┌──────────────────────────────┐
│  if valid:                   │
│    return data               │
│  else:                       │
│    return 401 Unauthorized   │
└──────────────────────────────┘
```

## 📱 Flujo de Drag & Drop

```
User dragging task
       │
       ▼
┌─────────────────────────────┐
│   handleDragStart            │
│   - Store draggedTask        │
│   - Set drag data            │
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│   User drops on new phase    │
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│   handleDrop                 │
│   - Check if different phase │
│   - PATCH /tareas/{id}       │
│   - Update backend           │
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│   Refresh data               │
│   - Re-fetch project data    │
│   - Update UI                │
└─────────────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│   Task moved to new phase!   │
└─────────────────────────────┘
```

## 🎨 Arquitectura CSS (Tailwind)

```
Base Styles (style.css)
    │
    ├─> Tailwind Utilities
    │   ├─> Layout (flex, grid, etc.)
    │   ├─> Colors (bg-*, text-*)
    │   └─> Spacing (p-*, m-*)
    │
    └─> Scoped Styles (in components)
        ├─> Custom transitions
        ├─> Hover effects
        └─> Scrollbar styles
```

## 🚀 Performance Optimizations

1. **Parallel Loading:** `Promise.all()` for concurrent API calls
2. **Reactive Updates:** Vue's reactivity system for efficient DOM updates
3. **Scoped Styles:** CSS scoping to prevent style conflicts
4. **Lazy Loading:** Components loaded on-demand
5. **Code Splitting:** Vite's automatic code splitting

## 📊 Métricas de Éxito

```
Antes de la optimización:
├─ Carga de 4 fases: ~2000ms (secuencial)
├─ Errores: "Cannot read properties of undefined"
└─ task_count: No disponible

Después de la optimización:
├─ Carga de 4 fases: ~500ms (paralelo)
├─ Errores: 0 (estructura completa)
└─ task_count: Preciso y sincronizado
```

**Mejora:** 75% más rápido + 0 errores de undefined

---

Esta arquitectura asegura:
✅ Escalabilidad
✅ Mantenibilidad
✅ Rendimiento óptimo
✅ Experiencia de usuario fluida
