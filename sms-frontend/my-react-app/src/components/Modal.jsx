import '../styles/premium-design.css'
import '../styles/premium-components.css'

export default function Modal({ open, title, onClose, children, footer }) {
  if (!open) return null

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1050,
        padding: '2rem',
        animation: 'fadeIn 0.3s ease-out'
      }}
      onMouseDown={onClose} 
      role="dialog" 
      aria-modal="true"
    >
      <div 
        className="premium-curved-box"
        style={{ 
          maxWidth: '600px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          animation: 'scaleIn 0.3s ease-out',
          onMouseDown: (e) => e.stopPropagation()
        }}
      >
        <div className="premium-card-header">
          <h3 className="premium-card-title">{title}</h3>
          <button 
            type="button" 
            style={{ 
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.55)',
              fontSize: '1.25rem',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '8px',
              transition: 'all 0.2s ease'
            }}
            onClick={onClose} 
            aria-label="Close"
            onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            ✕
          </button>
        </div>

        <div style={{ padding: '0 0 1.5rem 0' }}>{children}</div>

        {footer ? (
          <div style={{ 
            display: 'flex', 
            gap: '0.75rem', 
            justifyContent: 'flex-end',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}

