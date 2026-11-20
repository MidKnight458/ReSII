import api, { getAuthToken } from './api.js';

const SII_TTL_MS = 5 * 60 * 1000;
const EXTRA_TTL_MS = 60 * 1000;

export const CACHE_KEYS = {
  ESTUDIANTE: 'sii:estudiante',
  CALIFICACIONES: 'sii:calificaciones',
  KARDEX: 'sii:kardex',
  HORARIOS: 'sii:horarios',
  ASESORIAS: 'extra:asesorias',
  MIS_ASESORIAS: 'extra:mis-asesorias',
  ADVISOR: 'extra:advisor',
};

const cache = new Map();
const inFlight = new Map();
let cacheEpoch = 0;

/**
 * Lee una entrada vigente de caché en memoria; elimina y descarta entradas expiradas.
 */
export function getCachedData(key) {
  const entry = cache.get(key);
  if (!entry) return null;

  if (Date.now() >= entry.expiresAt) {
    cache.delete(key);
    return null;
  }

  return entry.data;
}

/**
 * Ejecuta o reutiliza una petición en vuelo / en caché con TTL por recurso.
 */
export function fetchCached(key, fetcher, ttlMs, { force = false } = {}) {
  if (!force) {
    const cached = getCachedData(key);
    if (cached !== null) {
      return Promise.resolve(cached);
    }
    if (inFlight.has(key)) {
      return inFlight.get(key);
    }
  }

  const requestEpoch = cacheEpoch;
  const promise = Promise.resolve()
    .then(fetcher)
    .then((data) => {
      if (requestEpoch === cacheEpoch) {
        cache.set(key, {
          data,
          expiresAt: Date.now() + ttlMs,
        });
      }
      return data;
    })
    .finally(() => {
      if (inFlight.get(key) === promise) {
        inFlight.delete(key);
      }
    });

  inFlight.set(key, promise);
  return promise;
}

/**
 * Invalida claves puntuales de caché tras mutaciones (p. ej. inscripciones o edición en LinceHub).
 */
export function invalidateCacheKeys(keys = []) {
  keys.forEach((key) => {
    cache.delete(key);
    inFlight.delete(key);
  });
}

/**
 * Limpia toda la caché y promesas en vuelo (login, logout o expiración de sesión).
 */
export function clearPrefetchCache() {
  cacheEpoch += 1;
  cache.clear();
  inFlight.clear();
}

export function extractCalificacionesEntries(value, depth = 0) {
  if (depth > 4 || !value) return [];
  if (Array.isArray(value)) {
    return value.flatMap((item) =>
      item && Array.isArray(item.materias)
        ? extractCalificacionesEntries(item.materias, depth + 1)
        : [item],
    );
  }
  if (typeof value !== 'object') return [];

  for (const key of ['calificaciones', 'calificaiones', 'materias', 'data']) {
    if (value[key] && typeof value[key] === 'object') {
      const entries = extractCalificacionesEntries(value[key], depth + 1);
      if (entries.length > 0) return entries;
    }
  }
  return [];
}

export function extractKardexEntries(kardexRaw) {
  const kardexPayload = kardexRaw?.data ?? kardexRaw ?? {};
  if (Array.isArray(kardexPayload?.kardex)) return kardexPayload.kardex;
  if (Array.isArray(kardexRaw?.kardex)) return kardexRaw.kardex;
  return [];
}

export function fetchEstudiante(options) {
  return fetchCached(
    CACHE_KEYS.ESTUDIANTE,
    () => api.get('/sii/estudiante').then((res) => res.data),
    SII_TTL_MS,
    options,
  );
}

export function fetchCalificaciones(options) {
  return fetchCached(
    CACHE_KEYS.CALIFICACIONES,
    () => api.get('/sii/calificaciones').then((res) => res.data),
    SII_TTL_MS,
    options,
  );
}

export function fetchKardex(options) {
  return fetchCached(
    CACHE_KEYS.KARDEX,
    () => api.get('/sii/kardex').then((res) => res.data),
    SII_TTL_MS,
    options,
  );
}

export function fetchHorarios(options) {
  return fetchCached(
    CACHE_KEYS.HORARIOS,
    () => api.get('/sii/horarios').then((res) => res.data),
    SII_TTL_MS,
    options,
  );
}

export function fetchAsesorias(options) {
  return fetchCached(
    CACHE_KEYS.ASESORIAS,
    () => api.get('/extra/asesorias').then((res) => res.data),
    EXTRA_TTL_MS,
    options,
  );
}

export function fetchMisAsesorias(userEmail, options) {
  return fetchCached(
    CACHE_KEYS.MIS_ASESORIAS,
    () =>
      api
        .get('/extra/mis-asesorias', {
          params: userEmail ? { alumno_id: userEmail } : {},
        })
        .then((res) => res.data),
    EXTRA_TTL_MS,
    options,
  );
}

export function fetchAdvisor(calificacionesRaw, kardexRaw, options) {
  return fetchCached(
    CACHE_KEYS.ADVISOR,
    () =>
      api
        .post('/extra/advisor', {
          calificaciones: extractCalificacionesEntries(calificacionesRaw),
          kardex: extractKardexEntries(kardexRaw),
        })
        .then((res) => res.data),
    SII_TTL_MS,
    options,
  );
}

/**
 * Precarga en segundo plano los datos de una ruta al hacer hover/focus sobre un enlace de navegación.
 */
export function prefetchRoute(path, userEmail = '') {
  if (!getAuthToken() || typeof path !== 'string') return;

  const normalized = path.split('?')[0].replace(/\/+$/, '') || '/';

  switch (normalized) {
    case '/dashboard':
      fetchEstudiante().catch(() => {});
      break;
    case '/calificaciones':
      fetchCalificaciones().catch(() => {});
      break;
    case '/kardex':
      fetchKardex().catch(() => {});
      break;
    case '/horarios':
    case '/horario':
      fetchHorarios().catch(() => {});
      break;
    case '/lince-hub':
    case '/extra':
      fetchAsesorias().catch(() => {});
      fetchMisAsesorias(userEmail).catch(() => {});
      Promise.all([fetchCalificaciones(), fetchKardex()])
        .then(([calificacionesRaw, kardexRaw]) =>
          fetchAdvisor(calificacionesRaw, kardexRaw),
        )
        .catch(() => {});
      break;
    default:
      break;
  }
}
