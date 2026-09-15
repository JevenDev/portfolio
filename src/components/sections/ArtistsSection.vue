<template>
  <section class="artists" aria-labelledby="artists-title">
    <span class="artists__word" data-poster-drift aria-hidden="true">COLLAB</span>
    <RegistrationStrip index="03" label="Collaborations" detail="Artists, teams, and releases" />

    <header class="artists__head" data-motion-section>
      <div>
        <p class="section-kicker">Collaborations</p>
        <h2 id="artists-title" data-poster-heading>Artists and teams</h2>
      </div>
      <p data-poster-copy>Selected ongoing and past relationships across identity, websites, artwork, production, and engineering.</p>
    </header>

    <div class="artists__list">
      <article
        v-for="(artist, index) in artists"
        :key="artist.name"
        class="artist"
        data-motion-section
      >
        <span class="artist__index meta-type">{{ String(index + 1).padStart(2, '0') }}</span>
        <img :src="artist.imageThumb || artist.image" :alt="artist.name" loading="lazy" decoding="async" data-poster-media />
        <div class="artist__identity" data-poster-copy>
          <h3 data-poster-heading>{{ artist.name }}</h3>
          <p>{{ artist.role }}</p>
        </div>
        <p class="artist__period meta-type">{{ artist.yearRange }}</p>
        <div class="artist__credits">
          <p>{{ artist.notableWorks[0] }}</p>
          <button
            v-if="artist.notableWorks.length > 1"
            type="button"
            class="artist__toggle meta-type"
            :aria-expanded="expandedArtist === artist.name"
            :aria-controls="`artist-credits-${index}`"
            @click="toggleArtist(artist.name)"
          >
            {{ expandedArtist === artist.name ? 'Hide credits' : `View all ${artist.notableWorks.length} credits` }}
            <span aria-hidden="true">{{ expandedArtist === artist.name ? '−' : '+' }}</span>
          </button>
          <div class="artist__links">
            <a v-for="link in artist.links" :key="link.url" :href="link.url" target="_blank" rel="noreferrer">{{ link.label }} ↗</a>
          </div>
        </div>
        <div
          v-if="expandedArtist === artist.name"
          :id="`artist-credits-${index}`"
          class="artist__details"
        >
          <p class="artist__details-label meta-type">Selected work</p>
          <ol>
            <li v-for="(work, workIndex) in artist.notableWorks" :key="`${artist.name}-${workIndex}`">
              <span class="meta-type">{{ String(workIndex + 1).padStart(2, '0') }}</span>
              <p>{{ work }}</p>
            </li>
          </ol>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import RegistrationStrip from '../ui/RegistrationStrip.vue';

defineProps({ artists: { type: Array, default: () => [] } });

const expandedArtist = ref(null);

function toggleArtist(name) {
  expandedArtist.value = expandedArtist.value === name ? null : name;
}
</script>

<style scoped>
.artists {
  position: relative;
  overflow: hidden;
  background: var(--paper-cool);
  padding: var(--section-space) var(--page-gutter);
  isolation: isolate;
}

.artists__word {
  position: absolute;
  top: 2rem;
  right: -0.08em;
  z-index: -1;
  color: transparent;
  -webkit-text-stroke: 1px rgba(41, 38, 199, 0.3);
  font-size: clamp(10rem, 24vw, 26rem);
  font-weight: 720;
  letter-spacing: -0.1em;
  line-height: 0.75;
}

.artists__head,
.artists__list {
  width: min(100%, 90rem);
  margin-inline: auto;
}

.artists__head {
  display: grid;
  grid-template-columns: 1fr 0.55fr;
  gap: 3rem;
  align-items: end;
  position: relative;
  z-index: 2;
  padding-top: clamp(3rem, 7vw, 7rem);
}

.artists__head .section-kicker {
  margin: 0 0 0.7rem;
  color: var(--blue);
}

.artists__head h2 {
  margin: 0;
  max-width: 11ch;
  font-size: clamp(4rem, 8vw, 9rem);
  font-weight: 650;
  letter-spacing: var(--display-tracking);
  line-height: 0.94;
}

