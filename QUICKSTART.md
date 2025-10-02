# ⚡ Quick Start Guide

Guía rápida para poner en marcha el proyecto en 5 minutos.

## 🚀 Instalación Rápida

```bash
# 1. Instalar dependencias
npm install

# 2. Verificar estructura (opcional)
npm run verify

# 3. Configurar variables de entorno
echo "VITE_API_URL=http://127.0.0.1:8000/api/v1" > .env

# 4. Iniciar servidor de desarrollo
npm run dev
```

## 🔐 Configurar Autenticación

Abre la consola del navegador (F12) y ejecuta:

```javascript
localStorage.setItem('authToken', 'tu-token-jwt-aqui');
```

## 📱 Acceder al Tablero

Navega a: **http://localhost:5173/proyecto/1/kanban**

## ✅ Verificar que Funciona

Deberías ver:

1. ✅ El tablero Kanban cargando
2. ✅ Fases del proyecto (Por Hacer, En Progreso, etc.)
3. ✅ Tareas en cada fase
4. ✅ Badge con contador de tareas en cada fase
5. ✅ Capacidad de arrastrar tareas entre fases

## 🐛 Solución Rápida de Problemas

### Error: "Cannot read properties of undefined (reading 'tasks')"

✅ **Ya solucionado** - Esta implementación lo resuelve.

Si aún ves este error:
1. Verifica que el backend esté corriendo
2. Verifica el token en localStorage
3. Revisa la consola del navegador

### Error: "Network Error"

```bash
# Verifica que el backend esté corriendo
curl http://127.0.0.1:8000/api/v1/health

# Si no responde, inicia el backend primero
```

### No se muestran las tareas

1. Abre DevTools → Network tab
2. Verifica que las peticiones a `/fases/{id}/tareas` respondan con datos
3. Verifica que las tareas tengan el campo `phase_id`

## 📊 Estructura de Datos Esperada

### Endpoint: GET /api/v1/proyectos/{id}/phases

```json
[
  {
    "id": 1,
    "name": "Por Hacer",
    "order": 1,
    "project_id": 1,
    "created_at": "2025-08-01T10:00:00Z",
    "updated_at": "2025-08-01T10:00:00Z"
  }
]
```

### Endpoint: GET /api/v1/fases/{id}/tareas

```json
[
  {
    "id": 1,
    "title": "Tarea ejemplo",
    "description": "Descripción opcional",
    "phase_id": 1,
    "project_id": 1,
    "order": 1,
    "created_at": "2025-08-01T10:00:00Z",
    "updated_at": "2025-08-01T10:00:00Z"
  }
]
```

## 🎯 Comandos Útiles

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo

# Verificación
npm run verify           # Verifica estructura del proyecto
npm run lint             # Lint del código

# Producción
npm run build            # Build para producción
npm run preview          # Preview del build
```

## 📚 Más Información

- **[README.md](./README.md)** - Documentación completa
- **[SOLUTION.md](./SOLUTION.md)** - Detalles de la solución al Issue #2
- **[SETUP.md](./SETUP.md)** - Guía de instalación detallada
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Arquitectura del sistema

## 🎉 ¡Listo!

Si todo funciona correctamente, deberías ver un tablero Kanban completamente funcional con:

- ✅ Carga optimizada de tareas por fase
- ✅ Contador de tareas preciso
- ✅ Drag & Drop entre fases
- ✅ Sincronización con backend
- ✅ Sin errores de "undefined"

---

**¿Tienes problemas?** Consulta [SETUP.md](./SETUP.md) para más detalles o abre un issue en GitHub.
