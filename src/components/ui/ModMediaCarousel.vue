<template>
  <figure
    ref="root"
    class="mod-media-viewer"
    :style="{ '--media-accent': accent }"
    role="region"
    aria-roledescription="carousel"
    :aria-label="`${label} media gallery`"
    @pointerenter="hoverPaused = true"
    @pointerleave="hoverPaused = false"
    @focusin="focusPaused = true"
    @focusout="handleFocusOut"
  >
    <div class="mod-media-viewer__stage" :aria-live="isRotating ? 'off' : 'polite'">
      <Transition name="mod-media-swap" mode="out-in">
        <video
          v-if="currentMedia.type === 'video'"
          :key="currentMedia.url"
          ref="video"
          :src="currentMedia.url"
          :poster="currentMedia.poster || undefined"
          :aria-label="currentMedia.alt"
          controls
          muted
          playsinline
          preload="metadata"
          @ended="advanceFromPlayback"
        />
        <img
          v-else
          :key="currentMedia.url"
          :src="currentMedia.url"
          :alt="currentMedia.alt"
          loading="lazy"
          decoding="async"
        />
      </Transition>
      <span class="mod-media-viewer__kind meta-type" aria-hidden="true">{{ currentMedia.type }}</span>
    </div>

    <figcaption class="mod-media-viewer__caption">
      <div class="mod-media-viewer__identity">
        <span class="meta-type">Project view / {{ formatIndex(activeIndex + 1) }}</span>
        <strong>{{ currentMedia.title }}</strong>
        <span v-if="currentMedia.description">{{ currentMedia.description }}</span>
      </div>

      <div v-if="items.length > 1" class="mod-media-viewer__controls">
        <button type="button" :aria-label="`Previous ${label} media`" @click="showPrevious">←</button>
        <button type="button" :aria-label="isManuallyPaused ? `Play ${label} gallery` : `Pause ${label} gallery`" @click="togglePlayback">
          {{ isManuallyPaused ? 'Play' : 'Pause' }}
        </button>
        <button type="button" :aria-label="`Next ${label} media`" @click="showNext">→</button>
        <span class="mod-media-viewer__count meta-type" :aria-live="isRotating ? 'off' : 'polite'">
          {{ formatIndex(activeIndex + 1) }} / {{ formatIndex(items.length) }}
        </span>
      </div>
    </figcaption>
  </figure>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const props = defineProps({
  accent: { type: String, default: '#2926c7' },
  items: { type: Array, default: () => [] },
  label: { type: String, required: true }
});

const activeIndex = ref(0);
const focusPaused = ref(false);
const hoverPaused = ref(false);
const inView = ref(false);
const isManuallyPaused = ref(false);
const pageVisible = ref(true);
const reducedMotion = ref(false);
const root = ref(null);
const video = ref(null);
let intervalId = null;
let mediaQuery = null;
let observer = null;
let playbackVersion = 0;

const currentMedia = computed(() => props.items[activeIndex.value] || {
  alt: '',
  description: '',
  title: props.label,
  type: 'image',
  url: ''
});
const isRotating = computed(() => (
  props.items.length > 1
  && inView.value
  && pageVisible.value
  && !focusPaused.value
  && !hoverPaused.value
  && !isManuallyPaused.value
  && !reducedMotion.value
));

function formatIndex(value) {
  return String(value).padStart(2, '0');
}

function setActiveIndex(nextIndex) {
  activeIndex.value = (nextIndex + props.items.length) % props.items.length;
}

function showPrevious() {
  isManuallyPaused.value = true;
  setActiveIndex(activeIndex.value - 1);
}

function showNext() {
  isManuallyPaused.value = true;
  setActiveIndex(activeIndex.value + 1);
}

function advanceFromPlayback() {
  if (!isManuallyPaused.value) setActiveIndex(activeIndex.value + 1);
}

function togglePlayback() {
  isManuallyPaused.value = !isManuallyPaused.value;
  if (!isManuallyPaused.value) focusPaused.value = false;
}

function handleFocusOut(event) {
  if (!root.value?.contains(event.relatedTarget)) focusPaused.value = false;
}

