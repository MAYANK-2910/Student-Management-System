import { useContext, useEffect, useMemo, useState } from 'react'
import { DbContext } from '../lib/DbContext.jsx'
import { daysOfWeek } from '../lib/db.js'
import { toLocalISODate } from '../lib/date.js'

function createId() {
  return (globalThis.crypto?.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(16).slice(2)}`)
}

export default function Timetable() {
  const { db, actions } = useContext(DbContext)
  const [day, setDay] = useState('Monday')

  const entries = useMemo(() => {
    return db.timetable.filter((e) => e.day === day).slice().sort((a, b) => a.period - b.period)
  }, [db.timetable, day])

  const [draft, setDraft] = useState(() => ({}))

  // Keep draft in sync with the selected day entries.
  useEffect(() => {
    const next = {}
    for (const e of entries) {
      next[e.id] = { subject: e.subject, startTime: e.startTime, endTime: e.endTime }
    }
    setDraft(next)
  }, [entries])

  function saveDay() {
    if (!entries.length) {
      alert('No timetable entries for this day.')
      return
    }
    const now = toLocalISODate(new Date())

    for (const e of entries) {
      const d = draft[e.id]
      if (!d) continue
      actions.upsertTimetableEntry({
        ...e,
        subject: String(d.subject ?? '').trim(),
        startTime: String(d.startTime ?? '').trim(),
        endTime: String(d.endTime ?? '').trim(),
        updatedAt: now,
      })
    }

    alert(`Time table saved for ${day}.`)
  }

  function addPeriod() {
    const maxPeriod = entries.reduce((m, e) => Math.max(m, e.period), 0)
    const now = toLocalISODate(new Date())

    actions.upsertTimetableEntry({
      id: createId(),
      day,
      period: maxPeriod + 1,
      subject: 'New Subject',
      startTime: '05:00',
      endTime: '05:50',
      updatedAt: now,
    })
  }

  return (
    <div className="premium-page">
      <div className="premium-curved-box">
        <div className="premium-card-header">
          <h2 className="premium-card-title">
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📅</span>
            Time Table
          </h2>
          <div className="premium-grid premium-grid-2">
            <div className="premium-form-group">
              <label className="premium-label">Day</label>
              <select className="premium-select" value={day} onChange={(e) => setDay(e.target.value)}>
                {daysOfWeek.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="premium-grid premium-grid-2" style={{ marginTop: '1.5rem' }}>
          <div className="premium-stat-card">
            <div className="premium-stat-value">{entries.length}</div>
            <div className="premium-stat-label">Entries for {day}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button type="button" className="premium-btn premium-btn-secondary" onClick={addPeriod}>
            <span>➕</span>
            Add Period
          </button>
          <button type="button" className="premium-btn" onClick={saveDay}>
            Save Day
          </button>
        </div>

        <div className="premium-divider" />

        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th style={{ width: 90 }}>Period</th>
                <th>Subject</th>
                <th style={{ width: 170 }}>Start</th>
                <th style={{ width: 170 }}>End</th>
              </tr>
            </thead>
            <tbody>
              {entries.map((e) => (
                <tr key={e.id}>
                  <td><span className="premium-badge premium-badge-primary">#{e.period}</span></td>
                  <td>
                    <input
                      className="premium-input"
                      value={draft[e.id]?.subject ?? e.subject}
                      onChange={(ev) => setDraft((p) => ({ ...p, [e.id]: { ...(p[e.id] ?? {}), subject: ev.target.value } }))}
                    />
                  </td>
                  <td>
                    <input
                      className="premium-input"
                      value={draft[e.id]?.startTime ?? e.startTime}
                      onChange={(ev) => setDraft((p) => ({ ...p, [e.id]: { ...(p[e.id] ?? {}), startTime: ev.target.value } }))}
                    />
                  </td>
                  <td>
                    <input
                      className="premium-input"
                      value={draft[e.id]?.endTime ?? e.endTime}
                      onChange={(ev) => setDraft((p) => ({ ...p, [e.id]: { ...(p[e.id] ?? {}), endTime: ev.target.value } }))}
                    />
                  </td>
                </tr>
              ))}

              {entries.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.55)' }}>
                    No timetable entries for this day. Click Add Period to create one.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="premium-divider" />

        <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.875rem' }}>
          Tip: This is a front-end only demo using local mock data. When you connect your backend later, the page can read/update the same fields using APIs.
        </div>
      </div>
    </div>
  )
}

