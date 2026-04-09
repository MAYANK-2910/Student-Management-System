import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import Logo from './Logo.jsx'
import '../styles/premium-design.css'
import '../styles/premium-components.css'
import '../styles/premium-layout.css'

function formatTime(d) {
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export default function AppShell() {
  const [now, setNow] = useState(() => new Date())
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    // Close mobile menu when route changes
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const navItems = [
    { to: '/', label: 'Dashboard', icon: '📊' },
    { to: '/students', label: 'Student Info', icon: '👥' },
    { to: '/student-records', label: 'Complete Records', icon: '📋' },
    { to: '/fees', label: 'Fees', icon: '💰' },
    { to: '/attendance/current', label: 'Attendance', icon: '✅' },
    { to: '/attendance/overall', label: 'Reports', icon: '📈' },
    { to: '/timetable', label: 'Timetable', icon: '📅' },
    { to: '/profile', label: 'Profile', icon: '👤' },
  ]

  const pageTitle = navItems.find((x) => x.to === location.pathname)?.label ?? 'Student Management'

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="premium-shell">
      <header className="premium-header">
        <div className="premium-header-content">
          {/* Brand */}
          <a href="/" className="premium-brand">
            <div className="premium-brand-logo">SMS</div>
            <div className="premium-brand-text">
              <h1 className="premium-brand-title">SMS</h1>
              <p className="premium-brand-subtitle">Student Management System</p>
            </div>
          </a>

          {/* Navigation */}
          <nav className={`premium-nav ${isMobileMenuOpen ? 'mobile-open' : ''}`} aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => 
                  isActive ? 'premium-nav-link active' : 'premium-nav-link'
                }
                end={item.to === '/'}
              >
                <span className="premium-nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="premium-header-actions">
            {/* Time Display */}
            <div className="premium-time-display">
              <span className="premium-time-label">Current time</span>
              <span className="premium-time-value">{formatTime(now)}</span>
            </div>

            {/* User Menu */}
            <div className="premium-user-menu">
              <div className="premium-user-avatar">A</div>
              <div className="premium-user-info">
                <div className="premium-user-name">Admin User</div>
                <div className="premium-user-role">Administrator</div>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button 
              className="premium-mobile-toggle"
              onClick={toggleMobileMenu}
              aria-label="Toggle navigation menu"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 6h14a1 1 0 010 2H3a1 1 0 010-2zm0 6h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      <div className="premium-main">
        {/* Page Header */}
        <div className="premium-page-header">
          <h1 className="premium-page-title">{pageTitle}</h1>
          {pageTitle === 'Dashboard' && (
            <p className="premium-page-description">
              Welcome to your student management dashboard. Monitor key metrics and manage your educational institution efficiently with our comprehensive platform.
            </p>
          )}
          {pageTitle === 'Student Info' && (
            <p className="premium-page-description">
              Manage student information, add new students, and maintain comprehensive student records with our advanced database system.
            </p>
          )}
          {pageTitle === 'Complete Records' && (
            <p className="premium-page-description">
              View and manage complete student records including academic performance, attendance history, and comprehensive analytics.
            </p>
          )}
          {pageTitle === 'Fees' && (
            <p className="premium-page-description">
              Track fee payments, manage dues, and generate detailed financial reports for students with our robust fee management system.
            </p>
          )}
          {pageTitle === 'Attendance' && (
            <p className="premium-page-description">
              Mark daily attendance and monitor student presence across different classes and subjects with our efficient attendance tracking system.
            </p>
          )}
          {pageTitle === 'Reports' && (
            <p className="premium-page-description">
              Generate comprehensive attendance reports and analyze student participation patterns with detailed analytics and insights.
            </p>
          )}
          {pageTitle === 'Timetable' && (
            <p className="premium-page-description">
              Manage class schedules, create timetables, and organize academic activities efficiently with our advanced scheduling system.
            </p>
          )}
          {pageTitle === 'Profile' && (
            <p className="premium-page-description">
              Manage your profile information, account settings, and view comprehensive activity statistics in one centralized location.
            </p>
          )}
        </div>

        {/* Main Content */}
        <main className="premium-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

