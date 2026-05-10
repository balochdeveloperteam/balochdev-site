export type SelectedWorkTeaser = {
  tag: string;
  title: string;
  desc: string;
};

/** Portfolio teaser cards — shared by Services and Technologies pages */
export const selectedWorkTeasers: SelectedWorkTeaser[] = [
  { tag: "AI", title: "AI Call Center", desc: "Autonomous agents for inbound and outbound customer calls." },
  { tag: "Web", title: "FutureSpark", desc: "AI-enabled business platform with strong UX and launch-ready pages." },
  { tag: "Mobile", title: "Android CRM", desc: "Mobile-first operations platform with dashboard and data workflows." },
  { tag: "Automation", title: "Lead Engine", desc: "Automated lead capture, enrichment, notification and CRM update flows." },
  { tag: "SaaS", title: "Admin Portal", desc: "Multi-role dashboard with auth, analytics and client management." },
  { tag: "RAG", title: "Knowledge Bot", desc: "Document-connected assistant for internal teams and customers." },
];
