<template>
  <main id="main-content" ref="page" tabindex="-1" class="page-shell">
    <ModsSection :mods="mods" />
  </main>
</template>

<script setup>
import { ref } from 'vue';
import ModsSection from '../components/sections/ModsSection.vue';
import { usePosterMotion } from '../composables/usePosterMotion';

const page = ref(null);
usePosterMotion(page);

defineProps({ mods: { type: Array, default: () => [] } });
</script>
