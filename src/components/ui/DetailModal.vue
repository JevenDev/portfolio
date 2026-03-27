<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="open && item"
        class="fixed inset-0 z-50 overflow-y-auto bg-white/90 px-4 py-8 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="titleId"
        @click.self="emit('close')"
      >
        <div class="mx-auto w-full max-w-5xl border border-ink/20 bg-paper p-6 shadow-card md:p-10">
          <button
            type="button"
            class="focus-ring mb-5 inline-flex items-center border border-line px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted transition hover:border-ink/30 hover:text-ink"
            @click="emit('close')"
          >
            Close
          </button>

          <template v-if="mode === 'artist'">
            <header class="mb-8 flex flex-wrap items-center gap-5 border-b border-line pb-8">
              <img
                v-if="item.image"
                :src="item.image"
                :alt="item.name"
                class="h-20 w-20 rounded-full object-cover"
              />
              <div class="space-y-2">
                <h3 :id="titleId" class="font-display text-3xl font-semibold tracking-[-0.02em] text-ink">
                  {{ item.name }}
                </h3>
                <p class="text-sm font-medium uppercase tracking-[0.14em] text-muted">{{ item.role }}</p>
                <p class="text-sm text-muted">{{ item.yearRange }}</p>
              </div>
            </header>

            <section v-if="item.notableWorks?.length" class="space-y-4">
              <h4 class="font-display text-xl font-semibold text-ink">Notable Works</h4>
              <ul class="space-y-2 text-sm leading-relaxed text-ink/90 md:text-base">
                <li v-for="(work, index) in item.notableWorks" :key="`${item.name}-work-${index}`">{{ work }}</li>
              </ul>
            </section>

            <section v-if="item.links?.length" class="mt-8 space-y-3 border-t border-line pt-6">
              <h4 class="font-display text-xl font-semibold text-ink">Links</h4>
              <ul class="flex flex-wrap gap-4">
                <li v-for="link in item.links" :key="`${item.name}-${link.url}`">
                  <a
                    :href="link.url"
                    target="_blank"
                    rel="noreferrer"
                    class="focus-ring text-sm font-semibold uppercase tracking-[0.14em] text-ink underline decoration-line underline-offset-4 transition hover:decoration-ink"
                  >
                    {{ link.label }}
                  </a>
                </li>
              </ul>
            </section>
          </template>

          <template v-else>
            <header class="mb-8 space-y-4 border-b border-line pb-8">
              <h3 :id="titleId" class="max-w-4xl font-display text-3xl font-semibold tracking-[-0.03em] text-ink md:text-5xl">
                {{ item.title }}
              </h3>

              <div class="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.14em] text-muted md:text-sm">
                <span>{{ item.year }}</span>
                <span class="text-line">/</span>
                <span v-if="item.role">{{ item.role }}</span>
                <span v-if="item.role" class="text-line">/</span>
                <span>{{ item.type === 'artwork' ? 'Artwork' : 'Project' }}</span>
              </div>
            </header>

            <section v-if="descriptionLines.length" class="space-y-3 text-base leading-relaxed text-ink/90">
              <p v-for="(line, index) in descriptionLines" :key="`${item.id}-desc-${index}`">{{ line }}</p>
            </section>

            <section v-if="galleryItems.length" class="mt-8 space-y-6">
              <h4 class="font-display text-xl font-semibold text-ink">Gallery</h4>
              <div class="grid gap-6 md:grid-cols-2">
                <figure
                  v-for="(media, index) in galleryItems"
                  :key="`${item.id}-gallery-${index}`"
                  class="space-y-2"
                >
                  <img :src="media.url" :alt="media.label || item.title" class="w-full border border-line" loading="lazy" />
                  <figcaption v-if="media.label" class="text-sm text-muted">{{ media.label }}</figcaption>
                </figure>
              </div>
            </section>

            <section v-if="item.audio?.src" class="mt-8 space-y-4 border-t border-line pt-6">
              <h4 class="font-display text-xl font-semibold text-ink">Audio</h4>
              <p class="text-sm text-muted">{{ item.audio.title }}</p>
              <audio :src="item.audio.src" controls class="w-full" preload="none">
                Your browser does not support embedded audio.
              </audio>
            </section>

            <section v-if="item.links?.length" class="mt-8 space-y-3 border-t border-line pt-6">
              <h4 class="font-display text-xl font-semibold text-ink">Links</h4>
              <ul class="flex flex-wrap gap-4">
                <li v-for="link in item.links" :key="`${item.id}-${link.url}`">
                  <a
                    :href="link.url"
                    target="_blank"
                    rel="noreferrer"
                    class="focus-ring text-sm font-semibold uppercase tracking-[0.14em] text-ink underline decoration-line underline-offset-4 transition hover:decoration-ink"
                  >
                    {{ link.label }}
                  </a>
                </li>
              </ul>
            </section>

            <section v-if="item.tags?.length" class="mt-8 border-t border-line pt-6">
              <ul class="flex flex-wrap gap-2">
                <li
                  v-for="tag in item.tags"
                  :key="`${item.id}-tag-${tag}`"
                  class="rounded-full border border-line px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted"
                >
                  {{ tag }}
                </li>
              </ul>
            </section>
          </template>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps({
  item: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'project'
  },
  open: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close']);

const titleId = computed(() => (props.mode === 'artist' ? 'artist-modal-title' : 'project-modal-title'));

const descriptionLines = computed(() => {
  if (!props.item) return [];
  if (Array.isArray(props.item.description)) return props.item.description;
  if (typeof props.item.description === 'string' && props.item.description.trim().length > 0) {
    return [props.item.description];
  }
  return [];
});

const galleryItems = computed(() => {
  if (!props.item?.gallery?.length) return [];

  return props.item.gallery.map((item) => {
    if (typeof item === 'string') {
      return { label: '', url: item };
    }

    return {
      label: item.label?.trim() || '',
      url: item.url
    };
  });
});

function onKeydown(event) {
  if (event.key === 'Escape' && props.open) {
    emit('close');
  }
}

watch(
  () => props.open,
  (isOpen) => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
  },
  { immediate: true }
);

onMounted(() => {
  document.addEventListener('keydown', onKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown);
  document.body.style.overflow = '';
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 220ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>