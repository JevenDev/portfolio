<template>
  <section id="mods" class="mods" aria-labelledby="mods-title">
    <span class="mods__watermark" data-poster-drift aria-hidden="true">MODS</span>
    <RegistrationStrip
      index="00"
      label="Mod catalogue"
      :detail="`${String(mods.length).padStart(2, '0')} public mods / two platforms`"
    />

    <header class="mods__head" data-motion-section>
      <div class="mods__heading">
        <p class="section-kicker">Minecraft / Java Edition</p>
        <h1 id="mods-title" data-poster-heading>
          <span>Minecraft,</span>
          <span>adjusted.</span>
        </h1>
      </div>

      <div class="mods__intro" data-poster-copy>
        <p>Independent systems for combat, atmosphere, survival, navigation, villagers, and the shared code underneath them.</p>
        <a href="https://modrinth.com/user/jvn" target="_blank" rel="noreferrer">Browse the Modrinth profile ↗</a>
      </div>

      <div
        class="mods__counter"
        data-poster-drift
        :aria-label="`${mods.length} public mods with ${formatExact(totalDownloads)} combined Modrinth and CurseForge downloads`"
      >
        <strong>{{ formatNumber(totalDownloads) }}</strong>
        <span class="meta-type">Combined downloads</span>
        <span class="meta-type">Modrinth + CurseForge</span>
      </div>

      <p class="mods__status meta-type" role="status" aria-live="polite">{{ status }}</p>
    </header>

    <nav class="mods__index" aria-label="Mod case study index">
      <div class="mods__index-head meta-type" aria-hidden="true">
        <span>No.</span>
        <span>Mark</span>
        <span>Project</span>
        <span>Loaders</span>
        <span>Downloads</span>
        <span></span>
      </div>

      <a
        v-for="(mod, index) in mods"
        :key="mod.id"
        class="mod-index-row"
        :href="`#mod-${mod.slug}`"
        :style="{ '--mod-accent': mod.accent }"
        data-motion-section
      >
        <span class="mod-index-row__index meta-type">{{ String(index + 1).padStart(2, '0') }}</span>
        <span class="mod-index-row__icon">
          <img :src="mod.iconUrl" alt="" loading="lazy" decoding="async" />
        </span>
        <span class="mod-index-row__identity" data-poster-copy>
          <strong>{{ mod.title }}</strong>
          <span>{{ mod.description }}</span>
        </span>
        <span class="mod-index-row__loaders meta-type" data-poster-copy>{{ formatLabels(mod.loaders) }}</span>
        <span class="mod-index-row__downloads meta-type" data-poster-copy>
          <strong>{{ formatNumber(combinedDownloads(mod)) }} total</strong>
          <span>{{ formatNumber(metricsFor(mod).modrinth) }} MR / {{ formatNumber(metricsFor(mod).curseforge) }} CF</span>
        </span>
        <span class="mod-index-row__arrow" aria-hidden="true">↓</span>
      </a>
    </nav>

    <div class="mods__stories">
      <article
        v-for="(mod, index) in mods"
        :id="`mod-${mod.slug}`"
        :key="`${mod.id}-story`"
        class="mod-story"
        :style="{ '--mod-accent': mod.accent }"
        data-motion-section
      >
        <header class="mod-story__header">
          <div class="mod-story__marker">
            <span class="meta-type">{{ String(index + 1).padStart(2, '0') }} / {{ String(mods.length).padStart(2, '0') }}</span>
            <img :src="mod.iconUrl" alt="" loading="lazy" decoding="async" />
          </div>

          <div class="mod-story__title">
            <p class="meta-type" data-poster-copy>{{ formatLabels(mod.categories) }} / {{ formatLabels(mod.loaders) }}</p>
            <h2 data-poster-heading>{{ mod.title }}</h2>
            <p data-poster-copy>{{ mod.description }}</p>
          </div>

          <dl class="mod-story__metrics" data-poster-copy>
            <div>
              <dt>Modrinth</dt>
              <dd>{{ formatExact(metricsFor(mod).modrinth) }}</dd>
            </div>
            <div>
              <dt>CurseForge</dt>
              <dd>{{ formatExact(metricsFor(mod).curseforge) }}</dd>
            </div>
            <div>
              <dt>Combined</dt>
              <dd>{{ formatExact(combinedDownloads(mod)) }}</dd>
            </div>
          </dl>
        </header>

        <div class="mod-story__body">
          <figure class="mod-story__media registered-media" data-poster-media>
            <img
              :src="mod.featuredImage"
              :alt="mod.featuredImageAlt"
              :class="{ 'mod-story__image--contain': mod.slug === 'toucan' }"
              loading="lazy"
              decoding="async"
            />
            <figcaption class="meta-type">Project view / {{ mod.title }}</figcaption>
          </figure>

          <div class="mod-story__narrative">
            <section data-poster-copy>
              <h3 class="meta-type">What it does</h3>
              <p>{{ mod.overview }}</p>
            </section>
            <section data-poster-copy>
              <h3 class="meta-type">Process reflection</h3>
              <p>{{ mod.reflection }}</p>
            </section>
          </div>
        </div>

        <div class="mod-story__lower">
          <section class="mod-story__features" aria-label="Selected features" data-poster-copy>
            <h3 class="meta-type">Selected systems</h3>
            <ol>
              <li v-for="(feature, featureIndex) in mod.features" :key="feature">
                <span class="meta-type">{{ String(featureIndex + 1).padStart(2, '0') }}</span>
                <p>{{ feature }}</p>
              </li>
            </ol>
          </section>

          <nav class="mod-story__links" :aria-label="`${mod.title} project links`" data-poster-copy>
            <a :href="`https://modrinth.com/mod/${mod.slug}`" target="_blank" rel="noreferrer">
              Modrinth <span>{{ formatNumber(metricsFor(mod).modrinth) }}</span> ↗
            </a>
            <a :href="`https://www.curseforge.com/minecraft/mc-mods/${mod.curseforge.slug}`" target="_blank" rel="noreferrer">
              CurseForge <span>{{ formatNumber(metricsFor(mod).curseforge) }}</span> ↗
            </a>
            <a :href="mod.sourceUrl" target="_blank" rel="noreferrer">Source ↗</a>
            <a v-if="mod.wikiUrl" :href="mod.wikiUrl" target="_blank" rel="noreferrer">Wiki ↗</a>
          </nav>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useModMetrics } from '../../composables/useModMetrics';
