<template>
  <main id="main-content" ref="page" tabindex="-1" class="project page-shell">
    <template v-if="project">
      <header class="project__hero" data-motion-section>
        <svg class="project__web" viewBox="0 0 1000 700" aria-hidden="true">
          <path data-draw-path d="M-60 560C170 350 350 430 520 250S810 -30 1060 170" />
          <path data-draw-path d="M90 -50C240 170 350 160 520 250S760 540 930 750" />
        </svg>
        <RegistrationStrip :index="displayIndex" label="Case study" :detail="`${category} / ${project.year}`" />
        <div class="project__top meta-type">
          <RouterLink to="/archive/">← Project archive</RouterLink>
          <span>{{ status }}</span>
        </div>

        <div class="project__hero-grid">
          <div class="project__intro">
            <p class="section-kicker">Case study {{ displayIndex }}</p>
            <h1 data-poster-heading>{{ project.title }}</h1>
            <p data-poster-copy>{{ contextText }}</p>
          </div>

          <div class="project__cover registered-media" data-poster-media>
            <GlitchMedia :src="project.thumbCard || project.thumb" :alt="project.title" eager fit="contain" treatment="full" />
          </div>
        </div>

        <dl class="project__meta" data-poster-copy>
          <div><dt>Format</dt><dd>{{ category }}</dd></div>
          <div><dt>Role</dt><dd>{{ project.role || 'Graphic design' }}</dd></div>
          <div><dt>Date</dt><dd>{{ project.year }}</dd></div>
          <div><dt>State</dt><dd>{{ status }}</dd></div>
        </dl>
      </header>

      <section class="project__story" aria-labelledby="story-title" data-motion-section>
        <RegistrationStrip index="01" label="Project notes" detail="Context / intent / process" tone="signal" />
        <header class="project__section-head">
          <p class="section-kicker">Project notes</p>
          <h2 id="story-title" data-poster-heading>Context, intent, and process</h2>
        </header>

        <div class="project__story-grid">
          <article data-poster-copy><h3>Context</h3><p>{{ contextText }}</p></article>
          <article data-poster-copy><h3>Intent</h3><p>{{ problemText }}</p></article>
          <article data-poster-copy><h3>Process</h3><p>{{ processText }}</p></article>
        </div>

        <div class="project__tags">
          <p>Services</p>
          <ul><li v-for="tag in project.tags" :key="tag">{{ tag }}</li></ul>
        </div>
      </section>

      <section class="project__outputs" aria-labelledby="outputs-title">
        <RegistrationStrip index="02" label="Selected frames" :detail="`${String(mediaItems.length).padStart(2, '0')} documented outputs`" />
        <header class="project__section-head project__section-head--outputs" data-motion-section>
          <div>
            <p class="section-kicker">Selected frames</p>
            <h2 id="outputs-title" data-poster-heading>{{ String(mediaItems.length).padStart(2, '0') }} documented outputs</h2>
          </div>
          <p data-poster-copy>Each asset is shown at its native ratio so the composition and production details remain readable.</p>
        </header>

        <div class="project__gallery">
          <figure v-for="(media, index) in mediaItems" :key="`${media.url}-${index}`" data-motion-section>
            <video
              v-if="media.type === 'video'"
              :src="media.url"
              :poster="project.thumb"
              :aria-label="media.label || `${project.title} video`"
              controls
              playsinline
              preload="none"
              data-poster-media
            />
            <img v-else :src="media.url" :alt="media.label || project.title" loading="lazy" decoding="async" data-poster-media />
            <figcaption class="meta-type" data-poster-copy>
              <span>{{ String(index + 1).padStart(2, '0') }} / {{ media.label || project.title }}</span>
              <span>{{ media.type }}</span>
            </figcaption>
          </figure>
        </div>

        <div v-if="project.audio?.src" class="project__audio">
          <div>
            <p class="meta-type">Audio playback</p>
            <h3>{{ project.audio.title }}</h3>
          </div>
          <audio :src="project.audio.src" :aria-label="project.audio.title" controls preload="none">
            Your browser does not support embedded audio.
          </audio>
        </div>
      </section>

      <section class="project__result" data-motion-section>
        <RegistrationStrip index="03" label="Result and credits" detail="Close case study" tone="light" />
        <div class="project__result-copy">
          <p class="section-kicker">Result</p>
          <p data-poster-heading>{{ resultText }}</p>
        </div>

        <div class="project__credits">
          <div><span>Designer</span><strong>Jeven Randhawa</strong></div>
          <div><span>Role</span><strong>{{ project.role || 'Graphic design' }}</strong></div>
          <a v-for="link in project.links" :key="link.url" :href="link.url" target="_blank" rel="noreferrer">{{ link.label }} ↗</a>
        </div>

        <nav class="project__next" aria-label="Project navigation">
          <RouterLink v-if="previousProject" :to="`/work/${previousProject.id}/`">
            <span class="meta-type">Previous project</span><strong>← {{ previousProject.title }}</strong>
          </RouterLink>
          <RouterLink v-if="nextProject" :to="`/work/${nextProject.id}/`">
            <span class="meta-type">Next project</span><strong>{{ nextProject.title }} →</strong>
          </RouterLink>
        </nav>
      </section>
    </template>

    <section v-else class="project__missing">
      <h1>Project not found</h1>
      <RouterLink to="/archive/">Return to archive →</RouterLink>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import GlitchMedia from '../components/ui/GlitchMedia.vue';
