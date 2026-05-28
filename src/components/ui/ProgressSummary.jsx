import React from 'react';

export function ProgressSummary({ total, answered, correct, wrong, percent }) {
    return (
        <div className="stat-card progress-summary">
            <span className="stat-label">Tiến độ</span>
            <strong>{percent}%</strong>
            <span className="stat-caption">{answered}/{total} đã làm</span>
            <div className="progress-track" aria-hidden>
                <span className="progress-fill" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
            </div>
        </div>
    );
}