import RegistrationStrip from '../ui/RegistrationStrip.vue';

const props = defineProps({ mods: { type: Array, default: () => [] } });
const modsSource = computed(() => props.mods);
const { metricsFor, status, totalDownloads } = useModMetrics(modsSource);

function combinedDownloads(mod) {
  const metrics = metricsFor(mod);
  return metrics.modrinth + metrics.curseforge;
}

function formatExact(value) {
  return new Intl.NumberFormat('en-CA').format(value);
}

function formatLabels(values) {
  return values
    .map((value) => value.replaceAll('-', ' ').replace(/^./, (letter) => letter.toUpperCase()).replace('Neoforge', 'NeoForge'))
    .join(' / ');
}

function formatNumber(value) {
  return new Intl.NumberFormat('en-CA', { notation: 'compact', maximumFractionDigits: 1 }).format(value);
}
</script>

<style scoped>
.mods {
  --page-gutter: clamp(1.25rem, 3vw, 3rem);
  position: relative;
  overflow: hidden;
  background: var(--acid);
  padding: clamp(2rem, 4vw, 4rem) var(--page-gutter) 0;
  isolation: isolate;
}

.mods__watermark {
  position: absolute;
  top: 4rem;
  right: -0.06em;
  z-index: -1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(41, 38, 199, 0.3);
  font-size: clamp(12rem, 27vw, 29rem);
  font-weight: 720;
  letter-spacing: -0.11em;
  line-height: 0.75;
  pointer-events: none;
}

.mods__head,
.mods__index {
  position: relative;
  z-index: 2;
  width: min(100%, 90rem);
  margin-inline: auto;
}

.mods__head {
  display: grid;
  grid-template-columns: minmax(25rem, 1.15fr) minmax(15rem, 0.48fr) minmax(13rem, 0.3fr);
  gap: clamp(2rem, 5vw, 5rem);
  align-items: end;
  min-height: 38rem;
  padding-block: clamp(5rem, 10vw, 10rem) clamp(4rem, 7vw, 7rem);
}

.mods__heading p,
.mods__heading h1,
.mods__intro p,
.mods__status {
  margin: 0;
}

.mods__heading > p {
  margin-bottom: clamp(3rem, 8vw, 8rem);
  color: var(--blue);
}

.mods__heading h1 {
  max-width: 8ch;
  color: var(--black);
  font-size: clamp(4.8rem, 9vw, 10rem);
  font-weight: 675;
  letter-spacing: -0.09em;
  line-height: 0.67;
}

.mods__heading h1 span {
  display: block;
}

.mods__heading h1 span:last-child {
  margin-left: 0.38em;
  color: var(--blue);
  font-size: 0.83em;
}

.mods__intro {
  align-self: end;
  padding-bottom: 0.75rem;
}

