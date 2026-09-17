import { useState } from 'react';

export type NavigationTab = 'dashboard' | 'vendors' | 'subscriptions' | 'map';

interface SidebarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  onLogout: () => void;
}

export const Sidebar = ({ currentTab, onTabChange, onLogout }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <aside
      className={`bg-slate-900 border-r border-slate-800 flex flex-col h-screen text-slate-300 shrink-0 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800">
        {!isCollapsed && (
          <span className="text-white font-bold text-lg tracking-tight">
            GodEyes
          </span>
        )}

        <button
          type="button"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors mx-auto"
          aria-label={isCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
          title={isCollapsed ? 'Expandir menú lateral' : 'Colapsar menú lateral'}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3">
        <ul className="space-y-2">
          <li>
            {isCollapsed ? (
              <button
                type="button"
                onClick={() => onTabChange('dashboard')}
                title="Dashboard"
                className={`w-full flex items-center justify-center p-3 rounded-md transition-colors ${
                  currentTab === 'dashboard'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onTabChange('dashboard')}
                className={`w-full text-left px-4 py-3 rounded-md font-medium text-sm transition-colors ${
                  currentTab === 'dashboard'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Dashboard
              </button>
            )}
          </li>

          <li>
            {isCollapsed ? (
              <button
                type="button"
                onClick={() => onTabChange('vendors')}
                title="Vendedores y Comercios"
                className={`w-full flex items-center justify-center p-3 rounded-md transition-colors ${
                  currentTab === 'vendors'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onTabChange('vendors')}
                className={`w-full text-left px-4 py-3 rounded-md font-medium text-sm transition-colors ${
                  currentTab === 'vendors'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Vendedores y Comercios
              </button>
            )}
          </li>

          <li>
            {isCollapsed ? (
              <button
                type="button"
                onClick={() => onTabChange('subscriptions')}
                title="Gestión de Suscripciones"
                className={`w-full flex items-center justify-center p-3 rounded-md transition-colors ${
                  currentTab === 'subscriptions'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onTabChange('subscriptions')}
                className={`w-full text-left px-4 py-3 rounded-md font-medium text-sm transition-colors ${
                  currentTab === 'subscriptions'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Gestión de Suscripciones
              </button>
            )}
          </li>

          <li>
            {isCollapsed ? (
              <button
                type="button"
                onClick={() => onTabChange('map')}
                title="Mapa en Vivo"
                className={`w-full flex items-center justify-center p-3 rounded-md transition-colors ${
                  currentTab === 'map'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onTabChange('map')}
                className={`w-full text-left px-4 py-3 rounded-md font-medium text-sm transition-colors ${
                  currentTab === 'map'
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Mapa en Vivo
              </button>
            )}
          </li>
        </ul>
      </nav>

      <div className="p-3 border-t border-slate-800">
        {isCollapsed ? (
          <button
            type="button"
            onClick={onLogout}
            title="Cerrar Sesión"
            className="w-full flex items-center justify-center p-3 text-red-400 hover:text-white hover:bg-red-600/20 rounded-md transition-colors border border-red-500/20"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={onLogout}
            className="w-full text-center py-2.5 bg-red-500/10 hover:bg-red-600/20 text-red-400 hover:text-red-300 rounded-md font-medium text-sm transition-colors border border-red-500/20"
          >
            Cerrar Sesión
          </button>
        )}
      </div>
    </aside>
  );
};
