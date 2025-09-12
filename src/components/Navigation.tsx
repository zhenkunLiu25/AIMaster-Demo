import { useState } from 'react';

interface NavigationProps {
  currentView: 'dashboard' | 'calendar' | 'settings';
  onViewChange: (view: 'dashboard' | 'calendar' | 'settings') => void;
}

export default function Navigation({ currentView, onViewChange }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'calendar', label: 'Calendar', icon: '📅' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ] as const;

  return (
    <nav style={{ 
      background: '#003d7a', 
      color: 'white',
      padding: '0 1rem',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '56px' }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🎓</span>
            <span style={{ fontWeight: 'bold', fontSize: '1.125rem' }}>AIMaster</span>
          </div>

          {/* Desktop Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  background: currentView === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (currentView !== item.id) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentView !== item.id) {
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            
            {/* Divider */}
            <div style={{ 
              width: '1px', 
              height: '24px', 
              background: 'rgba(255,255,255,0.3)', 
              margin: '0 0.5rem' 
            }} />
            
            {/* AskMeAnything AI ChatBot */}
            <button
              onClick={() => {
                // Placeholder for future development
                alert('AskMeAnything AI ChatBot - Coming Soon!\n\nThis feature will provide intelligent assistance for:\n• Task prioritization suggestions\n• Study schedule optimization\n• Assignment help and guidance\n• Academic planning advice');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontSize: '0.875rem',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
              }}
              title="AI-powered academic assistant (Coming Soon)"
            >
              <span>🤖</span>
              <span>AskMeAnything</span>
            </button>

            {/* Login Button */}
            <button
              onClick={() => {
                // Placeholder for future development
                alert('Login Feature - Coming Soon!\n\nThis will enable:\n• User authentication\n• Personal task sync\n• Cloud storage\n• Multi-device access\n• Collaboration features');
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid #ffffff',
                background: '#ffffff',
                color: '#003d7a',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: '500',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f8fafc';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#ffffff';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
              title="User authentication (Coming Soon)"
            >
              <span>👤</span>
              <span>Login</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              border: 'none',
              background: 'transparent',
              color: 'white',
              cursor: 'pointer',
              fontSize: '1.25rem',
            }}
            className="mobile-menu-btn"
          >
            {isMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div style={{
            display: 'none',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '1rem 0',
            borderTop: '1px solid rgba(255,255,255,0.2)',
          }}
          className="mobile-menu"
          >
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onViewChange(item.id);
                  setIsMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  background: currentView === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                  color: 'white',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            
            {/* Mobile divider */}
            <div style={{ 
              height: '1px', 
              background: 'rgba(255,255,255,0.2)', 
              margin: '0.5rem 0' 
            }} />
            
            {/* Mobile AskMeAnything AI ChatBot */}
            <button
              onClick={() => {
                alert('AskMeAnything AI ChatBot - Coming Soon!\n\nThis feature will provide intelligent assistance for:\n• Task prioritization suggestions\n• Study schedule optimization\n• Assignment help and guidance\n• Academic planning advice');
                setIsMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                textAlign: 'left',
                width: '100%',
              }}
            >
              <span>🤖</span>
              <span>AskMeAnything</span>
            </button>

            {/* Mobile Login Button */}
            <button
              onClick={() => {
                alert('Login Feature - Coming Soon!\n\nThis will enable:\n• User authentication\n• Personal task sync\n• Cloud storage\n• Multi-device access\n• Collaboration features');
                setIsMenuOpen(false);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                borderRadius: '0.375rem',
                border: '1px solid #ffffff',
                background: '#ffffff',
                color: '#003d7a',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                textAlign: 'left',
                width: '100%',
                fontWeight: '500',
              }}
            >
              <span>👤</span>
              <span>Login</span>
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          .mobile-menu {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
}
