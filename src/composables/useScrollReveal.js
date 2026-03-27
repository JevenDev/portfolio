import { onMounted, onUnmounted } from 'vue';
import { gsap } from '../utils/gsap';

export function useScrollReveal(scopeRef, selector = '[data-reveal]') {
  let ctx;

  onMounted(() => {
    if (!scopeRef.value) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    ctx = gsap.context(() => {
      gsap.utils.toArray(selector).forEach((element, index) => {
        gsap.fromTo(
          element,
          {
            autoAlpha: 0,
            y: 22
          },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
            ease: 'power2.out',
            delay: Math.min(index * 0.04, 0.2),
            scrollTrigger: {
              trigger: element,
              start: 'top 88%',
              once: true
            }
          }
        );
      });
    }, scopeRef);
  });

  onUnmounted(() => {
    ctx?.revert();
  });
}