# InvestiFlow - Plataforma de Gestión de Proyectos de Investigación

## 🔬 Descripción

InvestiFlow es una plataforma web innovadora diseñada para gestionar y optimizar proyectos de investigación académica mediante la integración de inteligencia artificial. La plataforma permite a investigadores, estudiantes y académicos organizar sus proyectos usando un sistema de tablero visual tipo Kanban, mientras reciben asistencia inteligente de **Lexi**, nuestro asistente de IA especializado en metodología científica.

## ✨ Características Principales

### 🤖 Asistente de IA - Lexi

- **Contexto Persistente**: Lexi mantiene el contexto completo del proyecto a través de todas las fases
- **Asistencia Especializada**: Entrenada específicamente en metodología de investigación científica
- **Sugerencias Inteligentes**: Ayuda en redacción, estructuración y desarrollo de ideas
- **Disponibilidad 24/7**: Siempre disponible para resolver dudas y ofrecer guidance

### 📋 Gestión de Proyectos Tipo Trello

- **Tablero Kanban Visual**: Organización intuitiva del flujo de trabajo
- **Fases del Ciclo de Vida**:
  - Idea de Investigación
  - Planteamiento del Problema
  - Marco Teórico
  - Metodología
  - Resultados
  - Conclusiones
- **Drag & Drop**: Mover tareas entre fases fácilmente
- **Seguimiento de Progreso**: Visualización clara del avance del proyecto

### 👥 Gestión de Usuarios y Colaboración

- **Sistema de Autenticación**: Registro e inicio de sesión seguros
- **Perfiles de Usuario**: Información institucional y roles (estudiante, investigador, profesor)
- **Colaboración**: Trabajo en equipo con múltiples usuarios por proyecto
- **Control de Acceso**: Gestión de permisos y roles de proyecto

### 🎨 Interfaz Moderna

- **Diseño Responsive**: Optimizado para desktop, tablet y móvil
- **UI/UX Intuitiva**: Interfaz limpia y fácil de usar
- **Tema Personalizable**: Paleta de colores moderna y accesible
- **Animaciones Suaves**: Transiciones y feedback visual atractivo

## 🛠️ Tecnologías

### Frontend

- **Vue.js 3**: Framework principal con Composition API
- **TypeScript**: Tipado estático para mayor robustez
- **TailwindCSS**: Framework de estilos utilitarios
- **HeroIcons**: Iconografía moderna y accesible
- **Vue Router**: Enrutamiento SPA
- **Pinia**: Gestión de estado
- **Vite**: Build tool y dev server

### Herramientas de Desarrollo

- **npm**: Gestor de paquetes estándar
- **Vue DevTools**: Debugging y desarrollo
- **TypeScript ESLint**: Linting y formateo de código

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── layout/         # Componentes de layout (navbar, etc.)
│   └── ui/            # Componentes UI (botones, modales, etc.)
├── views/             # Páginas principales
├── stores/            # Gestión de estado (Pinia)
├── router/            # Configuración de rutas
├── data/              # Datos mock y tipos
├── types/             # Definiciones TypeScript
├── lib/               # Utilidades y helpers
└── assets/            # Recursos estáticos
```

## 🚀 Instalación y Desarrollo

### Prerequisitos

- Node.js 18+
- npm (incluido con Node.js)

### Configuración Inicial

```bash
# Clonar el repositorio
git clone <repository-url>
cd investi-flow

# Instalar dependencias
npm install

# Instalar heroicons si no está incluido
npm install @heroicons/vue
```

### Scripts Disponibles

```bash
# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Type checking
npm run type-check
```

## 🔧 Configuración Adicional (Opcional)

Si deseas usar shadcn-vue en el futuro, puedes instalar las dependencias adicionales:

```bash
# Instalar componentes adicionales para UI avanzada
npm install radix-vue @radix-icons/vue @vueuse/core
npm install lucide-vue-next

# Instalar shadcn-vue CLI
npx shadcn-vue@latest init

# Instalar componentes shadcn-vue específicos
npx shadcn-vue@latest add button
npx shadcn-vue@latest add card
npx shadcn-vue@latest add input
npx shadcn-vue@latest add modal
```

## 🔮 Funcionalidades Futuras

### Backend y Base de Datos

- **FastAPI**: API REST robusta y rápida
- **PostgreSQL**: Base de datos relacional para almacenamiento persistente
- **Autenticación JWT**: Sistema de autenticación seguro y escalable

### Inteligencia Artificial

- **API de Gemini**: Integración completa con Google Gemini para funcionalidades avanzadas de IA
- **Búsqueda Bibliográfica**: Sistema automatizado de búsqueda y recomendación de fuentes
- **Análisis de Contenido**: Evaluación automática de calidad y completitud del contenido

### Colaboración Avanzada

- **Tiempo Real**: Colaboración sincronizada entre usuarios
- **Sistema de Comentarios**: Feedback y revisión entre colaboradores
- **Control de Versiones**: Historial de cambios y reversiones
- **Notificaciones**: Alertas de actividad y actualizaciones

### Gestión Avanzada

- **Gestión de Recursos**: Subida y organización de archivos de investigación
- **Generación de Informes**: Exportación automática a diferentes formatos
- **Métricas y Analytics**: Dashboard de progreso y estadísticas
- **Templates**: Plantillas predefinidas para diferentes tipos de investigación

### Monetización

- **Sistema de Pricing**: Planes gratuitos y premium
- **Pasarela de Pagos**: Integración con procesadores de pago
- **Funcionalidades Premium**: Características avanzadas para suscriptores

## 📊 Estado Actual

### ✅ Implementado

- Frontend completo con Vue 3 + TypeScript
- Sistema de autenticación básico (mock)
- Gestión de proyectos con tablero Kanban
- Interfaz de usuario moderna con TailwindCSS
- Estructura para asistente de IA (Lexi)
- Responsive design
- Navegación y routing

### 🚧 En Desarrollo

- Integración con backend FastAPI
- Implementación real de la API de Gemini
- Base de datos PostgreSQL
- Autenticación JWT

### 📋 Planificado

- Colaboración en tiempo real
- Búsqueda bibliográfica automatizada
- Gestión de archivos y recursos
- Sistema de notificaciones
- Funcionalidades premium

## 🎯 Objetivos del Proyecto

1. **Simplificar el proceso de investigación** mediante herramientas intuitivas
2. **Democratizar el acceso a asistencia de IA** especializada en investigación
3. **Mejorar la colaboración** entre investigadores
4. **Optimizar el flujo de trabajo** académico
5. **Mantener altos estándares éticos** en el uso de IA para investigación

## 🤝 Contribución

Este proyecto está en desarrollo activo. Las contribuciones son bienvenidas siguiendo las mejores prácticas de desarrollo y manteniendo la consistencia con TypeScript y los estándares de código establecidos.

## 📄 Licencia

[Especificar licencia del proyecto]

---

**InvestiFlow** - Revolucionando la manera de hacer investigación académica con inteligencia artificial. 🚀
