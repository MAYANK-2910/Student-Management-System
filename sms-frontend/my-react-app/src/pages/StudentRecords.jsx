import { useContext, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { DbContext } from '../lib/DbContext.jsx'

export default function StudentRecords() {
  const { db, actions } = useContext(DbContext)
  const [studentId, setStudentId] = useState(() => db.students[0]?.id ?? '')

  useEffect(() => {
    if (!studentId && db.students[0]?.id) setStudentId(db.students[0].id)
  }, [db.students, studentId])

  const student = db.students.find((s) => s.id === studentId) ?? null
  const fees = useMemo(() => db.fees.filter((f) => f.studentId === studentId).sort((a, b) => b.month.localeCompare(a.month)), [db.fees, studentId])
  const attendanceSummary = studentId ? actions.computeStudentAttendanceSummary(studentId) : null
  const attendanceRecords = useMemo(() => {
    if (!studentId) return []
    return db.attendance
      .filter((a) => a.studentId === studentId)
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [db.attendance, studentId])

  if (!student) {
    return (
      <div className="smsPage">
        <div className="smsCard">
          <div className="smsCardHeader">
            <h2 className="smsCardTitle">Complete Student Records</h2>
          </div>
          <div className="smsMuted">No students yet. Add students from `Student Info`.</div>
          <div style={{ marginTop: 12 }}>
            <Link className="smsBtn smsBtnSecondary" to="/students">
              Go to Student Info
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const pendingFees = fees.filter((f) => f.status !== 'Paid' && f.amountDue > f.amountPaid)

  return (
    <div className="smsPage">
      <div className="smsCard">
        <div className="smsCardHeader">
          <h2 className="smsCardTitle">Complete Student Records</h2>
          <div className="smsRow">
            <div className="smsField" style={{ minWidth: 320 }}>
              <div className="smsLabel">Student</div>
              <select className="smsSelect" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                {db.students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.rollNumber} - {s.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="smsGrid">
          <div className="smsCard" style={{ background: 'transparent', border: 'none', boxShadow: 'none', padding: 0 }}>
            <div className="smsRow" style={{ alignItems: 'flex-start' }}>
              <div style={{ flex: '1 1 280px' }}>
                <div style={{ fontSize: 20, fontWeight: 900 }}>{student.fullName}</div>
                <div className="smsMuted" style={{ marginTop: 6 }}>
                  Roll: {student.rollNumber} | Class: {student.className}-{student.section}
                </div>
                <div className="smsMuted" style={{ marginTop: 6 }}>
                  Contact: {student.contact} | Email: {student.email}
                </div>
                <div className="smsMuted" style={{ marginTop: 6 }}>
                  Address: {student.address}
                </div>

                <div className="smsDivider" />

                <div className="smsRow">
                  <div>
                    <div className="smsLabel">Attendance Overall</div>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>{attendanceSummary?.percentage.toFixed(2)}%</div>
                    <div className="smsMuted" style={{ marginTop: 4 }}>
                      Present: {attendanceSummary?.presentCount} / {attendanceSummary?.totalSessions}
                    </div>
                  </div>
                  <div>
                    <div className="smsLabel">Fees Pending</div>
                    <div style={{ fontSize: 24, fontWeight: 900 }}>{pendingFees.length}</div>
                    <div className="smsMuted" style={{ marginTop: 4 }}>
                      Months pending
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="smsLabel">Quick Actions</div>
            <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Link className="smsBtn smsBtnSecondary" to="/fees">
                Manage Fees
              </Link>
              <Link className="smsBtn smsBtnSecondary" to="/attendance/current">
                Mark Attendance
              </Link>
              <Link className="smsBtn smsBtnSecondary" to="/attendance/overall">
                View Overall Attendance
              </Link>
            </div>
            <div className="smsDivider" />

            <div className="smsLabel">Latest Attendance</div>
            <div className="smsTableWrap" style={{ marginTop: 10 }}>
              <table className="smsTable" style={{ minWidth: 0 }}>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Present</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.slice(0, 8).map((r) => (
                    <tr key={r.id}>
                      <td>{r.date}</td>
                      <td>
                        <span className={`smsBadge ${r.present ? 'smsBadgeOk' : 'smsBadgeWarn'}`}>
                          {r.present ? 'Present' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {attendanceRecords.length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{ padding: 16, opacity: 0.85 }}>
                        No attendance records yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="smsDivider" />

        <div className="smsGrid">
          <div>
            <div className="smsCardHeader" style={{ marginBottom: 10 }}>
              <h3 className="smsCardTitle">Fees</h3>
              <div className="smsMuted" style={{ fontSize: 12 }}>
                {fees.length} record(s)
              </div>
            </div>
            <div className="smsTableWrap">
              <table className="smsTable">
                <thead>
                  <tr>
                    <th>Month</th>
                    <th>Due</th>
                    <th>Paid</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {fees.map((f) => (
                    <tr key={f.id}>
                      <td>{f.month}</td>
                      <td>₹ {f.amountDue.toLocaleString()}</td>
                      <td>₹ {f.amountPaid.toLocaleString()}</td>
                      <td>
                        <span className={`smsBadge ${f.status === 'Paid' ? 'smsBadgeOk' : 'smsBadgeWarn'}`}>
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {fees.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: 16, opacity: 0.85 }}>
                        No fee records yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="smsCardHeader" style={{ marginBottom: 10 }}>
              <h3 className="smsCardTitle">Attendance Records</h3>
              <div className="smsMuted" style={{ fontSize: 12 }}>
                {attendanceRecords.length} session(s)
              </div>
            </div>
            <div className="smsTableWrap">
              <table className="smsTable">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Present</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((r) => (
                    <tr key={r.id}>
                      <td>{r.date}</td>
                      <td>
                        <span className={`smsBadge ${r.present ? 'smsBadgeOk' : 'smsBadgeWarn'}`}>
                          {r.present ? 'Present' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {attendanceRecords.length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{ padding: 16, opacity: 0.85 }}>
                        No attendance records yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

