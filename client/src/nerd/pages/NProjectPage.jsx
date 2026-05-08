import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { apiUrl } from '../../lib/api';

export default function NProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(undefined);

  useEffect(() => {
    if (!slug) return;
    fetch(apiUrl(`/api/projects/${slug}`))
      .then((r) => r.json())
      .then((d) => setProject(d.project))
      .catch(() => setProject(null));
  }, [slug]);

  useEffect(() => {
    document.title = project?.title ? `${project.title} — BalochDev` : 'Project — BalochDev';
  }, [project]);

  if (project === undefined) {
    return (
      <section className="ndx-section" style={{ paddingTop: '3rem' }}>
        <div className="ndx-container">
          <p className="ndx-muted">Loading…</p>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section className="ndx-section" style={{ paddingTop: '3rem' }}>
        <div className="ndx-container">
          <h1 className="ndx-h1">Project not found</h1>
          <Link to="/portfolio" className="ndx-btn ndx-btn-primary" style={{ marginTop: '1rem' }}>
            All projects
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="ndx-section" style={{ paddingTop: '3rem' }}>
      <div className="ndx-container" style={{ maxWidth: '720px' }}>
        <p className="ndx-eyebrow">Project · {project.category}</p>
        <h1 className="ndx-h1">{project.title}</h1>
        <p className="ndx-lead">{project.summary}</p>
        {project.body_html ? (
          <div
            className="ndx-prose"
            style={{ marginTop: '1.5rem', color: 'var(--ndx-muted)' }}
            dangerouslySetInnerHTML={{ __html: project.body_html }}
          />
        ) : null}
        <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          <Link to="/proposal" className="ndx-btn ndx-btn-primary">
            Work with us
          </Link>
          <Link to="/portfolio" className="ndx-btn">
            Back to portfolio
          </Link>
        </div>
      </div>
    </section>
  );
}
