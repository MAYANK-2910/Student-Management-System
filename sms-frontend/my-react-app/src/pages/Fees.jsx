import { useContext, useMemo, useState } from 'react'
import Modal from '../components/Modal.jsx'
import { DbContext } from '../lib/DbContext.jsx'

import { toLocalISODate } from '../lib/date.js'

function createId() {
  return (globalThis.crypto?.randomUUID?.() ?? `id_${Date.now()}_${Math.random().toString(16).slice(2)}`)
}

export default function Fees() {
  const { db, actions } = useContext(DbContext)
  const [studentId, setStudentId] = useState(() => db.students[0]?.id ?? '')

  const fees = useMemo(() => {
    if (!studentId) return []
    return db.fees.filter((f) => f.studentId === studentId).sort((a, b) => b.month.localeCompare(a.month))
  }, [db.fees, studentId])

  const dueTotal = fees.reduce((acc, f) => acc + Math.max(0, f.amountDue - f.amountPaid), 0)
  const pendingCount = fees.filter((f) => f.status !== 'Paid' && f.amountDue > f.amountPaid).length

  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState({ month: '', amountDue: '0', notes: '' })

  function submitAdd() {
    if (!form.month.trim()) {
      alert('Please enter Fee Month (example: 2026-04).')
      return
    }
    const amountDue = Number(form.amountDue)
    if (!Number.isFinite(amountDue) || amountDue <= 0) {
      alert('Please enter a valid Amount Due (> 0).')
      return
    }

    const now = toLocalISODate(new Date())
    actions.upsertFee({
      id: createId(),
      studentId,
      month: form.month.trim(),
      amountDue,
      amountPaid: 0,
      status: 'Pending',
      notes: form.notes.trim(),
      updatedAt: now,
    })

    setAddOpen(false)
    setForm({ month: '', amountDue: '0', notes: '' })
  }

  if (!db.students.length) {
    return (
      <div className="premium-page">
        <div className="premium-curved-box">
          <div className="premium-card-header">
            <h2 className="premium-card-title">
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>💰</span>
              Fees
            </h2>
          </div>
          <div style={{ color: 'rgba(255, 255, 255, 0.55)' }}>Please add students first.</div>
        </div>
      </div>
    )
  }

  const student = db.students.find((s) => s.id === studentId) ?? null

  return (
    <div className="premium-page">
      <div className="premium-curved-box">
        <div className="premium-card-header">
          <h2 className="premium-card-title">
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>💰</span>
            Fee Management
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

        <div className="premium-grid premium-grid-2" style={{ marginTop: '1.5rem' }}>
          <div className="premium-stat-card">
            <div className="premium-stat-value">₹{dueTotal.toLocaleString()}</div>
            <div className="premium-stat-label">Total Due</div>
          </div>
          <div className="premium-stat-card">
            <div className="premium-stat-value">{pendingCount}</div>
            <div className="premium-stat-label">Pending Records</div>
          </div>
        </div>

        <div className="premium-divider" />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button type="button" className="premium-btn" onClick={() => setAddOpen(true)}>
            <span>➕</span>
            Add Fee Entry
          </button>
        </div>

        <div className="premium-table-container">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Month</th>
                <th>Due</th>
                <th>Paid</th>
                <th>Status</th>
                <th style={{ width: 260 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.map((f) => {
                const isPaid = f.amountDue > 0 && f.amountPaid >= f.amountDue
                return (
                  <tr key={f.id}>
                    <td><span className="premium-badge premium-badge-primary">{f.month}</span></td>
                    <td>₹{f.amountDue.toLocaleString()}</td>
                    <td>₹{f.amountPaid.toLocaleString()}</td>
                    <td>
                      <span className={`premium-badge ${isPaid ? 'premium-badge-success' : 'premium-badge-warning'}`}>
                        {isPaid ? 'Paid' : 'Pending'}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="premium-btn premium-btn-secondary premium-btn-sm"
                          onClick={() => {
                            const now = toLocalISODate(new Date())
                            actions.upsertFee({
                              ...f,
                              amountPaid: isPaid ? 0 : f.amountDue,
                              status: isPaid ? 'Pending' : 'Paid',
                              updatedAt: now,
                            })
                          }}
                        >
                          {isPaid ? 'Mark Unpaid' : 'Mark Paid'}
                        </button>
                        <button
                          type="button"
                          className="premium-btn premium-btn-danger premium-btn-sm"
                          onClick={() => {
                            const ok = window.confirm(`Delete fee entry for ${f.month}?`)
                            if (!ok) return
                            actions.deleteFee(f.id)
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}

              {fees.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255, 255, 255, 0.55)' }}>
                    No fee records for {student?.fullName ?? 'this student'}. Add one above.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={addOpen}
        title="Add Fee Entry"
        onClose={() => setAddOpen(false)}
        footer={
          <>
            <button type="button" className="premium-btn premium-btn-secondary" onClick={() => setAddOpen(false)}>
              Cancel
            </button>
            <button type="button" className="premium-btn" onClick={submitAdd}>
              Add
            </button>
          </>
        }
      >
        <div className="premium-grid premium-grid-2">
          <div className="premium-form-group">
            <label className="premium-label">Fee Month</label>
            <input
              className="premium-input"
              value={form.month}
              onChange={(e) => setForm((p) => ({ ...p, month: e.target.value }))}
              placeholder="2026-04"
            />
          </div>
          <div className="premium-form-group">
            <label className="premium-label">Amount Due (INR)</label>
            <input className="premium-input" value={form.amountDue} onChange={(e) => setForm((p) => ({ ...p, amountDue: e.target.value }))} />
          </div>
          <div className="premium-form-group" style={{ gridColumn: 'span 2' }}>
            <label className="premium-label">Notes (optional)</label>
            <textarea
              className="premium-textarea"
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

