<template>
  <div class="registration-strip" :class="`registration-strip--${tone}`" data-motion-rule>
    <span class="registration-strip__index">{{ index }}</span>
    <strong>{{ label }}</strong>
    <span>{{ detail }}</span>
    <span class="registration-strip__mark" aria-hidden="true">+</span>
  </div>
</template>

<script setup>
defineProps({
  detail: { type: String, default: 'JVN / ON.CA' },
  index: { type: String, default: '00' },
  label: { type: String, required: true },
  tone: { type: String, default: 'dark' }
});
</script>

<style scoped>
.registration-strip {
  position: relative;
  z-index: 6;
  display: grid;
  grid-template-columns: 4rem minmax(0, 1fr) auto 1rem;
  gap: 1rem;
  align-items: center;
  width: min(100%, 90rem);
  margin-inline: auto;
  border-top: 1px solid currentColor;
  padding-top: 0.55rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.62rem;
  font-weight: 400;
  line-height: 1.3;
}

.registration-strip strong {
  font-weight: 500;
  text-transform: uppercase;
}

.registration-strip__index,
.registration-strip__mark {
  color: var(--blue);
}

.registration-strip__mark {
  justify-self: end;
  font-size: 1rem;
  line-height: 0.5;
}

.registration-strip--light {
  color: var(--paper-cool);
}

.registration-strip--light .registration-strip__index,
.registration-strip--light .registration-strip__mark {
  color: var(--signal-red);
}

@media (max-width: 560px) {
  .registration-strip {
    grid-template-columns: 2.2rem 1fr 0.8rem;
  }

  .registration-strip > span:nth-child(3) {
    display: none;
  }
}
</style>
