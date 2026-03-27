<template>
  <article class="group frame-block flex h-full flex-col transition duration-300 hover:border-ink/30" data-reveal>
    <button
      type="button"
      class="focus-ring block h-full text-left"
      :aria-label="`Open details for ${artist.name}`"
      @click="$emit('open', artist)"
    >
      <div class="flex h-full flex-col gap-5 p-5 md:p-6">
        <div class="flex items-start gap-4 border-b border-line pb-4">
          <img
            v-if="artist.image"
            :src="artist.image"
            :alt="artist.name"
            class="h-16 w-16 shrink-0 border border-line object-cover"
            loading="lazy"
          />
          <div class="space-y-2">
            <h3 class="font-display text-2xl font-semibold tracking-[-0.03em] text-ink">{{ artist.name }}</h3>
            <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">{{ artist.yearRange }}</p>
          </div>
        </div>

        <p class="text-sm leading-relaxed text-ink/90">{{ artist.role }}</p>

        <p class="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted">
          {{ artist.notableWorks?.length || 0 }} notable credits
        </p>
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
