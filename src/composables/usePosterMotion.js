import { nextTick, onBeforeUnmount, onMounted } from 'vue';
import { gsap, ScrollTrigger } from '../utils/gsap';

function resolveElement(target) {
  if (!target) return null;
  if (target instanceof Element || target instanceof HTMLDocument) return target;
  if (typeof target === 'object' && 'value' in target) return resolveElement(target.value);
  if (typeof target === 'object' && '$el' in target) return resolveElement(target.$el);
  return null;
}

function preparePath(path) {
  if (!(path instanceof SVGGeometryElement) || typeof path.getTotalLength !== 'function') return;
  const length = path.getTotalLength();
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
}

export function usePosterMotion(scopeTarget, options = {}) {
  let active = true;
  let ctx = null;

  onMounted(async () => {
    await nextTick();
    if (!active) return;

    const scope = resolveElement(scopeTarget);
    if (!scope || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    ctx = gsap.context(() => {
      const introPaths = gsap.utils.toArray('[data-motion-intro] [data-draw-path]', scope);
      introPaths.forEach(preparePath);

      if (options.hero) {
        const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
        heroTimeline
          .from('[data-hero-meta]', { autoAlpha: 0, y: 16, duration: 0.45 })
          .from('[data-hero-word]', { yPercent: 112, duration: 0.95, stagger: 0.11 }, 0.08)
          .to(introPaths, { strokeDashoffset: 0, duration: 1.4, stagger: 0.08, ease: 'power2.inOut' }, 0.12)
          .from('[data-hero-note]', { autoAlpha: 0, rotate: -5, scale: 0.9, y: -35, duration: 0.7 }, 0.28)
          .from('[data-hero-print]', {
            autoAlpha: 0,
            clipPath: 'inset(12% 8% 18% 10%)',
            scale: 0.88,
            y: 80,
            duration: 0.9,
            stagger: 0.12
          }, 0.32)
          .from('[data-hero-detail]', { autoAlpha: 0, y: 18, duration: 0.45, stagger: 0.07 }, 0.7);

        gsap.utils.toArray('[data-hero-print]', scope).forEach((print, index) => {
          gsap.to(print, {
            yPercent: index === 0 ? -8 : index === 1 ? -16 : -11,
            ease: 'none',
            scrollTrigger: {
              trigger: scope,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.7
            }
          });
        });

        const seal = scope.querySelector('[data-hero-seal]');
        if (seal) {
          gsap.to(seal, {
            rotate: 145,
            ease: 'none',
            scrollTrigger: { trigger: scope, start: 'top top', end: 'bottom top', scrub: 0.7 }
          });
        }
      }

      gsap.utils.toArray('[data-motion-section]', scope).forEach((section) => {
        const paths = gsap.utils.toArray('[data-draw-path]', section);
        paths.forEach(preparePath);

        if (paths.length) {
          gsap.to(paths, {
            strokeDashoffset: 0,
            duration: 1.6,
            stagger: 0.08,
            ease: 'power2.inOut',
            scrollTrigger: { trigger: section, start: 'top 78%', once: true }
          });
        }

        const heading = section.querySelector('[data-poster-heading]');
        if (heading) {
          gsap.from(heading, {
            autoAlpha: 0,
            clipPath: 'inset(0 0 100% 0)',
            y: 36,
            duration: 0.85,
            ease: 'power3.out',
            scrollTrigger: { trigger: heading, start: 'top 86%', once: true }
          });
        }

        const media = gsap.utils.toArray('[data-poster-media]', section);
        if (media.length) {
          gsap.from(media, {
            clipPath: 'inset(8% 9% 12% 7%)',
            scale: 0.94,
            y: 55,
            duration: 0.95,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: { trigger: media[0], start: 'top 88%', once: true }
          });
        }

        const copy = gsap.utils.toArray('[data-poster-copy]', section);
        if (copy.length) {
          gsap.from(copy, {
            autoAlpha: 0,
            y: 28,
            duration: 0.65,
            ease: 'power2.out',
            stagger: 0.08,
            scrollTrigger: { trigger: copy[0], start: 'top 88%', once: true }
          });
        }

        const drift = section.querySelector('[data-poster-drift]');
        if (drift) {
          gsap.fromTo(drift, { yPercent: -5 }, {
            yPercent: 9,
            ease: 'none',
            scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 0.8 }
          });
        }
      });

      gsap.utils.toArray('[data-motion-rule]', scope).forEach((rule) => {
        gsap.from(rule, {
          clipPath: 'inset(0 100% 0 0)',
          duration: 0.8,
          ease: 'power2.inOut',
          scrollTrigger: { trigger: rule, start: 'top 94%', once: true }
        });
      });

      ScrollTrigger.refresh();
    }, scope);
  });

  onBeforeUnmount(() => {
    active = false;
    ctx?.revert();
    ctx = null;
  });
}
