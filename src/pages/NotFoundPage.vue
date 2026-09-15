<template>
  <main id="main-content" tabindex="-1" class="page-shell not-found">
    <div class="not-found__content">
      <p>404</p>
      <h1>Page not found</h1>
      <p>This page may have moved, or the link may be incorrect.</p>
      <nav aria-label="Page recovery">
        <RouterLink to="/">Back to home</RouterLink>
        <RouterLink to="/archive/">Browse the archive</RouterLink>
      </nav>
    </div>
  </main>
</template>

<script setup>
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.not-found__content {
  max-width: 60rem;
  margin-inline: auto;
  padding: 4rem var(--page-gutter) 6rem;
}

.not-found h1 {
  margin: 1rem 0;
  font-size: clamp(2.5rem, 8vw, 6rem);
  font-weight: 550;
  letter-spacing: -0.045em;
  line-height: 1.05;
}

.not-found nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2rem;
  margin-top: 2rem;
}

.not-found a {
  padding-block: 0.75rem;
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
</style>
