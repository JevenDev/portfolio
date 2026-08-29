<template>
  <Transition name="boot-cut">
    <aside v-if="visible" class="boot-overlay" aria-label="JVN Graphics loading" aria-live="polite">
      <div class="boot-overlay__head meta-type">
        <span>JVN_OS / 4A56</span>
        <button type="button" @click="finish">SKIP</button>
      </div>

      <div class="boot-overlay__field" aria-hidden="true">
        <span v-for="index in 24" :key="index"></span>
      </div>

      <svg class="boot-overlay__lines" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">
        <line x1="-20" y1="160" x2="1650" y2="420" />
        <line x1="-20" y1="250" x2="1650" y2="510" />
        <line x1="440" y1="-20" x2="850" y2="930" />
        <line x1="720" y1="-20" x2="1050" y2="930" />
      </svg>

      <div class="boot-overlay__signal">
        <p>VISUAL SIGNAL<br />RECONSTRUCTING</p>
        <strong>{{ String(progress).padStart(3, '0') }}</strong>
        <span>%</span>
      </div>

      <div class="boot-overlay__mark" aria-hidden="true">RECOVERY<br />OPEN</div>
    </aside>
  </Transition>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

const visible = ref(false);
const progress = ref(0);
const timers = [];

function queue(callback, delay) {
  timers.push(window.setTimeout(callback, delay));
}

function finish() {
  visible.value = false;
  timers.forEach(window.clearTimeout);
}

onMounted(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let seen = false;

  try {
    seen = window.sessionStorage.getItem('jvn-poster-boot-seen') === 'true';
    window.sessionStorage.setItem('jvn-poster-boot-seen', 'true');
  } catch {
    seen = false;
  }

  if (reducedMotion || seen) return;

  visible.value = true;
  queue(() => { progress.value = 21; }, 100);
  queue(() => { progress.value = 58; }, 360);
  queue(() => { progress.value = 86; }, 690);
  queue(() => { progress.value = 100; }, 980);
  queue(finish, 1260);
});

onUnmounted(() => {
  timers.forEach(window.clearTimeout);
});
</script>

<style scoped>
.boot-overlay {
  position: fixed;
  inset: 0;
  z-index: 130;
  overflow: hidden;
  background: var(--black);
  color: var(--paper-cool);
  padding: clamp(1rem, 2.5vw, 2.75rem);
}

.boot-overlay__head {
  position: relative;
  z-index: 6;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid currentColor;
  padding-bottom: 0.6rem;
}

.boot-overlay__head button {
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
}

.boot-overlay__field {
  position: absolute;
  top: 8%;
  right: 5%;
  bottom: 7%;
  left: 18%;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  grid-template-rows: repeat(4, minmax(0, 1fr));
  background: linear-gradient(135deg, var(--sky), var(--blue) 52%, var(--violet));
}

.boot-overlay__field span {
  border: 1px solid rgba(248, 248, 244, 0.28);
}

.boot-overlay__field span:nth-child(4n + 1) { transform: translate(-9%, 7%); }
.boot-overlay__field span:nth-child(5n) { transform: translate(7%, -8%); }

.boot-overlay__lines {
  position: absolute;
  z-index: 2;
  inset: 0;
  width: 100%;
  height: 100%;
  stroke: var(--paper-cool);
  stroke-width: 1;
  vector-effect: non-scaling-stroke;
}

.boot-overlay__signal {
  position: absolute;
  z-index: 4;
  bottom: clamp(1rem, 3vw, 3rem);
  left: clamp(1rem, 2.5vw, 2.75rem);
  display: grid;
  grid-template-columns: auto auto auto;
  align-items: end;
  width: calc(100% - clamp(2rem, 5vw, 5.5rem));
  border-top: 1px solid currentColor;
  padding-top: 0.75rem;
}

.boot-overlay__signal p {
  align-self: start;
  margin: 0;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.7rem;
}

.boot-overlay__signal strong {
  justify-self: end;
  font-family: 'Archivo Black', sans-serif;
  font-size: clamp(7rem, 28vw, 28rem);
  font-weight: 400;
  letter-spacing: -0.09em;
  line-height: 0.55;
}

.boot-overlay__signal > span {
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.72rem;
}

.boot-overlay__mark {
  position: absolute;
  z-index: 5;
  top: 31%;
  left: 8%;
  background: var(--signal-red);
  color: var(--paper-cool);
  padding: 0.6rem 1.8rem 0.6rem 0.5rem;
  font-family: 'IBM Plex Mono', monospace;
  font-size: 0.62rem;
  font-weight: 600;
  line-height: 1;
}

.boot-cut-leave-active {
  transition: clip-path 160ms steps(3, jump-none), opacity 160ms linear;
}

.boot-cut-leave-to {
  clip-path: inset(48% 0 48% 0);
  opacity: 0;
}

@media (max-width: 767px) {
  .boot-overlay__field {
    top: 12%;
    right: -14%;
    bottom: 9%;
    left: 14%;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    grid-template-rows: repeat(6, minmax(0, 1fr));
  }

  .boot-overlay__mark {
    top: 43%;
  }

  .boot-overlay__signal {
    grid-template-columns: 1fr auto;
  }

  .boot-overlay__signal strong {
    grid-column: 1 / -1;
    justify-self: start;
    font-size: 38vw;
  }

  .boot-overlay__signal > span {
    position: absolute;
    right: 0;
    bottom: 0;
  }
}
</style>
