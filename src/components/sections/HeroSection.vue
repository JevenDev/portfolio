<template>
  <section class="hero" aria-labelledby="hero-title">
    <svg class="hero__web" viewBox="0 0 1000 700" aria-hidden="true">
      <path d="M-80 230C150 30 390 70 510 310S850 690 1090 370" />
      <path d="M-30 520C210 670 350 560 470 350S770 -20 1040 160" />
      <path d="M140 -40C90 210 250 270 510 310S910 410 980 760" />
      <path d="M770 -50C690 160 580 220 510 310S380 600 210 760" />
    </svg>

    <div class="hero__identity">
      <p class="meta-type">Independent practice / 2019–2026</p>
      <h1 id="hero-title">
        <span>Jeven</span>
        <span>Randhawa</span>
      </h1>
    </div>

    <div class="hero__gallery" aria-label="Featured projects">
      <RouterLink
        v-for="(project, index) in heroProjects"
        :key="project.id"
        :class="`hero-print hero-print--${index + 1}`"
        :to="`/work/${project.id}`"
      >
        <div class="hero-print__media">
          <GlitchMedia
            :src="project.thumbCard || project.thumb"
            :alt="project.title"
            :eager="index === 0"
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

    <div class="hero__role">
      <p>Graphic design, art direction, web, and sound for artists, teams, and independent releases.</p>
      <nav aria-label="Introduction links">
        <RouterLink to="/#outputs">Selected work</RouterLink>
        <RouterLink to="/archive">Complete archive</RouterLink>
        <a :href="`mailto:${email}`">Contact</a>
      </nav>
    </div>

    <p class="hero__edition meta-type">Issue 01<br />Ontario, Canada<br />Available worldwide</p>
    <span class="hero__seal" aria-hidden="true">J/R</span>
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
  min-height: max(52rem, calc(100svh - var(--header-height)));
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
  stroke-width: 1.4;
  vector-effect: non-scaling-stroke;
}

.hero__identity {
  position: absolute;
  inset: clamp(2rem, 5vw, 5rem) auto auto clamp(1.25rem, 3vw, 3rem);
  z-index: -1;
}

.hero__identity p {
  margin: 0;
  color: var(--blue);
}

.hero h1 {
  margin: clamp(1rem, 3vw, 3rem) 0 0;
  font-size: clamp(8rem, 19vw, 20rem);
  font-weight: 680;
  letter-spacing: -0.095em;
  line-height: 0.6;
}

.hero h1 span {
  display: block;
}

.hero h1 span:last-child {
  margin-left: 13vw;
  color: var(--blue);
  font-size: 0.62em;
}

.hero__gallery {
  position: absolute;
  inset: 0;
}

.hero-print {
  position: absolute;
  display: block;
  border: 0.55rem solid var(--paper-cool);
  background: var(--paper-cool);
  box-shadow: 0 0 0 1px var(--black);
}

.hero-print--1 {
  top: 20%;
  left: 38%;
  z-index: 3;
  width: min(38vw, 36rem);
  transform: rotate(-2.2deg);
}

.hero-print--2 {
  bottom: 4%;
  left: 10%;
  z-index: 4;
  width: min(26vw, 24rem);
  transform: rotate(4deg);
}

.hero-print--3 {
  right: 3%;
  bottom: 13%;
  z-index: 2;
  width: min(27vw, 25rem);
  transform: rotate(-4deg);
}

.hero-print__media {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.hero-print--2 .hero-print__media,
.hero-print--3 .hero-print__media {
  aspect-ratio: 1;
}

.hero-print__caption {
  display: grid;
  grid-template-columns: 1.8rem 1fr auto;
  gap: 0.5rem;
  align-items: baseline;
  padding-top: 0.5rem;
}

.hero-print__caption strong {
  font-size: clamp(0.72rem, 1.2vw, 0.95rem);
  font-weight: 560;
  letter-spacing: -0.025em;
  line-height: 1.05;
}

.hero-print:hover strong,
.hero-print:focus-visible strong {
  color: var(--blue);
}

.hero__role {
  position: absolute;
  top: 6%;
  right: clamp(1.25rem, 3vw, 3rem);
  z-index: 6;
  width: min(24rem, 27vw);
  background: var(--signal-red);
  color: var(--black);
  padding: 1rem;
  transform: rotate(2deg);
}

.hero__role p {
  margin: 0;
  font-size: clamp(0.85rem, 1.4vw, 1.08rem);
  font-weight: 520;
  line-height: 1.35;
}

.hero__role nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-top: 2.5rem;
  border-top: 1px solid currentColor;
  padding-top: 0.55rem;
  font-size: 0.68rem;
}

.hero__role a:hover,
.hero__role a:focus-visible {
  text-decoration: underline;
  text-underline-offset: 0.2rem;
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
  bottom: 5%;
  left: 43%;
  z-index: 5;
  display: grid;
  width: clamp(4rem, 7vw, 7rem);
  aspect-ratio: 1;
  place-items: center;
  border-radius: 50%;
  background: var(--blue);
  color: var(--paper-cool);
  font-family: 'IBM Plex Mono', monospace;
  font-size: clamp(0.8rem, 1.5vw, 1.3rem);
  transform: rotate(10deg);
}

@media (max-width: 820px) {
  .hero {
    min-height: 58rem;
  }

  .hero h1 {
    font-size: clamp(6rem, 24vw, 12rem);
  }

  .hero h1 span:last-child {
    margin-left: 4vw;
  }

  .hero__role {
    top: 25%;
    right: 1.25rem;
    width: min(22rem, 44vw);
  }

  .hero-print--1 {
    top: 38%;
    left: 26%;
    width: 52vw;
  }

  .hero-print--2 {
    bottom: 4%;
    left: 3%;
    width: 34vw;
  }

  .hero-print--3 {
    right: 2%;
    bottom: 9%;
    width: 32vw;
  }
}

@media (max-width: 560px) {
  .hero {
    min-height: 54rem;
  }

  .hero__identity {
    top: 2rem;
  }

  .hero h1 {
    margin-top: 1.5rem;
    font-size: clamp(5.2rem, 29vw, 8rem);
    line-height: 0.65;
  }

  .hero h1 span:last-child {
    margin-left: 0;
    font-size: 0.52em;
  }

  .hero__role {
    top: 25%;
    right: -0.35rem;
    width: 72vw;
  }

  .hero__role nav {
    margin-top: 1.5rem;
  }

  .hero-print {
    border-width: 0.35rem;
  }

  .hero-print--1 {
    top: 43%;
    left: 13%;
    width: 76vw;
  }

  .hero-print--2 {
    bottom: 2%;
    left: -7%;
    width: 44vw;
  }

  .hero-print--3 {
    right: -7%;
    bottom: 4%;
    width: 42vw;
  }

  .hero__seal {
    bottom: 11%;
    left: 47%;
  }

  .hero__edition {
    display: none;
  }
}
</style>