.mods__intro p {
  max-width: 27rem;
  color: var(--ink-soft);
  font-size: 0.82rem;
  line-height: 1.65;
}

.mods__intro a {
  display: inline-flex;
  min-height: 2rem;
  align-items: center;
  margin-top: 2rem;
  border-bottom: 1px solid currentColor;
  color: var(--blue);
  font-size: 0.72rem;
}

.mods__counter {
  display: grid;
  min-height: 15rem;
  align-content: space-between;
  background: var(--blue);
  clip-path: polygon(8% 0, 100% 0, 100% 91%, 0 100%, 0 9%);
  color: var(--paper-cool);
  padding: 1.15rem;
  transform: rotate(2.5deg);
}

.mods__counter strong {
  font-size: clamp(3.8rem, 7vw, 7rem);
  font-weight: 450;
  letter-spacing: -0.09em;
  line-height: 0.72;
}

.mods__counter span:last-child {
  justify-self: end;
  text-align: right;
}

.mods__status {
  grid-column: 2 / -1;
  justify-self: end;
  color: var(--ink-soft);
  text-align: right;
}

.mods__index {
  margin-bottom: clamp(5rem, 10vw, 10rem);
  border-top: 1px solid var(--black);
}

.mods__index-head,
.mod-index-row {
  display: grid;
  grid-template-columns: 2.5rem 4.5rem minmax(17rem, 1.1fr) minmax(9rem, 0.4fr) minmax(12rem, 0.48fr) 1.5rem;
  gap: 1rem;
  align-items: center;
}

.mods__index-head {
  min-height: 2.8rem;
  color: var(--ink-soft);
}

.mod-index-row {
  position: relative;
  min-height: 8rem;
  overflow: hidden;
  border-top: 1px solid var(--rule);
  color: var(--black);
  transition: background-color 180ms ease, color 180ms ease;
}

.mod-index-row:last-child {
  border-bottom: 1px solid var(--black);
}

.mod-index-row::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: 0.35rem;
  background: var(--mod-accent);
  content: '';
  transition: width 180ms ease;
}

.mod-index-row__index {
  align-self: start;
  padding: 0.9rem 0 0 0.45rem;
}

.mod-index-row__icon {
  display: block;
  width: 4rem;
  aspect-ratio: 1;
  background: var(--mod-accent);
  clip-path: polygon(8% 0, 100% 0, 100% 92%, 92% 100%, 0 100%, 0 8%);
  padding: 0.22rem;
}

.mod-index-row__icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mod-index-row__identity,
.mod-index-row__downloads {
  display: grid;
  gap: 0.25rem;
}

.mod-index-row__identity strong {
  font-size: clamp(1.6rem, 3vw, 3rem);
  font-weight: 640;
  letter-spacing: -0.065em;
  line-height: 0.86;
}

.mod-index-row__identity > span,
.mod-index-row__loaders,
.mod-index-row__downloads > span {
  color: var(--ink-soft);
}

.mod-index-row__identity > span {
  font-size: 0.68rem;
}

.mod-index-row__downloads strong {
  font-size: 0.72rem;
  font-weight: 500;
}

.mod-index-row__arrow {
  justify-self: end;
  color: var(--blue);
  font-size: 1rem;
}

.mod-index-row:hover,
.mod-index-row:focus-visible {
  background: var(--black);
  color: var(--paper-cool);
}

.mod-index-row:hover::before,
.mod-index-row:focus-visible::before {
  width: 0.8rem;
}

.mod-index-row:hover .mod-index-row__identity > span,
.mod-index-row:hover .mod-index-row__loaders,
.mod-index-row:hover .mod-index-row__downloads > span,
.mod-index-row:focus-visible .mod-index-row__identity > span,
.mod-index-row:focus-visible .mod-index-row__loaders,
.mod-index-row:focus-visible .mod-index-row__downloads > span {
  color: rgba(255, 254, 248, 0.72);
}

.mod-index-row:hover .mod-index-row__arrow,
.mod-index-row:focus-visible .mod-index-row__arrow {
  color: var(--signal-red);
}

.mods__stories {
  width: calc(100% + (var(--page-gutter) * 2));
  margin-left: calc(var(--page-gutter) * -1);
}

.mod-story {
  --story-muted: var(--ink-soft);
  --story-rule: var(--rule);
  position: relative;
  overflow: hidden;
  scroll-margin-top: calc(var(--header-height) + 1rem);
  background: var(--paper-cool);
  color: var(--black);
  padding: clamp(4rem, 9vw, 9rem) var(--page-gutter);
  isolation: isolate;
}

