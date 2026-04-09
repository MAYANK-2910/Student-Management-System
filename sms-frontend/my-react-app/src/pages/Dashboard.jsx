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

  const attendanceRate = totalStudents > 0 ? Math.round((presentToday / totalStudents) * 100) : 0

  return (
    <div className="premium-page">
      <div className="premium-grid">
        {/* Students Card */}
        <div className="premium-stat-card">
          <div className="premium-card-header">
            <h2 className="premium-card-title">
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>👥</span>
              Students
            </h2>
            <span className="premium-badge premium-badge-primary">Active</span>
          </div>
          <div className="premium-stat-value">{totalStudents}</div>
          <div className="premium-stat-label">Total enrolled students</div>
          <div className="premium-stat-change positive">
            <span>↑ 12%</span>
            <span>vs last month</span>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Link className="premium-btn" to="/students">
              Manage Students
            </Link>
          </div>
        </div>

        {/* Fees Card */}
        <div className="premium-stat-card">
          <div className="premium-card-header">
            <h2 className="premium-card-title">
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>💰</span>
              Fees Due
            </h2>
            <span className="premium-badge premium-badge-warning">{pendingCount} Pending</span>
          </div>
          <div className="premium-stat-value">₹{dueTotal.toLocaleString()}</div>
          <div className="premium-stat-label">Total outstanding fees</div>
          <div className="premium-stat-change negative">
            <span>↓ 5%</span>
            <span>vs last month</span>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Link className="premium-btn premium-btn-secondary" to="/fees">
              View Fees
            </Link>
          </div>
        </div>

        {/* Attendance Card */}
        <div className="premium-stat-card">
          <div className="premium-card-header">
            <h2 className="premium-card-title">
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>✅</span>
              Today's Attendance
            </h2>
            <span className="premium-badge premium-badge-success">{attendanceRate}%</span>
          </div>
          <div className="premium-stat-value">{presentToday}/{totalStudents}</div>
          <div className="premium-stat-label">Present today • {today}</div>
          <div className="premium-stat-change positive">
            <span>↑ 3%</span>
            <span>vs yesterday</span>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Link className="premium-btn" to="/attendance/current">
              Mark Attendance
            </Link>
          </div>
        </div>

        {/* Timetable Card */}
        <div className="premium-stat-card">
          <div className="premium-card-header">
            <h2 className="premium-card-title">
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📅</span>
              Timetable
            </h2>
            <span className="premium-badge">Schedule</span>
          </div>
          <div className="premium-stat-value">24</div>
          <div className="premium-stat-label">Classes this week</div>
          <div className="premium-stat-change positive">
            <span>↑ 8%</span>
            <span>vs last week</span>
          </div>
          <div style={{ marginTop: '1.5rem' }}>
            <Link className="premium-btn premium-btn-secondary" to="/timetable">
              View Timetable
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="premium-section">
        <h2 className="premium-section-title">Quick Actions</h2>
        <div className="premium-grid premium-grid-3">
          <div className="premium-action-card">
            <div className="premium-action-icon">➕</div>
            <h3 className="premium-action-title">Add New Student</h3>
            <p className="premium-action-description">
              Quickly register a new student in the system with our streamlined registration process
            </p>
          </div>

          <div className="premium-action-card">
            <div className="premium-action-icon">📊</div>
            <h3 className="premium-action-title">Generate Report</h3>
            <p className="premium-action-description">
              Create comprehensive attendance and performance reports with detailed analytics
            </p>
          </div>

          <div className="premium-action-card">
            <div className="premium-action-icon">🔔</div>
            <h3 className="premium-action-title">Notifications</h3>
            <p className="premium-action-description">
              Manage system notifications and alerts for important updates and reminders
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="premium-section">
        <h2 className="premium-section-title">Recent Activity</h2>
        <div className="premium-glass-box">
          <div className="premium-card-header">
            <h3 className="premium-card-title">
              <span style={{ fontSize: '1.25rem', marginRight: '0.5rem' }}>🕐</span>
              Latest Updates
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="premium-list-item">
              <div className="premium-list-item-icon">✅</div>
              <div className="premium-list-item-content">
                <div className="premium-list-item-title">Attendance marked for today</div>
                <div className="premium-list-item-subtitle">{presentToday} students present</div>
              </div>
              <div className="premium-list-item-action">Just now</div>
            </div>

            <div className="premium-list-item">
              <div className="premium-list-item-icon">👤</div>
              <div className="premium-list-item-content">
                <div className="premium-list-item-title">New student registered</div>
                <div className="premium-list-item-subtitle">Student ID: STU{String(totalStudents).padStart(4, '0')}</div>
              </div>
              <div className="premium-list-item-action">2 hours ago</div>
            </div>

            <div className="premium-list-item">
              <div className="premium-list-item-icon">💰</div>
              <div className="premium-list-item-content">
                <div className="premium-list-item-title">Fee payment reminder</div>
                <div className="premium-list-item-subtitle">{pendingCount} pending payments</div>
              </div>
              <div className="premium-list-item-action">Yesterday</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

