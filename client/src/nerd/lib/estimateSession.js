const STORAGE_KEY = 'balochdev_estimate_projects';
const LEGACY_KEY = 'balochdev_estimate_session';
const MAX_PROJECTS = 12;
const DEFAULT_LIMIT = 3;

/** UTC calendar day — matches worker daily reset window. */
export function utcDayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `est_${crypto.randomUUID().replace(/-/g, '').slice(0, 12)}`;
  }
  return `est_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function emptyProject(overrides = {}) {
  const now = Date.now();
  return {
    id: newId(),
    title: 'New project',
    createdAt: now,
    updatedAt: now,
    stepIndex: 0,
    answers: {},
    messages: null,
    draft: '',
    done: false,
    report: null,
    ...overrides,
  };
}

function deriveTitle(project) {
  const fromReport = project?.report?.meta?.projectTitle;
  if (typeof fromReport === 'string' && fromReport.trim()) return fromReport.trim().slice(0, 48);

  const type = project?.answers?.projectType;
  if (typeof type === 'string' && type.trim()) return type.trim().slice(0, 48);

  const name = project?.answers?.name;
  if (typeof name === 'string' && name.trim()) return `${name.trim().split(' ')[0]}'s estimate`;

  return 'New project';
}

function isBlankProject(project) {
  if (!project || project.done || project.report) return false;
  const answers = project.answers && typeof project.answers === 'object' ? project.answers : {};
  if (Object.keys(answers).some((k) => String(answers[k] || '').trim())) return false;
  const msgs = Array.isArray(project.messages) ? project.messages : [];
  return msgs.length <= 1;
}

function readRaw(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function writeStore(store) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // private mode / quota
  }
}

/**
 * When the UTC day changes, local used → 0 and remaining → daily limit.
 * Server already counts only today’s rows; this keeps the UI honest offline.
 */
function applyDailyQuotaRollover(store) {
  const today = utcDayKey();
  const limit = typeof store.limit === 'number' && store.limit > 0 ? store.limit : DEFAULT_LIMIT;
  store.limit = limit;

  if (store.quotaDay !== today) {
    store.quotaDay = today;
    store.used = 0;
    store.remaining = limit;
  } else {
    if (typeof store.used !== 'number') store.used = 0;
    if (typeof store.remaining !== 'number') {
      store.remaining = Math.max(0, limit - store.used);
    }
  }
  return store;
}

function migrateLegacy() {
  const legacy = readRaw(LEGACY_KEY);
  if (!legacy || typeof legacy !== 'object') return null;

  const project = emptyProject({
    title: deriveTitle(legacy),
    stepIndex: Number.isInteger(legacy.stepIndex) ? legacy.stepIndex : 0,
    answers: legacy.answers && typeof legacy.answers === 'object' ? legacy.answers : {},
    messages: Array.isArray(legacy.messages) ? legacy.messages : null,
    draft: typeof legacy.draft === 'string' ? legacy.draft : '',
    done: Boolean(legacy.done),
    report: legacy.report || null,
    createdAt: legacy.savedAt || Date.now(),
    updatedAt: legacy.savedAt || Date.now(),
  });

  const store = applyDailyQuotaRollover({
    version: 2,
    activeId: project.id,
    remaining: typeof legacy.remaining === 'number' ? legacy.remaining : null,
    limit: DEFAULT_LIMIT,
    used: null,
    quotaDay: null,
    projects: [project],
  });

  writeStore(store);
  try {
    localStorage.removeItem(LEGACY_KEY);
  } catch {
    // ignore
  }
  return store;
}

function normalizeStore(data) {
  if (!data || typeof data !== 'object') return null;
  if (!Array.isArray(data.projects) || data.projects.length === 0) return null;

  const projects = data.projects
    .filter((p) => p && typeof p === 'object' && typeof p.id === 'string')
    .map((p) => ({
      ...emptyProject(),
      ...p,
      id: p.id,
      title: typeof p.title === 'string' && p.title.trim() ? p.title : deriveTitle(p),
    }));

  if (projects.length === 0) return null;

  let activeId = typeof data.activeId === 'string' ? data.activeId : projects[0].id;
  if (!projects.some((p) => p.id === activeId)) activeId = projects[0].id;

  return applyDailyQuotaRollover({
    version: 2,
    activeId,
    remaining: typeof data.remaining === 'number' ? data.remaining : null,
    limit: typeof data.limit === 'number' ? data.limit : DEFAULT_LIMIT,
    used: typeof data.used === 'number' ? data.used : null,
    quotaDay: typeof data.quotaDay === 'string' ? data.quotaDay : null,
    projects,
  });
}

function defaultStore() {
  const project = emptyProject();
  return applyDailyQuotaRollover({
    version: 2,
    activeId: project.id,
    remaining: DEFAULT_LIMIT,
    limit: DEFAULT_LIMIT,
    used: 0,
    quotaDay: null,
    projects: [project],
  });
}

