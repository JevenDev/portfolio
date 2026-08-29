<template>
  <section id="contact" class="contact" aria-labelledby="contact-title" data-motion-section>
    <svg class="contact__web" viewBox="0 0 1000 600" aria-hidden="true">
      <path data-draw-path d="M-50 480C170 270 370 360 520 210S760 -60 1060 160" />
      <path data-draw-path d="M100 -40C220 180 330 150 520 210S800 440 940 680" />
    </svg>

    <RegistrationStrip index="04" label="Contact" detail="Available for selected projects" tone="light" />

    <div class="contact__main">
      <p class="section-kicker">Contact / New work</p>
      <h2 id="contact-title" data-poster-heading>Let’s make something worth keeping.</h2>
      <div class="contact__copy" data-poster-copy>
        <p>For identity, artwork, web, production, or a project that crosses those lines, send a note with the essentials.</p>
        <a :href="`mailto:${email}`">{{ email }} ↗</a>
      </div>
    </div>

    <ul class="contact__links">
      <li v-for="social in socials" :key="social.url">
        <a :href="social.url" target="_blank" rel="noreferrer">{{ social.label }} ↗</a>
      </li>
    </ul>
    <span class="contact__disc" data-poster-drift aria-hidden="true"></span>
  </section>
</template>

<script setup>
import RegistrationStrip from '../ui/RegistrationStrip.vue';

defineProps({ email: { type: String, default: '' }, socials: { type: Array, default: () => [] } });
</script>

<style scoped>
.contact {
  position: relative;
  min-height: 52rem;
  overflow: hidden;
  background: var(--blue);
  color: var(--paper-cool);
  padding: clamp(4rem, 9vw, 9rem) clamp(1.25rem, 3vw, 3rem);
  isolation: isolate;
}

.contact__web {
  position: absolute;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: var(--paper-cool);
  stroke-width: 1.2;
  opacity: 0.42;
}

.contact__main,
.contact__links {
  position: relative;
  z-index: 2;
  width: min(100%, 90rem);
  margin-inline: auto;
}

.contact__main {
  display: grid;
  grid-template-columns: 0.25fr 1fr 0.55fr;
  gap: clamp(2rem, 5vw, 5rem);
  align-items: start;
  padding-top: clamp(3rem, 7vw, 7rem);
}

.contact__main .section-kicker {
  margin: 0;
}

.contact h2 {
  max-width: 9ch;
  margin: 0;
  font-size: clamp(4rem, 9vw, 10rem);
  font-weight: 610;
  letter-spacing: -0.085em;
  line-height: 0.72;
}

.contact__copy {
  align-self: end;
  margin-top: clamp(12rem, 24vw, 24rem);
}

.contact__copy p {
  max-width: 28rem;
  margin: 0 0 2.5rem;
  font-size: 0.82rem;
}

.contact__copy a {
  display: block;
  border-bottom: 1px solid currentColor;
  padding-bottom: 0.45rem;
  font-size: clamp(1.05rem, 1.9vw, 2rem);
  letter-spacing: -0.04em;
  overflow-wrap: anywhere;
}

.contact__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem 1.4rem;
  margin-top: clamp(4rem, 8vw, 8rem);
  border-top: 1px solid var(--rule-white);
  padding: 0.7rem 0 0;
  list-style: none;
  font-size: 0.68rem;
}

.contact__links a:hover,
.contact__links a:focus-visible,
.contact__copy a:hover,
.contact__copy a:focus-visible {
  color: var(--signal-red);
}

.contact__disc {
  position: absolute;
  right: -10vw;
  bottom: -17vw;
  z-index: -1;
  width: min(44vw, 42rem);
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--signal-red);
}

.contact__disc::after {
  position: absolute;
  inset: 33%;
  border-radius: 50%;
  background: var(--blue);
  content: '';
}

@media (max-width: 800px) {
  .contact__main {
    grid-template-columns: 1fr;
  }

  .contact__copy {
    margin-top: 3rem;
  }
}

@media (max-width: 560px) {
  .contact {
    min-height: 48rem;
  }

  .contact h2 {
    font-size: clamp(4rem, 20vw, 6rem);
  }

  .contact__disc {
    width: 22rem;
    right: -9rem;
    bottom: -8rem;
  }
}
</style>
