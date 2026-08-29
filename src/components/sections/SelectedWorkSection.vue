<template>
  <section id="outputs" class="work" aria-labelledby="work-title">
    <RegistrationStrip class="work__registration" index="01" label="Selected work" detail="Six project chapters" tone="light" />

    <header class="work__head" data-motion-section>
      <p class="meta-type">Selected projects / 01–06</p>
      <h2 id="work-title" data-poster-heading>A working index of images, identities, interfaces, and sound.</h2>
      <RouterLink to="/archive/" data-poster-copy>Everything in the archive ↗</RouterLink>
    </header>

    <div class="work__chapters">
      <RouterLink
        v-for="(project, index) in projects"
        :key="project.id"
        :to="`/work/${project.id}/`"
        class="work-project"
        data-motion-section
      >
        <span class="work-project__number" data-poster-drift>{{ String(index + 1).padStart(2, '0') }}</span>
        <div class="work-project__media registered-media" data-poster-media>
          <GlitchMedia :src="project.thumbCard || project.thumb" :alt="project.title" treatment="full" />
        </div>
        <div class="work-project__copy">
          <p class="meta-type" data-poster-copy>{{ getProjectCategory(project) }} / {{ project.year }}</p>
          <h3 data-poster-heading>{{ project.title }}</h3>
          <span data-poster-copy>Open project ↗</span>
        </div>
      </RouterLink>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import { getProjectCategory } from '../../utils/portfolio';
import GlitchMedia from '../ui/GlitchMedia.vue';
import RegistrationStrip from '../ui/RegistrationStrip.vue';

defineProps({ projects: { type: Array, default: () => [] } });
</script>

<style scoped>
.work {
  background: var(--black);
  color: var(--paper-cool);
  padding-top: clamp(2rem, 4vw, 4rem);
}

.work__registration {
  width: calc(100% - clamp(2.5rem, 6vw, 6rem));
}

.work__head {
  display: grid;
  grid-template-columns: 0.35fr 1fr auto;
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: start;
  min-height: 26rem;
  padding: clamp(4rem, 9vw, 9rem) clamp(1.25rem, 3vw, 3rem);
}

.work__head p,
.work__head h2 {
  margin: 0;
}

.work__head h2 {
  max-width: 14ch;
  color: var(--blue-soft);
  font-size: clamp(3rem, 7vw, 7.5rem);
  font-weight: 480;
  letter-spacing: -0.075em;
  line-height: 0.88;
}

.work__head > a {
  display: inline-flex;
  min-height: 1.75rem;
  align-items: center;
  border-bottom: 1px solid currentColor;
  font-size: 0.72rem;
}

.work-project {
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  min-height: min(56rem, 86svh);
  overflow: hidden;
  padding: clamp(2rem, 5vw, 5rem) clamp(1.25rem, 3vw, 3rem);
  isolation: isolate;
}

.work-project:nth-child(4n + 1) {
  background: var(--paper);
  color: var(--black);
}

.work-project:nth-child(4n + 2) {
  background: var(--blue);
  color: var(--paper-cool);
}

.work-project:nth-child(4n + 3) {
  background: var(--signal-red);
  color: var(--black);
}

.work-project:nth-child(4n) {
  background: var(--black);
  color: var(--paper-cool);
}

.work-project__number {
  position: absolute;
  top: -0.11em;
  left: -0.035em;
  z-index: -1;
  color: currentColor;
  font-size: clamp(10rem, 26vw, 28rem);
  font-weight: 700;
  letter-spacing: -0.1em;
  line-height: 0.75;
  opacity: 0.12;
}

.work-project__media {
  grid-column: 1 / span 8;
  align-self: center;
  height: min(66vh, 43rem);
  background: var(--paper-cool);
}

.work-project__copy {
  grid-column: 8 / -1;
  align-self: end;
  z-index: 2;
  margin-left: -2rem;
  padding-bottom: clamp(1rem, 5vw, 5rem);
}

.work-project:nth-child(even) .work-project__media {
  grid-column: 5 / -1;
}

.work-project:nth-child(even) .work-project__copy {
  grid-column: 1 / span 6;
  grid-row: 1;
  margin-right: -2rem;
  margin-left: 0;
}

.work-project__copy p {
  width: fit-content;
  margin: 0 0 1rem;
  background: var(--black);
  padding: 0.3rem 0.45rem;
  color: var(--paper-cool);
}

.work-project:nth-child(4n + 2) .work-project__copy p,
.work-project:nth-child(4n) .work-project__copy p {
  background: var(--paper-cool);
  color: var(--black);
}

.work-project__copy h3 {
  max-width: 10ch;
  margin: 0;
  font-size: clamp(3rem, 7.2vw, 8rem);
  font-weight: 630;
  letter-spacing: -0.08em;
  line-height: 0.78;
}

.work-project__copy > span {
  display: inline-block;
  margin-top: 1.5rem;
  border-bottom: 1px solid currentColor;
  padding-bottom: 0.2rem;
  font-size: 0.72rem;
}

@media (max-width: 760px) {
  .work__head {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .work__head h2 {
    font-size: clamp(2.8rem, 13vw, 5rem);
  }

  .work__head > a {
    justify-self: start;
  }

  .work-project {
    display: block;
    min-height: 0;
    padding-block: 4rem;
  }

  .work-project__media,
  .work-project:nth-child(even) .work-project__media {
    width: 88%;
    height: auto;
    aspect-ratio: 4 / 3;
    margin-left: auto;
  }

  .work-project:nth-child(even) .work-project__media {
    margin-right: auto;
    margin-left: 0;
  }

  .work-project__copy,
  .work-project:nth-child(even) .work-project__copy {
    margin: -1rem 0 0;
    padding: 0;
  }

  .work-project__copy h3 {
    font-size: clamp(3rem, 16vw, 5.5rem);
  }

  .work-project__number {
    font-size: 14rem;
  }
}
</style>
