import { useContext, useMemo, useState } from 'react'
import Modal from '../components/Modal.jsx'
import { DbContext } from '../lib/DbContext.jsx'
import { toLocalISODate } from '../lib/date.js'

function createId() {
  return (globalThis.crypto?.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(16).slice(2)}`)
}

export default function Students() {
  const { db, actions } = useContext(DbContext)
  const [query, setQuery] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [mode, setMode] = useState('add') // 'add' | 'edit'
  const [form, setForm] = useState({
    id: '',
    fullName: '',
    rollNumber: '',
    className: '',
    section: '',
    contact: '',
    email: '',
    address: '',
  })

  const filteredStudents = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return db.students
    return db.students.filter((s) => {
      return (
        s.fullName.toLowerCase().includes(q) ||
        s.rollNumber.toLowerCase().includes(q) ||
        s.className.toLowerCase().includes(q) ||
        s.section.toLowerCase().includes(q)
      )
    })
  }, [db.students, query])

  function openAdd() {
    setMode('add')
    setForm({
      id: '',
      fullName: '',
      rollNumber: '',
      className: '',
      section: '',
      contact: '',
      email: '',
      address: '',
    })
    setModalOpen(true)
  }

  function openEdit(student) {
    setMode('edit')
    setForm({
      id: student.id,
      fullName: student.fullName,
      rollNumber: student.rollNumber,
      className: student.className,
      section: student.section,
      contact: student.contact,
      email: student.email,
      address: student.address,
    })
    setModalOpen(true)
  }

  function submit() {
    if (!form.fullName.trim() || !form.rollNumber.trim()) {
      alert('Please enter at least Full Name and Roll Number.')
      return
    }

    if (mode === 'add') {
      const now = toLocalISODate(new Date())
      const student = { ...form, id: createId(), createdAt: now }
      actions.upsertStudent(student)
    } else {
      actions.upsertStudent({ ...form })
    }

    setModalOpen(false)
  }

  return (
    <div className="smsPage">
      <div className="smsCard">
        <div className="smsCardHeader">
          <h2 className="smsCardTitle">Student Information</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <input
              className="smsInput"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name/roll/class/section"
              style={{ minWidth: 280 }}
            />
            <button type="button" className="smsBtn" onClick={openAdd}>
              + Add Student
            </button>
          </div>
        </div>

        <div className="smsTableWrap">
          <table className="smsTable">
            <thead>
              <tr>
                <th>Roll No</th>
                <th>Student</th>
                <th>Class</th>
                <th>Contact</th>
                <th>Email</th>
                <th style={{ width: 200 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((s) => (
                <tr key={s.id}>
                  <td>{s.rollNumber}</td>
                  <td>
                    <div style={{ fontWeight: 900 }}>{s.fullName}</div>
                    <div className="smsMuted" style={{ fontSize: 12 }}>
                      {s.address}
                    </div>
                  </td>
                  <td>
                    {s.className}-{s.section}
                  </td>
                  <td>{s.contact}</td>
                  <td>{s.email}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button type="button" className="smsBtn smsBtnSecondary" onClick={() => openEdit(s)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="smsBtn smsBtnDanger"
                        onClick={() => {
                          const ok = window.confirm(`Delete ${s.fullName}? This also removes fees and attendance for this student.`)
                          if (!ok) return
                          actions.deleteStudent(s.id)
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 16, opacity: 0.85 }}>
                    No students found.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={modalOpen}
        title={mode === 'add' ? 'Add Student' : 'Edit Student'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button type="button" className="smsBtn smsBtnSecondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="smsBtn" onClick={submit}>
              {mode === 'add' ? 'Create' : 'Save'}
            </button>
          </>
        }
      >
        <div className="smsRow">
          <div className="smsField" style={{ flex: '1 1 240px' }}>
            <div className="smsLabel">Full Name</div>
            <input className="smsInput" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
          </div>
          <div className="smsField" style={{ flex: '1 1 180px' }}>
            <div className="smsLabel">Roll Number</div>
            <input className="smsInput" value={form.rollNumber} onChange={(e) => setForm((p) => ({ ...p, rollNumber: e.target.value }))} />
          </div>
          <div className="smsField" style={{ flex: '1 1 140px' }}>
            <div className="smsLabel">Class</div>
            <input className="smsInput" value={form.className} onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))} />
          </div>
          <div className="smsField" style={{ flex: '1 1 120px' }}>
            <div className="smsLabel">Section</div>
            <input className="smsInput" value={form.section} onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))} />
          </div>
          <div className="smsField" style={{ flex: '1 1 200px' }}>
            <div className="smsLabel">Contact</div>
            <input className="smsInput" value={form.contact} onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))} />
          </div>
          <div className="smsField" style={{ flex: '1 1 240px' }}>
            <div className="smsLabel">Email</div>
            <input className="smsInput" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="smsField" style={{ flex: '1 1 100%' }}>
            <div className="smsLabel">Address</div>
            <textarea className="smsTextArea smsInput" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
          </div>
        </div>
      </Modal>
    </div>
  )
}

