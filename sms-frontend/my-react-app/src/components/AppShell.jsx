import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

import './appShell.css'

function formatTime(d) {
  const hh = String(d.getHours()).padStart(2, '0')
  const mm = String(d.getMinutes()).padStart(2, '0')
  const ss = String(d.getSeconds()).padStart(2, '0')
  return `${hh}:${mm}:${ss}`
}

export default function AppShell() {
  const [now, setNow] = useState(() => new Date())
  const location = useLocation()

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/students', label: 'Student Info' },
    { to: '/student-records', label: 'Complete Records' },
    { to: '/fees', label: 'Fees' },
    { to: '/attendance/current', label: 'Attendance (Current)' },
    { to: '/attendance/overall', label: 'Attendance (Overall)' },
    { to: '/timetable', label: 'Time Table' },
  ]

  const pageTitle = navItems.find((x) => x.to === location.pathname)?.label ?? 'Student Management'

  return (
    <div className="smsShell">
      <header className="smsHeader">
        <div className="smsBrand">
          <div className="smsBrandTitle">SMS</div>
          <div className="smsBrandSub">Student Management</div>
        </div>

        <nav className="smsTopNav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => (isActive ? 'smsTopNavLink smsTopNavLinkActive' : 'smsTopNavLink')}
              end={item.to === '/'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="smsHeaderRight">
          <div className="smsTimeLine">
            <span className="smsTimeLabel">Current time:</span>
            <span className="smsTimeValue">{formatTime(now)}</span>
          </div>
        </div>
      </header>

      <div className="smsMain">
        <div className="smsPageHeader">
          <h1 className="smsPageTitle">{pageTitle}</h1>
        </div>

        <main className="smsContent">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

