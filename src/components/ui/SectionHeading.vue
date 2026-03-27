<template>
  <div ref="root" class="mb-12 space-y-4" data-reveal>
    <p v-if="eyebrow" class="text-xs font-semibold uppercase tracking-[0.22em] text-muted">
      {{ eyebrow }}
    </p>
    <h2
      ref="titleRef"
      class="max-w-4xl pb-1 font-display text-4xl font-semibold leading-[1.12] tracking-[-0.03em] text-ink md:text-6xl"
    >
      {{ title }}
    </h2>
    <p v-if="description" class="max-w-2xl text-base leading-relaxed text-muted md:text-lg">
      {{ description }}
    </p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSplitHeading } from '../../composables/useSplitHeading';

const props = defineProps({
  description: {
    type: String,
    default: ''
  },
  eyebrow: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true
  }
});

const root = ref(null);
const titleRef = ref(null);

useSplitHeading(titleRef, root);
</script>
