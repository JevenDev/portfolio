<template>
  <footer class="border-t border-line bg-shell/70 py-10">
    <div class="section-wrap flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div class="space-y-2">
        <p class="font-display text-sm font-semibold uppercase tracking-[0.16em] text-ink">JVN Graphics</p>
        <p class="text-sm text-muted">Graphic Designer and Producer based in Brampton, ON.</p>
      </div>

      <ul class="flex flex-wrap gap-3">
        <li v-for="social in socials" :key="social.url">
          <a
            :href="social.url"
            target="_blank"
            rel="noreferrer"
            class="focus-ring inline-flex border border-line px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink transition hover:border-ink/40"
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