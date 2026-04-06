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
      <div className="smsPage">
        <div className="smsCard">
          <div className="smsCardHeader">
            <h2 className="smsCardTitle">Fees</h2>
          </div>
          <div className="smsMuted">Please add students first.</div>
        </div>
      </div>
    )
  }

  const student = db.students.find((s) => s.id === studentId) ?? null

  return (
    <div className="smsPage">
      <div className="smsCard">
        <div className="smsCardHeader">
          <h2 className="smsCardTitle">Fee Management</h2>
          <div className="smsRow">
            <div className="smsField" style={{ minWidth: 320 }}>
              <div className="smsLabel">Student</div>
              <select className="smsSelect" value={studentId} onChange={(e) => setStudentId(e.target.value)}>
                {db.students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.rollNumber} - {s.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="smsRow" style={{ marginTop: 8 }}>
          <div>
            <div className="smsLabel">Total Due</div>
            <div style={{ fontSize: 24, fontWeight: 900 }}>₹ {dueTotal.toLocaleString()}</div>
          </div>
          <div>
            <div className="smsLabel">Pending Records</div>
            <div style={{ fontSize: 24, fontWeight: 900 }}>{pendingCount}</div>
          </div>
        </div>

        <div className="smsDivider" />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10, gap: 10, flexWrap: 'wrap' }}>
          <button type="button" className="smsBtn" onClick={() => setAddOpen(true)}>
            + Add Fee Entry
          </button>
        </div>

        <div className="smsTableWrap">
          <table className="smsTable">
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
                    <td>{f.month}</td>
                    <td>₹ {f.amountDue.toLocaleString()}</td>
                    <td>₹ {f.amountPaid.toLocaleString()}</td>
                    <td>
                      <span className={`smsBadge ${isPaid ? 'smsBadgeOk' : 'smsBadgeWarn'}`}>{isPaid ? 'Paid' : 'Pending'}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          className="smsBtn smsBtnSecondary"
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
                          className="smsBtn smsBtnDanger"
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
                  <td colSpan={5} style={{ padding: 16, opacity: 0.85 }}>
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
            <button type="button" className="smsBtn smsBtnSecondary" onClick={() => setAddOpen(false)}>
              Cancel
            </button>
            <button type="button" className="smsBtn" onClick={submitAdd}>
              Add
            </button>
          </>
        }
      >
        <div className="smsRow">
          <div className="smsField" style={{ flex: '1 1 220px' }}>
            <div className="smsLabel">Fee Month</div>
            <input
              className="smsInput"
              value={form.month}
              onChange={(e) => setForm((p) => ({ ...p, month: e.target.value }))}
              placeholder="2026-04"
            />
          </div>
          <div className="smsField" style={{ flex: '1 1 220px' }}>
            <div className="smsLabel">Amount Due (INR)</div>
            <input className="smsInput" value={form.amountDue} onChange={(e) => setForm((p) => ({ ...p, amountDue: e.target.value }))} />
          </div>
          <div className="smsField" style={{ flex: '1 1 100%' }}>
            <div className="smsLabel">Notes (optional)</div>
            <textarea
              className="smsTextArea smsInput"
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
            />
          </div>
        </div>
      </Modal>
    </div>
  )
}

