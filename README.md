# 📋 Kanban Board - Frontend

Sistema de gestión de tareas estilo Kanban con carga optimizada por fase.

## 🚀 Características

- ✅ **Carga optimizada de tareas por fase** - Las tareas se cargan en paralelo usando `Promise.all()`
- 📊 **Contador de tareas en tiempo real** - Cada fase muestra el número exacto de tareas
- 🔄 **Drag & Drop** - Arrastra tareas entre fases
- 💾 **Sincronización con backend** - Actualización automática al mover tareas
- 🎨 **Interfaz moderna** - Diseñada con Vue 3 y Tailwind CSS

## 📦 Tecnologías

- **Vue 3** - Framework JavaScript progresivo
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Framework CSS utility-first
- **Vue Router** - Enrutamiento oficial de Vue

## 🛠️ Instalación

```bash
# Instalar dependencias
npm install

# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Lint
npm run lint
```

## 🔧 Configuración

Crea un archivo `.env` en la raíz del proyecto:

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

## 📁 Estructura del Proyecto

```
src/
├── views/
│   └── KanbanBoard.vue    # Vista principal del tablero Kanban
├── types/
│   └── index.ts           # Definiciones de tipos TypeScript
├── App.vue                # Componente raíz
├── main.ts                # Punto de entrada
└── style.css              # Estilos globales
```

## 🎯 Solución Implementada - Issue #2

### Problema Original

El sistema cargaba las fases sin las tareas asociadas, causando el error:
```
TypeError: Cannot read properties of undefined (reading 'tasks')
```

### Solución Optimizada

```typescript
// 1. Obtener fases del proyecto
const phases = await fetchPhases();

// 2. Cargar tareas de todas las fases en paralelo
const tasks = [];
await Promise.all(
  phases.map(async (phase) => {
    const phaseTasks = await axios.get(`/fases/${phase.id}/tareas`);
    tasks.push(...phaseTasks.data);
  })
);

// 3. Asignar tareas a cada fase
const phasesWithTasks = phases.map(phase => ({
  ...phase,
  tasks: tasks.filter(task => task.phase_id === phase.id),
  task_count: tasks.filter(task => task.phase_id === phase.id).length
}));
```

### Beneficios

- ✅ **Carga paralela** - Todas las tareas se cargan simultáneamente
- ✅ **Datos completos** - Cada fase tiene su array de tareas
- ✅ **task_count preciso** - Contador sincronizado automáticamente
- ✅ **Mejor rendimiento** - Promise.all() reduce el tiempo de carga

## 🧪 Testing

El componente incluye:
- Manejo de estados de carga
- Gestión de errores
- Validación de autenticación
- Actualización optimista del UI

## 📝 API Endpoints Utilizados

```
GET  /api/v1/proyectos/{id}/phases     # Obtener fases del proyecto
GET  /api/v1/fases/{id}/tareas         # Obtener tareas de una fase
PATCH /api/v1/tareas/{id}              # Actualizar tarea (mover entre fases)
```

## 🔐 Autenticación

El sistema usa Bearer Token almacenado en `localStorage`:

```javascript
localStorage.setItem('authToken', 'your-token-here');
```

## 📱 Uso

1. Navega a `/proyecto/{id}/kanban` donde `{id}` es el ID del proyecto
2. El tablero cargará automáticamente todas las fases y sus tareas
3. Arrastra tareas entre fases para cambiar su estado
4. Los cambios se sincronizan automáticamente con el backend

## 🎨 Personalización

### Cambiar colores del tema

Edita `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    }
  }
}
```

### Modificar URL base de la API

Edita el archivo `.env` o cambia la constante en `KanbanBoard.vue`:

```typescript
const API_BASE_URL = 'https://your-api-url.com/api/v1';
```

## 🐛 Manejo de Errores

El componente maneja:
- Errores de autenticación
- Errores de red
- Errores al cargar fases
- Errores al cargar tareas individuales (continúa con las demás)
- Errores al mover tareas

## 📄 Licencia

MIT

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor abre un issue o PR.

## 📞 Soporte

Para reportar bugs o solicitar features, abre un issue en GitHub.
