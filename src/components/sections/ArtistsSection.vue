<template>
  <section id="artists" class="section-shell">
    <div ref="root" class="section-wrap">
      <SectionHeading
        eyebrow="Collaborators"
        title="Artists I've Worked With"
        description="Creative partners across engineering, production, and visual direction work."
      />

      <div class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <ArtistCard v-for="artist in artists" :key="artist.name" :artist="artist" @open="emit('open', $event)" />
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { useScrollReveal } from '../../composables/useScrollReveal';
import ArtistCard from '../ui/ArtistCard.vue';
import SectionHeading from '../ui/SectionHeading.vue';

defineProps({
  artists: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['open']);

const root = ref(null);
useScrollReveal(root);
</script>