<template>
  <article class="group flex h-full flex-col border border-line bg-paper transition duration-300 hover:border-ink/30 hover:shadow-card" data-reveal>
    <button
      type="button"
      class="focus-ring block h-full text-left"
      :aria-label="`Open details for ${artist.name}`"
      @click="$emit('open', artist)"
    >
      <div class="flex h-full flex-col gap-5 p-6">
        <div class="flex items-start gap-4">
          <img
            v-if="artist.image"
            :src="artist.image"
            :alt="artist.name"
            class="h-16 w-16 shrink-0 rounded-full object-cover"
            loading="lazy"
          />
          <div class="space-y-2">
            <h3 class="font-display text-2xl font-semibold tracking-[-0.02em] text-ink">{{ artist.name }}</h3>
            <p class="text-sm font-medium uppercase tracking-[0.14em] text-muted">{{ artist.yearRange }}</p>
          </div>
        </div>

        <p class="text-base leading-relaxed text-ink/90">{{ artist.role }}</p>

        <p class="text-sm text-muted">{{ artist.notableWorks?.length || 0 }} notable credits</p>
      </div>
    </button>
  </article>
</template>

<script setup>
defineProps({
  artist: {
    type: Object,
    required: true
  }
});

defineEmits(['open']);
</script>