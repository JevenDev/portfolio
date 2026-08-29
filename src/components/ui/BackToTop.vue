<template>
  <Transition name="top-fade">
    <button v-if="visible" type="button" class="back-to-top" @click="$emit('to-top')">Back to top ↑</button>
  </Transition>
</template>

<script setup>
defineProps({ visible: { type: Boolean, default: false } });
defineEmits(['to-top']);
</script>

<style scoped>
.back-to-top {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 60;
  border: 1px solid var(--rule);
  background: var(--paper-cool);
  color: var(--black);
  padding: 0.55rem 0.7rem;
  font-size: 0.68rem;
  cursor: pointer;
}

.back-to-top:hover,
.back-to-top:focus-visible {
  border-color: var(--blue);
  color: var(--blue);
}

.top-fade-enter-active,
.top-fade-leave-active {
  transition: opacity 140ms ease;
}

.top-fade-enter-from,
.top-fade-leave-to {
  opacity: 0;
}
</style>
