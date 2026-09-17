import { useCallback, useEffect, useState } from 'react';
import { subscriptionsService } from '../../../services/subscriptions.service';
import type {
  CreatePlanPayload,
  PlanTargetRole,
  SubscriptionPlan,
  UpdatePlanPayload,
} from '../../../types/subscription.types';
import { SubscriptionModal } from './SubscriptionModal';

interface SubscriptionsManagerProps {
  token: string;
}

export const SubscriptionsManager = ({ token }: SubscriptionsManagerProps) => {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<PlanTargetRole>('vendor');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [deletingPlanId, setDeletingPlanId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await subscriptionsService.getPlans(token);
      setPlans(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los planes');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleSavePlan = async (payload: CreatePlanPayload | UpdatePlanPayload) => {
    if (editingPlan) {
      await subscriptionsService.updatePlan(token, editingPlan.id, payload);
    } else {
      await subscriptionsService.createPlan(token, payload as CreatePlanPayload);
    }
    await fetchPlans();
  };

  const handleDeletePlan = async () => {
    if (!deletingPlanId) return;
    try {
      setIsDeleting(true);
      await subscriptionsService.deletePlan(token, deletingPlanId);
      setDeletingPlanId(null);
      await fetchPlans();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el plan');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPlans = plans.filter((plan) => (plan.targetRole || 'vendor') === activeTab);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Gestión de Suscripciones</h1>
          <p className="text-slate-400 mt-1">Configura y administra los niveles de membresía en Soles</p>
        </div>
        <button
          onClick={() => {
            setEditingPlan(null);
            setIsModalOpen(true);
          }}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm rounded-md transition-colors shadow-sm self-start md:self-auto"
        >
          Nuevo Plan
        </button>
      </header>

      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('vendor')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'vendor'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Planes para Vendedores
        </button>
        <button
          onClick={() => setActiveTab('client')}
          className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
            activeTab === 'client'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Planes para Usuarios y Clientes
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/60 text-slate-400 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Nombre del Plan</th>
                <th className="p-4 font-semibold">Precio (PEN)</th>
                <th className="p-4 font-semibold">Duración</th>
                <th className="p-4 font-semibold">Destinatario</th>
                <th className="p-4 font-semibold">Categoría</th>
                <th className="p-4 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-sm text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500 font-medium">
                    Cargando catálogo de membresías...
                  </td>
                </tr>
              ) : filteredPlans.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-slate-500">
                    No se encontraron planes configurados para este tipo de usuario.
                  </td>
                </tr>
              ) : (
                filteredPlans.map((plan) => (
                  <tr key={plan.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-white">{plan.name}</p>
                        <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-sm">
                          {plan.description}
                        </p>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-emerald-400 font-mono text-base">
                      S/ {Number(plan.price).toFixed(2)}
                    </td>
                    <td className="p-4 text-slate-300 font-medium">
                      {plan.durationDays || 30} días
                    </td>
                    <td className="p-4">
                      <span className="inline-block px-2.5 py-1 text-xs font-medium rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        {plan.targetRole === 'client' ? 'Cliente General' : 'Vendedor'}
                      </span>
                    </td>
                    <td className="p-4">
                      {plan.isPopular ? (
                        <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          Destacado
                        </span>
                      ) : (
                        <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-md bg-slate-800/80 text-slate-400 border border-slate-700">
                          Estándar
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingPlan(plan);
                            setIsModalOpen(true);
                          }}
                          className="px-3 py-1.5 text-xs font-medium text-blue-400 hover:text-white bg-blue-500/10 hover:bg-blue-600 rounded-md transition-colors"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeletingPlanId(plan.id)}
                          className="px-3 py-1.5 text-xs font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 rounded-md transition-colors"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <SubscriptionModal
          initialData={editingPlan}
          defaultRole={activeTab}
          onSave={handleSavePlan}
          onClose={() => {
            setIsModalOpen(false);
            setEditingPlan(null);
          }}
        />
      )}

      {deletingPlanId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-4 shadow-xl text-slate-200">
            <h3 className="text-lg font-bold text-white tracking-tight">Confirmar Eliminación</h3>
            <p className="text-sm text-slate-400">
              ¿Estás seguro de que deseas eliminar este plan de suscripción? Esta acción no se puede deshacer.
            </p>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setDeletingPlanId(null)}
                className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-md transition-colors"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeletePlan}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-md transition-colors"
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar Plan'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
