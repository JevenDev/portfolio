import { nextTick, onBeforeUnmount, onMounted } from 'vue';
import { gsap } from '../utils/gsap';

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

  return gsap.utils
    .toArray(selector)
    .map((target) => resolveElement(target))
    .filter((target) => target instanceof Element);
}

export function useScrollReveal(scopeTarget, selector = '[data-reveal]') {
  let ctx = null;

  onMounted(async () => {
    await nextTick();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const scopeElement = resolveElement(scopeTarget);
    if (!scopeElement) return;

    ctx = gsap.context(() => {
      const targets = resolveTargets(scopeElement, selector);
      if (!targets.length) return;

      gsap.set(targets, {
        autoAlpha: 0,
        force3D: true,
        willChange: 'opacity, transform',
        y: 18
      });

      targets.forEach((element, index) => {
        gsap.to(
          element,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.56,
            ease: 'power2.out',
            overwrite: 'auto',
            clearProps: 'willChange,force3D',
            scrollTrigger: {
              trigger: element,
              start: `top ${Math.max(80, 90 - index * 2)}%`,
              once: true
            }
          }
        );
      });
    }, scopeElement);
  });

  onBeforeUnmount(() => {
    ctx?.revert();
    ctx = null;
  });
}
