<template>
  <button
    :class="[
      'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
      props.variant === 'default' ? 'bg-blue-600 text-white hover:bg-blue-700' : '',
      props.variant === 'outline' ? 'border border-gray-400 bg-white text-black hover:bg-gray-100' : '',
      props.class
    ]"
    v-bind="$attrs"
    :type="props.type"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  variant: {
    type: String,
    default: 'default',
  },
  type: {
    type: String,
    default: 'button',
  },
  class: {
    type: String,
    default: '',
  },
})
</script>
