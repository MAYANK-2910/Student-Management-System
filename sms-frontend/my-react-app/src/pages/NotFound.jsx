import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="smsPage">
      <div className="smsCard">
        <div className="smsCardHeader">
          <h2 className="smsCardTitle">Page not found</h2>
        </div>
        <div className="smsMuted">The page you are looking for does not exist.</div>
        <div style={{ marginTop: 12 }}>
          <Link className="smsBtn smsBtnSecondary" to="/">
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}

