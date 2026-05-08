/** Footers link to /services/:slug — keep keys in sync with ShellFooter */
export const SERVICE_PAGES = {
  'ai-development': {
    title: 'AI development',
    blurb:
      'Production AI features: prompts, guardrails, evaluation, and observability — not demos. We pair Claude, GPT, Gemini, and open models with your product constraints.',
    bullets: ['Structured outputs & tool calling', 'Latency and cost controls', 'Security review for PII'],
  },
  'ai-agents': {
    title: 'AI agent development',
    blurb:
      'Task agents that read your repo, call your APIs, and finish workflows with human checkpoints. Built for support ops, internal tools, and sales assist.',
    bullets: ['MCP & tool integrations', 'Audit trails', 'Fallback paths when models drift'],
  },
  'rag-llm': {
    title: 'RAG & LLM development',
    blurb:
      'Retrieval that respects permissions: chunking, hybrid search, citations, and Supabase/pgvector patterns ready for Cloudflare + edge caching.',
    bullets: ['Ingestion pipelines', 'Re-ranking & filters', 'Evaluation sets'],
  },
  chatbots: {
    title: 'Chatbot development',
    blurb:
      'On-brand assistants for web and messaging channels — handoff to humans, CRM hooks, and analytics you can trust.',
    bullets: ['Multi-channel', 'Content moderation', 'CRM / Helpdesk wiring'],
  },
  'ux-ui': {
    title: 'UX / UI design',
    blurb:
      'Editorial, fast UIs with accessible components — Figma to code with tokens that survive engineering changes.',
    bullets: ['Design systems', 'Mobile-first layouts', 'Handoff to React / Flutter'],
  },
  web: {
    title: 'Web development',
    blurb:
      'Next.js, React, Node, Supabase — SEO-first builds with Core Web Vitals in mind and Cloudflare-ready deploys.',
    bullets: ['ISR / SSR where it matters', 'Security headers', 'Analytics wiring'],
  },
};
