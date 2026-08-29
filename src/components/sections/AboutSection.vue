<template>
  <section id="profile" class="profile" aria-labelledby="profile-title" data-motion-section>
    <span class="profile__word" data-poster-drift aria-hidden="true">PROFILE</span>
    <svg class="profile__web" viewBox="0 0 900 700" aria-hidden="true">
      <path data-draw-path d="M-20 620C180 430 280 480 430 330S690 30 940 190" />
      <path data-draw-path d="M80 -20C220 180 330 190 430 330S580 640 860 740" />
      <path data-draw-path d="M-40 220C180 300 330 250 430 330S670 510 950 420" />
    </svg>

    <RegistrationStrip index="03" label="Profile" :detail="location" tone="light" />

    <div class="profile__content">
      <div class="profile__statement">
        <h2 id="profile-title" data-poster-heading>{{ headline }}</h2>
        <p data-poster-copy>{{ body }}</p>
      </div>

      <div class="profile__capabilities" data-poster-copy>
        <article v-for="(group, index) in skillGroups" :key="group.label">
          <span class="meta-type">0{{ index + 1 }}</span>
          <h3>{{ group.label }}</h3>
          <ul>
            <li v-for="item in group.items" :key="item">{{ item }}</li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import RegistrationStrip from '../ui/RegistrationStrip.vue';

const props = defineProps({
  body: { type: String, default: '' },
  headline: { type: String, default: '' },
  location: { type: String, default: '' },
  skills: { type: Array, default: () => [] }
});

const skillGroups = computed(() => [
  { label: 'Design', items: props.skills.filter((skill) => /brand|cover|ui|web design|creative suite|photoshop|illustrator|indesign|figma|canva/i.test(skill)) },
  { label: 'Digital', items: props.skills.filter((skill) => /html|css|javascript|java$|vue|vite|tailwind/i.test(skill)) },
  { label: 'Sound', items: props.skills.filter((skill) => /mixing|beat|fl studio|music/i.test(skill)) }
]);
</script>

<style scoped>
.profile {
  position: relative;
  min-height: 62rem;
  overflow: hidden;
  background: var(--black);
  color: var(--paper-cool);
  padding: clamp(4rem, 9vw, 9rem) clamp(1.25rem, 3vw, 3rem);
  isolation: isolate;
}

.profile__word {
  position: absolute;
  top: 5%;
  left: -0.08em;
  z-index: -3;
  color: var(--blue);
  font-size: clamp(11rem, 25vw, 27rem);
  font-weight: 720;
  letter-spacing: -0.095em;
  line-height: 0.75;
}

.profile__web {
  position: absolute;
  inset: 0 0 0 auto;
  z-index: -2;
  width: 72%;
  height: 100%;
  fill: none;
  stroke: var(--signal-red);
  stroke-width: 1.5;
}

.profile__content {
  position: relative;
  z-index: 2;
  width: min(100%, 90rem);
  margin-inline: auto;
}

.profile__content {
  display: grid;
  grid-template-columns: minmax(22rem, 1fr) minmax(22rem, 0.72fr);
  gap: clamp(3rem, 8vw, 9rem);
  align-items: end;
  margin-top: clamp(12rem, 22vw, 23rem);
}

.profile__statement {
  position: relative;
}

.profile__statement h2 {
  max-width: 13ch;
  margin: 0;
  font-size: clamp(3rem, 6vw, 6.5rem);
  font-weight: 520;
  letter-spacing: -0.075em;
  line-height: 0.84;
}

.profile__statement > p {
  max-width: 42rem;
  margin: 2.5rem 0 0;
  color: rgba(255, 254, 248, 0.74);
  font-size: clamp(0.92rem, 1.35vw, 1.12rem);
  line-height: 1.65;
}

.profile__capabilities {
  background: var(--signal-red);
  color: var(--black);
  padding: 1rem;
  transform: rotate(2deg);
}

.profile__capabilities article {
  display: grid;
  grid-template-columns: 2rem 5rem 1fr;
  gap: 0.75rem;
  border-top: 1px solid currentColor;
  padding: 0.75rem 0 1.25rem;
}

.profile__capabilities h3 {
  margin: 0;
  font-size: 0.85rem;
  font-weight: 620;
}

.profile__capabilities ul {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem 0.8rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.66rem;
  line-height: 1.45;
}

@media (max-width: 820px) {
  .profile {
    min-height: 0;
  }

  .profile__content {
    grid-template-columns: 1fr;
    margin-top: clamp(10rem, 30vw, 16rem);
  }

  .profile__capabilities {
    width: min(100%, 34rem);
    margin-left: auto;
  }
}

@media (max-width: 560px) {
  .profile__word {
    top: 7rem;
    font-size: 9rem;
  }

  .profile__content {
    margin-top: 10rem;
  }

  .profile__statement h2 {
    font-size: clamp(2.7rem, 14vw, 4.5rem);
  }

  .profile__capabilities article {
    grid-template-columns: 1.5rem 1fr;
  }

  .profile__capabilities ul {
    grid-column: 2;
  }
}
</style>
