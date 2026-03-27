<template>
  <div class="fixed inset-x-0 top-0 z-40 hidden h-8 border-b border-line/90 bg-paper/95 backdrop-blur md:block">
    <div class="relative h-full">
      <div class="section-wrap flex h-full items-center justify-between">
        <p class="text-xs font-semibold uppercase leading-none tracking-[0.16em] text-muted">
          Graphic Designer + Producer
        </p>
        <p class="text-xs font-semibold uppercase leading-none tracking-[0.16em] text-muted">
          Brampton, ON
        </p>
      </div>

      <p
        class="pointer-events-none absolute left-1/2 top-1/2 w-[min(34rem,46vw)] -translate-x-1/2 -translate-y-1/2 truncate text-center text-xs font-semibold uppercase leading-none tracking-[0.16em] text-muted"
      >
        {{ activeSkill }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

const props = defineProps({
  intervalMs: {
    type: Number,
    default: 4000
  },
  skills: {
    type: Array,
    default: () => []
  }
});

const currentIndex = ref(0);
let intervalId;

const activeSkill = computed(() => {
  if (!props.skills.length) return 'Creative Direction';
  return props.skills[currentIndex.value % props.skills.length];
});

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (props.skills.length <= 1 || props.intervalMs <= 0) return;

  intervalId = window.setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.skills.length;
  }, props.intervalMs);
});

onUnmounted(() => {
  if (intervalId) {
    window.clearInterval(intervalId);
  }
});
</script>

