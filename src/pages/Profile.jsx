import React, { useEffect, useState } from 'react';

const Profile = ({ navigate, user, isLoggedIn }) => {
  const [showEdit, setShowEdit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editUsername, setEditUsername] = useState(user?.username || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [editMsg, setEditMsg] = useState('');
  const [editErr, setEditErr] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwMsg, setPwMsg] = useState('');
  const [pwErr, setPwErr] = useState('');

  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('login');
    }
  }, [isLoggedIn, user, navigate]);

  if (!user) return null;

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setEditMsg(''); setEditErr('');
    try {
      const res = await fetch(`http://localhost:4000/api/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: editUsername, email: editEmail })
      });
      const data = await res.json();
      if (data.success) {
        setEditMsg('Profile updated!');
        // Optionally update user info in parent state (App)
        user.username = editUsername;
        user.email = editEmail;
        setShowEdit(false);
      } else {
        setEditErr(data.message || 'Update failed');
      }
    } catch (err) {
      setEditErr('Update failed. Please try again.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwMsg(''); setPwErr('');
    try {
      const res = await fetch(`http://localhost:4000/api/user/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        setPwMsg('Password changed!');
        setShowPassword(false);
        setOldPassword('');
        setNewPassword('');
      } else {
        setPwErr(data.message || 'Password change failed');
      }
    } catch (err) {
      setPwErr('Password change failed. Please try again.');
    }
  };

  return (
    <div className="profile">
      {/* Header */}
      <div className="profile-header">
        <div className="profile-header-content">
          <h1 className="profile-title">Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="profile-content">
        <div className="profile-container">
          {/* Profile Header */}
          <div className="profile-banner">
            <div className="profile-avatar">
              <div className="profile-avatar-image">
                <span>{user.username ? user.username[0].toUpperCase() : '?'}</span>
              </div>
              <div className="profile-info">
                <h2>{user.username}</h2>
                <p>Member</p>
                {/* You can add more user info here */}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="profile-details">
            <h3 className="profile-details-title">Account Information</h3>
            <div className="profile-details-list">
              <div className="profile-details-item">
                <span className="profile-details-label">Username</span>
                <span className="profile-details-value">{user.username}</span>
              </div>
              <div className="profile-details-item">
                <span className="profile-details-label">Email</span>
                <span className="profile-details-value">{user.email}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="profile-actions">
            <button className="profile-action-button" onClick={() => setShowEdit((v) => !v)}>
              Edit Profile
            </button>
            <button className="profile-action-button profile-action-button-secondary" onClick={() => setShowPassword((v) => !v)}>
              Change Password
            </button>
          </div>

          {/* Edit Profile Form */}
          {showEdit && (
            <form onSubmit={handleEditProfile} style={{ marginTop: '1rem', background: '#222', padding: '1rem', borderRadius: '0.5rem' }}>
              <h4>Edit Profile</h4>
              {editErr && <div style={{ color: 'red' }}>{editErr}</div>}
              {editMsg && <div style={{ color: 'green' }}>{editMsg}</div>}
              <div style={{ marginBottom: '0.5rem' }}>
                <label>Username: </label>
                <input value={editUsername} onChange={e => setEditUsername(e.target.value)} required />
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <label>Email: </label>
                <input value={editEmail} onChange={e => setEditEmail(e.target.value)} required />
              </div>
              <button type="submit" className="profile-action-button">Save</button>
              <button type="button" className="profile-action-button profile-action-button-secondary" onClick={() => setShowEdit(false)} style={{ marginLeft: '1rem' }}>Cancel</button>
            </form>
          )}

          {/* Change Password Form */}
          {showPassword && (
            <form onSubmit={handleChangePassword} style={{ marginTop: '1rem', background: '#222', padding: '1rem', borderRadius: '0.5rem' }}>
              <h4>Change Password</h4>
              {pwErr && <div style={{ color: 'red' }}>{pwErr}</div>}
              {pwMsg && <div style={{ color: 'green' }}>{pwMsg}</div>}
              <div style={{ marginBottom: '0.5rem' }}>
                <label>Old Password: </label>
                <input type="password" value={oldPassword} onChange={e => setOldPassword(e.target.value)} required />
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <label>New Password: </label>
                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
              </div>
              <button type="submit" className="profile-action-button">Change</button>
              <button type="button" className="profile-action-button profile-action-button-secondary" onClick={() => setShowPassword(false)} style={{ marginLeft: '1rem' }}>Cancel</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