.artists__head > p {
  max-width: 30rem;
  margin: 0;
  color: var(--ink-soft);
  font-size: 1rem;
  line-height: 1.6;
}

.artists__list {
  position: relative;
  z-index: 2;
  margin-top: clamp(3rem, 7vw, 7rem);
  border-top: 1px solid var(--black);
}

.artist {
  display: grid;
  grid-template-columns: 2.5rem 7rem minmax(0, 1fr) 7rem minmax(0, 0.8fr);
  gap: 1rem;
  align-items: center;
  min-height: 12rem;
  border-bottom: 1px solid var(--rule);
  padding-block: 0.75rem;
}

.artist img {
  width: 6rem;
  aspect-ratio: 1;
  border: 0.3rem solid var(--paper);
  object-fit: cover;
  filter: grayscale(1) contrast(1.2);
  transition: filter 160ms ease;
}

.artist h3,
.artist p {
  margin: 0;
}

.artist h3 {
  font-size: clamp(2rem, 3.8vw, 4rem);
  font-weight: 640;
  letter-spacing: var(--display-tracking);
  line-height: 1;
  overflow-wrap: anywhere;
}

.artist__identity p,
.artist__credits > p {
  margin-top: 0.3rem;
  color: var(--ink-soft);
  font-size: 0.875rem;
  line-height: 1.4;
}

.artist__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 0.8rem;
  margin-top: 0.45rem;
  font-size: 0.875rem;
}

.artist__toggle {
  display: flex;
  width: 100%;
  min-height: 2.75rem;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border: 0;
  border-bottom: 1px solid var(--rule);
  background: transparent;
  padding: 0;
  color: var(--black);
  text-align: left;
  cursor: pointer;
}

.artist__toggle:hover,
.artist__toggle:focus-visible {
  color: var(--blue);
}

.artist__toggle span {
  font-size: 1rem;
}

.artist__details {
  grid-column: 3 / -1;
  display: grid;
  grid-template-columns: 7rem minmax(0, 1fr);
  gap: 1rem;
  border-top: 1px solid var(--black);
  padding: 1.25rem 0 1.75rem;
}

.artist__details-label {
  color: var(--blue);
}

.artist__details ol {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  margin: 0;
  padding: 0;
  list-style: none;
}

.artist__details li {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr);
  gap: 0.75rem;
  border-top: 1px solid var(--rule);
  padding: 0.8rem 1rem 0.8rem 0;
}

.artist__details li:nth-child(-n + 2) {
  border-top: 0;
}

.artist__details li:nth-child(even) {
  padding-right: 0;
  padding-left: 1rem;
}

.artist__details li > span {
  color: var(--ink-soft);
}

.artist__details li p {
  font-size: 0.9rem;
  line-height: 1.5;
}

.artist__links a:hover,
.artist__links a:focus-visible {
  color: var(--blue);
}

.artist__links a {
  display: inline-flex;
  min-height: 2.75rem;
  align-items: center;
}

.artist:hover img,
.artist:focus-within img {
  filter: none;
}

.artist:hover h3,
.artist:focus-within h3 {
  color: var(--blue);
}

@media (max-width: 860px) {
  .artist {
    grid-template-columns: 2rem 6.5rem 1fr auto;
  }

  .artist__credits {
    grid-column: 3 / -1;
  }

  .artist__details {
    grid-column: 3 / -1;
  }
}

@media (max-width: 620px) {
  .artists__head {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .artist {
    grid-template-columns: 1.5rem 3.5rem minmax(0, 1fr);
    min-height: 9rem;
  }

  .artist img {
    width: 3.5rem;
  }

  .artist__period,
  .artist__credits {
    grid-column: 3;
  }

  .artist__details {
    grid-column: 2 / -1;
    grid-template-columns: 1fr;
    margin-top: 0.5rem;
  }

  .artist__details ol {
    grid-template-columns: 1fr;
  }

  .artist__details li:nth-child(2) {
    border-top: 1px solid var(--rule);
  }

  .artist__details li:nth-child(even) {
    padding-right: 0;
    padding-left: 0;
  }
}
</style>
