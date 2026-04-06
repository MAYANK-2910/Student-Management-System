const STORAGE_KEY = 'sms_frontend_db_v1'

function createId() {
  // Works in modern browsers; falls back for older runtimes.
  return (globalThis.crypto?.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(16).slice(2)}`)
}

function isoDate(d) {
  const dt = d instanceof Date ? d : new Date(d)
  const yyyy = dt.getFullYear()
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const dd = String(dt.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

export function seedDb() {
  const now = new Date()

  const students = [
    {
      id: createId(),
      fullName: 'Alice Johnson',
      rollNumber: 'A-01',
      className: '10',
      section: 'A',
      contact: '9876543210',
      email: 'alice@example.com',
      address: '12 Lake View Street',
      createdAt: isoDate(now),
    },
    {
      id: createId(),
      fullName: 'Rahul Sharma',
      rollNumber: 'A-02',
      className: '10',
      section: 'A',
      contact: '9123456780',
      email: 'rahul@example.com',
      address: '88 River Road',
      createdAt: isoDate(now),
    },
    {
      id: createId(),
      fullName: 'Meera Patel',
      rollNumber: 'A-03',
      className: '10',
      section: 'A',
      contact: '9988776655',
      email: 'meera@example.com',
      address: '5 Sunset Avenue',
      createdAt: isoDate(now),
    },
  ]

  const fees = []
  for (const s of students) {
    fees.push({
      id: createId(),
      studentId: s.id,
      month: '2026-04',
      amountDue: 5000,
      amountPaid: 0,
      status: 'Pending',
      notes: '',
      updatedAt: isoDate(now),
    })
  }

  const attendance = []
  // Seed last 7 days.
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now)
    day.setDate(now.getDate() - i)
    const d = isoDate(day)

    for (const s of students) {
      // Simple pattern: different attendance for each student.
      const present = i === 2 ? false : (s.rollNumber === 'A-02' ? i % 3 !== 0 : i % 2 === 0)
      attendance.push({
        id: createId(),
        studentId: s.id,
        date: d,
        present,
        updatedAt: isoDate(now),
      })
    }
  }

  const timetable = []
  // 5 periods per day for Monday-Friday as a starter.
  const baseDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
  for (const day of baseDays) {
    const subjects = ['Maths', 'English', 'Science', 'Social Studies', 'Computer']
    for (let period = 1; period <= 5; period++) {
      timetable.push({
        id: createId(),
        day,
        period,
        subject: subjects[period - 1],
        startTime: `0${period}:00`,
        endTime: `0${period}:50`,
        updatedAt: isoDate(now),
      })
    }
  }

  return { students, fees, attendance, timetable }
}

export function loadDb() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return seedDb()
    const parsed = JSON.parse(raw)
    // Minimal shape validation; if missing keys, reseed.
    if (!parsed?.students || !parsed?.fees || !parsed?.attendance || !parsed?.timetable) return seedDb()
    return parsed
  } catch {
    return seedDb()
  }
}

export function saveDb(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

export function getStudentById(db, studentId) {
  return db.students.find((s) => s.id === studentId) ?? null
}

export function upsertFee(db, fee) {
  const idx = db.fees.findIndex((f) => f.id === fee.id)
  const nextFees = [...db.fees]
  if (idx === -1) nextFees.unshift(fee)
  else nextFees[idx] = fee
  return { ...db, fees: nextFees }
}

export function deleteFee(db, feeId) {
  return { ...db, fees: db.fees.filter((f) => f.id !== feeId) }
}

export function upsertStudent(db, student) {
  const idx = db.students.findIndex((s) => s.id === student.id)
  const nextStudents = [...db.students]
  if (idx === -1) nextStudents.unshift(student)
  else nextStudents[idx] = student
  return { ...db, students: nextStudents }
}

export function deleteStudent(db, studentId) {
  return {
    ...db,
    students: db.students.filter((s) => s.id !== studentId),
    fees: db.fees.filter((f) => f.studentId !== studentId),
    attendance: db.attendance.filter((a) => a.studentId !== studentId),
  }
}

export function upsertAttendanceForDate(db, date, attendanceByStudentId) {
  // attendanceByStudentId: { [studentId]: boolean }
  const existing = db.attendance.filter((a) => a.date !== date)

  const nowIso = isoDate(new Date())
  const nextAttendance = [...existing]
  for (const s of db.students) {
    if (!(s.id in attendanceByStudentId)) continue
    nextAttendance.push({
      id: db.attendance.find((a) => a.studentId === s.id && a.date === date)?.id ?? createId(),
      studentId: s.id,
      date,
      present: !!attendanceByStudentId[s.id],
      updatedAt: nowIso,
    })
  }

  return { ...db, attendance: nextAttendance }
}

export function computeAttendanceOverall(db, { fromDate, toDate }) {
  const from = fromDate ? new Date(fromDate) : null
  const to = toDate ? new Date(toDate) : null

  const inRange = (d) => {
    const dt = new Date(d)
    if (from && dt < from) return false
    if (to && dt > to) return false
    return true
  }

  const datesInRange = new Set(db.attendance.filter((a) => inRange(a.date)).map((a) => a.date))
  const totalSessions = datesInRange.size

  return db.students.map((s) => {
    const records = db.attendance.filter((a) => a.studentId === s.id && inRange(a.date))
    const presentCount = records.filter((r) => r.present).length
    const percentage = totalSessions ? (presentCount / totalSessions) * 100 : 0
    return { studentId: s.id, rollNumber: s.rollNumber, fullName: s.fullName, presentCount, totalSessions, percentage }
  }).sort((a, b) => b.percentage - a.percentage)
}

export function computeStudentAttendanceSummary(db, studentId) {
  const records = db.attendance.filter((a) => a.studentId === studentId)
  const dates = new Set(records.map((r) => r.date))
  const totalSessions = dates.size
  const presentCount = records.filter((r) => r.present).length
  const percentage = totalSessions ? (presentCount / totalSessions) * 100 : 0
  return { presentCount, totalSessions, percentage, records }
}

export function upsertTimetableEntry(db, entry) {
  const idx = db.timetable.findIndex((e) => e.id === entry.id)
  const next = [...db.timetable]
  if (idx === -1) next.unshift(entry)
  else next[idx] = entry
  return { ...db, timetable: next }
}

export function deleteTimetableEntry(db, entryId) {
  return { ...db, timetable: db.timetable.filter((e) => e.id !== entryId) }
}