import RegistrationStrip from '../components/ui/RegistrationStrip.vue';
import { usePosterMotion } from '../composables/usePosterMotion';
import { getProjectCategory } from '../utils/portfolio';

const page = ref(null);
usePosterMotion(page);

const props = defineProps({ projects: { type: Array, default: () => [] } });
const route = useRoute();
const projectIndex = computed(() => props.projects.findIndex((item) => item.id === route.params.id));
const project = computed(() => props.projects[projectIndex.value] || null);
const displayIndex = computed(() => String(projectIndex.value + 1).padStart(3, '0'));
const category = computed(() => getProjectCategory(project.value));
const status = computed(() => (/present|current/i.test(project.value?.year || '') ? 'Active' : 'Released'));
const descriptionLines = computed(() => {
  if (!project.value?.description) return [];
  return Array.isArray(project.value.description) ? project.value.description : [project.value.description];
});
const contextText = computed(() => descriptionLines.value[0] || `A ${category.value.toLowerCase()} output completed for the JVN Graphics archive in ${project.value?.year}.`);
const problemText = computed(() => descriptionLines.value[1] || 'The project called for a focused visual or sonic identity that could remain distinct across its required formats.');
const processText = computed(() => {
  const count = mediaItems.value.length;
  return `The archive contains ${count} selected ${count === 1 ? 'output' : 'outputs'} from the project. The system was developed around the role, formats, and production needs documented here.`;
});
const resultText = computed(() => status.value === 'Active'
  ? `The ${category.value.toLowerCase()} system remains active and continues to expand through the outputs currently available.`
  : `The completed ${category.value.toLowerCase()} system is preserved as a released output from ${project.value?.year}.`);
const mediaItems = computed(() => {
  const gallery = project.value?.gallery?.length ? project.value.gallery : [{ label: project.value?.title, url: project.value?.thumb }];
  return gallery
    .map((item) => typeof item === 'string' ? { label: '', url: item } : item)
    .filter((item) => item?.url)
    .map((item) => ({
      label: item.label?.trim() || '',
      type: /\.(mp4|webm|mov|m4v)(?:\?|$)/i.test(item.url) ? 'video' : 'image',
      url: item.url
    }));
});
const previousProject = computed(() => projectIndex.value <= 0 ? props.projects[props.projects.length - 1] || null : props.projects[projectIndex.value - 1] || null);
const nextProject = computed(() => projectIndex.value < 0 ? null : props.projects[(projectIndex.value + 1) % props.projects.length] || null);
</script>

<style scoped>
.project {
  background: var(--paper-cool);
}

.project__hero {
  position: relative;
  overflow: hidden;
  padding: 1rem clamp(1.25rem, 3vw, 3rem) clamp(5rem, 10vw, 10rem);
}

.project__web {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: var(--blue);
  stroke-width: 1.3;
  pointer-events: none;
}

.project__top {
  position: relative;
  z-index: 3;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  margin-top: 1.3rem;
  padding-top: 0;
  color: var(--ink-soft);
}

.project__top span:last-child {
  text-align: right;
}

.project__top a:hover,
.project__top a:focus-visible {
  color: var(--blue);
}

.project__top a,
.project__credits a {
  display: inline-flex;
  min-height: 1.75rem;
  align-items: center;
}

.project__hero-grid {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: minmax(18rem, 0.7fr) minmax(25rem, 1.3fr);
  gap: clamp(3rem, 8vw, 9rem);
  align-items: center;
  width: min(100%, 90rem);
  margin: clamp(4rem, 9vw, 9rem) auto 0;
}

