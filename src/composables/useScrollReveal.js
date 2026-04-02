import { nextTick, onBeforeUnmount, onMounted } from 'vue';

function isDomElement(value) {
  return value instanceof Element || value instanceof HTMLDocument;
}

function resolveElement(target) {
  if (!target) return null;
  if (isDomElement(target)) return target;

  if (typeof target === 'string') {
    return document.querySelector(target);
  }

  if (Array.isArray(target)) {
    return resolveElement(target[0]);
  }

  if (typeof target === 'object') {
    if ('value' in target) return resolveElement(target.value);
    if ('$el' in target) return resolveElement(target.$el);
  }

  return null;
}

function resolveTargets(scopeElement, selector) {
  if (!scopeElement) return [];

  if (typeof selector === 'string') {
    return Array.from(scopeElement.querySelectorAll(selector));
  }

  return []
    .concat(selector)
    .map((target) => resolveElement(target))
    .filter((target) => target instanceof Element);
}

function isInInitialViewport(element, multiplier = 0.92) {
  const rect = element.getBoundingClientRect();
  return rect.bottom > 0 && rect.top < window.innerHeight * multiplier;
}

export function useScrollReveal(scopeTarget, selector = '[data-reveal]', options = {}) {
  let observer = null;

  onMounted(async () => {
    await nextTick();

    const scopeElement = resolveElement(scopeTarget);
    if (!scopeElement) return;

    const targets = resolveTargets(scopeElement, selector);
    if (!targets.length) return;

    if (
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      typeof IntersectionObserver === 'undefined'
    ) {
      targets.forEach((target) => target.classList.add('reveal-visible'));
      return;
    }

    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          entry.target.classList.add('reveal-visible');
          entry.target.classList.remove('reveal-ready');
          observer?.unobserve(entry.target);
        });
      },
      {
        root: null,
        rootMargin: options.rootMargin || '0px 0px -10% 0px',
        threshold: options.threshold ?? 0.12
      }
    );

    targets.forEach((target) => {
      if (isInInitialViewport(target, options.initialViewportMultiplier ?? 0.92)) {
        target.classList.add('reveal-visible');
        return;
      }

      target.classList.add('reveal-ready');
      observer?.observe(target);
    });
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    observer = null;
  });
}
