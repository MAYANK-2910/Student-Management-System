import './modal.css'

export default function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null

  return (
    <div className="smsModalOverlay" onMouseDown={onClose} role="dialog" aria-modal="true">
      <div className="smsModal" onMouseDown={(e) => e.stopPropagation()}>
        <div className="smsModalHeader">
          <div className="smsModalTitle">{title}</div>
          <button type="button" className="smsIconBtn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        <div className="smsModalBody">{children}</div>

        {footer ? <div className="smsModalFooter">{footer}</div> : null}
      </div>
    </div>
  )
}

