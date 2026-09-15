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

    <div
      ref="gallery"
      class="hero__gallery"
      role="region"
      aria-roledescription="carousel"
      aria-label="Selected works"
      @pointerenter="hovered = $event.pointerType === 'mouse'"
      @pointerleave="hovered = false"
      @focusin="focused = true"
      @focusout="onFocusOut"
      @keydown.left.prevent="stepProject(-1)"
      @keydown.right.prevent="stepProject(1)"
    >
      <div
        v-for="(project, index) in heroProjects"
        :key="project.id"
        class="hero__orbit-item"
        :style="orbitStyle(index)"
      >
        <RouterLink class="hero-print" :to="`/work/${project.id}/`" data-hero-print @focus="onProjectFocus($event, index)">
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
      <div class="hero__gallery-controls meta-type">
        <button type="button" aria-label="Previous selected work" @click="stepProject(-1)">←</button>
        <span :aria-live="paused ? 'polite' : 'off'">{{ String(frontIndex + 1).padStart(2, '0') }} / {{ String(heroProjects.length).padStart(2, '0') }}</span>
        <button type="button" aria-label="Next selected work" @click="stepProject(1)">→</button>
        <button type="button" :aria-label="paused ? 'Play carousel' : 'Pause carousel'" @click="togglePlayback">
          {{ paused ? 'Play' : 'Pause' }}
        </button>
      </div>
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
    <span class="hero__seal" data-hero-seal aria-hidden="true">JVN</span>
    <span class="hero__side-note hero__side-note--a meta-type" data-hero-detail aria-hidden="true">Selected work / 01–{{ String(heroProjects.length).padStart(2, '0') }}</span>
    <span class="hero__side-note hero__side-note--b meta-type" data-hero-detail aria-hidden="true">Scroll to explore / ↓</span>
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import GlitchMedia from '../ui/GlitchMedia.vue';

const props = defineProps({
  email: { type: String, default: '' },
  heroProjects: { type: Array, default: () => [] }
});

const gallery = ref(null);
const angle = ref(0);
const hovered = ref(false);
const focused = ref(false);
const paused = ref(false);
const fullTurn = Math.PI * 2;
const spacing = computed(() => fullTurn / Math.max(props.heroProjects.length, 1));
const frontIndex = computed(() => {
  const count = props.heroProjects.length;
  return count ? ((Math.round(-angle.value / spacing.value) % count) + count) % count : 0;
});
let frame = 0;
let lastTime = 0;
let visible = false;
let observer;
let motionPreference;
let selectionMotion = null;

function orbitStyle(index) {
  const position = angle.value + index * spacing.value;
  const depth = (Math.cos(position) + 1) / 2;
  return {
    '--orbit-x': Math.sin(position),
    '--orbit-y': Math.cos(position),
    '--orbit-scale': 0.6 + depth * 0.4,
    '--orbit-tilt': `${-Math.sin(position) * 20}deg`,
    '--orbit-fade': (1 - depth) * 0.42,
    zIndex: Math.round(depth * 100)
  };
}

function moveToAngle(target, immediate = false) {
  if (immediate || motionPreference?.matches) {
    selectionMotion = null;
    angle.value = target;
    return;
  }
  selectionMotion = { from: angle.value, to: target, elapsed: 0 };
}

function showProject(index, immediate = false) {
  const destination = -index * spacing.value;
  const offset = ((destination - angle.value + Math.PI) % fullTurn + fullTurn) % fullTurn - Math.PI;
  moveToAngle(angle.value + offset, immediate);
}

function onProjectFocus(event, index) {
  if (event.target.matches(':focus-visible')) showProject(index, true);
}

function stepProject(direction) {
  const count = props.heroProjects.length;
  if (!count) return;
  paused.value = true;
  const current = selectionMotion?.to ?? Math.round(angle.value / spacing.value) * spacing.value;
  moveToAngle(current - direction * spacing.value);
}

function togglePlayback() {
  paused.value = !paused.value;
  if (!paused.value) {
    hovered.value = false;
    focused.value = false;
  }
}

function onFocusOut(event) {
  focused.value = gallery.value?.contains(event.relatedTarget) ?? false;
}

