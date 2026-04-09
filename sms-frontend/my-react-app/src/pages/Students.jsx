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
    <div className="premium-page">
      <div className="premium-curved-box">
        <div className="premium-card-header">
          <h2 className="premium-card-title">
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>👥</span>
            Student Information
          </h2>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <input
              className="premium-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name/roll/class/section"
              style={{ minWidth: 280 }}
            />
            <button type="button" className="premium-btn" onClick={openAdd}>
              <span>➕</span>
              Add Student
            </button>
          </div>
        </div>

        <div className="premium-table-container">
          <table className="premium-table">
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
                  <td><span className="premium-badge premium-badge-primary">{s.rollNumber}</span></td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'rgba(255, 255, 255, 0.95)' }}>{s.fullName}</div>
                    <div style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.55)' }}>
                      {s.address}
                    </div>
                  </td>
                  <td>
                    <span className="premium-badge premium-badge-success">{s.className}-{s.section}</span>
                  </td>
                  <td>{s.contact}</td>
                  <td>{s.email}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button type="button" className="premium-btn premium-btn-secondary premium-btn-sm" onClick={() => openEdit(s)}>
                        Edit
                      </button>
                      <button
                        type="button"
                        className="premium-btn premium-btn-danger premium-btn-sm"
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
                  <td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.55)' }}>
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
            <button type="button" className="premium-btn premium-btn-secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </button>
            <button type="button" className="premium-btn" onClick={submit}>
              {mode === 'add' ? 'Create' : 'Save'}
            </button>
          </>
        }
      >
        <div className="premium-grid premium-grid-2">
          <div className="premium-form-group">
            <label className="premium-label">Full Name</label>
            <input className="premium-input" value={form.fullName} onChange={(e) => setForm((p) => ({ ...p, fullName: e.target.value }))} />
          </div>
          <div className="premium-form-group">
            <label className="premium-label">Roll Number</label>
            <input className="premium-input" value={form.rollNumber} onChange={(e) => setForm((p) => ({ ...p, rollNumber: e.target.value }))} />
          </div>
          <div className="premium-form-group">
            <label className="premium-label">Class</label>
            <input className="premium-input" value={form.className} onChange={(e) => setForm((p) => ({ ...p, className: e.target.value }))} />
          </div>
          <div className="premium-form-group">
            <label className="premium-label">Section</label>
            <input className="premium-input" value={form.section} onChange={(e) => setForm((p) => ({ ...p, section: e.target.value }))} />
          </div>
          <div className="premium-form-group">
            <label className="premium-label">Contact</label>
            <input className="premium-input" value={form.contact} onChange={(e) => setForm((p) => ({ ...p, contact: e.target.value }))} />
          </div>
          <div className="premium-form-group">
            <label className="premium-label">Email</label>
            <input className="premium-input" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
          </div>
          <div className="premium-form-group" style={{ gridColumn: 'span 2' }}>
            <label className="premium-label">Address</label>
            <textarea className="premium-textarea" value={form.address} onChange={(e) => setForm((p) => ({ ...p, address: e.target.value }))} />
          </div>
        </div>
      </Modal>
    </div>
  )
}