/** Full multi-project store (always returns a usable object). */
export function loadEstimateStore() {
  const existing = normalizeStore(readRaw(STORAGE_KEY));
  if (existing) {
    // Persist rollover if day changed while app was closed.
    writeStore(existing);
    return existing;
  }

  const migrated = migrateLegacy();
  if (migrated) return migrated;

  const fresh = defaultStore();
  writeStore(fresh);
  return fresh;
}

function commit(store) {
  writeStore(applyDailyQuotaRollover(store));
  return store;
}

export function listEstimateProjects() {
  return loadEstimateStore().projects.map((p) => ({
    id: p.id,
    title: p.title || deriveTitle(p),
    done: Boolean(p.done),
    updatedAt: p.updatedAt || p.createdAt || 0,
    hasReport: Boolean(p.report),
  }));
}

export function getActiveEstimateProject() {
  const store = loadEstimateStore();
  return store.projects.find((p) => p.id === store.activeId) || store.projects[0];
}

export function getEstimateRemaining() {
  return loadEstimateStore().remaining;
}

export function getEstimateQuota() {
  const store = loadEstimateStore();
  return {
    remaining: typeof store.remaining === 'number' ? store.remaining : store.limit || DEFAULT_LIMIT,
    limit: typeof store.limit === 'number' ? store.limit : DEFAULT_LIMIT,
    used: typeof store.used === 'number' ? store.used : 0,
    quotaDay: store.quotaDay || utcDayKey(),
  };
}

export function setActiveEstimateProject(id) {
  const store = loadEstimateStore();
  if (!store.projects.some((p) => p.id === id)) return getActiveEstimateProject();
  store.activeId = id;
  return commit(store).projects.find((p) => p.id === id);
}

/**
 * Start a fresh empty chat. Reuses an existing blank project when possible
 * so “New project” doesn’t spam empty tabs.
 * Does not consume a daily estimate slot — only a successful report does.
 */
export function createEstimateProject() {
  const store = loadEstimateStore();
  const blank = store.projects.find((p) => p.id === store.activeId && isBlankProject(p))
    || store.projects.find((p) => isBlankProject(p));

  if (blank) {
    store.activeId = blank.id;
    blank.updatedAt = Date.now();
    blank.title = 'New project';
    return commit(store).projects.find((p) => p.id === blank.id);
  }

  const project = emptyProject();
  store.projects = [project, ...store.projects].slice(0, MAX_PROJECTS);
  store.activeId = project.id;
  return commit(store).projects[0];
}

/**
 * Wipe local chats and start one empty project.
 * Daily quota is unchanged (server-enforced); only local chat history resets.
 */
export function resetEstimateChats() {
  const store = loadEstimateStore();
  const project = emptyProject();
  store.projects = [project];
  store.activeId = project.id;
  // Keep today's quota fields — clearing chats must not restore used slots.
  return commit(store).projects[0];
}

/** Merge-update the active project (and optional store-level remaining). */
export function saveEstimateSession(partial = {}) {
  const store = loadEstimateStore();
  const idx = store.projects.findIndex((p) => p.id === store.activeId);
  if (idx < 0) return;

  const { remaining, limit, used, quotaDay, ...projectPartial } = partial;
  if (typeof remaining === 'number') store.remaining = remaining;
  if (typeof limit === 'number') store.limit = limit;
  if (typeof used === 'number') store.used = used;
  if (typeof quotaDay === 'string') store.quotaDay = quotaDay;
  else if (
    typeof remaining === 'number' ||
    typeof used === 'number' ||
    typeof limit === 'number'
  ) {
    store.quotaDay = utcDayKey();
  }

  if (Object.keys(projectPartial).length > 0) {
    const next = {
      ...store.projects[idx],
      ...projectPartial,
      updatedAt: Date.now(),
    };
    next.title = deriveTitle(next);
    store.projects[idx] = next;
  }
  commit(store);
}

/** @deprecated path — clears active into a fresh blank project (kept for restart). */
export function clearEstimateSession() {
  createEstimateProject();
  const store = loadEstimateStore();
  const idx = store.projects.findIndex((p) => p.id === store.activeId);
  if (idx < 0) return;
  const id = store.projects[idx].id;
  store.projects[idx] = emptyProject({ id, createdAt: store.projects[idx].createdAt });
  commit(store);
}

/** Back-compat: load active project as the old flat session shape. */
export function loadEstimateSession() {
  const store = loadEstimateStore();
  const p = store.projects.find((x) => x.id === store.activeId) || store.projects[0];
  if (!p) return null;
  return {
    ...p,
    remaining: store.remaining,
    limit: store.limit,
    used: store.used,
    quotaDay: store.quotaDay,
  };
}

export function deleteEstimateProject(id) {
  const store = loadEstimateStore();
  if (store.projects.length <= 1) {
    const only = store.projects[0];
    store.projects = [emptyProject({ id: only.id })];
    store.activeId = only.id;
    return commit(store);
  }

  store.projects = store.projects.filter((p) => p.id !== id);
  if (store.activeId === id) store.activeId = store.projects[0].id;
  return commit(store);
}
