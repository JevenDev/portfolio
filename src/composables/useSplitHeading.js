import { onMounted, onUnmounted } from 'vue';
import { SplitText, gsap } from '../utils/gsap';

export function useSplitHeading(targetRef, triggerRef = null) {
  let splitInstance;
  let ctx;

  onMounted(() => {
    if (!targetRef.value) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    ctx = gsap.context(() => {
      splitInstance = SplitText.create(targetRef.value, {
        type: 'lines',
        linesClass: 'split-line',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          return gsap.from(self.lines, {
            yPercent: 110,
            autoAlpha: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.08,
            scrollTrigger: {
              trigger: triggerRef?.value || targetRef.value,
              start: 'top 86%',
              once: true
            }
          });
        }
      });
    }, triggerRef || targetRef);
  });

  onUnmounted(() => {
    splitInstance?.revert();
    ctx?.revert();
  });
}