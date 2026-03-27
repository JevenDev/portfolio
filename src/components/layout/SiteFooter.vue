<template>
  <footer class="border-t border-line bg-paper py-8 md:py-10">
    <div class="section-wrap grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
      <div class="space-y-3">
        <p class="text-xs font-semibold uppercase tracking-[0.18em] text-muted">JVN Graphics</p>
        <p class="font-display text-2xl font-semibold tracking-[-0.03em] text-ink md:text-3xl">
          Graphic Design + Music Production
        </p>
        <p class="text-base text-muted">Brampton, Ontario</p>
      </div>

      <ul class="flex flex-wrap gap-2 md:justify-end">
        <li v-for="social in socials" :key="social.url">
          <a
            :href="social.url"
            target="_blank"
            rel="noreferrer"
            class="focus-ring inline-flex border border-line px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-ink/40"
          >
            {{ social.label }}
          </a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
defineProps({
  socials: {
    type: Array,
    default: () => []
  }
});
</script>