function animate(time) {
  const elapsed = lastTime ? Math.min(time - lastTime, 64) : 0;
  lastTime = time;
  if (selectionMotion) {
    selectionMotion.elapsed += elapsed;
    const progress = Math.min(selectionMotion.elapsed / 700, 1);
    const eased = progress * progress * (3 - 2 * progress);
    angle.value = selectionMotion.from + (selectionMotion.to - selectionMotion.from) * eased;
    if (progress === 1) selectionMotion = null;
  } else if (!paused.value && !hovered.value && !focused.value) {
    angle.value = (angle.value - elapsed * fullTurn / 72000) % fullTurn;
  }
  frame = requestAnimationFrame(animate);
}

function syncAnimation() {
  cancelAnimationFrame(frame);
  lastTime = 0;
  if (visible && !document.hidden) frame = requestAnimationFrame(animate);
}

function onMotionPreferenceChange() {
  paused.value = motionPreference.matches;
  if (motionPreference.matches && selectionMotion) {
    angle.value = selectionMotion.to;
    selectionMotion = null;
  }
}

onMounted(() => {
  motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  onMotionPreferenceChange();
  motionPreference.addEventListener('change', onMotionPreferenceChange);
  observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncAnimation();
  });
  observer.observe(gallery.value);
  document.addEventListener('visibilitychange', syncAnimation);
});

onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
  motionPreference?.removeEventListener('change', onMotionPreferenceChange);
  document.removeEventListener('visibilitychange', syncAnimation);
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
  --orbit-radius: clamp(12rem, 21vw, 24rem);
  --orbit-rise: clamp(4rem, 7vw, 7rem);
  position: absolute;
  top: 43%;
  right: 2%;
  bottom: 3%;
  width: 69%;
  z-index: 1;
}

.hero__orbit-item {
  position: absolute;
  top: 38%;
  left: 50%;
  width: min(26vw, 26rem);
  transform: translate(-50%, -50%)
    translateX(calc(var(--orbit-x) * var(--orbit-radius)))
    translateY(calc(var(--orbit-y) * var(--orbit-rise)))
    scale(var(--orbit-scale)) perspective(60rem) rotateY(var(--orbit-tilt));
  will-change: transform;
}

.hero-print {
  position: relative;
  display: block;
  border: 0.5rem solid var(--paper-cool);
  background: var(--paper-cool);
  box-shadow: 0 0 0 1px var(--black);
}

.hero-print::after {
  position: absolute;
  inset: -1px;
  background: var(--paper-cool);
  opacity: var(--orbit-fade);
  pointer-events: none;
  content: '';
}

.hero-print__media {
  aspect-ratio: 1;
  overflow: hidden;
}

.hero__gallery-controls {
  position: absolute;
  right: 0;
  bottom: 0;
  z-index: 101;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-top: 1px solid var(--rule);
  padding-top: 0.35rem;
}

.hero__gallery-controls button {
  min-width: 2.75rem;
  min-height: 2.75rem;
  padding: 0.25rem;
  border: 0;
  background: transparent;
  color: var(--black);
  cursor: pointer;
}

.hero__gallery-controls button:last-child {
  min-width: 4rem;
  margin-left: 0.5rem;
}

.hero__gallery-controls button:hover {
  color: var(--blue);
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
  left: var(--page-gutter);
  bottom: 1.5rem;
  z-index: 5;
  margin: 0;
  text-align: left;
}

.hero__seal {
  position: absolute;
  top: 49%;
  left: 18%;
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

  .hero__gallery {
    --orbit-radius: 25vw;
    --orbit-rise: 4rem;
    top: 51%;
    right: 3%;
    bottom: 5%;
    width: 90%;
  }

  .hero__orbit-item {
    width: 36vw;
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
    --orbit-radius: 26vw;
    --orbit-rise: 3rem;
    position: relative;
    inset: auto;
    width: 100%;
    height: clamp(23rem, 105vw, 34rem);
    margin-block: 1.5rem;
  }

  .hero__orbit-item {
    top: 40%;
    width: 49vw;
  }

  .hero-print {
    border-width: 0.3rem;
  }

  .hero-print__caption {
    grid-template-columns: 1rem 1fr auto;
    gap: 0.35rem;
  }

  .hero-print__caption strong {
    font-size: 0.8125rem;
  }

  .hero__edition {
    position: relative;
    inset: auto;
    border-top: 1px solid var(--rule);
    padding-top: 1rem;
    text-align: right;
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
