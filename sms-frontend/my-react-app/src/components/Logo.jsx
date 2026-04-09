export default function Logo({ size = 40, showText = true }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 4px 12px rgba(168, 85, 247, 0.3))' }}
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
          <linearGradient id="bookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle cx="20" cy="20" r="18" fill="url(#logoGradient)" />
        
        {/* Book/graduation cap icon */}
        <g transform="translate(8, 10)">
          {/* Book base */}
          <rect x="2" y="8" width="20" height="12" rx="1" fill="url(#bookGradient)" />
          
          {/* Book pages */}
          <rect x="4" y="10" width="16" height="8" rx="0.5" fill="#f8fafc" opacity="0.9" />
          
          {/* Graduation cap */}
          <path d="M12 2 L22 6 L12 10 L2 6 Z" fill="#f8fafc" />
          <path d="M12 10 L12 14" stroke="#f8fafc" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 8 L8 11.5 C8 12.3 8.8 13 9.5 13 L14.5 13 C15.2 13 16 12.3 16 11.5 L16 8" 
                stroke="#f8fafc" strokeWidth="1.5" fill="none" />
        </g>
        
        {/* Decorative dots */}
        <circle cx="8" cy="8" r="1.5" fill="#f8fafc" opacity="0.6" />
        <circle cx="32" cy="32" r="1.5" fill="#f8fafc" opacity="0.6" />
        <circle cx="32" cy="8" r="1" fill="#f8fafc" opacity="0.4" />
        <circle cx="8" cy="32" r="1" fill="#f8fafc" opacity="0.4" />
      </svg>
      
      {showText && (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ 
            fontSize: `${size * 0.4}px`, 
            fontWeight: '800', 
            color: '#f8fafc',
            lineHeight: '1.1',
            letterSpacing: '-0.02em'
          }}>
            SMS
          </span>
          <span style={{ 
            fontSize: `${size * 0.25}px`, 
            color: '#cbd5e1',
            lineHeight: '1.1',
            fontWeight: '500'
          }}>
            Student Management
          </span>
        </div>
      )}
    </div>
  )
}
