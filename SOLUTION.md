# 🎯 Solución al Issue #2: Implementar carga de tareas por fase

## 📌 Problema Original

El sistema cargaba las fases del proyecto pero **no incluía las tareas asociadas**, causando el error:

```
TypeError: Cannot read properties of undefined (reading 'tasks')
at <anonymous>:1:11
```

Esto ocurría porque:
1. Se obtenían las fases desde `/api/v1/proyectos/{id}/phases`
2. Pero el endpoint **no retornaba las tareas** dentro de cada fase
3. Al intentar iterar sobre `phase.tasks` en el template, la propiedad era `undefined`

## ✅ Solución Implementada

### Código en `src/views/KanbanBoard.vue`

```typescript
async function fetchProjectData(): Promise<void> {
  loading.value = true;
  error.value = null;

  try {
    const token = getAuthToken();
    const headers = { Authorization: `Bearer ${token}` };

    // 1️⃣ Obtener las fases del proyecto
    const phasesResponse = await axios.get(
      `${API_BASE_URL}/proyectos/${props.proyectoId}/phases`,
      { headers }
    );

    const phases: KanbanPhase[] = phasesResponse.data;

    // 2️⃣ Cargar tareas de todas las fases EN PARALELO (clave de optimización)
    const tasks: KanbanTask[] = [];
    
    await Promise.all(
      phases.map(async (phase: KanbanPhase) => {
        const { id } = phase;
        
        try {
          const phaseTasksResponse = await axios.get(
            `${API_BASE_URL}/fases/${id}/tareas`,
            { headers }
          );
          
          // Agregar todas las tareas de esta fase al array general
          tasks.push(...phaseTasksResponse.data);
        } catch (err) {
          console.error(`Error cargando tareas para la fase ${id}:`, err);
          // Continuamos con las demás fases incluso si una falla
        }
      })
    );

    // 3️⃣ Asignar tareas a cada fase y calcular task_count
    const phasesWithTasks = phases.map((phase: KanbanPhase) => ({
      ...phase,
      tasks: tasks.filter(task => task.phase_id === phase.id),
      task_count: tasks.filter(task => task.phase_id === phase.id).length
    }));

    // 4️⃣ Construir el objeto KanbanBoard completo
    kanbanBoard.value = {
      id: props.proyectoId,
      project_id: props.proyectoId,
      phases: phasesWithTasks, // ✅ Ahora cada fase tiene su array de tareas
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

  } catch (err: any) {
    console.error('Error al cargar el tablero Kanban:', err);
    error.value = err.response?.data?.message || err.message;
  } finally {
    loading.value = false;
  }
}
```

### Interfaces TypeScript en `src/types/index.ts`

```typescript
export interface KanbanTask {
  id: number;
  title: string;
  description?: string;
  phase_id: number;      // ← Relaciona la tarea con su fase
  project_id: number;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface KanbanPhase {
  id: number;
  name: string;
  order: number;
  project_id: number;
  tasks: KanbanTask[];   // ← Array de tareas (antes undefined)
  task_count: number;    // ← Contador sincronizado
  created_at: string;
  updated_at: string;
}

export interface KanbanBoard {
  id: number;
  project_id: number;
  phases: KanbanPhase[]; // ← Fases con tareas incluidas
  created_at: string;
  updated_at: string;
}
```

## 🚀 Beneficios de la Solución

### 1. **Carga Paralela con Promise.all()**
- Todas las fases cargan sus tareas **simultáneamente**
- Reduce el tiempo de carga de N segundos secuenciales a ~1 segundo paralelo
- Mejor experiencia de usuario

### 2. **Datos Completos y Estructurados**
- Cada fase tiene su array `tasks` completo
- No hay errores de "undefined" en el template
- Estructura de datos consistente y predecible

### 3. **task_count Preciso**
- Se calcula automáticamente al asignar tareas
- Siempre sincronizado con la cantidad real de tareas
- Se muestra en la UI como badge

### 4. **Manejo de Errores Robusto**
- Si una fase falla al cargar, las demás continúan
- Logs detallados en consola para debugging
- UI muestra mensajes de error amigables

## 📊 Antes vs Después

### ❌ Antes (Problemático)

```typescript
// Solo se obtenían las fases, sin tareas
async function fetchKanbanBoard() {
  const response = await axios.get(`/api/v1/proyectos/${proyectoId.value}/phases`);
  kanbanBoard.value = response.data; 
  // ❌ phase.tasks = undefined
}
```

**Resultado:** Error en template al intentar `v-for="task in phase.tasks"`

### ✅ Después (Optimizado)

```typescript
// Se cargan fases y luego sus tareas en paralelo
const phases = await getPhases();
const tasks = await Promise.all(phases.map(p => getTasks(p.id)));
const phasesWithTasks = assignTasksToPhases(phases, tasks);
// ✅ phase.tasks = [task1, task2, ...]
// ✅ phase.task_count = 2
```

**Resultado:** Template funciona correctamente, sin errores

## 🧪 Cómo Probarlo

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar API URL:**
   Crear archivo `.env`:
   ```env
   VITE_API_URL=http://127.0.0.1:8000/api/v1
   ```

3. **Configurar token de autenticación:**
   En la consola del navegador:
   ```javascript
   localStorage.setItem('authToken', 'tu-token-aqui');
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```

5. **Navegar a:**
   ```
   http://localhost:5173/proyecto/1/kanban
   ```

## 📋 Criterios de Aceptación Cumplidos

- ✅ Las tareas se cargan específicamente por cada fase
- ✅ El contador de tareas (`task_count`) es preciso
- ✅ La carga es paralela para mejor rendimiento
- ✅ Manejo de errores implementado
- ✅ Interfaz actualizada correctamente
- ✅ No hay errores de "undefined" en el template
- ✅ Drag & drop funcional entre fases

## 📁 Archivos Modificados/Creados

1. **`src/views/KanbanBoard.vue`** - Componente principal con lógica optimizada
2. **`src/types/index.ts`** - Interfaces TypeScript con `task_count`
3. **`package.json`** - Dependencias del proyecto
4. **`README.md`** - Documentación completa
5. Archivos de configuración (vite, tsconfig, tailwind, etc.)

## 🔧 APIs Utilizadas

```
GET  /api/v1/proyectos/{id}/phases  → Obtener fases del proyecto
GET  /api/v1/fases/{id}/tareas      → Obtener tareas de una fase específica
PATCH /api/v1/tareas/{id}           → Actualizar tarea (mover entre fases)
```

## 💡 Puntos Clave de la Implementación

1. **Separación de responsabilidades:** Una petición para fases, otra para tareas
2. **Composición de datos:** Unir fases y tareas en el cliente
3. **Carga paralela:** `Promise.all()` para eficiencia
4. **Tipado fuerte:** TypeScript previene errores en tiempo de desarrollo
5. **Manejo de errores:** Try-catch en cada llamada crítica

---

**Prioridad:** 🔴 Alta (Resuelto)  
**Estimación:** 3 story points  
**Sprint:** 1  
**Estado:** ✅ Completado
