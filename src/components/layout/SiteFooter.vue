<template>
  <footer class="site-footer">
    <div class="site-footer__main">
      <div>
        <strong>Jeven Randhawa</strong>
        <p>Independent graphic designer and music producer based in Ontario, Canada.</p>
      </div>
      <a :href="`mailto:${email}`" class="site-footer__email">{{ email }}</a>
      <ul class="site-footer__links">
        <li v-for="social in socials" :key="social.url">
          <a :href="social.url" target="_blank" rel="noreferrer">{{ social.label }} ↗</a>
        </li>
      </ul>
    </div>
    <div class="site-footer__base meta-type">
      <span>Selected work and ongoing practice</span>
      <span>© {{ currentYear }}</span>
    </div>
  </footer>
</template>

<script setup>
defineProps({ email: { type: String, default: '' }, socials: { type: Array, default: () => [] } });
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.site-footer {
  background: var(--black);
  color: var(--paper-cool);
  padding: clamp(3rem, 7vw, 6rem) clamp(1.25rem, 3vw, 3rem) 1.25rem;
}

.site-footer__main {
  display: grid;
  grid-template-columns: 0.7fr 1.3fr 0.55fr;
  gap: clamp(2rem, 5vw, 5rem);
  max-width: 90rem;
  margin-inline: auto;
}

.site-footer__main strong {
  font-size: 1rem;
  font-weight: 550;
}

.site-footer__main p {
  max-width: 22rem;
  margin: 0.75rem 0 0;
  color: rgba(255, 254, 248, 0.62);
  font-size: 0.78rem;
}

.site-footer__email {
  align-self: start;
  border-bottom: 1px solid currentColor;
  padding-bottom: 0.3rem;
  font-size: clamp(1.2rem, 2.8vw, 2.8rem);
  letter-spacing: -0.045em;
  overflow-wrap: anywhere;
}

.site-footer__email:hover,
.site-footer__email:focus-visible {
  color: var(--blue-soft);
}

.site-footer__links {
  display: grid;
  gap: 0.4rem;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0.72rem;
}

.site-footer__links a:hover,
.site-footer__links a:focus-visible {
  color: var(--blue-soft);
}

.site-footer__links a {
  display: inline-flex;
  min-height: 1.75rem;
  align-items: center;
}

.site-footer__base {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  max-width: 90rem;
  margin: clamp(4rem, 8vw, 8rem) auto 0;
  border-top: 1px solid rgba(255, 254, 248, 0.24);
  padding-top: 0.8rem;
  color: rgba(255, 254, 248, 0.55);
}

@media (max-width: 720px) {
  .site-footer__main {
    grid-template-columns: 1fr;
  }
}
</style>
