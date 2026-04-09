import { useState } from 'react'

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: 'Admin User',
    email: 'admin@sms.com',
    role: 'Administrator',
    department: 'Student Management',
    phone: '+91 98765 43210',
    joinDate: '2024-01-15',
    address: '123 Education Street, Learning City, 560001',
    bio: 'Experienced administrator managing student records and academic operations with a focus on efficiency and student success.'
  })

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSave = () => {
    setIsEditing(false)
    // Here you would typically save to backend
  }

  const handleCancel = () => {
    setIsEditing(false)
    // Reset to original values
  }

  return (
    <div className="premium-page">
      <div className="premium-grid">
        {/* Profile Header Card */}
        <div className="premium-glass-box" style={{ gridColumn: 'span 2' }}>
          <div className="premium-card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div className="premium-avatar premium-avatar-xl">
                {profileData.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 className="premium-card-title" style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>
                  {profileData.name}
                </h2>
                <p className="premium-card-subtitle">
                  {profileData.role} • {profileData.department}
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {isEditing ? (
                <>
                  <button className="premium-btn" onClick={handleSave}>
                    <span>💾</span>
                    Save Changes
                  </button>
                  <button className="premium-btn premium-btn-ghost" onClick={handleCancel}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="premium-btn premium-btn-secondary" onClick={() => setIsEditing(true)}>
                  <span>✏️</span>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information Card */}
        <div className="premium-curved-box" style={{ gridColumn: 'span 2' }}>
          <div className="premium-card-header">
            <h3 className="premium-card-title">
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📋</span>
              Personal Information
            </h3>
          </div>

          <div className="premium-grid premium-grid-2">
            <div className="premium-form-group">
              <label className="premium-label">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  className="premium-input"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter your full name"
                />
              ) : (
                <div style={{ 
                  padding: '0.75rem 1rem', 
                  background: 'rgba(51, 65, 85, 0.5)', 
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.95)'
                }}>
                  {profileData.name}
                </div>
              )}
            </div>

            <div className="premium-form-group">
              <label className="premium-label">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  className="premium-input"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter your email"
                />
              ) : (
                <div style={{ 
                  padding: '0.75rem 1rem', 
                  background: 'rgba(51, 65, 85, 0.5)', 
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.95)'
                }}>
                  {profileData.email}
                </div>
              )}
            </div>

            <div className="premium-form-group">
              <label className="premium-label">Role</label>
              {isEditing ? (
                <select
                  className="premium-select"
                  value={profileData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Staff">Staff</option>
                  <option value="Principal">Principal</option>
                </select>
              ) : (
                <div style={{ 
                  padding: '0.75rem 1rem', 
                  background: 'rgba(51, 65, 85, 0.5)', 
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.95)'
                }}>
                  {profileData.role}
                </div>
              )}
            </div>

            <div className="premium-form-group">
              <label className="premium-label">Department</label>
              {isEditing ? (
                <input
                  type="text"
                  className="premium-input"
                  value={profileData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="Enter your department"
                />
              ) : (
                <div style={{ 
                  padding: '0.75rem 1rem', 
                  background: 'rgba(51, 65, 85, 0.5)', 
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.95)'
                }}>
                  {profileData.department}
                </div>
              )}
            </div>

            <div className="premium-form-group">
              <label className="premium-label">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  className="premium-input"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                />
              ) : (
                <div style={{ 
                  padding: '0.75rem 1rem', 
                  background: 'rgba(51, 65, 85, 0.5)', 
                  borderRadius: '12px',
                  fontSize: '0.875rem',
                  color: 'rgba(255, 255, 255, 0.95)'
                }}>
                  {profileData.phone}
                </div>
              )}
            </div>

            <div className="premium-form-group">
              <label className="premium-label">Join Date</label>
              <div style={{ 
                padding: '0.75rem 1rem', 
                background: 'rgba(51, 65, 85, 0.5)', 
                borderRadius: '12px',
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.75)'
              }}>
                {new Date(profileData.joinDate).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </div>

          <div className="premium-form-group">
            <label className="premium-label">Address</label>
            {isEditing ? (
              <textarea
                className="premium-textarea"
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                placeholder="Enter your address"
                rows={2}
              />
            ) : (
              <div style={{ 
                padding: '0.75rem 1rem', 
                background: 'rgba(51, 65, 85, 0.5)', 
                borderRadius: '12px',
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.95)',
                lineHeight: '1.5'
              }}>
                {profileData.address}
              </div>
            )}
          </div>

          <div className="premium-form-group">
            <label className="premium-label">Bio</label>
            {isEditing ? (
              <textarea
                className="premium-textarea"
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself"
                rows={3}
              />
            ) : (
              <div style={{ 
                padding: '0.75rem 1rem', 
                background: 'rgba(51, 65, 85, 0.5)', 
                borderRadius: '12px',
                fontSize: '0.875rem',
                color: 'rgba(255, 255, 255, 0.95)',
                lineHeight: '1.6'
              }}>
                {profileData.bio}
              </div>
            )}
          </div>
        </div>

        {/* Account Settings Card */}
        <div className="premium-curved-box">
          <div className="premium-card-header">
            <h3 className="premium-card-title">
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>⚙️</span>
              Account Settings
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button className="premium-btn premium-btn-ghost" style={{ justifyContent: 'flex-start' }}>
              <span>🔐</span>
              Change Password
            </button>
            <button className="premium-btn premium-btn-ghost" style={{ justifyContent: 'flex-start' }}>
              <span>🔔</span>
              Notification Preferences
            </button>
            <button className="premium-btn premium-btn-ghost" style={{ justifyContent: 'flex-start' }}>
              <span>🔒</span>
              Privacy Settings
            </button>
            <button className="premium-btn premium-btn-ghost" style={{ justifyContent: 'flex-start' }}>
              <span>📤</span>
              Export Data
            </button>
            <button className="premium-btn premium-btn-ghost" style={{ justifyContent: 'flex-start' }}>
              <span>🌐</span>
              Language & Region
            </button>
          </div>
        </div>

        {/* Activity Statistics Card */}
        <div className="premium-curved-box">
          <div className="premium-card-header">
            <h3 className="premium-card-title">
              <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📊</span>
              Activity Statistics
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="premium-stat-value">1,234</div>
              <div className="premium-stat-label">Students Managed</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div className="premium-stat-value">456</div>
              <div className="premium-stat-label">Attendance Records</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div className="premium-stat-value">789</div>
              <div className="premium-stat-label">Fee Entries Processed</div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div className="premium-stat-value">98.5%</div>
              <div className="premium-stat-label">Data Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
