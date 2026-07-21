import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiUser } from 'react-icons/hi2';
import { apiUrl } from '../../../lib/api';
import { getVisitorKey } from '../../lib/visitorKey';
import {
  createEstimateProject,
  getActiveEstimateProject,
  listEstimateProjects,
  loadEstimateSession,
  resetEstimateChats,
  saveEstimateSession,
  setActiveEstimateProject,
  utcDayKey,
} from '../../lib/estimateSession';
import { isSkip, validateEstimateField } from '../../lib/estimateValidation';
import botLogo from '../../../assets/BalochDevLogo/botlogo.webp';

const STEPS = [
  {
    id: 'name',
    bot: 'Hi — I’m the BalochDev estimate assistant. What’s your full name? (first and last)',
    placeholder: 'e.g. Sara Khan',
    required: true,
    inputType: 'text',
  },
  {
    id: 'email',
    bot: (answers) => `Nice to meet you${answers.name ? `, ${answers.name}` : ''}. What’s the best email for the report?`,
    placeholder: 'you@company.com',
    required: true,
    inputType: 'email',
  },
  {
    id: 'phone',
    bot: 'Phone is optional — handy if we need a quick follow-up. Skip with “skip” or leave blank.',
    placeholder: '+1 555 123 4567 (optional)',
    required: false,
    inputType: 'tel',
    optional: true,
  },
  {
    id: 'projectType',
    bot: 'What are you building? (e.g. web app, mobile MVP, SaaS, chatbot, RAG…)',
    placeholder: 'Project type',
    required: false,
    inputType: 'text',
    optional: true,
  },
  {
    id: 'budget',
    bot: 'Any budget band in mind? Optional — helps us pick the right package size.',
    placeholder: 'e.g. $5k–$15k (optional)',
    required: false,
    inputType: 'text',
    optional: true,
  },
  {
    id: 'brief',
    bot: 'Last step: describe the product in a few sentences — users, must-haves, stack prefs, success metrics.',
    placeholder: 'What are you building?',
    required: true,
    inputType: 'textarea',
  },
];

function resolveBotText(step, answers) {
  return typeof step.bot === 'function' ? step.bot(answers) : step.bot;
}

function formatUsd(n) {
  const v = Number(n);
  if (!Number.isFinite(v)) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(v);
}

function defaultMessages() {
  return [{ id: 'b0', role: 'bot', text: resolveBotText(STEPS[0], {}) }];
}

function readChatFromSession() {
  const s = loadEstimateSession();
  if (!s) return null;

  const answers = s.answers && typeof s.answers === 'object' ? s.answers : {};
  const messages = Array.isArray(s.messages)
    ? s.messages.filter((m) => m && (m.role === 'bot' || m.role === 'user') && typeof m.text === 'string')
    : [];

  if (messages.length === 0 && !s.done && Object.keys(answers).length === 0) {
    return {
      stepIndex: 0,
      answers: {},
      messages: defaultMessages(),
      draft: '',
      done: false,
    };
  }

  if (messages.length === 0) return null;

  const stepIndex = Number.isInteger(s.stepIndex) ? Math.min(Math.max(0, s.stepIndex), STEPS.length - 1) : 0;

  return {
    stepIndex: s.done ? STEPS.length - 1 : stepIndex,
    answers,
    messages,
    draft: typeof s.draft === 'string' ? s.draft : '',
    done: Boolean(s.done),
  };
}

function BotAvatar() {
  return (
    <div className="ndx-estimate-chat__avatar ndx-estimate-chat__avatar--bot" aria-hidden>
      <img src={botLogo} alt="" width={40} height={40} decoding="async" />
    </div>
  );
}

function UserAvatar() {
  return (
    <div className="ndx-estimate-chat__avatar ndx-estimate-chat__avatar--user" aria-hidden>
      <HiUser size={20} />
    </div>
  );
}

function ThinkingRow() {
  return (
    <div className="ndx-estimate-chat__row ndx-estimate-chat__row--bot" aria-live="polite">
      <BotAvatar />
      <div className="ndx-estimate-chat__bubble ndx-estimate-chat__bubble--bot ndx-estimate-chat__bubble--thinking">
        <span className="ndx-estimate-chat__dot" />
        <span className="ndx-estimate-chat__dot" />
        <span className="ndx-estimate-chat__dot" />
        <span className="ndx-estimate-chat__thinking-label">Analyzing your brief…</span>
      </div>
    </div>
  );
}

