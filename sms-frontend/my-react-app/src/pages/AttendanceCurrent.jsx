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
    <div className="smsPage">
      <div className="smsCard">
        <div className="smsCardHeader">
          <h2 className="smsCardTitle">Attendance (Current)</h2>
          <div className="smsRow" style={{ justifyContent: 'flex-end' }}>
            <div className="smsField" style={{ minWidth: 260 }}>
              <div className="smsLabel">Date</div>
              <input className="smsInput" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="smsRow" style={{ marginTop: 6, justifyContent: 'space-between' }}>
          <div>
            <div className="smsLabel">Present</div>
            <div style={{ fontSize: 26, fontWeight: 900 }}>{presentCount}/{totalStudents}</div>
          </div>
          <div>
            <div className="smsLabel">Attendance %</div>
            <div style={{ fontSize: 26, fontWeight: 900 }}>{percentage.toFixed(2)}%</div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <button type="button" className="smsBtn smsBtnSecondary" onClick={() => setAttendanceMap((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, true])))}>
              Mark All Present
            </button>
            <button type="button" className="smsBtn smsBtnSecondary" onClick={() => setAttendanceMap((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, false])))}>
              Clear
            </button>
            <button type="button" className="smsBtn" onClick={save}>
              Save Attendance
            </button>
          </div>
        </div>

        <div className="smsDivider" />

        <div className="smsTableWrap">
          <table className="smsTable">
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
                  <td>{s.rollNumber}</td>
                  <td>
                    <div style={{ fontWeight: 900 }}>{s.fullName}</div>
                    <div className="smsMuted" style={{ fontSize: 12 }}>
                      {s.className}-{s.section}
                    </div>
                  </td>
                  <td>
                    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!attendanceMap[s.id]}
                        onChange={() => setAttendanceMap((prev) => ({ ...prev, [s.id]: !prev[s.id] }))}
                      />
                      <span className={attendanceMap[s.id] ? 'smsBadge smsBadgeOk' : 'smsBadge smsBadgeWarn'}>
                        {attendanceMap[s.id] ? 'Present' : 'Absent'}
                      </span>
                    </label>
                  </td>
                </tr>
              ))}

              {db.students.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ padding: 16, opacity: 0.85 }}>
                    No students yet. Add students from `Student Info`.
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

