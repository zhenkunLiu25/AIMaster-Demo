import { useState } from 'react';

interface EmailIntegrationProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EmailIntegration({ isOpen, onClose }: EmailIntegrationProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [step, setStep] = useState<'provider' | 'configure' | 'success'>('provider');

  const emailProviders = [
    {
      id: 'gmail',
      name: 'Gmail',
      icon: '📧',
      description: 'Connect your NUS Gmail account to automatically sync assignments and deadlines'
    },
    {
      id: 'outlook',
      name: 'Outlook',
      icon: '📨',
      description: 'Connect your Outlook account for seamless calendar integration'
    },
    {
      id: 'canvas',
      name: 'Canvas LMS',
      icon: '🎓',
      description: 'Sync directly with Canvas to import course assignments and due dates'
    },
    {
      id: 'luminus',
      name: 'LumiNUS',
      icon: '🏫',
      description: 'Connect to NUS LumiNUS platform for automatic task synchronization'
    }
  ];

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId);
    setStep('configure');
  };

  const handleConnect = () => {
    // In a real app, this would handle OAuth flow
    setStep('success');
    setTimeout(() => {
      onClose();
      setStep('provider');
      setSelectedProvider('');
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem',
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '0.5rem',
        width: '100%',
        maxWidth: '600px',
        maxHeight: '90vh',
        overflow: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '1.5rem 1.5rem 0 1.5rem',
          borderBottom: '1px solid #e5e7eb',
          marginBottom: '1.5rem',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              📧 Email Integration
            </h2>
            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
                color: '#6b7280',
                padding: '0.25rem',
              }}
            >
              ✕
            </button>
          </div>
        </div>

        <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
          {step === 'provider' && (
            <div>
              <p style={{ color: '#6b7280', marginBottom: '1.5rem', margin: '0 0 1.5rem 0' }}>
                Connect your email or learning management system to automatically import tasks and deadlines.
              </p>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {emailProviders.map((provider) => (
                  <div
                    key={provider.id}
                    onClick={() => handleProviderSelect(provider.id)}
                    style={{
                      padding: '1rem',
                      border: '1px solid #e5e7eb',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#003d7a';
                      e.currentTarget.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e5e7eb';
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ fontSize: '2rem' }}>{provider.icon}</div>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontWeight: '600', color: '#1f2937', margin: '0 0 0.25rem 0' }}>
                        {provider.name}
                      </h3>
                      <p style={{ color: '#6b7280', fontSize: '0.875rem', margin: 0 }}>
                        {provider.description}
                      </p>
                    </div>
                    <div style={{ color: '#6b7280', fontSize: '1.25rem' }}>→</div>
                  </div>
                ))}
              </div>

              <div style={{
                marginTop: '1.5rem',
                padding: '1rem',
                backgroundColor: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '0.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#166534' }}>🔒</span>
                  <div>
                    <h4 style={{ fontWeight: '500', color: '#166534', margin: '0 0 0.25rem 0' }}>
                      Secure Integration
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: '#166534', margin: 0 }}>
                      We use industry-standard OAuth 2.0 for secure authentication. 
                      We never store your passwords and only access the minimum required permissions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 'configure' && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                  {emailProviders.find(p => p.id === selectedProvider)?.icon}
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', margin: '0 0 0.5rem 0' }}>
                  Connect to {emailProviders.find(p => p.id === selectedProvider)?.name}
                </h3>
                <p style={{ color: '#6b7280', margin: 0 }}>
                  You'll be redirected to securely sign in to your account
                </p>
              </div>

              <div style={{
                padding: '1rem',
                backgroundColor: '#fef3c7',
                border: '1px solid #fed7aa',
                borderRadius: '0.5rem',
                marginBottom: '1.5rem',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                  <span style={{ color: '#92400e' }}>ℹ️</span>
                  <div>
                    <h4 style={{ fontWeight: '500', color: '#92400e', margin: '0 0 0.25rem 0' }}>
                      What will be synced?
                    </h4>
                    <ul style={{ fontSize: '0.875rem', color: '#92400e', margin: 0, paddingLeft: '1rem' }}>
                      <li>Assignment deadlines and due dates</li>
                      <li>Course information and names</li>
                      <li>Exam schedules and reminders</li>
                      <li>Meeting invitations and calendar events</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                  onClick={() => setStep('provider')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: '1px solid #d1d5db',
                    borderRadius: '0.375rem',
                    background: 'white',
                    color: '#374151',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={handleConnect}
                  style={{
                    padding: '0.75rem 1.5rem',
                    border: 'none',
                    borderRadius: '0.375rem',
                    background: '#003d7a',
                    color: 'white',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  🔗 Connect Account
                </button>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#166534', margin: '0 0 0.5rem 0' }}>
                Successfully Connected!
              </h3>
              <p style={{ color: '#6b7280', margin: 0 }}>
                Your tasks will now be automatically synced from {emailProviders.find(p => p.id === selectedProvider)?.name}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}