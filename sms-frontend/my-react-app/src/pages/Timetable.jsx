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
    <div className="smsPage">
      <div className="smsCard">
        <div className="smsCardHeader">
          <h2 className="smsCardTitle">Time Table</h2>
          <div className="smsRow" style={{ justifyContent: 'flex-end' }}>
            <div className="smsField" style={{ minWidth: 260 }}>
              <div className="smsLabel">Day</div>
              <select className="smsSelect" value={day} onChange={(e) => setDay(e.target.value)}>
                {daysOfWeek.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="smsRow" style={{ marginTop: 6, justifyContent: 'space-between' }}>
          <div>
            <div className="smsLabel">Entries for {day}</div>
            <div style={{ fontSize: 26, fontWeight: 900 }}>{entries.length}</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <button type="button" className="smsBtn smsBtnSecondary" onClick={addPeriod}>
              + Add Period
            </button>
            <button type="button" className="smsBtn" onClick={saveDay}>
              Save Day
            </button>
          </div>
        </div>

        <div className="smsDivider" />

        <div className="smsTableWrap">
          <table className="smsTable">
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
                  <td style={{ fontWeight: 900 }}>#{e.period}</td>
                  <td>
                    <input
                      className="smsInput"
                      value={draft[e.id]?.subject ?? e.subject}
                      onChange={(ev) => setDraft((p) => ({ ...p, [e.id]: { ...(p[e.id] ?? {}), subject: ev.target.value } }))}
                    />
                  </td>
                  <td>
                    <input
                      className="smsInput"
                      value={draft[e.id]?.startTime ?? e.startTime}
                      onChange={(ev) => setDraft((p) => ({ ...p, [e.id]: { ...(p[e.id] ?? {}), startTime: ev.target.value } }))}
                    />
                  </td>
                  <td>
                    <input
                      className="smsInput"
                      value={draft[e.id]?.endTime ?? e.endTime}
                      onChange={(ev) => setDraft((p) => ({ ...p, [e.id]: { ...(p[e.id] ?? {}), endTime: ev.target.value } }))}
                    />
                  </td>
                </tr>
              ))}

              {entries.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: 16, opacity: 0.85 }}>
                    No timetable entries for this day. Click `+ Add Period` to create one.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="smsDivider" />

        <div className="smsMuted">
          Tip: This is a front-end only demo using local mock data. When you connect your backend later, the page can read/update the same fields using APIs.
        </div>
      </div>
    </div>
  )
}

