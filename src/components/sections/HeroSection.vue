<template>
  <section class="hero" aria-labelledby="hero-title" data-motion-intro>
    <svg class="hero__web" viewBox="0 0 1000 700" aria-hidden="true">
      <path data-draw-path d="M-80 230C150 30 390 70 510 310S850 690 1090 370" />
      <path data-draw-path d="M-30 520C210 670 350 560 470 350S770 -20 1040 160" />
      <path data-draw-path d="M140 -40C90 210 250 270 510 310S910 410 980 760" />
      <path data-draw-path d="M770 -50C690 160 580 220 510 310S380 600 210 760" />
    </svg>

    <div class="hero__identity">
      <p class="meta-type" data-hero-meta>Independent practice / 2019–2026</p>
      <h1 id="hero-title" aria-label="Jeven Randhawa">
        <span class="hero__title-line"><span data-hero-word>Jeven</span></span>
        <span class="hero__title-line"><span data-hero-word>Randhawa</span></span>
      </h1>
    </div>

    <div class="hero__gallery" aria-label="Featured projects">
      <RouterLink
        v-for="(project, index) in heroProjects"
        :key="project.id"
        :class="`hero-print hero-print--${index + 1}`"
        :to="`/work/${project.id}/`"
        data-hero-print
      >
        <div class="hero-print__media registered-media">
          <GlitchMedia
            :src="project.thumbDisplay || project.thumbCard || project.thumb"
            :mobile-src="project.thumbCard"
            :alt="project.title"
            :eager="index === 0"
            fit="contain"
            treatment="full"
          />
        </div>
        <div class="hero-print__caption">
          <span class="meta-type">0{{ index + 1 }}</span>
          <strong>{{ project.title }}</strong>
          <span aria-hidden="true">↗</span>
        </div>
      </RouterLink>
    </div>

    <div class="hero__role" data-hero-note>
      <p>Graphic design, art direction, web, and sound for artists, teams, and independent releases.</p>
      <nav aria-label="Introduction links">
        <RouterLink to="/#outputs">Selected work</RouterLink>
        <RouterLink to="/archive/">Complete archive</RouterLink>
        <a :href="`mailto:${email}`">Contact</a>
      </nav>
    </div>

    <p class="hero__edition meta-type" data-hero-detail>Issue 01<br />Ontario, Canada<br />Available worldwide</p>
    <span class="hero__seal" data-hero-seal aria-hidden="true">J/R</span>
    <span class="hero__side-note hero__side-note--a meta-type" data-hero-detail aria-hidden="true">Selected work / 01–03</span>
    <span class="hero__side-note hero__side-note--b meta-type" data-hero-detail aria-hidden="true">Scroll to explore / ↓</span>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router';
import GlitchMedia from '../ui/GlitchMedia.vue';

defineProps({
  email: { type: String, default: '' },
  heroProjects: { type: Array, default: () => [] }
});
</script>

<style scoped>
.hero {
  position: relative;
  min-height: clamp(58rem, 76vw, 76rem);
  overflow: hidden;
  background: var(--paper-cool);
  color: var(--black);
  isolation: isolate;
}

.hero__web {
  position: absolute;
  inset: 0;
  z-index: -3;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: var(--blue);
  stroke-width: 0.8;
  opacity: 0.32;
  vector-effect: non-scaling-stroke;
}

.hero__identity {
  position: absolute;
  inset: clamp(2rem, 5vw, 5rem) auto auto clamp(1.25rem, 3vw, 3rem);
  z-index: 2;
  pointer-events: none;
}

.hero__identity p {
  margin: 0;
  color: var(--blue);
}

.hero h1 {
  margin: clamp(1rem, 3vw, 3rem) 0 0;
  font-size: clamp(9rem, 19vw, 20rem);
  font-weight: 680;
  letter-spacing: var(--display-tracking);
  line-height: 0.83;
}

.hero__title-line {
  display: block;
  padding-right: 0.08em;
}

.hero__title-line > span {
  display: block;
}

.hero__title-line:last-child {
  margin-left: 7vw;
  color: var(--blue);
  font-size: 0.69em;
  letter-spacing: var(--display-tracking);
  line-height: 0.95;
}

