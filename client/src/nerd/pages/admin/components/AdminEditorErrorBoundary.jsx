import { Component } from 'react';
import { Link } from 'react-router-dom';

export default class AdminEditorErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[AdminPostEditor]', error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div className="ndx-admin-editor-error ndx-glass-section" role="alert">
          <p className="ndx-eyebrow">Editor</p>
          <h2 className="ndx-h2" style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
            Something went wrong loading the editor
          </h2>
          <p className="ndx-admin-field-hint" style={{ marginBottom: '1rem' }}>
            {error?.message || 'Unknown error'}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            <button
              type="button"
              className="ndx-btn ndx-btn-primary"
              onClick={() => this.setState({ error: null })}
            >
              Try again
            </button>
            <Link to="/admin/posts/" className="ndx-btn">
              Back to posts
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
