import { computed, onBeforeUnmount, onMounted, ref, toValue } from 'vue';

const REFRESH_INTERVAL = 15 * 60 * 1000;

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`Request failed with ${response.status}`);
    return response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

export function useModMetrics(modsSource) {
  const metrics = ref({});
  const status = ref('Saved platform totals');
  let active = true;
  let refreshTimer = null;
  let refreshing = false;

  function getMods() {
    return toValue(modsSource) || [];
  }

  function setFallbacks() {
    metrics.value = Object.fromEntries(
      getMods().map((mod) => [
        mod.id,
        {
          curseforge: mod.curseforge?.downloads || 0,
          modrinth: mod.downloads || 0
        }
      ])
    );
  }

  function mergeMetric(id, nextMetric) {
    metrics.value = {
      ...metrics.value,
      [id]: {
        ...metrics.value[id],
        ...nextMetric
      }
    };
  }

  async function refreshMetrics() {
    if (refreshing || !active) return;
    refreshing = true;
    status.value = 'Refreshing platform totals';
    const loadedSources = new Set();
    const failedSources = new Set();

    try {
      const projects = await fetchJson('https://api.modrinth.com/v2/user/jvn/projects');
      if (active) {
        projects.forEach((project) => {
          if (project.project_type !== 'mod' || !metrics.value[project.id]) return;
          mergeMetric(project.id, { modrinth: project.downloads });
        });
        loadedSources.add('Modrinth');
      }
    } catch {
      failedSources.add('Modrinth');
    }

    const mods = getMods();
    for (let index = 0; index < mods.length && active; index += 3) {
      const batch = mods.slice(index, index + 3);
      const results = await Promise.allSettled(
        batch.map((mod) => fetchJson(`https://api.cfwidget.com/${mod.curseforge.id}`))
      );

      results.forEach((result, resultIndex) => {
        if (result.status !== 'fulfilled') {
          failedSources.add('CurseForge');
          return;
        }
        const total = Number(result.value?.downloads?.total);
        if (!Number.isFinite(total)) {
          failedSources.add('CurseForge');
          return;
        }
        mergeMetric(batch[resultIndex].id, { curseforge: total });
        loadedSources.add('CurseForge');
      });
    }

    if (active) {
      const refreshedAt = new Intl.DateTimeFormat('en-CA', { hour: 'numeric', minute: '2-digit' }).format(new Date());
      if (loadedSources.size && failedSources.size) {
        status.value = `Partial live totals updated ${refreshedAt}`;
      } else if (loadedSources.size) {
        status.value = `${[...loadedSources].join(' + ')} totals updated ${refreshedAt}`;
      } else {
        status.value = 'Saved platform totals';
      }
    }
    refreshing = false;
  }

  function metricsFor(mod) {
    return metrics.value[mod.id] || { curseforge: 0, modrinth: 0 };
  }

  function onVisibilityChange() {
    if (document.visibilityState === 'visible') refreshMetrics();
  }

  const totalDownloads = computed(() =>
    getMods().reduce((total, mod) => {
      const metric = metricsFor(mod);
      return total + metric.modrinth + metric.curseforge;
    }, 0)
  );

  setFallbacks();

  onMounted(() => {
    refreshMetrics();
    refreshTimer = window.setInterval(refreshMetrics, REFRESH_INTERVAL);
    document.addEventListener('visibilitychange', onVisibilityChange);
  });

  onBeforeUnmount(() => {
    active = false;
    window.clearInterval(refreshTimer);
    document.removeEventListener('visibilitychange', onVisibilityChange);
  });

  return { metricsFor, refreshMetrics, status, totalDownloads };
}
