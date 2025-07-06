import React, { useState } from 'react';

const Settings = ({ navigate }) => {
  const [settings, setSettings] = useState({
    theme: 'dark',
    autoplay: true,
    subtitles: false,
    quality: '1080p',
    notifications: true
  });



  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="settings">
      {/* Header */}
      <div className="settings-header">
        <div className="settings-header-content">
          <h1 className="settings-title">Settings</h1>
        </div>
      </div>

      {/* Settings Content */}
      <div className="settings-content">
        <div className="settings-container">
          {/* Playback Settings */}
          <div className="settings-section">
            <h3 className="settings-section-title">Playback Settings</h3>
            <div className="settings-list">
              <div className="settings-item">
                <div className="settings-item-info">
                  <span className="settings-item-label">Autoplay</span>
                  <p className="settings-item-description">Automatically play next episode</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.autoplay}
                    onChange={(e) => handleSettingChange('autoplay', e.target.checked)}
                  />
                  <div className="toggle-slider"></div>
                </label>
              </div>
              
              <div className="settings-item">
                <div className="settings-item-info">
                  <span className="settings-item-label">Subtitles</span>
                  <p className="settings-item-description">Show subtitles by default</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.subtitles}
                    onChange={(e) => handleSettingChange('subtitles', e.target.checked)}
                  />
                  <div className="toggle-slider"></div>
                </label>
              </div>
              
              <div className="settings-item">
                <div className="settings-item-info">
                  <span className="settings-item-label">Video Quality</span>
                  <p className="settings-item-description">Preferred streaming quality</p>
                </div>
                <select
                  value={settings.quality}
                  onChange={(e) => handleSettingChange('quality', e.target.value)}
                  className="settings-select"
                >
                  <option value="720p">720p</option>
                  <option value="1080p">1080p</option>
                  <option value="4K">4K</option>
                </select>
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="settings-section">
            <h3 className="settings-section-title">Account Settings</h3>
            <div className="settings-list">
              <div className="settings-item">
                <div className="settings-item-info">
                  <span className="settings-item-label">Theme</span>
                  <p className="settings-item-description">Choose your preferred theme</p>
                </div>
                <select
                  value={settings.theme}
                  onChange={(e) => handleSettingChange('theme', e.target.value)}
                  className="settings-select"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              
              <div className="settings-item">
                <div className="settings-item-info">
                  <span className="settings-item-label">Notifications</span>
                  <p className="settings-item-description">Receive email notifications</p>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={settings.notifications}
                    onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                  />
                  <div className="toggle-slider"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="settings-actions">
            <button className="settings-action-button">
              Save Settings
            </button>
            <button className="settings-action-button settings-action-button-secondary">
              Reset to Default
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
