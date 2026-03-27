<template>
  <transition name="fade">
    <button
      v-if="visible"
      type="button"
      class="focus-ring fixed bottom-5 right-5 z-30 border border-line bg-paper px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink shadow-card"
      @click="$emit('to-top')"
    >
      Top
    </button>
  </transition>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: false
  }
});

defineEmits(['to-top']);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>