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
      <div className="premium-page">
        <div className="premium-curved-box">
          <div className="premium-card-header">
            <h2 className="premium-card-title">
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📋</span>
              Complete Student Records
            </h2>
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.55)' }}>No students yet. Add students from Student Info.</div>
          <div style={{ marginTop: '1.5rem' }}>
            <Link className="premium-btn premium-btn-secondary" to="/students">
              Go to Student Info
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const pendingFees = fees.filter((f) => f.status !== 'Paid' && f.amountDue > f.amountPaid)

  return (
    <div className="premium-page">
      <div className="premium-curved-box">
        <div className="premium-card-header">
          <h2 className="premium-card-title">
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📋</span>
            Complete Student Records
          </h2>
          <div className="premium-grid premium-grid-2">
            <div className="premium-form-group">
              <label className="premium-label">Student</label>
              <select className="premium-select" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                {db.students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.rollNumber} - {s.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="premium-grid premium-grid-2">
          <div className="premium-glass-box" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'rgba(255, 255, 255, 0.95)', marginBottom: '0.5rem' }}>{student.fullName}</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Roll: {student.rollNumber} | Class: {student.className}-{student.section}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Contact: {student.contact} | Email: {student.email}
            </div>
            <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Address: {student.address}
            </div>

            <div className="premium-divider" />

            <div className="premium-grid premium-grid-2">
              <div className="premium-stat-card">
                <div className="premium-stat-value">{attendanceSummary?.percentage.toFixed(2)}%</div>
                <div className="premium-stat-label">Attendance Overall</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Present: {attendanceSummary?.presentCount} / {attendanceSummary?.totalSessions}
                </div>
              </div>
              <div className="premium-stat-card">
                <div className="premium-stat-value">{pendingFees.length}</div>
                <div className="premium-stat-label">Fees Pending</div>
                <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                  Months pending
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="premium-section-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Quick Actions</div>
            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link className="premium-btn premium-btn-secondary" to="/fees">
                Manage Fees
              </Link>
              <Link className="premium-btn premium-btn-secondary" to="/attendance/current">
                Mark Attendance
              </Link>
              <Link className="premium-btn premium-btn-secondary" to="/attendance/overall">
                View Overall Attendance
              </Link>
            </div>
            <div className="premium-divider" />

            <div className="premium-section-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Latest Attendance</div>
            <div className="premium-table-container" style={{ marginTop: '1rem' }}>
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Present</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.slice(0, 8).map((r) => (
                    <tr key={r.id}>
                      <td><span className="premium-badge premium-badge-primary">{r.date}</span></td>
                      <td>
                        <span className={`premium-badge ${r.present ? 'premium-badge-success' : 'premium-badge-warning'}`}>
                          {r.present ? 'Present' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {attendanceRecords.length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.55)' }}>
                        No attendance records yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="premium-divider" />

        <div className="premium-grid premium-grid-2">
          <div>
            <div className="premium-card-header" style={{ marginBottom: '1rem' }}>
              <h3 className="premium-card-title">Fees</h3>
              <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.875rem' }}>
                {fees.length} record(s)
              </div>
            </div>
            <div className="premium-table-container">
              <table className="premium-table">
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
                      <td><span className="premium-badge premium-badge-primary">{f.month}</span></td>
                      <td>₹{f.amountDue.toLocaleString()}</td>
                      <td>₹{f.amountPaid.toLocaleString()}</td>
                      <td>
                        <span className={`premium-badge ${f.status === 'Paid' ? 'premium-badge-success' : 'premium-badge-warning'}`}>
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {fees.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.55)' }}>
                        No fee records yet.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <div className="premium-card-header" style={{ marginBottom: '1rem' }}>
              <h3 className="premium-card-title">Attendance Records</h3>
              <div style={{ color: 'rgba(255, 255, 255, 0.55)', fontSize: '0.875rem' }}>
                {attendanceRecords.length} session(s)
              </div>
            </div>
            <div className="premium-table-container">
              <table className="premium-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Present</th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceRecords.map((r) => (
                    <tr key={r.id}>
                      <td><span className="premium-badge premium-badge-primary">{r.date}</span></td>
                      <td>
                        <span className={`premium-badge ${r.present ? 'premium-badge-success' : 'premium-badge-warning'}`}>
                          {r.present ? 'Present' : 'Absent'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {attendanceRecords.length === 0 ? (
                    <tr>
                      <td colSpan={2} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.55)' }}>
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

