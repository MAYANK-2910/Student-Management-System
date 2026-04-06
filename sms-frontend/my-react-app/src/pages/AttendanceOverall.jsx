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
    <div className="smsPage">
      <div className="smsCard">
        <div className="smsCardHeader">
          <h2 className="smsCardTitle">Attendance (Overall)</h2>
          <div className="smsRow" style={{ justifyContent: 'flex-end' }}>
            <div className="smsField" style={{ minWidth: 220 }}>
              <div className="smsLabel">From</div>
              <input className="smsInput" type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
            </div>
            <div className="smsField" style={{ minWidth: 220 }}>
              <div className="smsLabel">To</div>
              <input className="smsInput" type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="smsRow" style={{ marginTop: 6, justifyContent: 'space-between' }}>
          <div>
            <div className="smsLabel">Students</div>
            <div style={{ fontSize: 26, fontWeight: 900 }}>{rows.length}</div>
          </div>
          <div>
            <div className="smsLabel">Average Attendance %</div>
            <div style={{ fontSize: 26, fontWeight: 900 }}>{avg.toFixed(2)}%</div>
          </div>
          <div className="smsMuted" style={{ alignSelf: 'center' }}>
            Computed from attendance entries in that date range.
          </div>
        </div>

        <div className="smsDivider" />

        <div className="smsTableWrap">
          <table className="smsTable">
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
                const badgeClass = r.percentage >= 75 ? 'smsBadgeOk' : (r.percentage >= 50 ? 'smsBadgeWarn' : 'smsBadgeWarn')
                return (
                  <tr key={r.studentId}>
                    <td>{r.rollNumber}</td>
                    <td style={{ fontWeight: 900 }}>{r.fullName}</td>
                    <td>{r.presentCount}</td>
                    <td>{r.totalSessions}</td>
                    <td>
                      <span className={`smsBadge ${badgeClass}`}>{r.percentage.toFixed(2)}%</span>
                    </td>
                  </tr>
                )
              })}
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: 16, opacity: 0.85 }}>
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