.project__intro {
  position: relative;
  z-index: 3;
  margin-right: clamp(-7rem, -7vw, -3rem);
}

.project__intro .section-kicker {
  margin: 0 0 2rem;
  color: var(--blue);
}

.project__intro h1 {
  margin: 0;
  color: var(--blue);
  font-size: clamp(4.5rem, 9vw, 10rem);
  font-weight: 680;
  letter-spacing: -0.09em;
  line-height: 0.7;
  overflow-wrap: anywhere;
}

.project__intro > p:last-child {
  max-width: 34rem;
  margin: 2rem 0 0;
  color: var(--ink-soft);
  font-size: 0.9rem;
  line-height: 1.65;
}

.project__cover {
  height: min(67vh, 44rem);
  background: #deddd7;
  border: 0.7rem solid var(--paper-cool);
  box-shadow: 0 0 0 1px var(--black);
  transform: rotate(1.2deg);
}

.project__meta {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  width: min(100%, 90rem);
  margin: clamp(4rem, 8vw, 8rem) auto 0;
  border-top: 1px solid var(--black);
}

.project__meta div {
  min-width: 0;
  border-right: 1px solid var(--rule);
  padding: 0.75rem 1rem 0 0;
}

.project__meta div + div {
  padding-left: 1rem;
}

.project__meta div:last-child {
  border-right: 0;
}

.project__meta dt {
  color: var(--ink-soft);
  font-size: 0.65rem;
}

.project__meta dd {
  margin: 0.35rem 0 0;
  font-size: 0.76rem;
  overflow-wrap: anywhere;
}

.project__story,
.project__outputs,
.project__result {
  padding: clamp(5rem, 10vw, 10rem) clamp(1.25rem, 3vw, 3rem);
}

.project__story {
  background: var(--signal-red);
}

.project__section-head {
  display: grid;
  grid-template-columns: 0.4fr 1fr;
  gap: 2rem;
  align-items: end;
  width: min(100%, 90rem);
  margin-inline: auto;
  padding-top: clamp(3rem, 6vw, 6rem);
}

.project__section-head p,
.project__section-head h2 {
  margin: 0;
}

.project__section-head .section-kicker {
  color: var(--black);
}

.project__section-head h2 {
  max-width: 13ch;
  font-size: clamp(2.6rem, 5.4vw, 5.8rem);
  font-weight: 500;
  letter-spacing: -0.065em;
  line-height: 0.92;
}

.project__story-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  width: min(100%, 90rem);
  margin: clamp(3rem, 7vw, 7rem) auto 0;
  border-top: 1px solid var(--black);
}

.project__story-grid article {
  min-height: 16rem;
  border-right: 1px solid var(--rule);
  border-bottom: 1px solid var(--black);
  padding: 0.9rem clamp(1rem, 2.5vw, 2.5rem) 2rem 0;
}

.project__story-grid article + article {
  padding-left: clamp(1rem, 2.5vw, 2.5rem);
}

.project__story-grid article:last-child {
  border-right: 0;
}

.project__story-grid h3 {
  margin: 0;
  color: var(--black);
  font-size: 0.72rem;
  font-weight: 500;
}

.project__story-grid p {
  margin: 4rem 0 0;
  font-size: 0.84rem;
  line-height: 1.65;
}

.project__tags {
  display: grid;
  grid-template-columns: 0.4fr 1fr;
  gap: 2rem;
  width: min(100%, 90rem);
  margin: 2rem auto 0;
}

.project__tags > p {
  margin: 0;
  color: var(--black);
  font-size: 0.72rem;
}

.project__tags ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin: 0;
  border-top: 1px solid var(--black);
  padding: 0.7rem 0 0;
  list-style: none;
  font-size: 0.7rem;
}

.project__outputs {
  background: var(--paper);
}

.project__section-head--outputs {
  grid-template-columns: 1fr minmax(18rem, 0.55fr);
}

.project__section-head--outputs > p {
  max-width: 30rem;
  color: var(--ink-soft);
  font-size: 0.82rem;
  line-height: 1.55;
}

.project__gallery {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(3rem, 7vw, 7rem) clamp(1.5rem, 4vw, 4rem);
  width: min(100%, 90rem);
  margin: clamp(4rem, 9vw, 9rem) auto 0;
}

.project__gallery figure {
  margin: 0;
}

.project__gallery figure:first-child:nth-last-child(odd),
.project__gallery figure:nth-child(3n) {
  grid-column: 1 / -1;
}

.project__gallery img,
.project__gallery video {
  width: 100%;
  max-height: 88vh;
  background: #deddd7;
  object-fit: contain;
}

