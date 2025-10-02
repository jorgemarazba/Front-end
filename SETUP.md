# 🚀 Guía de Instalación y Configuración

## 📋 Requisitos Previos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0 o **pnpm** >= 8.0.0
- **Backend API** corriendo en `http://127.0.0.1:8000` (o configurar URL diferente)

## 🛠️ Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/jorgemarazba/Front-end.git
cd Front-end
```

### 2. Instalar dependencias

```bash
npm install
```

O si usas pnpm:

```bash
pnpm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```bash
cp .env.example .env
```

Edita el archivo `.env`:

```env
# URL base de la API backend
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

### 4. Iniciar servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en: `http://localhost:5173`

## 🔐 Configuración de Autenticación

El sistema requiere un token JWT para autenticar las peticiones. Hay dos formas de configurarlo:

### Opción 1: Desde la consola del navegador

1. Abre las DevTools del navegador (F12)
2. Ve a la pestaña **Console**
3. Ejecuta:

```javascript
localStorage.setItem('authToken', 'tu-token-jwt-aqui');
```

### Opción 2: Implementar login

Si tienes un endpoint de login, puedes guardar el token automáticamente:

```typescript
// Ejemplo de login
async function login(username: string, password: string) {
  const response = await axios.post(`${API_URL}/auth/login`, {
    username,
    password
  });
  
  const token = response.data.token;
  localStorage.setItem('authToken', token);
}
```

## 🧪 Verificar la Instalación

### 1. Verificar que el backend esté corriendo

```bash
curl http://127.0.0.1:8000/api/v1/health
```

### 2. Acceder al tablero Kanban

Navega a: `http://localhost:5173/proyecto/1/kanban`

Deberías ver:
- ✅ El tablero cargando
- ✅ Las fases del proyecto
- ✅ Las tareas en cada fase
- ✅ Los contadores de tareas

## 🏗️ Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Inicia servidor de desarrollo

# Producción
npm run build        # Compila para producción
npm run preview      # Preview del build de producción

# Calidad de Código
npm run lint         # Ejecuta ESLint
```

## 📊 Estructura de la API Requerida

El frontend espera los siguientes endpoints:

### 1. Obtener fases del proyecto

```http
GET /api/v1/proyectos/{id}/phases
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "name": "Por Hacer",
    "order": 1,
    "project_id": 1,
    "created_at": "2025-08-01T10:00:00Z",
    "updated_at": "2025-08-01T10:00:00Z"
  },
  ...
]
```

### 2. Obtener tareas de una fase

```http
GET /api/v1/fases/{id}/tareas
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "title": "Tarea ejemplo",
    "description": "Descripción de la tarea",
    "phase_id": 1,
    "project_id": 1,
    "order": 1,
    "created_at": "2025-08-01T10:00:00Z",
    "updated_at": "2025-08-01T10:00:00Z"
  },
  ...
]
```

### 3. Actualizar tarea (mover entre fases)

```http
PATCH /api/v1/tareas/{id}
Authorization: Bearer {token}
Content-Type: application/json

Body:
{
  "phase_id": 2
}

Response:
{
  "id": 1,
  "phase_id": 2,
  ...
}
```

## 🐛 Solución de Problemas

### Error: "Cannot read properties of undefined (reading 'tasks')"

✅ **Solucionado en esta implementación**

Este era el problema original que se resolvió cargando las tareas por fase. Si aún ves este error:

1. Verifica que el backend esté corriendo
2. Verifica que el token sea válido
3. Revisa la consola del navegador para más detalles
4. Verifica que los endpoints respondan correctamente

### Error: "Network Error"

**Causas posibles:**
- Backend no está corriendo
- URL de la API incorrecta en `.env`
- CORS no configurado en el backend

**Solución:**
1. Verifica que el backend esté en `http://127.0.0.1:8000`
2. Configura CORS en el backend para permitir `http://localhost:5173`

### Error: "401 Unauthorized"

**Causa:** Token inválido o expirado

**Solución:**
1. Obtén un nuevo token del backend
2. Actualiza el token en localStorage:
   ```javascript
   localStorage.setItem('authToken', 'nuevo-token');
   ```
3. Recarga la página

### Las tareas no se muestran

**Verificar:**
1. Que el endpoint `/fases/{id}/tareas` retorne datos
2. Que las tareas tengan el campo `phase_id` correcto
3. Revisar la consola del navegador por errores
4. Verificar network tab en DevTools

## 🔧 Configuración del Backend (Ejemplo Django)

Si estás usando Django REST Framework, necesitas configurar CORS:

```python
# settings.py
INSTALLED_APPS = [
    ...
    'corsheaders',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    ...
]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# O en desarrollo puedes usar:
CORS_ALLOW_ALL_ORIGINS = True  # ⚠️ Solo para desarrollo
```

## 📱 Uso de la Aplicación

1. **Ver el tablero:** Navega a `/proyecto/{id}/kanban`
2. **Arrastrar tareas:** Click y arrastra una tarea a otra fase
3. **Ver contadores:** Cada fase muestra cuántas tareas tiene

## 🎨 Personalización

### Cambiar colores

Edita `tailwind.config.js`:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: '#your-color',
        secondary: '#your-color',
      }
    }
  }
}
```

### Cambiar puerto de desarrollo

Edita `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 3000, // Cambiar a tu puerto preferido
  }
})
```

## 📚 Más Información

- [Documentación de Vue 3](https://vuejs.org/)
- [Documentación de Vite](https://vitejs.dev/)
- [Documentación de TypeScript](https://www.typescriptlang.org/)
- [Documentación de Tailwind CSS](https://tailwindcss.com/)

## 🤝 Soporte

Si encuentras problemas:
1. Revisa la sección de solución de problemas
2. Consulta los logs en la consola del navegador
3. Abre un issue en GitHub con detalles del error

---

✅ **¡Listo!** Ahora deberías tener el tablero Kanban funcionando correctamente con carga optimizada de tareas por fase.
