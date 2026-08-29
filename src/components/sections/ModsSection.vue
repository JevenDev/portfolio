<template>
  <section id="mods" class="mods" aria-labelledby="mods-title">
    <span class="mods__watermark" data-poster-drift aria-hidden="true">MODS</span>
    <RegistrationStrip
      index="00"
      label="Mod catalogue"
      :detail="`${String(mods.length).padStart(2, '0')} public mods / Modrinth`"
    />

    <header class="mods__head" data-motion-section>
      <div class="mods__heading">
        <p class="section-kicker">Minecraft / Java Edition</p>
        <h2 id="mods-title" data-poster-heading>
          <span>Minecraft,</span>
          <span>adjusted.</span>
        </h2>
      </div>

      <div class="mods__intro" data-poster-copy>
        <p>Combat lock-ons, sky systems, village economies, survival mechanics, and shared utilities built for Minecraft.</p>
        <a href="https://modrinth.com/user/jvn" target="_blank" rel="noreferrer">Browse every release on Modrinth ↗</a>
      </div>

      <div
        class="mods__counter"
        data-poster-drift
        :aria-label="`${mods.length} public mods with ${formatNumber(totalDownloads)} combined downloads`"
      >
        <strong>{{ String(mods.length).padStart(2, '0') }}</strong>
        <span class="meta-type">Public mods</span>
        <span class="meta-type">{{ formatNumber(totalDownloads) }} combined downloads</span>
      </div>
    </header>

    <div class="mods__index">
      <div class="mods__index-head meta-type" aria-hidden="true">
        <span>No.</span>
        <span>Mark</span>
        <span>Release</span>
        <span>Type / loaders</span>
        <span>Activity</span>
        <span></span>
      </div>

      <a
        v-for="(mod, index) in mods"
        :key="mod.id"
        class="mod-row"
        :href="`https://modrinth.com/mod/${mod.slug}`"
        target="_blank"
        rel="noreferrer"
        :style="{ '--mod-accent': mod.accent }"
        data-motion-section
      >
        <span class="mod-row__index meta-type">{{ String(index + 1).padStart(2, '0') }}</span>
        <span class="mod-row__icon">
          <img :src="mod.iconUrl" alt="" loading="lazy" decoding="async" data-poster-media />
        </span>
        <span class="mod-row__identity" data-poster-copy>
          <strong data-poster-heading>{{ mod.title }}</strong>
          <span>{{ mod.description }}</span>
        </span>
        <span class="mod-row__details meta-type" data-poster-copy>
          <span>{{ formatLabels(mod.categories) }}</span>
          <span>{{ formatLabels(mod.loaders) }}</span>
        </span>
        <span class="mod-row__activity meta-type" data-poster-copy>
          <span>{{ formatNumber(mod.downloads) }} downloads</span>
          <span>Updated {{ formatDate(mod.updated) }}</span>
        </span>
        <span class="mod-row__arrow" aria-hidden="true">↗</span>
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import RegistrationStrip from '../ui/RegistrationStrip.vue';

const props = defineProps({ mods: { type: Array, default: () => [] } });

const totalDownloads = computed(() => props.mods.reduce((total, mod) => total + mod.downloads, 0));

