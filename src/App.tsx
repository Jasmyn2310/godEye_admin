import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Sidebar, type NavigationTab } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
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
        {currentTab === 'subscriptions' && (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-white tracking-tight">Planes de Suscripción</h1>
            <p className="text-slate-400">Configuración y estado de monetización de comerciantes</p>
            <Dashboard token={token} showOnlyPlans />
          </div>
        )}
        {currentTab === 'map' && (
          <div className="flex flex-col items-center justify-center h-[70vh] border border-dashed border-slate-800 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mb-4 border border-blue-500/20">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Mapa Central en Vivo</h2>
            <p className="text-sm text-slate-400 max-w-md">
              Próximo módulo: Visualización de telemetría y geolocalización en tiempo real vía WebSockets de todos los vendedores ambulantes y fijos.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
