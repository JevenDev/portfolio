<template>
  <div ref="root" class="space-y-4" data-reveal>
    <p v-if="eyebrow" class="eyebrow-label">
      {{ eyebrow }}
    </p>
    <h2
      ref="titleRef"
      class="max-w-5xl pb-1 font-display text-[clamp(2.2rem,6.2vw,5.25rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-ink"
    >
      {{ title }}
    </h2>
    <p v-if="description" class="editorial-lead">
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
