import React, { useState } from 'react'
import { 
  Settings as SettingsIcon, 
  User, 
  Bell, 
  Palette, 
  Database,
  Shield,
  Save,
  Moon,
  Sun
} from 'lucide-react'
import { useTask } from '../context/TaskContext'

function Settings() {
  const { user } = useTask()
  const [settings, setSettings] = useState({
    // Profile settings
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    
    // Notification settings
    emailNotifications: true,
    pushNotifications: false,
    weeklyDigest: true,
    deadlineReminders: true,
    
    // Appearance settings
    darkMode: false,
    compactView: false,
    
    // Privacy settings
    profileVisibility: 'private',
    dataSharing: false
  })

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log('Saving settings:', settings)
    alert('Settings saved successfully!')
  }

  const SettingSection = ({ icon: Icon, title, children }) => (
    <div className="card mb-6">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center">
          <Icon className="w-5 h-5 text-gray-600 mr-3" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  )

  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-nusblue"></div>
      </label>
    </div>
  )

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <SettingsIcon className="w-8 h-8 text-gray-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        </div>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <SettingSection icon={User} title="Profile">
        <div className="space-y-4">
          <div className="flex items-center space-x-4 mb-6">
            <img 
              src={settings.avatar} 
              alt="Profile" 
              className="w-16 h-16 rounded-full object-cover"
            />
            <button className="btn-secondary">
              Change Photo
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={settings.name}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={settings.email}
                onChange={handleInputChange}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </SettingSection>

      {/* Notification Settings */}
      <SettingSection icon={Bell} title="Notifications">
        <div className="space-y-2">
          <ToggleSwitch
            checked={settings.emailNotifications}
            onChange={(e) => handleInputChange({ target: { name: 'emailNotifications', type: 'checkbox', checked: e.target.checked }})}
            label="Email Notifications"
            description="Receive notifications via email"
          />
          <ToggleSwitch
            checked={settings.pushNotifications}
            onChange={(e) => handleInputChange({ target: { name: 'pushNotifications', type: 'checkbox', checked: e.target.checked }})}
            label="Push Notifications"
            description="Receive browser push notifications"
          />
          <ToggleSwitch
            checked={settings.weeklyDigest}
            onChange={(e) => handleInputChange({ target: { name: 'weeklyDigest', type: 'checkbox', checked: e.target.checked }})}
            label="Weekly Digest"
            description="Get a weekly summary of your tasks"
          />
          <ToggleSwitch
            checked={settings.deadlineReminders}
            onChange={(e) => handleInputChange({ target: { name: 'deadlineReminders', type: 'checkbox', checked: e.target.checked }})}
            label="Deadline Reminders"
            description="Remind me before task deadlines"
          />
        </div>
      </SettingSection>

      {/* Appearance Settings */}
      <SettingSection icon={Palette} title="Appearance">
        <div className="space-y-4">
          <ToggleSwitch
            checked={settings.darkMode}
            onChange={(e) => handleInputChange({ target: { name: 'darkMode', type: 'checkbox', checked: e.target.checked }})}
            label="Dark Mode"
            description="Use dark theme throughout the application"
          />
          <ToggleSwitch
            checked={settings.compactView}
            onChange={(e) => handleInputChange({ target: { name: 'compactView', type: 'checkbox', checked: e.target.checked }})}
            label="Compact View"
            description="Show more content in less space"
          />
        </div>
      </SettingSection>

      {/* Privacy Settings */}
      <SettingSection icon={Shield} title="Privacy & Security">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Profile Visibility
            </label>
            <select
              name="profileVisibility"
              value={settings.profileVisibility}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="public">Public</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          
          <ToggleSwitch
            checked={settings.dataSharing}
            onChange={(e) => handleInputChange({ target: { name: 'dataSharing', type: 'checkbox', checked: e.target.checked }})}
            label="Anonymous Data Sharing"
            description="Help improve the app by sharing anonymous usage data"
          />
        </div>
      </SettingSection>

      {/* Data Management */}
      <SettingSection icon={Database} title="Data Management">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Export Data</p>
              <p className="text-sm text-gray-500">Download all your tasks and data</p>
            </div>
            <button className="btn-secondary">
              Export
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
            <div>
              <p className="font-medium text-red-900">Delete Account</p>
              <p className="text-sm text-red-600">Permanently delete your account and all data</p>
            </div>
            <button className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50">
              Delete
            </button>
          </div>
        </div>
      </SettingSection>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn-primary">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </button>
      </div>
    </div>
  )
}

export default Settings