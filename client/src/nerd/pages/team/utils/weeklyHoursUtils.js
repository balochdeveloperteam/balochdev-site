export const MANAGER_REVIEW_PREFIX = '[Manager review]:';

export const DAY_FIELDS = [
  { key: 'hours_sun', label: 'Sun' },
  { key: 'hours_mon', label: 'Mon' },
  { key: 'hours_tue', label: 'Tue' },
  { key: 'hours_wed', label: 'Wed' },
  { key: 'hours_thu', label: 'Thu' },
  { key: 'hours_fri', label: 'Fri' },
  { key: 'hours_sat', label: 'Sat' },
];

/** @param {Date} d */
export function formatDateISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** @param {string} iso */
export function parseISODate(iso) {
  const [y, m, day] = iso.split('-').map(Number);
  return new Date(y, m - 1, day);
}

/** Matches Postgres current_week_sunday(): (current_date - extract(dow)::int)::date */
export function getCurrentWeekSunday(fromDate = new Date()) {
  const d = new Date(fromDate.getFullYear(), fromDate.getMonth(), fromDate.getDate());
  d.setDate(d.getDate() - d.getDay());
  return d;
}

/** @param {Date} sundayDate */
export function getWeekRange(sundayDate) {
  const start = new Date(sundayDate.getFullYear(), sundayDate.getMonth(), sundayDate.getDate());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return {
    weekStart: formatDateISO(start),
    weekEnd: formatDateISO(end),
    weekStartDate: start,
    weekEndDate: end,
  };
}

export function formatWeekRange(weekStartISO, weekEndISO) {
  const start = parseISODate(weekStartISO);
  const end = parseISODate(weekEndISO);
  const opts = { month: 'short', day: 'numeric' };
  const startStr = start.toLocaleDateString(undefined, opts);
  const endStr = end.toLocaleDateString(undefined, { ...opts, year: 'numeric' });
  return `${startStr} – ${endStr}`;
}

/** @param {Date} sundayDate @param {number} deltaWeeks */
export function addWeeks(sundayDate, deltaWeeks) {
  const d = new Date(sundayDate.getFullYear(), sundayDate.getMonth(), sundayDate.getDate());
  d.setDate(d.getDate() + deltaWeeks * 7);
  return d;
}

export function splitNotes(notes = '') {
  const lines = String(notes).split('\n');
  const memberLines = [];
  const reviewLines = [];
  for (const line of lines) {
    if (line.trimStart().startsWith(MANAGER_REVIEW_PREFIX)) {
      reviewLines.push(line);
    } else {
      memberLines.push(line);
    }
  }
  return {
    memberNotes: memberLines.join('\n').replace(/\n+$/, ''),
    managerReviews: reviewLines,
    managerReviewText: reviewLines
      .map((l) => l.replace(/^\s*\[Manager review\]:\s*/, ''))
      .join('\n'),
  };
}

export function mergeNotes(memberNotes, existingFullNotes = '') {
  const { managerReviews } = splitNotes(existingFullNotes);
  const member = memberNotes.trim();
  const parts = [];
  if (member) parts.push(member);
  if (managerReviews.length) parts.push(managerReviews.join('\n'));
  return parts.join('\n');
}

export function appendManagerReview(existingNotes, reason) {
  const trimmed = reason.trim();
  if (!trimmed) return existingNotes;
  const line = `${MANAGER_REVIEW_PREFIX} ${trimmed}`;
  if (!String(existingNotes).trim()) return line;
  return `${String(existingNotes).trimEnd()}\n${line}`;
}

/** @param {Record<string, unknown> | null | undefined} row */
export function sumHours(row) {
  return DAY_FIELDS.reduce((sum, { key }) => {
    const v = row?.[key];
    return sum + (v != null && v !== '' ? Number(v) : 0);
  }, 0);
}

export function parseHourInput(value) {
  if (value === '' || value == null) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

/** @param {{ status?: string } | null | undefined} row */
export function isRedWeek(row) {
  return !row || row.status === 'rejected';
}

export function friendlyHoursError(err) {
  if (!err) return 'Something went wrong.';
  if (err.code === '42501' || /policy|permission|row-level security/i.test(err.message || '')) {
    return 'You do not have permission to perform this action. Past weeks are read-only for members.';
  }
  return err.message || 'Something went wrong.';
}
