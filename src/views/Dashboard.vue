<template>
  <AuthenticatedLayout>
    <div class="text-center mt-10">
      <h2 class="text-2xl font-bold mb-4">Bienvenido al panel de usuario</h2>
      <p>Esta es una ruta protegida. Solo usuarios autenticados pueden verla.</p>
    </div>
  </AuthenticatedLayout>
</template>

<script setup lang="ts">
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout.vue';
</script>
