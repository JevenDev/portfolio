<template>
  <main id="main-content" ref="page" tabindex="-1" class="archive page-shell">
    <header class="archive__hero" data-motion-section>
      <svg class="archive__web" viewBox="0 0 1000 650" aria-hidden="true">
        <path data-draw-path d="M-50 520C180 300 320 430 510 250S790 -40 1050 150" />
        <path data-draw-path d="M80 -40C260 150 330 160 510 250S760 510 930 700" />
        <path data-draw-path d="M-30 180C170 280 310 180 510 250S790 430 1040 350" />
      </svg>
      <RegistrationStrip class="archive__registration" index="00" label="Archive" detail="Complete project catalogue" />
      <div class="archive__hero-copy">
        <p class="section-kicker">Archive / 2019–2026</p>
        <h1 data-poster-copy><span>Project</span><span>archive</span></h1>
        <p data-poster-copy>A searchable catalogue of identities, artwork, campaigns, digital builds, sound, and ongoing experiments.</p>
      </div>
      <div class="archive__counter" data-poster-drift>
        <strong>{{ String(filteredProjects.length).padStart(3, '0') }}</strong>
        <p class="meta-type">Visible records<br />Updated live</p>
      </div>
    </header>

    <section class="archive__tools" aria-label="Archive controls">
      <div class="archive__search">
        <label for="archive-search">Search</label>
        <input id="archive-search" v-model="query" type="search" placeholder="Title, role, or tag" autocomplete="off" />
      </div>
      <div class="archive__sort">
        <label for="archive-sort">Order</label>
        <select id="archive-sort" v-model="sortBy">
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="a-z">A to Z</option>
          <option value="z-a">Z to A</option>
        </select>
      </div>
      <div class="archive__views" aria-label="Archive view">
        <button type="button" :aria-pressed="view === 'grid'" :class="{ active: view === 'grid' }" @click="view = 'grid'">Grid</button>
        <button type="button" :aria-pressed="view === 'index'" :class="{ active: view === 'index' }" @click="view = 'index'">Index</button>
      </div>
      <div class="archive__filters" aria-label="Archive categories">
        <button
          v-for="category in categories"
          :key="category"
          type="button"
          :aria-pressed="activeCategory === category"
          :class="{ active: activeCategory === category }"
          @click="activeCategory = category"
        >
          {{ category.toLowerCase() }}
        </button>
      </div>
    </section>

    <section class="archive__results" :aria-label="`${filteredProjects.length} archive results`">
      <div v-if="filteredProjects.length && view === 'grid'" class="archive-grid">
        <article v-for="(project, index) in filteredProjects" :key="project.id" class="archive-item" data-motion-section>
          <RouterLink :to="`/work/${project.id}`">
            <div class="archive-item__media registered-media" data-poster-media>
              <GlitchMedia :src="project.thumbCard || project.thumb" :alt="project.title" treatment="preview" />
            </div>
            <div class="archive-item__body" data-poster-copy>
              <span class="meta-type">{{ String(index + 1).padStart(3, '0') }}</span>
              <div>
                <h2>{{ project.title }}</h2>
                <p>{{ getProjectCategory(project) }}</p>
              </div>
              <span class="meta-type">{{ project.year }}</span>
            </div>
          </RouterLink>
        </article>
      </div>

      <div v-else-if="filteredProjects.length" class="archive-index">
        <div class="archive-index__head meta-type" aria-hidden="true">
          <span>No.</span><span>Project</span><span>Format</span><span>Date</span><span></span>
        </div>
        <ProjectIndexRow
          v-for="(project, index) in filteredProjects"
          :key="project.id"
          :active="activeProjectId === project.id"
          :index="index"
          :project="project"
          @activate="activeProjectId = $event.id"
        />
      </div>

      <div v-else class="archive__empty">
        <h2>No matching projects</h2>
        <p>Try another title, role, tag, or category.</p>
        <button type="button" @click="resetFilters">Reset search</button>
      </div>
    </section>
  </main>
</template>

