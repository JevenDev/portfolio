<template>
  <Transition name="top-fade">
    <button v-if="visible" type="button" class="back-to-top" aria-label="Back to top" @click="$emit('to-top')">
      <span aria-hidden="true">↑</span>
      <span>Top</span>
    </button>
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
  display: grid;
  width: 3.6rem;
  aspect-ratio: 1;
  place-content: center;
  gap: 0.05rem;
  border: 1px solid var(--black);
  border-radius: 50%;
  background: var(--paper-cool);
  color: var(--black);
  padding: 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.58rem;
  line-height: 1;
  text-align: center;
  cursor: pointer;
  transform: rotate(2deg);
}

.back-to-top:hover,
.back-to-top:focus-visible {
  border-color: var(--blue);
  background: var(--blue);
  color: var(--paper-cool);
}

.back-to-top span:first-child {
  font-size: 1rem;
}

.top-fade-enter-active,
.top-fade-leave-active {
  transition: opacity 140ms ease;
}

.top-fade-enter-from,
.top-fade-leave-to {
  opacity: 0;
}

@media (max-width: 560px) {
  .back-to-top {
    right: 0.65rem;
    bottom: max(0.65rem, env(safe-area-inset-bottom));
    width: 2.9rem;
    font-size: 0.52rem;
  }

  .back-to-top span:first-child {
    font-size: 0.85rem;
  }
}
</style>
