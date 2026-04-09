import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="premium-page">
      <div className="premium-curved-box">
        <div className="premium-card-header">
          <h2 className="premium-card-title">
            <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>🔍</span>
            Page not found
          </h2>
        </div>
        <div style={{ color: 'rgba(255, 255, 255, 0.55)' }}>The page you are looking for does not exist.</div>
        <div style={{ marginTop: '1.5rem' }}>
          <Link className="premium-btn premium-btn-secondary" to="/">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

