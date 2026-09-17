import { useMemo, useState, useEffect } from 'react';
import { adminVendorsService } from '../../../services/admin-vendors.service';
import type { AdminVendorListItem } from '../../../types/vendor.types';
import { VendorDetailModal } from './VendorDetailModal';

interface VendorListProps {
  token: string;
}

export const VendorList = ({ token }: VendorListProps) => {
  const [vendors, setVendors] = useState<AdminVendorListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedVendorId, setSelectedVendorId] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const fetchVendors = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminVendorsService.getVendors(token);
        if (isMounted) {
          setVendors(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar lista de vendedores');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVendors();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const filteredVendors = useMemo(() => {
    return vendors.filter((vendor) => {
      const matchesSearch =
        (vendor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
        vendor.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (vendor.phone?.includes(searchQuery) ?? false) ||
        (vendor.vendorType?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

      const matchesType =
        typeFilter === 'all' ||
        (vendor.vendorType?.toLowerCase() === typeFilter.toLowerCase());

      return matchesSearch && matchesType;
    });
  }, [vendors, searchQuery, typeFilter]);

  const summaryStats = useMemo(() => {
    const totalVendors = vendors.length;
    const totalProducts = vendors.reduce((acc, v) => acc + v.totalProducts, 0);
    const totalSalesVolume = vendors.reduce((acc, v) => acc + v.totalRevenue, 0);
    return { totalVendors, totalProducts, totalSalesVolume };
  }, [vendors]);

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Directorio de Vendedores</h1>
          <p className="text-slate-400 mt-1">Supervisión, productos y métricas de comercios registrados</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm relative overflow-hidden">
          <p className="text-slate-400 text-sm font-medium mb-1">Comercios Totales</p>
          <p className="text-3xl font-bold text-white">{summaryStats.totalVendors}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm relative overflow-hidden">
          <p className="text-slate-400 text-sm font-medium mb-1">Catálogo Global de Productos</p>
          <p className="text-3xl font-bold text-white">{summaryStats.totalProducts}</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-sm relative overflow-hidden">
          <p className="text-slate-400 text-sm font-medium mb-1">Volumen de Ventas Declaradas</p>
          <p className="text-3xl font-bold text-emerald-400 font-mono">
            S/ {summaryStats.totalSalesVolume.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <svg
              className="absolute left-3.5 top-3.5 w-5 h-5 text-slate-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Buscar por nombre, email o teléfono..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-400 font-medium">Filtrar por:</span>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="all">Todos los tipos</option>
              <option value="comida">Comida / Snacks</option>
              <option value="bebidas">Bebidas</option>
              <option value="postres">Postres</option>
              <option value="ambulante">Ambulante</option>
              <option value="fijo">Puesto Fijo</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                <th className="p-4 font-semibold">Vendedor</th>
                <th className="p-4 font-semibold">Tipo / Rango</th>
                <th className="p-4 font-semibold">Contacto</th>
                <th className="p-4 font-semibold">Productos</th>
                <th className="p-4 font-semibold">Ventas</th>
                <th className="p-4 font-semibold">Registro</th>
                <th className="p-4 font-semibold text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <div className="inline-flex items-center gap-3">
                      <div className="w-5 h-5 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                      <span>Cargando directorio de vendedores...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    No se encontraron vendedores registrados que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor) => (
                  <tr key={vendor.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/20 shrink-0">
                          {vendor.name ? vendor.name.charAt(0).toUpperCase() : 'V'}
                        </div>
                        <div>
                          <p className="font-semibold text-white leading-tight">
                            {vendor.name || 'Sin nombre'}
                          </p>
                          <p className="text-xs text-slate-500 font-mono mt-0.5">{vendor.email}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {vendor.vendorType || 'Comercio'}
                        </span>
                        {vendor.priceRange && (
                          <p className="text-xs text-slate-500">{vendor.priceRange}</p>
                        )}
                      </div>
                    </td>

                    <td className="p-4">
                      <p className="text-slate-200 text-xs font-medium">
                        {vendor.phone || 'Sin registrar'}
                      </p>
                      {vendor.fixedAddress && (
                        <p className="text-[11px] text-slate-500 truncate max-w-[160px]">
                          {vendor.fixedAddress}
                        </p>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-300">
                        {vendor.totalProducts} items
                      </span>
                    </td>

                    <td className="p-4">
                      <div>
                        <p className="font-semibold text-emerald-400 text-xs font-mono">
                          S/ {Number(vendor.totalRevenue).toFixed(2)}
                        </p>
                        <p className="text-[11px] text-slate-500">{vendor.totalSalesCount} órdenes</p>
                      </div>
                    </td>

                    <td className="p-4 font-mono text-xs text-slate-500">
                      {new Date(vendor.createdAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedVendorId(vendor.id)}
                        className="px-3 py-1.5 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 hover:text-blue-300 rounded-md text-xs font-medium border border-blue-500/20 transition-colors"
                      >
                        Inspeccionar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedVendorId && (
        <VendorDetailModal
          vendorId={selectedVendorId}
          token={token}
          onClose={() => setSelectedVendorId(null)}
        />
      )}
    </div>
  );
};
