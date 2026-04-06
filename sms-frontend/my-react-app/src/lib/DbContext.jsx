import { createContext, useEffect, useMemo, useState } from 'react'
import {
  computeAttendanceOverall,
  computeStudentAttendanceSummary,
  deleteFee,
  deleteStudent,
  deleteTimetableEntry,
  loadDb,
  saveDb,
  upsertAttendanceForDate,
  upsertFee,
  upsertStudent,
  upsertTimetableEntry,
} from './db'

export const DbContext = createContext(null)

export function DbProvider({ children }) {
  const [db, setDb] = useState(() => loadDb())

  useEffect(() => {
    saveDb(db)
  }, [db])

  const actions = useMemo(() => {
    return {
      resetDb: () => setDb(loadDb()),
      upsertStudent: (student) => setDb((prev) => upsertStudent(prev, student)),
      deleteStudent: (studentId) => setDb((prev) => deleteStudent(prev, studentId)),
      upsertFee: (fee) => setDb((prev) => upsertFee(prev, fee)),
      deleteFee: (feeId) => setDb((prev) => deleteFee(prev, feeId)),
      saveAttendanceForDate: (date, attendanceByStudentId) =>
        setDb((prev) => upsertAttendanceForDate(prev, date, attendanceByStudentId)),
      computeAttendanceOverall: (range) => computeAttendanceOverall(db, range),
      computeStudentAttendanceSummary: (studentId) => computeStudentAttendanceSummary(db, studentId),
      upsertTimetableEntry: (entry) => setDb((prev) => upsertTimetableEntry(prev, entry)),
      deleteTimetableEntry: (entryId) => setDb((prev) => deleteTimetableEntry(prev, entryId)),
    }
  }, [db])

  return <DbContext.Provider value={{ db, setDb, actions }}>{children}</DbContext.Provider>
}