.project__gallery figcaption {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid var(--black);
  padding-top: 0.55rem;
}

.project__audio {
  display: grid;
  grid-template-columns: 1fr minmax(18rem, 0.7fr);
  gap: 2rem;
  align-items: center;
  width: min(100%, 90rem);
  margin: clamp(4rem, 9vw, 9rem) auto 0;
  border-top: 1px solid var(--black);
  padding-top: 1rem;
}

.project__audio p,
.project__audio h3 {
  margin: 0;
}

.project__audio h3 {
  margin-top: 0.4rem;
  font-size: clamp(1.25rem, 2.5vw, 2.2rem);
  font-weight: 520;
  letter-spacing: -0.04em;
}

.project__audio audio {
  width: 100%;
}

.project__result {
  background: var(--blue);
  color: var(--paper-cool);
}

.project__result-copy,
.project__credits,
.project__next {
  width: min(100%, 90rem);
  margin-inline: auto;
}

.project__result-copy {
  display: grid;
  grid-template-columns: 0.4fr 1fr;
  gap: 2rem;
  border-top: 1px solid var(--rule-white);
  padding-top: 0.8rem;
}

.project__result-copy .section-kicker {
  margin: 0;
}

.project__result-copy > p:last-child {
  max-width: 22ch;
  margin: 0;
  font-size: clamp(2rem, 4.5vw, 4.8rem);
  font-weight: 460;
  letter-spacing: -0.055em;
  line-height: 0.96;
}

.project__credits {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  margin-top: clamp(4rem, 8vw, 8rem);
  border-top: 1px solid var(--rule-white);
  padding-top: 0.75rem;
  font-size: 0.68rem;
}

.project__credits div {
  display: grid;
  gap: 0.35rem;
}

.project__credits span {
  color: rgba(255, 254, 248, 0.68);
}

.project__credits a {
  align-self: end;
  border-bottom: 1px solid currentColor;
}

.project__next {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  margin-top: clamp(4rem, 8vw, 8rem);
  border-top: 1px solid var(--rule-white);
}

.project__next a {
  display: grid;
  min-height: 9rem;
  align-content: space-between;
  border-right: 1px solid var(--rule-white);
  padding: 1rem 1rem 1rem 0;
}

.project__next a:last-child {
  border-right: 0;
  padding-right: 0;
  padding-left: 1rem;
  text-align: right;
}

.project__next strong {
  font-size: clamp(1.1rem, 2.2vw, 1.9rem);
  font-weight: 520;
  letter-spacing: -0.035em;
  line-height: 1.05;
}

.project__next a:hover,
.project__next a:focus-visible {
  color: var(--blue-soft);
}

.project__missing {
  width: min(calc(100% - 2rem), 44rem);
  margin: 5rem auto;
  border-top: 1px solid var(--black);
  padding-top: 1rem;
}

.project__missing h1 {
  font-size: clamp(2.5rem, 7vw, 6rem);
  font-weight: 500;
  letter-spacing: -0.06em;
}

@media (max-width: 850px) {
  .project__hero-grid,
  .project__section-head,
  .project__section-head--outputs,
  .project__result-copy {
    grid-template-columns: 1fr;
  }

  .project__story-grid {
    grid-template-columns: 1fr;
  }

  .project__story-grid article,
  .project__story-grid article + article {
    min-height: auto;
    border-right: 0;
    padding: 1rem 0 2rem;
  }

  .project__story-grid p {
    margin-top: 2.5rem;
  }

  .project__tags {
    grid-template-columns: 1fr;
  }

  .project__intro {
    margin-right: 0;
  }
}

@media (max-width: 650px) {
  .project__cover {
    height: 26rem;
  }

  .project__intro h1 {
    font-size: clamp(3.3rem, 18vw, 5rem);
    line-height: 0.78;
  }

  .project__meta {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .project__meta div:nth-child(2) {
    border-right: 0;
  }

  .project__meta div:nth-child(n + 3) {
    border-top: 1px solid var(--rule);
  }

  .project__gallery {
    grid-template-columns: 1fr;
  }

  .project__gallery figure:nth-child(n) {
    grid-column: auto;
  }

  .project__audio,
  .project__credits,
  .project__next {
    grid-template-columns: 1fr;
  }

  .project__next a {
    min-height: 7rem;
    border-right: 0;
    border-bottom: 1px solid var(--rule-white);
  }

  .project__next a:last-child {
    padding-left: 0;
  }
}
</style>