.mod-story:nth-child(even) {
  --story-muted: rgba(255, 254, 248, 0.68);
  --story-rule: rgba(255, 254, 248, 0.3);
  background: var(--black);
  color: var(--paper-cool);
}

.mod-story:nth-child(3n) {
  --story-muted: rgba(255, 254, 248, 0.72);
  --story-rule: rgba(255, 254, 248, 0.34);
  background: var(--blue);
  color: var(--paper-cool);
}

.mod-story::before {
  position: absolute;
  inset: 0 0 auto;
  height: 0.55rem;
  background: var(--mod-accent);
  content: '';
}

.mod-story__header,
.mod-story__body,
.mod-story__lower {
  width: min(100%, 90rem);
  margin-inline: auto;
}

.mod-story__header {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: clamp(1.5rem, 3vw, 3rem);
  align-items: end;
}

.mod-story__marker {
  grid-column: 1 / span 2;
  align-self: start;
  display: grid;
  gap: 1rem;
}

.mod-story__marker img {
  width: clamp(4.5rem, 8vw, 7.5rem);
  aspect-ratio: 1;
  object-fit: cover;
  background: var(--mod-accent);
  padding: 0.3rem;
}

.mod-story__title {
  grid-column: 3 / span 7;
}

.mod-story__title p,
.mod-story__title h2,
.mod-story__metrics,
.mod-story__narrative h3,
.mod-story__narrative p,
.mod-story__features h3,
.mod-story__features ol,
.mod-story__features p {
  margin: 0;
}

.mod-story__title > p:first-child {
  margin-bottom: 1rem;
  color: var(--story-muted);
}

.mod-story__title h2 {
  max-width: 10ch;
  overflow-wrap: anywhere;
  font-size: clamp(4rem, 8.5vw, 9rem);
  font-weight: 660;
  letter-spacing: -0.09em;
  line-height: 0.72;
}

.mod-story__title > p:last-child {
  max-width: 34rem;
  margin-top: 1.5rem;
  color: var(--story-muted);
  font-size: 0.78rem;
}

.mod-story__metrics {
  grid-column: 10 / -1;
  border-top: 1px solid currentColor;
}

.mod-story__metrics div {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  border-bottom: 1px solid var(--story-rule);
  padding: 0.65rem 0;
}

.mod-story__metrics dt {
  color: var(--story-muted);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.62rem;
}

.mod-story__metrics dd {
  margin: 0;
  font-size: 0.78rem;
  font-variant-numeric: tabular-nums;
}

.mod-story__body {
  display: grid;
  grid-template-columns: repeat(12, minmax(0, 1fr));
  gap: clamp(2rem, 5vw, 5rem);
  align-items: center;
  margin-top: clamp(4rem, 8vw, 8rem);
}

.mod-story__media {
  grid-column: 1 / span 7;
  margin: 0;
  background: var(--mod-accent);
}

.mod-story__media > img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
}

.mod-story__media > img.mod-story__image--contain {
  object-fit: contain;
  padding: 8%;
}

.mod-story__media figcaption {
  border-top: 1px solid currentColor;
  padding-top: 0.5rem;
  color: var(--story-muted);
}

.mod-story__narrative {
  grid-column: 8 / -1;
  display: grid;
  gap: clamp(2rem, 5vw, 5rem);
}

.mod-story:nth-child(even) .mod-story__media {
  grid-column: 6 / -1;
}

.mod-story:nth-child(even) .mod-story__narrative {
  grid-column: 1 / span 5;
  grid-row: 1;
}

.mod-story__narrative section {
  border-top: 1px solid currentColor;
  padding-top: 0.65rem;
}

.mod-story__narrative h3 {
  margin-bottom: 1.2rem;
  color: var(--story-muted);
  text-transform: uppercase;
}

.mod-story__narrative p {
  font-size: clamp(0.9rem, 1.35vw, 1.12rem);
  line-height: 1.65;
}

.mod-story__lower {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(14rem, 0.28fr);
  gap: clamp(2rem, 5vw, 5rem);
  margin-top: clamp(4rem, 8vw, 8rem);
  border-top: 1px solid currentColor;
  padding-top: 0.75rem;
}

.mod-story__features {
  display: grid;
  grid-template-columns: minmax(8rem, 0.25fr) 1fr;
  gap: 2rem;
}

.mod-story__features h3 {
  color: var(--story-muted);
  text-transform: uppercase;
}

.mod-story__features ol {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid var(--story-rule);
  padding: 0;
  list-style: none;
}

.mod-story__features li {
  display: grid;
  grid-template-columns: 1.6rem 1fr;
  gap: 0.6rem;
  border-bottom: 1px solid var(--story-rule);
  padding: 0.75rem 0;
}

