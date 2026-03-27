<template>
  <div class="fixed inset-x-0 top-0 z-40 hidden h-8 border-b border-line/90 bg-paper/95 backdrop-blur md:block">
    <div class="section-wrap flex h-full items-center justify-between">
      <p class="text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-muted">
        Graphic Designer + Producer
      </p>
      <p class="max-w-[34rem] truncate text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-muted">
        {{ activeSkill }}
      </p>
      <p class="text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-muted">
        Brampton, ON
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