function formatDate(value) {
  return new Intl.DateTimeFormat('en-CA', { month: 'short', year: 'numeric' }).format(new Date(value));
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
  position: relative;
  overflow: hidden;
  background: var(--acid);
  padding: clamp(2rem, 4vw, 4rem) clamp(1.25rem, 3vw, 3rem) clamp(5rem, 10vw, 10rem);
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
.mods__heading h2,
.mods__intro p {
  margin: 0;
}

.mods__heading p {
  margin-bottom: clamp(3rem, 8vw, 8rem);
  color: var(--blue);
}

.mods__heading h2 {
  max-width: 8ch;
  color: var(--black);
  font-size: clamp(4.8rem, 9vw, 10rem);
  font-weight: 680;
  letter-spacing: -0.09em;
  line-height: 0.67;
}

.mods__heading h2 span {
  display: block;
}

.mods__heading h2 span:last-child {
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
  font-size: clamp(5rem, 9vw, 8rem);
  font-weight: 450;
  letter-spacing: -0.09em;
  line-height: 0.72;
}

.mods__counter span:last-child {
  max-width: 10rem;
  justify-self: end;
  text-align: right;
}

.mods__index {
  border-top: 1px solid var(--black);
}

.mods__index-head,
.mod-row {
  display: grid;
  grid-template-columns: 2.5rem 6rem minmax(18rem, 1.15fr) minmax(11rem, 0.55fr) minmax(9rem, 0.4fr) 1.5rem;
  gap: 1rem;
  align-items: center;
}

.mods__index-head {
  min-height: 2.8rem;
  color: var(--ink-soft);
}

.mod-row {
  position: relative;
  min-height: 10rem;
  overflow: hidden;
  border-top: 1px solid var(--rule);
  color: var(--black);
  transition: background-color 180ms ease, color 180ms ease;
}

.mod-row:last-child {
  border-bottom: 1px solid var(--black);
}

.mod-row::before {
  position: absolute;
  inset: 0 auto 0 0;
  width: 0.35rem;
  background: var(--mod-accent);
  content: '';
  transition: width 180ms ease;
}

.mod-row__index {
  align-self: start;
  padding-left: 0.45rem;
  padding-top: 1.1rem;
}

.mod-row__icon {
  display: block;
  width: 5.5rem;
  aspect-ratio: 1;
  background: var(--mod-accent);
  clip-path: polygon(8% 0, 100% 0, 100% 92%, 92% 100%, 0 100%, 0 8%);
  padding: 0.28rem;
  transition: transform 180ms ease;
}

.mod-row__icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mod-row__identity,
.mod-row__details,
.mod-row__activity {
  display: grid;
}

.mod-row__identity {
  gap: 0.45rem;
}

.mod-row__identity strong {
  font-size: clamp(2.1rem, 4vw, 4.6rem);
  font-weight: 640;
  letter-spacing: -0.075em;
  line-height: 0.8;
  transition: transform 180ms ease;
}

.mod-row__identity > span {
  max-width: 38rem;
  color: var(--ink-soft);
  font-size: 0.7rem;
  line-height: 1.45;
  transition: color 180ms ease;
}

.mod-row__details,
.mod-row__activity {
  gap: 0.3rem;
  color: var(--ink-soft);
  transition: color 180ms ease;
}

.mod-row__details span:last-child {
  color: var(--black);
  transition: color 180ms ease;
}

.mod-row__arrow {
  justify-self: end;
  color: var(--blue);
  font-size: 1.15rem;
  transition: color 180ms ease, transform 180ms ease;
}

.mod-row:hover,
.mod-row:focus-visible {
  background: var(--black);
  color: var(--paper-cool);
}

.mod-row:hover::before,
.mod-row:focus-visible::before {
  width: 0.85rem;
}

.mod-row:hover .mod-row__icon,
.mod-row:focus-visible .mod-row__icon {
  transform: rotate(-3deg) scale(1.06);
}

.mod-row:hover .mod-row__identity strong,
.mod-row:focus-visible .mod-row__identity strong {
  transform: translateX(0.55rem);
}

.mod-row:hover .mod-row__identity > span,
.mod-row:hover .mod-row__details,
.mod-row:hover .mod-row__activity,
.mod-row:hover .mod-row__details span:last-child,
.mod-row:focus-visible .mod-row__identity > span,
.mod-row:focus-visible .mod-row__details,
.mod-row:focus-visible .mod-row__activity,
.mod-row:focus-visible .mod-row__details span:last-child {
  color: rgba(255, 254, 248, 0.72);
}

.mod-row:hover .mod-row__arrow,
.mod-row:focus-visible .mod-row__arrow {
  color: var(--signal-red);
  transform: translate(0.15rem, -0.15rem);
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

  .mods__index-head,
  .mod-row {
    grid-template-columns: 2.5rem 5rem minmax(15rem, 1fr) minmax(9rem, 0.48fr) 8rem 1.5rem;
  }

  .mod-row__icon {
    width: 4.5rem;
  }

  .mod-row__details span:first-child {
    display: none;
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

  .mods__heading p {
    margin-bottom: 4rem;
  }

  .mods__heading h2 {
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

  .mods__index-head {
    display: none;
  }

  .mod-row {
    grid-template-columns: 2rem 4.1rem minmax(0, 1fr) 1.25rem;
    gap: 0.75rem;
    min-height: 0;
    padding-block: 1.25rem;
  }

  .mod-row__index {
    grid-column: 1;
    grid-row: 1;
    padding-top: 0.2rem;
  }

  .mod-row__icon {
    grid-column: 2;
    grid-row: 1;
    width: 4rem;
  }

  .mod-row__identity {
    grid-column: 3;
    grid-row: 1;
  }

  .mod-row__identity strong {
    font-size: clamp(2rem, 10vw, 3.3rem);
  }

  .mod-row__details,
  .mod-row__activity {
    grid-column: 2 / -1;
    margin-left: 0;
  }

  .mod-row__details {
    grid-row: 2;
  }

  .mod-row__details span:first-child {
    display: block;
  }

  .mod-row__activity {
    grid-row: 3;
    grid-template-columns: 1fr 1fr;
  }

  .mod-row__arrow {
    grid-column: 4;
    grid-row: 1;
    align-self: start;
  }
}

@media (max-width: 480px) {
  .mod-row {
    grid-template-columns: 1.6rem 3.5rem minmax(0, 1fr) 1rem;
    gap: 0.6rem;
  }

  .mod-row__icon {
    width: 3.5rem;
  }

  .mod-row__identity > span {
    font-size: 0.66rem;
  }
}
</style>
