import { nextTick, onBeforeUnmount, onMounted } from 'vue';
import { SplitText, gsap } from '../utils/gsap';

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

export function useSplitHeading(targetTarget, triggerTarget = null) {
  let splitInstance = null;
  let ctx = null;

  onMounted(async () => {
    await nextTick();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const targetElement = resolveElement(targetTarget);
    if (!(targetElement instanceof Element)) return;

    const triggerElement = resolveElement(triggerTarget) || targetElement;
    if (!(triggerElement instanceof Element)) return;

    ctx = gsap.context(() => {
      splitInstance = SplitText.create(targetElement, {
        type: 'lines',
        linesClass: 'split-line',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          const lines = Array.isArray(self?.lines)
            ? self.lines.filter((line) => line instanceof Element)
            : [];

          if (!lines.length) return null;

          return gsap.from(lines, {
            yPercent: 110,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: triggerElement,
              start: 'top 86%',
              once: true
            }
          });
        }
      });
    }, triggerElement);
  });

  onBeforeUnmount(() => {
    splitInstance?.revert();
    splitInstance = null;
    ctx?.revert();
    ctx = null;
  });
}
