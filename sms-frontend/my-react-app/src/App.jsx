import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DbProvider } from './lib/DbContext.jsx'

import AppShell from './components/AppShell.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Students from './pages/Students.jsx'
import StudentRecords from './pages/StudentRecords.jsx'
import Fees from './pages/Fees.jsx'
import AttendanceCurrent from './pages/AttendanceCurrent.jsx'
import AttendanceOverall from './pages/AttendanceOverall.jsx'
import Timetable from './pages/Timetable.jsx'
import NotFound from './pages/NotFound.jsx'

import './app.css'
import './airtable.css'

export default function App() {
  return (
    <DbProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<Dashboard />} />
            <Route path="students" element={<Students />} />
            <Route path="student-records" element={<StudentRecords />} />
            <Route path="fees" element={<Fees />} />
            <Route path="attendance/current" element={<AttendanceCurrent />} />
            <Route path="attendance/overall" element={<AttendanceOverall />} />
            <Route path="timetable" element={<Timetable />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DbProvider>
  )
}
