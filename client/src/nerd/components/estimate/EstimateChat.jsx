import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiUrl } from '../../../lib/api';
import { getVisitorKey } from '../../lib/visitorKey';

const STEPS = [
  {
    id: 'name',
    bot: 'Hi — I’m the BalochDev estimate assistant. What’s your name?',
    placeholder: 'Your name',
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
    placeholder: 'Phone (optional)',
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
    placeholder: 'Budget range (optional)',
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
    minLength: 12,
  },
];

function resolveBotText(step, answers) {
  return typeof step.bot === 'function' ? step.bot(answers) : step.bot;
}

function isSkip(value) {
  const v = String(value || '').trim().toLowerCase();
  return !v || v === 'skip' || v === 'n/a' || v === 'na' || v === '-';
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

function ThinkingDots() {
  return (
    <div className="ndx-estimate-chat__thinking" aria-live="polite">
      <span className="ndx-estimate-chat__dot" />
      <span className="ndx-estimate-chat__dot" />
      <span className="ndx-estimate-chat__dot" />
      <span>Analyzing your brief…</span>
    </div>
  );
}

/**
 * Conversational lead collection → POST /api/estimate.
 */
export default function EstimateChat({ remaining, onRemaining, onReport, onError }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [messages, setMessages] = useState(() => [
    { id: 'b0', role: 'bot', text: resolveBotText(STEPS[0], {}) },
  ]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const listRef = useRef(null);
  const inputRef = useRef(null);

  const step = STEPS[stepIndex];
  const remainingLabel = remaining !== null && remaining !== undefined ? remaining : '—';

  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, loading]);

  useEffect(() => {
    if (!loading && !done) inputRef.current?.focus();
  }, [stepIndex, loading, done]);

  const append = (msg) => {
    setMessages((prev) => [...prev, { id: `${msg.role}-${Date.now()}-${prev.length}`, ...msg }]);
  };

  const submitEstimate = async (finalAnswers) => {
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
      if (!res.ok) {
        const errMsg = data.error || 'Something went wrong';
        onError?.(errMsg);
        append({ role: 'bot', text: errMsg });
        if (typeof data.remaining === 'number') onRemaining?.(data.remaining);
        return;
      }
      if (typeof data.remaining === 'number') onRemaining?.(data.remaining);
      const report = data.report;
      const low = formatUsd(report?.totals?.low);
      const high = formatUsd(report?.totals?.high);
      const title = report?.meta?.projectTitle || 'your project';
      append({
        role: 'bot',
        text: `Here’s a catalog-based ballpark for ${title}: ${low}–${high} USD. Full breakdown is below — this isn’t a formal quote.`,
      });
      setDone(true);
      onReport?.(report);
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
    const value = String(rawValue || '').trim();

    if (step.required && value.length < (step.minLength || 1)) {
      append({
        role: 'bot',
        text:
          step.id === 'brief'
            ? 'Please share a bit more detail (at least a couple of sentences).'
            : 'I need that to continue — try again?',
      });
      return;
    }

    if (step.id === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      append({ role: 'bot', text: 'That doesn’t look like a valid email. Mind checking it?' });
      return;
    }

    const stored = step.optional && isSkip(value) ? '' : value;
    const display = step.optional && isSkip(value) ? 'Skip' : value;
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

  const restart = () => {
    setStepIndex(0);
    setAnswers({});
    setMessages([{ id: 'b0-restart', role: 'bot', text: resolveBotText(STEPS[0], {}) }]);
    setDraft('');
    setDone(false);
    setLoading(false);
    onReport?.(null);
    onError?.(null);
  };

  return (
    <div className="ndx-estimate-chat">
      <div className="ndx-estimate-chat__panel" ref={listRef} role="log" aria-live="polite">
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div
              key={m.id}
              className={`ndx-estimate-chat__bubble ndx-estimate-chat__bubble--${m.role}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              {m.text}
            </motion.div>
          ))}
        </AnimatePresence>
        {loading ? <ThinkingDots /> : null}
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
          <button type="submit" className="ndx-btn ndx-btn-primary" disabled={loading}>
            Send
          </button>
        </form>
      ) : (
        <div className="ndx-estimate-chat__done-bar">
          <button type="button" className="ndx-btn" onClick={restart}>
            Start another estimate
          </button>
        </div>
      )}

      <p className="ndx-estimate-chat__meta">
        Free AI estimate · {remainingLabel} left today · Automated ballpark, not a formal quote. Prefer email?{' '}
        <a href="mailto:team@balochdev.com">team@balochdev.com</a>
      </p>
    </div>
  );
}
