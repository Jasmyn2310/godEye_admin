import { useEffect, useState } from 'react';
import { Dashboard } from './components/Dashboard';
import { Login } from './components/Login';
import { Sidebar, type NavigationTab } from './components/Sidebar';
import { LiveMap } from './features/map/components/LiveMap';
import { SubscriptionsManager } from './features/subscriptions/components/SubscriptionsManager';
import { VendorList } from './features/vendors/components/VendorList';

function App() {
  const [token, setToken] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');

  useEffect(() => {
    const savedToken = localStorage.getItem('admin_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  const handleLogin = (newToken: string) => {
    localStorage.setItem('admin_token', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
  };

  if (!token) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex h-screen bg-slate-950 text-slate-200 overflow-hidden">
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-y-auto p-8">
        {currentTab === 'dashboard' && <Dashboard token={token} />}
        {currentTab === 'vendors' && <VendorList token={token} />}
        {currentTab === 'subscriptions' && <SubscriptionsManager token={token} />}
        {currentTab === 'map' && <LiveMap token={token} />}
      </main>
    </div>
  );
}

export default App;
