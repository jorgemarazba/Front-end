#!/usr/bin/env node

/**
 * Script de verificación de la estructura del proyecto
 * Valida que todos los archivos necesarios existan y estén correctos
 */

import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Colores para output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(path, description) {
  const fullPath = join(__dirname, path);
  if (existsSync(fullPath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description} - No encontrado: ${path}`, 'red');
    return false;
  }
}

function checkFileContent(path, searchString, description) {
  const fullPath = join(__dirname, path);
  if (!existsSync(fullPath)) {
    log(`❌ ${description} - Archivo no existe: ${path}`, 'red');
    return false;
  }
  
  try {
    const content = readFileSync(fullPath, 'utf-8');
    if (content.includes(searchString)) {
      log(`✅ ${description}`, 'green');
      return true;
    } else {
      log(`⚠️  ${description} - No se encontró: "${searchString}"`, 'yellow');
      return false;
    }
  } catch (err) {
    log(`❌ ${description} - Error al leer: ${err.message}`, 'red');
    return false;
  }
}

log('\n🔍 Verificando estructura del proyecto...\n', 'blue');

let allChecks = true;

// Archivos de configuración
log('📦 Archivos de configuración:', 'blue');
allChecks &= checkFile('package.json', 'package.json');
allChecks &= checkFile('tsconfig.json', 'tsconfig.json');
allChecks &= checkFile('vite.config.ts', 'vite.config.ts');
allChecks &= checkFile('tailwind.config.js', 'tailwind.config.js');
allChecks &= checkFile('.gitignore', '.gitignore');

// Archivos de código fuente
log('\n📁 Archivos de código fuente:', 'blue');
allChecks &= checkFile('src/main.ts', 'main.ts - Punto de entrada');
allChecks &= checkFile('src/App.vue', 'App.vue - Componente raíz');
allChecks &= checkFile('src/views/KanbanBoard.vue', 'KanbanBoard.vue - Vista principal');
allChecks &= checkFile('src/types/index.ts', 'types/index.ts - Definiciones de tipos');
allChecks &= checkFile('src/components/TaskCard.vue', 'TaskCard.vue - Componente de tarea');

// Documentación
log('\n📚 Documentación:', 'blue');
allChecks &= checkFile('README.md', 'README.md');
allChecks &= checkFile('SOLUTION.md', 'SOLUTION.md - Documentación de la solución');
allChecks &= checkFile('SETUP.md', 'SETUP.md - Guía de instalación');
allChecks &= checkFile('ARCHITECTURE.md', 'ARCHITECTURE.md - Arquitectura');

// Verificar contenido clave en KanbanBoard.vue
log('\n🔍 Verificando implementación de KanbanBoard.vue:', 'blue');
allChecks &= checkFileContent(
  'src/views/KanbanBoard.vue',
  'Promise.all',
  'Carga paralela con Promise.all()'
);
allChecks &= checkFileContent(
  'src/views/KanbanBoard.vue',
  'task_count',
  'Implementación de task_count'
);
allChecks &= checkFileContent(
  'src/views/KanbanBoard.vue',
  'handleDragStart',
  'Drag & Drop - handleDragStart'
);
allChecks &= checkFileContent(
  'src/views/KanbanBoard.vue',
  'handleDrop',
  'Drag & Drop - handleDrop'
);
allChecks &= checkFileContent(
  'src/views/KanbanBoard.vue',
  'fetchProjectData',
  'Función fetchProjectData'
);

// Verificar tipos en types/index.ts
log('\n🔍 Verificando tipos TypeScript:', 'blue');
allChecks &= checkFileContent(
  'src/types/index.ts',
  'interface KanbanTask',
  'Interface KanbanTask'
);
allChecks &= checkFileContent(
  'src/types/index.ts',
  'interface KanbanPhase',
  'Interface KanbanPhase'
);
allChecks &= checkFileContent(
  'src/types/index.ts',
  'interface KanbanBoard',
  'Interface KanbanBoard'
);
allChecks &= checkFileContent(
  'src/types/index.ts',
  'task_count',
  'Campo task_count en KanbanPhase'
);

// Verificar dependencias en package.json
log('\n🔍 Verificando dependencias:', 'blue');
allChecks &= checkFileContent(
  'package.json',
  '"vue"',
  'Vue 3 en dependencias'
);
allChecks &= checkFileContent(
  'package.json',
  '"axios"',
  'Axios en dependencias'
);
allChecks &= checkFileContent(
  'package.json',
  '"typescript"',
  'TypeScript en devDependencies'
);
allChecks &= checkFileContent(
  'package.json',
  '"vite"',
  'Vite en devDependencies'
);
allChecks &= checkFileContent(
  'package.json',
  '"tailwindcss"',
  'Tailwind CSS en devDependencies'
);

// Resultado final
log('\n' + '='.repeat(50), 'blue');
if (allChecks) {
  log('✅ ¡Todos los checks pasaron correctamente!', 'green');
  log('✅ La estructura del proyecto está completa.', 'green');
  log('\n📝 Siguientes pasos:', 'blue');
  log('   1. npm install', 'yellow');
  log('   2. Configura el archivo .env con VITE_API_URL', 'yellow');
  log('   3. npm run dev', 'yellow');
  log('   4. Navega a http://localhost:5173/proyecto/1/kanban', 'yellow');
  process.exit(0);
} else {
  log('❌ Algunos checks fallaron. Revisa los errores arriba.', 'red');
  process.exit(1);
}
