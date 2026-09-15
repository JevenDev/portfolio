<template>
  <section id="outputs" class="work" aria-labelledby="work-title">
    <RegistrationStrip class="work__registration" index="01" label="Selected work" detail="Six project chapters" tone="light" />

    <header class="work__head" data-motion-section>
      <h2 id="work-title" data-poster-heading>Selected <span>work.</span></h2>
      <div class="work__intro" data-poster-copy>
        <p>A working index of images, identities, interfaces, and sound.</p>
        <RouterLink to="/archive/">Everything in the archive ↗</RouterLink>
      </div>
    </header>

    <div class="work__chapters">
      <RouterLink
        v-for="(project, index) in projects"
        :key="project.id"
        :to="`/work/${project.id}/`"
        class="work-project"
        data-motion-section
      >
        <div class="work-project__media registered-media" data-poster-media>
          <GlitchMedia
            :src="project.thumbDisplay || project.thumb"
            :mobile-src="project.thumbCard"
            :alt="project.title"
            fit="natural"
            treatment="full"
          />
        </div>
        <div class="work-project__copy">
          <span class="work-project__number">{{ String(index + 1).padStart(2, '0') }}</span>
          <p class="meta-type" data-poster-copy>{{ getProjectCategory(project) }} / {{ project.year }}</p>
          <h3 data-poster-heading>{{ project.title }}</h3>
          <span class="work-project__link" data-poster-copy>Open project ↗</span>
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
  grid-template-columns: 1.5fr 0.5fr;
  gap: clamp(1.5rem, 4vw, 4rem);
  align-items: end;
  min-height: 26rem;
  padding: clamp(3rem, 6vw, 6rem) var(--page-gutter);
}

.work__head p,
.work__head h2 {
  margin: 0;
}

.work__head h2 {
  max-width: 10ch;
  color: var(--blue-soft);
  font-size: clamp(5rem, 13vw, 13rem);
  font-weight: 480;
  letter-spacing: var(--display-tracking);
  line-height: 0.87;
}

.work__intro a {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
  border-bottom: 1px solid currentColor;
  font-size: 0.875rem;
}

.work__head h2 span {
  display: block;
  margin-left: 0.8em;
  color: var(--paper-cool);
}

.work__intro p {
  max-width: 26ch;
  margin-bottom: 1.5rem;
  font-size: clamp(1rem, 1.5vw, 1.25rem);
  line-height: 1.6;
}

.work-project {
  position: relative;
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: 2rem;
  align-items: center;
  min-height: clamp(36rem, 62vw, 60rem);
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
  background: var(--paper-cool);
  color: var(--blue);
}

.work-project:nth-child(4n) {
  background: var(--black);
  color: var(--paper-cool);
}

.work-project__number {
  display: block;
  margin-bottom: 2rem;
  color: currentColor;
  font-size: clamp(4rem, 10vw, 10rem);
  font-weight: 700;
  letter-spacing: var(--display-tracking);
  line-height: 1;
  opacity: 0.6;
}

.work-project__media {
  grid-column: 1 / span 7;
  align-self: center;
  height: auto;
  border: 0.5rem solid var(--paper-cool);
  transform: rotate(-1.5deg);
  background: var(--paper-cool);
}

.work-project__copy {
  position: relative;
  grid-column: 8 / -1;
  align-self: center;
  z-index: 2;
  margin-left: 0;
  padding-block: 2rem;
}

.work-project:nth-child(even) .work-project__media {
  grid-column: 6 / -1;
  transform: rotate(1.5deg);
}

.work-project:nth-child(even) .work-project__copy {
  grid-column: 1 / span 5;
  grid-row: 1;
  margin-right: 0;
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
  max-width: 12ch;
  margin: 0;
  overflow-wrap: anywhere;
  font-size: clamp(2.5rem, 5.5vw, 6rem);
  font-weight: 630;
  letter-spacing: var(--display-tracking);
  line-height: 0.98;
}

.work-project__link {
  display: inline-block;
  margin-top: 1.5rem;
  border-bottom: 1px solid currentColor;
  padding-bottom: 0.2rem;
  font-size: 0.875rem;
}

@media (max-width: 760px) {
  .work__head {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .work__head h2 {
    font-size: clamp(4rem, 19vw, 8rem);
  }

  .work__intro a {
    justify-self: start;
  }

  .work-project {
    display: block;
    min-height: 0;
    padding-block: 4rem;
  }

  .work-project__media,
  .work-project:nth-child(even) .work-project__media {
    width: 94%;
    height: auto;
    margin-left: auto;
  }

  .work-project:nth-child(even) .work-project__media {
    margin-right: auto;
    margin-left: 0;
  }

  .work-project__copy,
  .work-project:nth-child(even) .work-project__copy {
    margin: 2rem 0 0;
    padding: 0;
  }

  .work-project__copy h3 {
    max-width: 17ch;
    font-size: clamp(2.5rem, 11vw, 5rem);
  }

  .work-project__number {
    margin-bottom: 1.5rem;
    font-size: 4rem;
  }
}
</style>
