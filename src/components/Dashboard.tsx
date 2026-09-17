import { useState, useEffect } from 'react';

interface PlanItem {
  id: string;
  name: string;
  price: number;
  description: string;
  isPopular: boolean;
}

interface DashboardStats {
  activeVendors: number;
  registeredDevices: number;
  monthlyRevenue: number;
}

interface DashboardProps {
  token: string;
  showOnlyPlans?: boolean;
}

export const Dashboard = ({ token, showOnlyPlans = false }: DashboardProps) => {
  const [stats, setStats] = useState<DashboardStats>({
    activeVendors: 0,
    registeredDevices: 0,
    monthlyRevenue: 0,
  });
  const [plans, setPlans] = useState<PlanItem[]>([]);

  useEffect(() => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';

    const fetchStats = async () => {
      try {
        const response = await fetch(`${baseUrl}/admin/dashboard-stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = (await response.json()) as DashboardStats;
          setStats(data);
        }
      } catch (err: unknown) {
        console.error('Failed to fetch stats', err);
      }
    };

    const fetchPlans = async () => {
      try {
        const response = await fetch(`${baseUrl}/subscriptions/plans`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = (await response.json()) as PlanItem[];
          setPlans(data);
        }
      } catch (err: unknown) {
        console.error('Failed to fetch plans', err);
      }
    };

    if (!showOnlyPlans) {
      fetchStats();
    }
    fetchPlans();
  }, [token, showOnlyPlans]);

  return (
    <div className="space-y-8">
      {!showOnlyPlans && (
        <>
          <header>
            <h1 className="text-3xl font-bold text-white tracking-tight">Vista General</h1>
            <p className="text-slate-400 mt-1">Métricas en tiempo real de GodEyes</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">Usuarios Totales</p>
              <p className="text-4xl font-bold text-white">{stats.activeVendors}</p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-500 transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" />
                </svg>
              </div>
              <p className="text-slate-400 text-sm font-medium mb-1">Dispositivos Registrados</p>
              <p className="text-4xl font-bold text-white">{stats.registeredDevices}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 border border-blue-500/50 rounded-lg p-6 shadow-lg shadow-blue-900/20 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-20 text-white transform group-hover:scale-110 transition-transform duration-300">
                <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z" />
                </svg>
              </div>
              <p className="text-blue-100 text-sm font-medium mb-1">Ingresos Mensuales</p>
              <p className="text-4xl font-bold text-white">
                S/ {stats.monthlyRevenue.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>
        </>
      )}

      <div>
        <h2 className="text-2xl font-bold text-white mb-6">Planes de Suscripción</h2>
        <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/50 text-slate-300 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">ID Plan</th>
                <th className="p-4 font-semibold">Nombre</th>
                <th className="p-4 font-semibold">Precio</th>
                <th className="p-4 font-semibold">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {plans.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    No hay planes registrados
                  </td>
                </tr>
              ) : (
                plans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4 font-mono text-xs text-slate-500">{plan.id}</td>
                    <td className="p-4 font-medium text-white">{plan.name}</td>
                    <td className="p-4 text-emerald-400 font-medium font-mono">S/ {Number(plan.price).toFixed(2)}</td>
                    <td className="p-4">
                      {plan.isPopular ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Popular
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-800 text-slate-400 border border-slate-700">
                          Estándar
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