<script setup>
import { computed, ref } from 'vue';
import { RouterLink } from 'vue-router';
import GlitchMedia from '../components/ui/GlitchMedia.vue';
import ProjectIndexRow from '../components/ui/ProjectIndexRow.vue';
import RegistrationStrip from '../components/ui/RegistrationStrip.vue';
import { usePosterMotion } from '../composables/usePosterMotion';
import { ARCHIVE_CATEGORIES, getProjectCategory, projectMatchesArchiveCategory, sortProjects } from '../utils/portfolio';

const page = ref(null);
usePosterMotion(page);

const props = defineProps({ projects: { type: Array, default: () => [] } });
const activeCategory = ref('ALL');
const activeProjectId = ref('');
const categories = ARCHIVE_CATEGORIES;
const query = ref('');
const sortBy = ref('newest');
const view = ref('grid');

const filteredProjects = computed(() => {
  const normalizedQuery = query.value.trim().toLowerCase();
  const matching = props.projects.filter((project) => {
    if (!projectMatchesArchiveCategory(project, activeCategory.value)) return false;
    if (!normalizedQuery) return true;
    const haystack = [project.title, project.role, project.year, ...(project.tags || [])].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(normalizedQuery);
  });
  return sortProjects(matching, sortBy.value);
});

function resetFilters() {
  query.value = '';
  activeCategory.value = 'ALL';
}
</script>

<style scoped>
.archive {
  background: var(--paper-cool);
}

.archive__hero {
  position: relative;
  display: grid;
  grid-template-columns: 1fr minmax(16rem, 0.38fr);
  gap: clamp(3rem, 9vw, 10rem);
  align-items: end;
  min-height: 34rem;
  overflow: hidden;
  padding: clamp(4rem, 9vw, 9rem) clamp(1.25rem, 3vw, 3rem);
}

.archive__web {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: var(--blue);
  stroke-width: 1.3;
  pointer-events: none;
}

.archive__registration {
  position: absolute;
  inset: 2rem clamp(1.25rem, 3vw, 3rem) auto;
  width: auto;
}

.archive__hero-copy,
.archive__counter {
  position: relative;
  z-index: 2;
}

.archive__hero-copy .section-kicker {
  margin: 0 0 clamp(3rem, 8vw, 8rem);
  color: var(--blue);
}

.archive__hero-copy h1 {
  margin: 0;
  font-size: clamp(5rem, 12vw, 13rem);
  font-weight: 680;
  letter-spacing: -0.09em;
  line-height: 0.6;
}

.archive__hero-copy h1 span {
  display: block;
}

.archive__hero-copy h1 span:last-child {
  margin-left: 0.7em;
  color: var(--blue);
  font-size: 0.72em;
}

.archive__hero-copy > p:last-child {
  max-width: 36rem;
  margin: 2rem 0 0;
  color: var(--ink-soft);
  font-size: 0.9rem;
}

.archive__counter {
  display: flex;
  min-height: 17rem;
  flex-direction: column;
  justify-content: space-between;
  width: min(100%, 20rem);
  aspect-ratio: 1;
  justify-self: end;
  border-radius: 50%;
  background: var(--signal-red);
  color: var(--paper-cool);
  padding: 1rem;
  transform: rotate(7deg);
}

.archive__counter strong {
  font-size: clamp(5rem, 11vw, 10rem);
  font-weight: 440;
  letter-spacing: -0.085em;
  line-height: 0.8;
}

.archive__counter p {
  align-self: flex-end;
  margin: 0 1.5rem 1.2rem 0;
  transform: rotate(-7deg);
  text-align: right;
}

.archive__tools {
  position: sticky;
  top: var(--header-height);
  z-index: 20;
  display: grid;
  grid-template-columns: minmax(14rem, 1fr) minmax(11rem, 0.35fr) auto;
  border-block: 1px solid var(--rule);
  background: rgba(242, 240, 233, 0.96);
}

.archive__search,
.archive__sort {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 1rem;
  border-right: 1px solid var(--rule);
  padding-left: 1rem;
  font-size: 0.7rem;
}

.archive__search input,
.archive__sort select {
  width: 100%;
  height: 3.4rem;
  border: 0;
  background: transparent;
  color: var(--black);
  padding-right: 1rem;
  font-size: 0.75rem;
}

.archive__views {
  display: flex;
}