/**
 * Conversational lead collection → POST /api/estimate.
 * Multiple projects are stored locally so users can switch chats after refresh.
 */
export default function EstimateChat({
  projectId,
  remaining,
  limit = 3,
  used = null,
  onQuota,
  onRemaining,
  onReport,
  onError,
  onProjectChange,
}) {
  const restoredRef = useRef(null);
  if (restoredRef.current === null) {
    restoredRef.current = readChatFromSession();
  }
  const restored = restoredRef.current;

  const [stepIndex, setStepIndex] = useState(() => restored?.stepIndex ?? 0);
  const [answers, setAnswers] = useState(() => restored?.answers ?? {});
  const [messages, setMessages] = useState(() => restored?.messages ?? defaultMessages());
  const [draft, setDraft] = useState(() => restored?.draft ?? '');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(() => restored?.done ?? false);
  const [projects, setProjects] = useState(() => listEstimateProjects());
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const step = STEPS[stepIndex];
  const dailyLimit = typeof limit === 'number' && limit > 0 ? limit : 3;
  const remainingCount = typeof remaining === 'number' ? remaining : null;
  const usedCount =
    typeof used === 'number' ? used : remainingCount !== null ? Math.max(0, dailyLimit - remainingCount) : null;
  const quotaExhausted = remainingCount === 0;
  const canGenerate = remainingCount === null || remainingCount > 0;

  const refreshProjects = () => setProjects(listEstimateProjects());

  useEffect(() => {
    const s = loadEstimateSession();
    if (s?.report) onReport?.(s.report);
    else onReport?.(null);
    if (typeof s?.remaining === 'number' || typeof s?.limit === 'number') {
      onQuota?.({
        remaining: s.remaining,
        limit: s.limit,
        used: s.used,
      });
      if (typeof s?.remaining === 'number') onRemaining?.(s.remaining);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- remount per projectId
  }, [projectId]);

  useEffect(() => {
    saveEstimateSession({
      stepIndex,
      answers,
      messages,
      draft,
      done,
    });
    refreshProjects();
  }, [stepIndex, answers, messages, draft, done]);

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (!loading && !done) inputRef.current?.focus();
  }, [stepIndex, loading, done, projectId]);

  const append = (msg) => {
    setMessages((prev) => [...prev, { id: `${msg.role}-${Date.now()}-${prev.length}`, ...msg }]);
  };

  const switchProject = (id) => {
    if (!id || id === projectId || loading) return;
    // Persist current chat before leaving
    saveEstimateSession({ stepIndex, answers, messages, draft, done });
    setActiveEstimateProject(id);
    const next = getActiveEstimateProject();
    onReport?.(next?.report || null);
    onError?.(null);
    onProjectChange?.(next?.id);
    refreshProjects();
  };

  const startNewProject = () => {
    if (loading) return;
    saveEstimateSession({ stepIndex, answers, messages, draft, done });
    const next = createEstimateProject();
    onReport?.(null);
    onError?.(null);
    onProjectChange?.(next.id);
    refreshProjects();
  };

  const clearAllChats = () => {
    if (loading) return;
    const ok = window.confirm(
      'Clear all saved estimate chats on this device?\n\nYour daily limit is unchanged — used slots stay used until tomorrow (UTC).',
    );
    if (!ok) return;
    const next = resetEstimateChats();
    onReport?.(null);
    onError?.(null);
    onProjectChange?.(next.id);
    refreshProjects();
  };

  const applyResponseQuota = (data) => {
    if (
      typeof data?.remaining === 'number' ||
      typeof data?.limit === 'number' ||
      typeof data?.used === 'number'
    ) {
      onQuota?.(data);
      if (typeof data.remaining === 'number') onRemaining?.(data.remaining);
      saveEstimateSession({
        ...(typeof data.remaining === 'number' ? { remaining: data.remaining } : {}),
        ...(typeof data.limit === 'number' ? { limit: data.limit } : {}),
        ...(typeof data.used === 'number' ? { used: data.used } : {}),
        quotaDay: typeof data.day === 'string' ? data.day : utcDayKey(),
      });
    }
  };

  const submitEstimate = async (finalAnswers) => {
    if (quotaExhausted) {
      const errMsg = `Daily limit reached (${dailyLimit} estimates per day). Try again tomorrow, or open a saved project above.`;
      onError?.(errMsg);
      append({ role: 'bot', text: errMsg });
      return;
    }

    setLoading(true);
    onError?.(null);
    try {
      const res = await fetch(apiUrl('/api/estimate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: finalAnswers.name,
          email: finalAnswers.email,
          phone: finalAnswers.phone || undefined,
          budget: finalAnswers.budget || undefined,
          projectType: finalAnswers.projectType || undefined,
          brief: finalAnswers.brief,
          visitor_key: getVisitorKey(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      applyResponseQuota(data);
      if (!res.ok) {
        const errMsg = data.error || 'Something went wrong';
        onError?.(errMsg);
        append({ role: 'bot', text: errMsg });
        return;
      }
      const report = data.report;
      const low = formatUsd(report?.totals?.low);
      const high = formatUsd(report?.totals?.high);
      const title = report?.meta?.projectTitle || 'your project';
      const left = typeof data.remaining === 'number' ? data.remaining : remainingCount;
      append({
        role: 'bot',
        text: `Here’s a catalog-based ballpark for ${title}: ${low}–${high} USD. Full breakdown is below — this isn’t a formal quote.${
          typeof left === 'number' ? ` You have ${left} of ${dailyLimit} free estimates left today.` : ''
        }`,
      });
      setDone(true);
      saveEstimateSession({ report, done: true });
      onReport?.(report);
      refreshProjects();
    } catch {
      const errMsg = 'Network error — try again or email team@balochdev.com';
      onError?.(errMsg);
      append({ role: 'bot', text: errMsg });
    } finally {
      setLoading(false);
    }
  };

  const advance = async (rawValue) => {
    if (!step || loading || done) return;

    const raw = String(rawValue || '');
    const validation = validateEstimateField(step.id, raw);

    if (!validation.ok) {
      const shown = raw.trim() || '(empty)';
      append({ role: 'user', text: shown });
      append({ role: 'bot', text: validation.message });
      setDraft('');
      return;
    }

    const stored = validation.value;
    const display = validation.skipped || (step.optional && isSkip(raw)) ? 'Skip' : stored;
    const nextAnswers = { ...answers, [step.id]: stored };
    setAnswers(nextAnswers);
    append({ role: 'user', text: display });
    setDraft('');

    const nextIndex = stepIndex + 1;
    if (nextIndex < STEPS.length) {
      setStepIndex(nextIndex);
      append({ role: 'bot', text: resolveBotText(STEPS[nextIndex], nextAnswers) });
      return;
    }

    await submitEstimate(nextAnswers);
  };

  const onFormSubmit = (e) => {
    e.preventDefault();
    advance(draft);
  };

  return (
    <div className="ndx-estimate-chat">
      <div className="ndx-estimate-chat__projects" aria-label="Estimate projects">
        <div className="ndx-estimate-chat__project-tabs">
          {projects.map((p) => (
            <button
              key={p.id}
              type="button"
              className={`ndx-estimate-chat__project-tab${p.id === projectId ? ' is-active' : ''}`}
              onClick={() => switchProject(p.id)}
              disabled={loading}
              title={p.title}
            >
              <span className="ndx-estimate-chat__project-tab-label">{p.title}</span>
              {p.done || p.hasReport ? <span className="ndx-estimate-chat__project-pill">Done</span> : null}
            </button>
          ))}
        </div>
        <div className="ndx-estimate-chat__project-actions">
          <button
            type="button"
            className="ndx-btn ndx-btn-primary ndx-estimate-chat__new-project"
            onClick={startNewProject}
            disabled={loading}
            title={
              canGenerate
                ? 'Start a fresh estimate chat (does not use a daily slot until you finish)'
                : 'Daily limit used — you can still draft; new reports unlock tomorrow'
            }
          >
            New project
          </button>
          {projects.length > 1 || projects.some((p) => p.done || p.hasReport) ? (
            <button
              type="button"
              className="ndx-btn ndx-estimate-chat__clear-chats"
              onClick={clearAllChats}
              disabled={loading}
              title="Remove saved chats on this device. Daily estimate slots are not restored."
            >
              Clear chats
            </button>
          ) : null}
        </div>
      </div>

      <div className="ndx-estimate-chat__shell">
        <header className="ndx-estimate-chat__header">
          <BotAvatar />
          <div>
            <p className="ndx-estimate-chat__title">BalochDev Estimate</p>
            <p className="ndx-estimate-chat__subtitle">AI assistant · catalog pricing</p>
          </div>
          <div className="ndx-estimate-chat__header-meta">
            <span
              className={`ndx-estimate-chat__quota${quotaExhausted ? ' is-exhausted' : ''}`}
              title="Shared daily limit across all your estimate projects"
            >
              {remainingCount !== null ? (
                <>
                  <strong>{remainingCount}</strong> / {dailyLimit} left today
                </>
              ) : (
                <>{dailyLimit} / day</>
              )}
            </span>
            <span className="ndx-estimate-chat__status">Online</span>
          </div>
        </header>

        {quotaExhausted && !done ? (
          <p className="ndx-estimate-chat__quota-banner" role="status">
            Daily limit reached ({dailyLimit} estimates). Clear chats anytime to tidy up — your counter resets to{' '}
            {dailyLimit} at the next UTC midnight.
          </p>
        ) : null}

        <div className="ndx-estimate-chat__panel" ref={listRef} role="log" aria-live="polite">
          <AnimatePresence initial={false}>
            {messages.map((m) => (
              <motion.div
                key={m.id}
                className={`ndx-estimate-chat__row ndx-estimate-chat__row--${m.role}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.28 }}
              >
                {m.role === 'bot' ? <BotAvatar /> : null}
                <div className={`ndx-estimate-chat__bubble ndx-estimate-chat__bubble--${m.role}`}>
                  {m.role === 'bot' ? <span className="ndx-estimate-chat__name">Assistant</span> : null}
                  {m.role === 'user' ? <span className="ndx-estimate-chat__name">You</span> : null}
                  <p className="ndx-estimate-chat__text">{m.text}</p>
                </div>
                {m.role === 'user' ? <UserAvatar /> : null}
              </motion.div>
            ))}
          </AnimatePresence>
          {loading ? <ThinkingRow /> : null}
        </div>

        {!done ? (
          <form className="ndx-estimate-chat__composer" onSubmit={onFormSubmit}>
            {step?.inputType === 'textarea' ? (
              <textarea
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={step.placeholder}
                rows={3}
                disabled={loading}
                aria-label={step.placeholder}
              />
            ) : (
              <input
                ref={inputRef}
                type={step?.inputType || 'text'}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={step?.placeholder}
                disabled={loading}
                aria-label={step?.placeholder}
              />
            )}
            <button type="submit" className="ndx-btn ndx-btn-primary ndx-estimate-chat__send" disabled={loading}>
              Send
            </button>
          </form>
        ) : (
          <div className="ndx-estimate-chat__done-bar">
            <button type="button" className="ndx-btn ndx-btn-primary" onClick={startNewProject} disabled={loading}>
              New project
            </button>
            <p className="ndx-estimate-chat__done-hint">
              This chat stays saved — switch tabs above anytime.
              {remainingCount !== null
                ? ` ${remainingCount} of ${dailyLimit} free estimates left today.`
                : ` Up to ${dailyLimit} free estimates per day.`}
            </p>
          </div>
        )}
      </div>

      <p className="ndx-estimate-chat__meta">
        Free AI estimate ·{' '}
        {remainingCount !== null
          ? `${remainingCount} of ${dailyLimit} left today${usedCount !== null ? ` (${usedCount} used)` : ''}`
          : `${dailyLimit} per day`}{' '}
        · Resets daily (UTC) · New project / Clear chats don’t restore used slots · Prefer email?{' '}
        <a href="mailto:team@balochdev.com">team@balochdev.com</a>
      </p>
    </div>
  );
}
