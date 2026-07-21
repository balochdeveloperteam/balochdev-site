/**
 * Client-side validation for the AI estimate chat.
 * Returns { ok: true, value } or { ok: false, message } — message is shown by the bot.
 */

const EMAIL_RE =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

const NAME_WORD_RE = /^[A-Za-zÀ-ÖØ-öø-ÿ][A-Za-zÀ-ÖØ-öø-ÿ'’-]*$/;

function isSkip(value) {
  const v = String(value || '').trim().toLowerCase();
  return !v || v === 'skip' || v === 'n/a' || v === 'na' || v === '-';
}

function collapseSpaces(value) {
  return String(value || '')
    .trim()
    .replace(/\s+/g, ' ');
}

/** Title-case each word lightly (keeps Mc/O' patterns simple). */
function normalizeName(value) {
  return collapseSpaces(value)
    .split(' ')
    .map((w) => {
      if (!w) return w;
      if (w.includes("'")) {
        return w
          .split("'")
          .map((p) => (p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : p))
          .join("'");
      }
      if (w.includes('-')) {
        return w
          .split('-')
          .map((p) => (p ? p.charAt(0).toUpperCase() + p.slice(1).toLowerCase() : p))
          .join('-');
      }
      return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    })
    .join(' ');
}

export function validateName(raw) {
  const value = collapseSpaces(raw);
  if (!value) {
    return { ok: false, message: 'I’ll need your name to personalize the estimate — please type it below.' };
  }
  if (value.length < 3) {
    return { ok: false, message: 'That name looks too short. Please enter your full name (first and last).' };
  }
  if (/\d/.test(value) || /@/.test(value)) {
    return {
      ok: false,
      message: 'That doesn’t look like a person name. Please use letters only — e.g. “Sara Khan”.',
    };
  }

  const words = value.split(' ').filter(Boolean);
  if (words.length < 2) {
    return {
      ok: false,
      message: 'Please enter your full name with at least first and last name (two words), e.g. “Ali Hassan”.',
    };
  }
  if (words.length > 5) {
    return {
      ok: false,
      message: 'Please keep it to a normal full name (first + last, optionally middle) — up to a few words.',
    };
  }

  for (const word of words) {
    if (word.length < 2) {
      return {
        ok: false,
        message: 'Each part of your name should be at least 2 letters. Example: “Mia Chen”.',
      };
    }
    if (!NAME_WORD_RE.test(word)) {
      return {
        ok: false,
        message: 'Please use a proper name with letters only (hyphens or apostrophes are fine), e.g. “Jean-Luc O’Brien”.',
      };
    }
  }

  return { ok: true, value: normalizeName(value) };
}

export function validateEmail(raw) {
  const value = collapseSpaces(raw).toLowerCase();
  if (!value) {
    return { ok: false, message: 'I’ll need a valid email so we can send the report — please try again.' };
  }
  if (/\s/.test(String(raw || '').trim())) {
    return { ok: false, message: 'Emails can’t contain spaces. Example: you@company.com' };
  }
  if (!EMAIL_RE.test(value)) {
    return {
      ok: false,
      message: 'That doesn’t look like a valid email. Please use a format like name@company.com',
    };
  }
  const [local, domain] = value.split('@');
  if (!local || local.length > 64 || local.startsWith('.') || local.endsWith('.') || local.includes('..')) {
    return { ok: false, message: 'Please double-check the part before @ — that email doesn’t look valid.' };
  }
  if (!domain || domain.length > 255 || domain.startsWith('-') || domain.includes('..')) {
    return { ok: false, message: 'Please double-check the domain after @ — that email doesn’t look valid.' };
  }
  const tld = domain.split('.').pop();
  if (!tld || tld.length < 2) {
    return { ok: false, message: 'Email needs a real domain ending (like .com or .io). Mind checking it?' };
  }

  return { ok: true, value };
}

export function validatePhone(raw) {
  if (isSkip(raw)) return { ok: true, value: '', skipped: true };

  const value = collapseSpaces(raw);
  const digits = value.replace(/\D/g, '');
  if (digits.length < 7 || digits.length > 15) {
    return {
      ok: false,
      message:
        'That phone number doesn’t look right. Use 7–15 digits (with country code if you like), or type “skip”.',
    };
  }
  // Reject obvious fake patterns
  if (/^(\d)\1+$/.test(digits) || digits === '1234567890' || digits === '0123456789') {
    return {
      ok: false,
      message: 'That doesn’t look like a real phone number. Please enter a valid one, or type “skip”.',
    };
  }

  return { ok: true, value };
}

export function validateProjectType(raw) {
  if (isSkip(raw)) return { ok: true, value: '', skipped: true };

  const value = collapseSpaces(raw);
  if (value.length < 3) {
    return {
      ok: false,
      message: 'A bit short — e.g. “SaaS web app”, “iOS MVP”, or “AI chatbot”. Or type “skip”.',
    };
  }
  if (value.length > 120) {
    return { ok: false, message: 'Keep the project type short (under ~120 characters). You can add detail in the brief.' };
  }

  return { ok: true, value };
}

export function validateBudget(raw) {
  if (isSkip(raw)) return { ok: true, value: '', skipped: true };

  const value = collapseSpaces(raw);
  if (value.length < 2) {
    return {
      ok: false,
      message: 'Share a range like “$5k–$15k” or “under 10k”, or type “skip”.',
    };
  }
  if (value.length > 80) {
    return { ok: false, message: 'Keep the budget note short, or type “skip”.' };
  }

  return { ok: true, value };
}

export function validateBrief(raw) {
  const value = collapseSpaces(raw);
  if (!value) {
    return {
      ok: false,
      message: 'I need a short product brief to estimate — users, must-haves, and goals in a few sentences.',
    };
  }

  const words = value.split(' ').filter(Boolean);
  if (value.length < 40 || words.length < 8) {
    return {
      ok: false,
      message:
        'Please add a little more detail (a few sentences): who it’s for, must-have features, platforms, and any tech prefs.',
    };
  }
  if (value.length > 4000) {
    return { ok: false, message: 'That’s a bit long for this form — please keep the brief under ~4000 characters.' };
  }
  // Repeated single character / spam
  if (/^(.)\1{9,}$/.test(value.replace(/\s/g, ''))) {
    return { ok: false, message: 'That doesn’t look like a real brief. Please describe the product in your own words.' };
  }

  return { ok: true, value };
}

/**
 * @param {string} stepId
 * @param {string} raw
 * @returns {{ ok: true, value: string, skipped?: boolean } | { ok: false, message: string }}
 */
export function validateEstimateField(stepId, raw) {
  switch (stepId) {
    case 'name':
      return validateName(raw);
    case 'email':
      return validateEmail(raw);
    case 'phone':
      return validatePhone(raw);
    case 'projectType':
      return validateProjectType(raw);
    case 'budget':
      return validateBudget(raw);
    case 'brief':
      return validateBrief(raw);
    default:
      return { ok: true, value: collapseSpaces(raw) };
  }
}

export { isSkip };
