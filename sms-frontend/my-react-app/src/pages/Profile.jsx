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
    bio: 'Experienced administrator managing student records and academic operations.'
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
    <div className="smsPage">
      <div className="smsGrid">
        {/* Profile Information Card */}
        <div className="smsCard" style={{ gridColumn: 'span 2' }}>
          <div className="smsCardHeader">
            <h2 className="smsCardTitle">Profile Information</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              {isEditing ? (
                <>
                  <button className="smsBtn" onClick={handleSave}>
                    Save
                  </button>
                  <button className="smsBtn smsBtnSecondary" onClick={handleCancel}>
                    Cancel
                  </button>
                </>
              ) : (
                <button className="smsBtn smsBtnSecondary" onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="smsRow" style={{ marginBottom: '20px' }}>
            <div className="smsField" style={{ minWidth: '200px' }}>
              <label className="smsLabel">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  className="smsInput"
                  value={profileData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                />
              ) : (
                <div style={{ fontSize: '16px', fontWeight: '600' }}>{profileData.name}</div>
              )}
            </div>

            <div className="smsField" style={{ minWidth: '200px' }}>
              <label className="smsLabel">Email Address</label>
              {isEditing ? (
                <input
                  type="email"
                  className="smsInput"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                />
              ) : (
                <div style={{ fontSize: '14px' }}>{profileData.email}</div>
              )}
            </div>

            <div className="smsField" style={{ minWidth: '150px' }}>
              <label className="smsLabel">Role</label>
              {isEditing ? (
                <select
                  className="smsSelect"
                  value={profileData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Teacher">Teacher</option>
                  <option value="Staff">Staff</option>
                </select>
              ) : (
                <div className="smsBadge smsBadgeOk">{profileData.role}</div>
              )}
            </div>
          </div>

          <div className="smsRow" style={{ marginBottom: '20px' }}>
            <div className="smsField" style={{ minWidth: '200px' }}>
              <label className="smsLabel">Department</label>
              {isEditing ? (
                <input
                  type="text"
                  className="smsInput"
                  value={profileData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                />
              ) : (
                <div style={{ fontSize: '14px' }}>{profileData.department}</div>
              )}
            </div>

            <div className="smsField" style={{ minWidth: '150px' }}>
              <label className="smsLabel">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  className="smsInput"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              ) : (
                <div style={{ fontSize: '14px' }}>{profileData.phone}</div>
              )}
            </div>

            <div className="smsField" style={{ minWidth: '150px' }}>
              <label className="smsLabel">Join Date</label>
              <div style={{ fontSize: '14px' }}>{profileData.joinDate}</div>
            </div>
          </div>

          <div className="smsField" style={{ marginBottom: '20px' }}>
            <label className="smsLabel">Address</label>
            {isEditing ? (
              <textarea
                className="smsTextArea"
                value={profileData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={2}
              />
            ) : (
              <div style={{ fontSize: '14px' }}>{profileData.address}</div>
            )}
          </div>

          <div className="smsField">
            <label className="smsLabel">Bio</label>
            {isEditing ? (
              <textarea
                className="smsTextArea"
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={3}
              />
            ) : (
              <div style={{ fontSize: '14px', lineHeight: '1.5' }}>{profileData.bio}</div>
            )}
          </div>
        </div>

        {/* Account Settings Card */}
        <div className="smsCard">
          <div className="smsCardHeader">
            <h2 className="smsCardTitle">Account Settings</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button className="smsBtn smsBtnSecondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              Change Password
            </button>
            <button className="smsBtn smsBtnSecondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              Notification Preferences
            </button>
            <button className="smsBtn smsBtnSecondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              Privacy Settings
            </button>
            <button className="smsBtn smsBtnSecondary" style={{ width: '100%', justifyContent: 'flex-start' }}>
              Export Data
            </button>
          </div>
        </div>

        {/* Statistics Card */}
        <div className="smsCard">
          <div className="smsCardHeader">
            <h2 className="smsCardTitle">Activity Statistics</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '900' }}>1,234</div>
              <div className="smsMuted">Students Managed</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '900' }}>456</div>
              <div className="smsMuted">Attendance Records</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '900' }}>789</div>
              <div className="smsMuted">Fee Entries Processed</div>
            </div>
            <div>
              <div style={{ fontSize: '20px', fontWeight: '900' }}>98.5%</div>
              <div className="smsMuted">Data Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
