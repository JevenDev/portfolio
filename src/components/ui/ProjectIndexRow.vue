<template>
  <article class="index-row" :class="{ 'index-row--active': active }" @mouseenter="activate" @focusin="activate">
    <RouterLink :to="`/work/${project.id}/`">
      <span class="index-row__number meta-type">{{ displayIndex }}</span>
      <strong>{{ project.title }}</strong>
      <span>{{ category }}</span>
      <span>{{ project.year }}</span>
      <span aria-hidden="true">↗</span>
    </RouterLink>
  </article>
</template>

<script setup>
import { computed } from 'vue';
import { RouterLink } from 'vue-router';
import { getProjectCategory } from '../../utils/portfolio';

const props = defineProps({
  active: { type: Boolean, default: false },
  index: { type: Number, required: true },
  project: { type: Object, required: true }
});
const emit = defineEmits(['activate']);
const displayIndex = computed(() => String(props.index + 1).padStart(3, '0'));
const category = computed(() => getProjectCategory(props.project));
function activate() { emit('activate', props.project); }
</script>

<style scoped>
.index-row {
  border-bottom: 1px solid var(--rule);
}

.index-row a {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1.5fr) minmax(9rem, 0.7fr) 8rem 1rem;
  gap: 1rem;
  align-items: center;
  min-height: 5rem;
  padding: 0.65rem 0;
  font-size: 0.7rem;
}

.index-row strong {
  font-size: clamp(1rem, 1.9vw, 1.65rem);
  font-weight: 540;
  letter-spacing: -0.035em;
  line-height: 1.05;
}

.index-row__number,
.index-row a > span:last-child {
  color: var(--blue);
}

.index-row a > span:last-child {
  justify-self: end;
}

.index-row--active,
.index-row:hover,
.index-row:focus-within {
  color: var(--blue);
}

@media (max-width: 680px) {
  .index-row a {
    grid-template-columns: 2.5rem 1fr auto;
    gap: 0.65rem;
    min-height: 6rem;
  }

  .index-row a > span:nth-child(3) {
    grid-column: 2;
  }

  .index-row a > span:nth-child(4) {
    grid-column: 3;
    grid-row: 2;
  }

  .index-row a > span:last-child {
    grid-column: 3;
    grid-row: 1;
  }
}
</style>
