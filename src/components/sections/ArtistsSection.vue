<template>
  <section class="artists" aria-labelledby="artists-title">
    <span class="artists__word" aria-hidden="true">COLLAB</span>
    <header class="artists__head">
      <div>
        <p class="section-kicker">Collaborations</p>
        <h2 id="artists-title">Artists and teams</h2>
      </div>
      <p>Selected ongoing and past relationships across identity, websites, artwork, production, and engineering.</p>
    </header>

    <div class="artists__list">
      <article v-for="(artist, index) in artists" :key="artist.name" class="artist">
        <span class="artist__index meta-type">{{ String(index + 1).padStart(2, '0') }}</span>
        <img :src="artist.imageThumb || artist.image" :alt="artist.name" loading="lazy" decoding="async" />
        <div class="artist__identity">
          <h3>{{ artist.name }}</h3>
          <p>{{ artist.role }}</p>
        </div>
        <p class="artist__period meta-type">{{ artist.yearRange }}</p>
        <div class="artist__credits">
          <p>{{ artist.notableWorks[0] }}</p>
          <div class="artist__links">
            <a v-for="link in artist.links" :key="link.url" :href="link.url" target="_blank" rel="noreferrer">{{ link.label }} ↗</a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
defineProps({ artists: { type: Array, default: () => [] } });
</script>

<style scoped>
.artists {
  position: relative;
  overflow: hidden;
  background: var(--paper-cool);
  padding: clamp(5rem, 10vw, 10rem) clamp(1.25rem, 3vw, 3rem);
  isolation: isolate;
}

.artists__word {
  position: absolute;
  top: 2rem;
  right: -0.08em;
  z-index: -1;
  color: var(--acid);
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
  border-top: 1px solid var(--black);
  padding-top: 0.8rem;
}

.artists__head .section-kicker {
  margin: 0 0 0.7rem;
  color: var(--blue);
}

.artists__head h2 {
  margin: 0;
  max-width: 8ch;
  font-size: clamp(4rem, 8vw, 9rem);
  font-weight: 650;
  letter-spacing: -0.085em;
  line-height: 0.76;
}

.artists__head > p {
  max-width: 30rem;
  margin: 0;
  color: var(--ink-soft);
  font-size: 0.82rem;
}

.artists__list {
  position: relative;
  z-index: 2;
  margin-top: clamp(3rem, 7vw, 7rem);
  border-top: 1px solid var(--black);
}

.artist {
  display: grid;
  grid-template-columns: 2.5rem 8rem minmax(12rem, 0.85fr) 8rem minmax(15rem, 1fr);
  gap: 1rem;
  align-items: center;
  min-height: 12rem;
  border-bottom: 1px solid var(--rule);
  padding-block: 0.75rem;
}

.artist img {
  width: 7.5rem;
  aspect-ratio: 1;
  border-radius: 50%;
  object-fit: cover;
  filter: grayscale(1) contrast(1.2);
  transition: filter 160ms ease;
}

.artist h3,
.artist p {
  margin: 0;
}

.artist h3 {
  font-size: clamp(2.3rem, 4.8vw, 5.4rem);
  font-weight: 640;
  letter-spacing: -0.075em;
  line-height: 0.78;
}

.artist__identity p,
.artist__credits > p {
  margin-top: 0.3rem;
  color: var(--ink-soft);
  font-size: 0.72rem;
  line-height: 1.4;
}

.artist__links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 0.8rem;
  margin-top: 0.45rem;
  font-size: 0.68rem;
}

.artist__links a:hover,
.artist__links a:focus-visible {
  color: var(--blue);
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
}

@media (max-width: 620px) {
  .artists__head {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .artist {
    grid-template-columns: 1.5rem 3.5rem 1fr;
    min-height: 9rem;
  }

  .artist img {
    width: 3.5rem;
  }

  .artist__period,
  .artist__credits {
    grid-column: 3;
  }
}
</style>
