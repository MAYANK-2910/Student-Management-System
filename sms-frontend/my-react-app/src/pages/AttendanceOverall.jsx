import { useContext, useMemo, useState } from 'react'
import { DbContext } from '../lib/DbContext.jsx'
import { toLocalISODate } from '../lib/date.js'

function toRangeDefault() {
  const to = new Date()
  const from = new Date()
  from.setDate(from.getDate() - 30)
  return { from: toLocalISODate(from), to: toLocalISODate(to) }
}

export default function AttendanceOverall() {
  const { db, actions } = useContext(DbContext)
  const initial = useMemo(() => toRangeDefault(), [])

  const [fromDate, setFromDate] = useState(initial.from)
  const [toDate, setToDate] = useState(initial.to)

  const rows = useMemo(() => {
    if (!db.students.length) return []
    return actions.computeAttendanceOverall({ fromDate, toDate })
  }, [actions, db.students.length, fromDate, toDate])

  const avg = rows.length ? rows.reduce((acc, r) => acc + r.percentage, 0) / rows.length : 0

  return (
    <div className="premium-page">
      <div className="premium-curved-box">
        <div className="premium-card-header">
          <h2 className="premium-card-title">
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📈</span>
            Attendance (Overall)
          </h2>
          <div className="premium-grid premium-grid-2">
            <div className="premium-form-group">
              <label className="premium-label">From</label>
              <input className="premium-input" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="premium-form-group">
              <label className="premium-label">To</label>
              <input className="premium-input" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="premium-grid premium-grid-2" style={{ marginTop: '1.5rem' }}>
          <div className="premium-stat-card">
            <div className="premium-stat-value">{rows.length}</div>
            <div className="premium-stat-label">Students</div>
          </div>
          <div className="premium-stat-card">
            <div className="premium-stat-value">{avg.toFixed(2)}%</div>
            <div className="premium-stat-label">Average Attendance</div>
          </div>
        </div>

        <div style={{ color: 'rgba(255, 255, 255, 0.55)', marginTop: '1rem', fontSize: '0.875rem' }}>
          Computed from attendance entries in that date range.
        </div>

        <div className="premium-divider" />

        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student</th>
                <th>Present</th>
                <th>Sessions</th>
                <th style={{ width: 150 }}>Attendance %</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const badgeClass = r.percentage >= 75 ? 'premium-badge-success' : (r.percentage >= 50 ? 'premium-badge-warning' : 'premium-badge-error')
                return (
                  <tr key={r.studentId}>
                    <td><span className="premium-badge premium-badge-primary">{r.rollNumber}</span></td>
                    <td style={{ fontWeight: 700, color: 'rgba(255, 255, 255, 0.95)' }}>{r.fullName}</td>
                    <td>{r.presentCount}</td>
                    <td>{r.totalSessions}</td>
                    <td>
                      <span className={`premium-badge ${badgeClass}`}>{r.percentage.toFixed(2)}%</span>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.55)' }}>
                    No data for this date range. Mark attendance on the Current Attendance page first.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

