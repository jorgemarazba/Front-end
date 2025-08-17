
<script setup lang="ts">
import Navbar from './components/navbar.vue';
import Footer from './components/footer.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <template v-if="$route.path !== '/register'">
      <Navbar />
      <main class="flex-1">
        <router-view />
      </main>
      <Footer />
    </template>
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<style>
</style>