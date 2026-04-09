import { useContext, useEffect, useMemo, useState } from 'react'
import { DbContext } from '../lib/DbContext.jsx'
import { toLocalISODate } from '../lib/date.js'

export default function AttendanceCurrent() {
  const { db, actions } = useContext(DbContext)

  const [date, setDate] = useState(() => toLocalISODate(new Date()))
  const [attendanceMap, setAttendanceMap] = useState({})

  useEffect(() => {
    const next = {}
    for (const s of db.students) {
      const rec = db.attendance.find((a) => a.studentId === s.id && a.date === date)
      next[s.id] = rec?.present ?? false
    }
    setAttendanceMap(next)
  }, [db.students, db.attendance, date])

  const { presentCount, totalStudents } = useMemo(() => {
    const totalStudents = db.students.length
    const presentCount = db.students.filter((s) => attendanceMap[s.id]).length
    return { presentCount, totalStudents }
  }, [attendanceMap, db.students])

  const percentage = totalStudents ? (presentCount / totalStudents) * 100 : 0

  function save() {
    if (!date) return
    if (!db.students.length) {
      alert('Add students first.')
      return
    }

    actions.saveAttendanceForDate(date, attendanceMap)
    alert(`Attendance saved for ${date}.`)
  }

  return (
    <div className="premium-page">
      <div className="premium-curved-box">
        <div className="premium-card-header">
          <h2 className="premium-card-title">
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>✅</span>
            Attendance (Current)
          </h2>
          <div className="premium-grid premium-grid-2">
            <div className="premium-form-group">
              <label className="premium-label">Date</label>
              <input className="premium-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="premium-grid premium-grid-2" style={{ marginTop: '1.5rem' }}>
          <div className="premium-stat-card">
            <div className="premium-stat-value">{presentCount}/{totalStudents}</div>
            <div className="premium-stat-label">Present</div>
          </div>
          <div className="premium-stat-card">
            <div className="premium-stat-value">{percentage.toFixed(2)}%</div>
            <div className="premium-stat-label">Attendance Rate</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <button type="button" className="premium-btn premium-btn-secondary" onClick={() => setAttendanceMap((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, true])))}>
            Mark All Present
          </button>
          <button type="button" className="premium-btn premium-btn-secondary" onClick={() => setAttendanceMap((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, false])))}>
            Clear
          </button>
          <button type="button" className="premium-btn" onClick={save}>
            Save Attendance
          </button>
        </div>

        <div className="premium-divider" />

        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student</th>
                <th style={{ width: 180 }}>Present</th>
              </tr>
            </thead>
            <tbody>
              {db.students.map((s) => (
                <tr key={s.id}>
                  <td><span className="premium-badge premium-badge-primary">{s.rollNumber}</span></td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'rgba(255, 255, 255, 0.95)' }}>{s.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.55)' }}>
                      {s.className}-{s.section}
                    </div>
                  </td>
                  <td>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!attendanceMap[s.id]}
                        onChange={() => setAttendanceMap((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                        style={{ width: '20px', height: '20px', accentColor: '#2563eb' }}
                      />
                      <span className={`premium-badge ${attendanceMap[s.id] ? 'premium-badge-success' : 'premium-badge-warning'}`}>
                        {attendanceMap[s.id] ? 'Present' : 'Absent'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}

              {db.students.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.55)' }}>
                    No students yet. Add students from Student Info.
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

