import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { DbContext } from '../lib/DbContext.jsx'
import { toLocalISODate } from '../lib/date.js'

function sum(arr) {
  return arr.reduce((a, b) => a + b, 0)
}

export default function Dashboard() {
  const { db } = useContext(DbContext)

  const today = toLocalISODate(new Date())
  const todayRecords = db.attendance.filter((a) => a.date === today)
  const presentToday = todayRecords.filter((r) => r.present).length
  const totalStudents = db.students.length

  const dueFees = db.fees
  const dueTotal = sum(dueFees.map((f) => Math.max(0, f.amountDue - f.amountPaid)))
  const pendingCount = dueFees.filter((f) => f.status !== 'Paid' && f.amountDue > f.amountPaid).length

  return (
    <div className="smsPage">
      <div className="smsGrid">
        <div className="smsCard">
          <div className="smsCardHeader">
            <h2 className="smsCardTitle">Students</h2>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{totalStudents}</div>
          <div className="smsMuted" style={{ marginTop: 6 }}>
            Manage student info and view complete records.
          </div>
          <div style={{ marginTop: 12 }}>
            <Link className="smsBtn smsBtnSecondary" to="/students">
              Student Info
            </Link>
          </div>
        </div>

        <div className="smsCard">
          <div className="smsCardHeader">
            <h2 className="smsCardTitle">Fees Due</h2>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>₹ {dueTotal.toLocaleString()}</div>
          <div className="smsMuted" style={{ marginTop: 6 }}>
            Pending fee entries: {pendingCount}
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <Link className="smsBtn smsBtnSecondary" to="/fees">
              Manage Fees
            </Link>
          </div>
        </div>

        <div className="smsCard">
          <div className="smsCardHeader">
            <h2 className="smsCardTitle">Today Attendance</h2>
          </div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>
            {presentToday}/{totalStudents}
          </div>
          <div className="smsMuted" style={{ marginTop: 6 }}>
            Date: {today}
          </div>
          <div style={{ marginTop: 12 }}>
            <Link className="smsBtn smsBtnSecondary" to="/attendance/current">
              Mark Attendance
            </Link>
          </div>
        </div>

        <div className="smsCard">
          <div className="smsCardHeader">
            <h2 className="smsCardTitle">Timetable</h2>
          </div>
          <div className="smsMuted">
            View weekly classes and update subjects/periods.
          </div>
          <div style={{ marginTop: 12 }}>
            <Link className="smsBtn smsBtnSecondary" to="/timetable">
              Open Time Table
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