function handleVisibilityChange() {
  pageVisible.value = !document.hidden;
}

function handleMotionPreference(event) {
  reducedMotion.value = event.matches;
}

function stopInterval() {
  if (intervalId === null) return;
  window.clearInterval(intervalId);
  intervalId = null;
}

async function syncPlayback() {
  const version = ++playbackVersion;
  stopInterval();
  await nextTick();
  if (version !== playbackVersion) return;

  if (!isRotating.value) {
    video.value?.pause();
    return;
  }

  if (currentMedia.value.type === 'video') {
    const playback = video.value?.play();
    playback?.catch(() => {
      isManuallyPaused.value = true;
    });
    return;
  }

  intervalId = window.setInterval(() => {
    setActiveIndex(activeIndex.value + 1);
  }, 6500);
}

watch(() => props.items, () => {
  activeIndex.value = 0;
}, { deep: false });
watch([isRotating, currentMedia], syncPlayback);

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion.value = mediaQuery.matches;
  mediaQuery.addEventListener('change', handleMotionPreference);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  observer = new IntersectionObserver(([entry]) => {
    inView.value = entry.isIntersecting && entry.intersectionRatio >= 0.45;
  }, { threshold: [0, 0.45, 0.75] });
  observer.observe(root.value);
});

onBeforeUnmount(() => {
  playbackVersion += 1;
  stopInterval();
  observer?.disconnect();
  mediaQuery?.removeEventListener('change', handleMotionPreference);
  document.removeEventListener('visibilitychange', handleVisibilityChange);
});
</script>

<style scoped>
.mod-media-viewer {
  margin: 0;
  background: var(--media-accent);
}

.mod-media-viewer__stage {
  position: relative;
  display: grid;
  overflow: hidden;
  aspect-ratio: 16 / 10;
  place-items: center;
  background: #090909;
}

.mod-media-viewer__stage img,
.mod-media-viewer__stage video {
  grid-area: 1 / 1;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.mod-media-viewer__kind {
  position: absolute;
  top: 0;
  right: 0;
  background: #fffef8;
  color: #090909;
  padding: 0.42rem 0.55rem;
  text-transform: uppercase;
}

.mod-media-viewer__caption {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  border-top: 1px solid currentColor;
  background: var(--story-background, #fffef8);
  color: inherit;
}

.mod-media-viewer__identity {
  display: grid;
  gap: 0.18rem;
  min-width: 0;
  padding: 0.65rem 0.75rem 0.72rem 0;
}

.mod-media-viewer__identity > span {
  color: var(--story-muted, currentColor);
  font-size: 0.64rem;
}

.mod-media-viewer__identity strong {
  overflow: hidden;
  font-size: 0.78rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mod-media-viewer__controls {
  display: grid;
  grid-template-columns: 2.65rem minmax(3.75rem, auto) 2.65rem auto;
  align-self: stretch;
  border-left: 1px solid var(--story-rule, currentColor);
}

.mod-media-viewer__controls button {
  border: 0;
  border-right: 1px solid var(--story-rule, currentColor);
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 0.7rem;
  cursor: pointer;
  transition: background-color 150ms ease, color 150ms ease;
}

.mod-media-viewer__controls button:hover {
  background: #090909;
  color: #fffef8;
}

.mod-media-viewer__count {
  display: grid;
  min-width: 4.5rem;
  place-items: center;
  padding-inline: 0.65rem;
  color: var(--story-muted, currentColor);
}

.mod-media-swap-enter-active,
.mod-media-swap-leave-active {
  transition: opacity 220ms ease;
}

.mod-media-swap-enter-from,
.mod-media-swap-leave-to {
  opacity: 0;
}

@media (max-width: 760px) {
  .mod-media-viewer__caption {
    grid-template-columns: 1fr;
  }

  .mod-media-viewer__identity {
    padding-inline: 0;
  }

  .mod-media-viewer__controls {
    grid-template-columns: 2.75rem 1fr 2.75rem auto;
    min-height: 2.75rem;
    border-top: 1px solid var(--story-rule, currentColor);
    border-left: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .mod-media-swap-enter-active,
  .mod-media-swap-leave-active {
    transition: none;
  }
}
</style>