.archive__views button,
.archive__filters button,
.archive__empty button {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
}

.archive__views button {
  min-width: 4.5rem;
  border-left: 1px solid var(--rule);
  font-size: 0.7rem;
}

.archive__filters {
  grid-column: 1 / -1;
  display: flex;
  overflow-x: auto;
  border-top: 1px solid var(--rule);
}

.archive__filters button {
  flex: 1 0 auto;
  min-height: 2.6rem;
  border-right: 1px solid var(--rule);
  padding-inline: 1rem;
  font-size: 0.68rem;
}

.archive__views button.active,
.archive__views button:hover,
.archive__filters button.active,
.archive__filters button:hover {
  color: var(--blue);
  text-decoration: underline;
  text-underline-offset: 0.25rem;
}

.archive__results {
  min-height: 50vh;
  background: var(--paper);
  padding: clamp(4rem, 9vw, 9rem) clamp(1.25rem, 3vw, 3rem);
}

.archive-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(3rem, 6vw, 6rem) clamp(1.2rem, 2.5vw, 2.5rem);
  width: min(100%, 90rem);
  margin-inline: auto;
}

.archive-item:nth-child(3n + 2) {
  margin-top: clamp(2rem, 5vw, 5rem);
}

.archive-item:nth-child(4n + 1) {
  transform: rotate(-0.45deg);
}

.archive-item:nth-child(4n + 3) {
  transform: rotate(0.55deg);
}

.archive-item__media {
  aspect-ratio: 4 / 3;
}

.archive-item__body {
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  gap: 0.65rem;
  border-top: 1px solid var(--black);
  padding-top: 0.6rem;
}

.archive-item__body h2,
.archive-item__body p {
  margin: 0;
}

.archive-item__body h2 {
  font-size: clamp(1rem, 1.65vw, 1.4rem);
  font-weight: 540;
  letter-spacing: -0.03em;
  line-height: 1.05;
}

.archive-item__body p {
  margin-top: 0.25rem;
  color: var(--ink-soft);
  font-size: 0.68rem;
}

.archive-item a:hover h2,
.archive-item a:focus-visible h2 {
  color: var(--blue);
}

.archive-index {
  width: min(100%, 90rem);
  margin-inline: auto;
  border-top: 1px solid var(--black);
}

.archive-index__head {
  display: grid;
  grid-template-columns: 3rem minmax(0, 1.5fr) minmax(9rem, 0.7fr) 8rem 1rem;
  gap: 1rem;
  border-bottom: 1px solid var(--black);
  padding: 0.65rem 0;
  color: var(--ink-soft);
}

.archive__empty {
  width: min(100%, 40rem);
  margin-inline: auto;
  border-top: 1px solid var(--black);
  padding-top: 1rem;
}

.archive__empty h2 {
  margin: 0;
  font-size: clamp(2rem, 4vw, 4rem);
  font-weight: 520;
  letter-spacing: -0.05em;
}

.archive__empty button {
  margin-top: 1rem;
  border-bottom: 1px solid currentColor;
  padding: 0.2rem 0;
  color: var(--blue);
}

@media (max-width: 900px) {
  .archive__tools {
    grid-template-columns: 1fr 1fr;
  }

  .archive__views {
    grid-column: 1 / -1;
    border-top: 1px solid var(--rule);
  }

  .archive__views button {
    flex: 1;
  }

  .archive-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 680px) {
  .archive__hero {
    grid-template-columns: 1fr;
    min-height: 0;
  }

  .archive__hero-copy h1 {
    font-size: clamp(4.2rem, 21vw, 6.5rem);
  }

  .archive__counter {
    min-height: 12rem;
    width: 13rem;
    justify-self: start;
  }

  .archive__tools {
    position: relative;
    top: auto;
    grid-template-columns: 1fr;
  }

  .archive__search,
  .archive__sort {
    border-right: 0;
    border-bottom: 1px solid var(--rule);
  }

  .archive__views {
    grid-column: auto;
    border-top: 0;
  }

  .archive-grid {
    grid-template-columns: 1fr;
  }

  .archive-item:nth-child(n) {
    margin-top: 0;
    transform: none;
  }

  .archive-index__head {
    display: none;
  }
}
</style>
