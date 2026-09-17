import { useState } from 'react';
import type {
  CreatePlanPayload,
  PlanTargetRole,
  SubscriptionPlan,
  UpdatePlanPayload,
} from '../../../types/subscription.types';

interface SubscriptionModalProps {
  initialData?: SubscriptionPlan | null;
  defaultRole?: PlanTargetRole;
  onSave: (payload: CreatePlanPayload | UpdatePlanPayload) => Promise<void>;
  onClose: () => void;
}

export const SubscriptionModal = ({
  initialData,
  defaultRole = 'vendor',
  onSave,
  onClose,
}: SubscriptionModalProps) => {
  const [name, setName] = useState<string>(initialData?.name ?? '');
  const [price, setPrice] = useState<string>(
    initialData ? initialData.price.toString() : '',
  );
  const [description, setDescription] = useState<string>(
    initialData?.description ?? '',
  );
  const [targetRole, setTargetRole] = useState<PlanTargetRole>(
    initialData?.targetRole ?? defaultRole,
  );
  const [durationDays, setDurationDays] = useState<string>(
    initialData ? initialData.durationDays.toString() : '30',
  );
  const [isPopular, setIsPopular] = useState<boolean>(
    initialData?.isPopular ?? false,
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const parsedPrice = parseFloat(price);
    if (!name.trim()) {
      setFormError('El nombre del plan es obligatorio');
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      setFormError('Ingrese un precio válido en Soles');
      return;
    }
    if (!description.trim()) {
      setFormError('La descripción del plan es requerida');
      return;
    }

    const parsedDays = parseInt(durationDays, 10);

    try {
      setIsSubmitting(true);
      await onSave({
        name: name.trim(),
        price: parsedPrice,
        description: description.trim(),
        targetRole,
        durationDays: isNaN(parsedDays) ? 30 : parsedDays,
        isPopular,
      });
      onClose();
    } catch (err: unknown) {
      setFormError(
        err instanceof Error ? err.message : 'Error al procesar el plan',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-lg shadow-xl text-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <h2 className="text-lg font-bold text-white tracking-tight">
            {initialData ? 'Editar Plan de Suscripción' : 'Nuevo Plan de Suscripción'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white px-2 py-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            Cerrar
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {formError && (
            <div className="p-3 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-md">
              {formError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Nombre del Plan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Plan Vendedor Pro"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Precio (S/)
              </label>
              <input
                type="number"
                step="0.10"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Duración (Días)
              </label>
              <input
                type="number"
                min="1"
                value={durationDays}
                onChange={(e) => setDurationDays(e.target.value)}
                placeholder="30"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Público Destinatario
            </label>
            <select
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value as PlanTargetRole)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-white focus:outline-none focus:border-blue-500"
            >
              <option value="vendor">Vendedores y Comercios</option>
              <option value="client">Usuarios y Clientes Generales</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Descripción y Beneficios
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Detalla los beneficios separados por comas..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-md text-white placeholder-slate-600 focus:outline-none focus:border-blue-500"
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              id="isPopularToggle"
              checked={isPopular}
              onChange={(e) => setIsPopular(e.target.checked)}
              className="w-4 h-4 rounded-md border-slate-700 bg-slate-950 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isPopularToggle" className="text-sm text-slate-300 font-medium">
              Marcar como plan popular o destacado
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-400 hover:text-white bg-slate-800/60 hover:bg-slate-800 rounded-md transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 rounded-md transition-colors shadow-sm"
            >
              {isSubmitting
                ? 'Procesando...'
                : initialData
                ? 'Guardar Cambios'
                : 'Crear Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
