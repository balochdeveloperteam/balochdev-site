import { NavLink } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import SocialLinksRow from './SocialLinksRow';

const cols = [
  {
    title: 'Company',
    links: [
      { to: '/about', label: 'About us' },
      { to: '/apps', label: 'Apps & software' },
      { to: '/blog', label: 'Blog' },
      { to: '/advertise', label: 'Advertise' },
      { to: '/contact', label: 'Contact us' },
      { to: '/estimate', label: 'AI estimate' },
    ],
  },
  {
    title: 'Services',
    links: [
      { to: '/services/ai-development', label: 'AI development' },
      { to: '/services/ai-agents', label: 'AI agent development' },
      { to: '/services/rag-llm', label: 'RAG LLM development' },
      { to: '/services/chatbots', label: 'Chatbot development' },
      { to: '/services/ux-ui', label: 'UX/UI design' },
      { to: '/services/web', label: 'Web development' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { to: '/brand', label: 'Brand guidelines' },
      { to: '/resources/ai-enabled-tools', label: 'AI-enabled tools' },
      { to: '/resources/rag', label: 'RAG' },
      { to: '/resources/workflow-automation', label: 'Workflow automation' },
      { to: '/resources/marketplace-apps', label: 'Marketplace apps' },
      { to: '/resources/dashboards', label: 'Dashboards' },
      { to: '/resources/mvps', label: 'MVPs' },
    ],
  },
  {
    title: 'Contact',
    links: [
      { to: '/contact', label: 'Book a call' },
      { to: '/estimate', label: 'AI estimate' },
      { to: 'mailto:team@balochdev.com', label: 'team@balochdev.com', external: true },
      { to: 'mailto:support@balochdev.com', label: 'support@balochdev.com', external: true },
    ],
  },
];

function ColLink({ to, label, external }) {
  if (external) {
    return (
      <a href={to} rel="noopener noreferrer" target="_blank">
        {label}
      </a>
    );
  }
  return <NavLink to={to}>{label}</NavLink>;
}

export default function ShellFooter() {
  return (
    <footer className="ndx-footer">
      <div className="ndx-footer-inner">
        <div>
          <BrandLogo variant="footer" />
          <p style={{ marginTop: '1rem', fontSize: '0.875rem', color: 'var(--ndx-muted)', maxWidth: '32ch' }}>
            AI-first software development. We ship custom products faster with Claude Code, AI agents, and modern frameworks.
          </p>
          <p style={{ marginTop: '1rem', fontSize: '0.8125rem', color: 'var(--ndx-dim)' }}>
            <a href="mailto:team@balochdev.com" style={{ color: 'inherit' }}>
              team@balochdev.com
            </a>
          </p>
          <p style={{ marginTop: '0.35rem', fontSize: '0.8125rem', color: 'var(--ndx-dim)' }}>
            balochdev.com
          </p>
          <SocialLinksRow className="ndx-social-links--footer" showLabel={false} />
        </div>
        {cols.map((col) => (
          <div key={col.title}>
            <h4>{col.title}</h4>
            {col.links.map((l) => (
              <ColLink key={l.label + l.to} {...l} />
            ))}
          </div>
        ))}
      </div>
      <div className="ndx-footer-bottom">
        <span>
          © {new Date().getFullYear()} BalochDev · All rights reserved
        </span>
        <span className="ndx-footer-legal">
          <NavLink to="/privacy">Privacy</NavLink>
          <NavLink to="/terms">Terms</NavLink>
          <NavLink to="/refund">Refund</NavLink>
          <NavLink to="/fulfilment">Fulfilment</NavLink>
          <a href="/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap</a>
        </span>
      </div>
    </footer>
  );
}