.hero__gallery {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.hero-print {
  position: absolute;
  display: block;
  border: 0.5rem solid var(--paper-cool);
  background: var(--paper-cool);
  box-shadow: 0 0 0 1px var(--black);
}

.hero-print--1 {
  top: 43%;
  left: 37%;
  z-index: 3;
  width: min(32vw, 32rem);
  transform: rotate(-3deg);
}

.hero-print--2 {
  bottom: 10%;
  left: 6%;
  z-index: 4;
  width: min(29vw, 28rem);
  transform: rotate(2deg);
}

.hero-print--3 {
  right: 4%;
  bottom: 11%;
  z-index: 2;
  width: min(23vw, 23rem);
  transform: rotate(3deg);
}

.hero-print__media {
  aspect-ratio: 1;
  overflow: hidden;
}

.hero-print--2 .hero-print__media {
  aspect-ratio: 16 / 9;
}

.hero-print__caption {
  display: grid;
  grid-template-columns: 1.8rem 1fr auto;
  gap: 0.5rem;
  align-items: baseline;
  padding-top: 0.5rem;
}

.hero-print__caption strong {
  font-size: clamp(0.875rem, 1.2vw, 1rem);
  font-weight: 560;
  letter-spacing: -0.025em;
  line-height: 1.3;
}

.hero-print:hover strong,
.hero-print:focus-visible strong {
  color: var(--blue);
}

.hero__role {
  position: absolute;
  top: 8%;
  right: clamp(1.25rem, 3vw, 3rem);
  z-index: 6;
  width: min(23rem, 27vw);
  border-top: 0.4rem solid var(--signal-red);
  background: var(--paper-cool);
  color: var(--black);
  padding: 1rem 0 0;
}

.hero__role p {
  margin: 0;
  font-size: clamp(1rem, 1.5vw, 1.3rem);
  font-weight: 520;
  line-height: 1.45;
}

.hero__role nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-top: 1.5rem;
  border-top: 1px solid currentColor;
  padding-top: 0.55rem;
  font-size: 0.8125rem;
}

.hero__role a:hover,
.hero__role a:focus-visible {
  text-decoration: underline;
  text-underline-offset: 0.2rem;
}

.hero__role a {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
}

.hero__edition {
  position: absolute;
  right: clamp(1.25rem, 3vw, 3rem);
  bottom: 1.5rem;
  z-index: 5;
  margin: 0;
  text-align: right;
}

.hero__seal {
  position: absolute;
  top: 43%;
  left: 72%;
  z-index: 5;
  display: grid;
  width: clamp(4rem, 6vw, 6rem);
  aspect-ratio: 1;
  place-items: center;
  border-radius: 50%;
  background: var(--signal-red);
  color: var(--black);
  font-family: 'IBM Plex Mono', monospace;
  font-size: clamp(0.8rem, 1.5vw, 1.3rem);
  transform: rotate(10deg);
}

.hero__side-note {
  position: absolute;
  z-index: 5;
  margin: 0;
  color: var(--blue);
  writing-mode: vertical-rl;
}

.hero__side-note--a {
  top: 38%;
  left: 1rem;
}

.hero__side-note--b {
  top: 45%;
  right: 0.75rem;
}

@media (max-width: 820px) {
  .hero {
    min-height: 64rem;
  }

  .hero h1 {
    font-size: clamp(8rem, 25vw, 13rem);
  }

  .hero__title-line:last-child {
    margin-left: 5vw;
    font-size: 0.63em;
  }

  .hero__role {
    top: 30%;
    right: 6%;
    width: 42%;
  }

  .hero-print--1 {
    top: 54%;
    left: 28%;
    width: 43%;
  }

  .hero-print--2 {
    bottom: 8%;
    left: 5%;
    width: 35%;
  }

  .hero-print--3 {
    right: 5%;
    bottom: 7%;
    width: 29%;
  }

  .hero__seal {
    top: 40%;
    left: 17%;
  }
}

@media (max-width: 560px) {
  .hero {
    display: grid;
    grid-template-columns: 1fr;
    min-height: 0;
    padding: 2.5rem var(--page-gutter) 1.5rem;
  }

  .hero__identity {
    position: relative;
    inset: auto;
  }

  .hero h1 {
    margin-top: 1.5rem;
    font-size: 29vw;
  }

  .hero__title-line:last-child {
    margin-left: 4vw;
    font-size: 0.58em;
  }

  .hero__role {
    position: relative;
    inset: auto;
    grid-row: 2;
    width: 82%;
    margin: 2rem 0 0 auto;
  }

  .hero__role p {
    font-size: 1rem;
  }

  .hero__role nav {
    gap: 0.25rem 0.75rem;
    margin-top: 1rem;
  }

  .hero__gallery {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem 1rem;
    padding-block: 2.5rem;
  }

  .hero-print {
    position: relative;
    inset: auto;
    width: 100%;
    border-width: 0.3rem;
  }

  .hero-print--1 {
    grid-column: 1 / -1;
    width: 78%;
    margin-inline: auto;
  }

  .hero-print--2 {
    align-self: center;
    transform: rotate(-3deg);
  }

  .hero-print--3 {
    transform: rotate(4deg);
  }

  .hero-print__caption {
    grid-template-columns: 1fr auto;
    gap: 0.35rem;
  }

  .hero-print__caption .meta-type {
    grid-column: 1 / -1;
  }

  .hero-print__caption strong {
    font-size: 0.8125rem;
  }

  .hero__edition {
    position: relative;
    inset: auto;
    border-top: 1px solid var(--rule);
    padding-top: 1rem;
  }

  .hero__seal {
    top: 37%;
    left: 3%;
    width: 3rem;
  }

  .hero__side-note {
    display: none;
  }
}
</style>
