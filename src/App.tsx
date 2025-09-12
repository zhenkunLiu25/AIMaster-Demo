import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'calendar' | 'settings'>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'calendar':
        return (
          <div style={{ 
            padding: '2rem',
            textAlign: 'center',
            background: '#f9fafb',
            minHeight: 'calc(100vh - 56px)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
              📅 Calendar View
            </h2>
            <p style={{ color: '#6b7280' }}>Calendar integration coming soon...</p>
          </div>
        );
      case 'settings':
        return (
          <div style={{ 
            padding: '2rem',
            textAlign: 'center',
            background: '#f9fafb',
            minHeight: 'calc(100vh - 56px)'
          }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#1f2937' }}>
              ⚙️ Settings
            </h2>
            <p style={{ color: '#6b7280' }}>Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <Provider store={store}>
      <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        {renderView()}
      </div>
    </Provider>
  );
}

export default App;
