import { useState } from 'react';

export default function RejectHoursModal({ memberName, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');

  return (
    <div className="ndx-team-modal-backdrop" role="presentation" onClick={onCancel}>
      <div
        className="ndx-card ndx-team-modal"
        role="dialog"
        aria-labelledby="reject-hours-title"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="reject-hours-title" className="ndx-h3" style={{ marginTop: 0 }}>
          Reject hours
        </h3>
        <p className="ndx-tech-blurb" style={{ marginBottom: '1rem' }}>
          Provide a reason for rejecting {memberName}&apos;s weekly hours. This will be appended to their notes.
        </p>
        <label className="ndx-team-field">
          <span>Rejection reason</span>
          <textarea
            className="ndx-team-input"
            rows={4}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Explain what needs to be corrected…"
            autoFocus
          />
        </label>
        <div className="ndx-team-form-actions">
          <button type="button" className="ndx-btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="ndx-btn ndx-btn-primary"
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason.trim())}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}