.mod-story__features li:nth-child(odd) {
  padding-right: 1rem;
}

.mod-story__features li:nth-child(even) {
  border-left: 1px solid var(--story-rule);
  padding-left: 1rem;
}

.mod-story__features p {
  font-size: 0.72rem;
  line-height: 1.45;
}

.mod-story__links {
  display: grid;
  align-content: start;
}

.mod-story__links a {
  display: flex;
  min-height: 2.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  border-bottom: 1px solid var(--story-rule);
  font-size: 0.7rem;
}

.mod-story__links a span {
  margin-left: auto;
  color: var(--story-muted);
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.6rem;
}

.mod-story__links a:hover,
.mod-story__links a:focus-visible {
  color: var(--signal-red);
}

@media (max-width: 1040px) {
  .mods__head {
    grid-template-columns: minmax(22rem, 1fr) minmax(14rem, 0.55fr);
  }

  .mods__counter {
    grid-column: 2;
    width: min(100%, 18rem);
    margin-top: -3rem;
    justify-self: end;
  }

  .mods__status {
    grid-column: 1 / -1;
  }

  .mods__index-head,
  .mod-index-row {
    grid-template-columns: 2.5rem 4rem minmax(14rem, 1fr) 8rem minmax(10rem, 0.5fr) 1rem;
  }

  .mod-index-row__icon {
    width: 3.5rem;
  }

  .mod-story__header {
    grid-template-columns: repeat(10, minmax(0, 1fr));
  }

  .mod-story__marker {
    grid-column: 1 / span 2;
  }

  .mod-story__title {
    grid-column: 3 / span 6;
  }

  .mod-story__metrics {
    grid-column: 9 / -1;
  }

  .mod-story__lower {
    grid-template-columns: 1fr;
  }

  .mod-story__links {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .mod-story__links a {
    padding-right: 0.75rem;
  }
}

@media (max-width: 760px) {
  .mods__watermark {
    top: 9rem;
    font-size: 11rem;
  }

  .mods__head {
    grid-template-columns: 1fr;
    min-height: 0;
    padding-top: 6rem;
  }

  .mods__heading > p {
    margin-bottom: 4rem;
  }

  .mods__heading h1 {
    font-size: clamp(4.4rem, 20vw, 7rem);
  }

  .mods__intro {
    width: min(100%, 28rem);
  }

  .mods__counter {
    grid-column: auto;
    width: 14rem;
    margin: 0 0 0 auto;
  }

  .mods__status {
    grid-column: auto;
  }

  .mods__index-head {
    display: none;
  }

  .mod-index-row {
    grid-template-columns: 1.7rem 3.6rem minmax(0, 1fr) 1rem;
    gap: 0.65rem;
    min-height: 0;
    padding-block: 1rem;
  }

  .mod-index-row__index {
    padding: 0.1rem 0 0 0.35rem;
  }

  .mod-index-row__icon {
    width: 3.4rem;
  }

  .mod-index-row__identity strong {
    font-size: clamp(1.8rem, 9vw, 3rem);
  }

  .mod-index-row__loaders {
    grid-column: 2 / -1;
    grid-row: 2;
  }

  .mod-index-row__downloads {
    grid-column: 2 / -1;
    grid-row: 3;
    grid-template-columns: 1fr 1fr;
  }

  .mod-index-row__arrow {
    grid-column: 4;
    grid-row: 1;
    align-self: start;
  }

  .mod-story__header {
    grid-template-columns: 4.5rem minmax(0, 1fr);
  }

  .mod-story__marker {
    grid-column: 1;
  }

  .mod-story__marker img {
    width: 4rem;
  }

  .mod-story__title {
    grid-column: 2;
  }

  .mod-story__title h2 {
    font-size: clamp(3.5rem, 17vw, 6rem);
  }

  .mod-story__metrics {
    grid-column: 1 / -1;
    margin-top: 1rem;
  }

  .mod-story__body {
    grid-template-columns: 1fr;
  }

  .mod-story__media,
  .mod-story:nth-child(even) .mod-story__media,
  .mod-story__narrative,
  .mod-story:nth-child(even) .mod-story__narrative {
    grid-column: 1;
    grid-row: auto;
  }

  .mod-story__features {
    grid-template-columns: 1fr;
  }

  .mod-story__features ol {
    grid-template-columns: 1fr;
  }

  .mod-story__features li:nth-child(n) {
    border-left: 0;
    padding-inline: 0;
  }

  .mod-story__links {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 440px) {
  .mod-story__links {
    grid-template-columns: 1fr;
  }
}
</style>
