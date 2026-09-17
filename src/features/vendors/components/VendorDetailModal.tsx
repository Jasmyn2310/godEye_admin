import { useEffect, useState } from 'react';
import { adminVendorsService } from '../../../services/admin-vendors.service';
import type { AdminVendorDetail } from '../../../types/vendor.types';

interface VendorDetailModalProps {
  vendorId: string;
  token: string;
  onClose: () => void;
}

type ModalTab = 'overview' | 'products' | 'promotions' | 'sales';

export const VendorDetailModal = ({ vendorId, token, onClose }: VendorDetailModalProps) => {
  const [detail, setDetail] = useState<AdminVendorDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ModalTab>('overview');

  useEffect(() => {
    let isMounted = true;
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminVendorsService.getVendorDetail(vendorId, token);
        if (isMounted) {
          setDetail(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar los detalles');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [vendorId, token]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/30">
              {detail?.name ? detail.name.charAt(0).toUpperCase() : 'V'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                {detail?.name || 'Detalle del Vendedor'}
              </h2>
              <p className="text-xs text-slate-400 font-mono">{detail?.email || vendorId}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Resumen General
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Productos ({detail?.products.length ?? 0})
          </button>
          <button
            onClick={() => setActiveTab('promotions')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'promotions'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Promociones ({detail?.promotions.length ?? 0})
          </button>
          <button
            onClick={() => setActiveTab('sales')}
            className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'sales'
                ? 'border-blue-500 text-blue-400 font-semibold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Ventas Registradas ({detail?.recentSales.length ?? 0})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 space-y-3">
              <div className="w-10 h-10 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
              <p className="text-sm text-slate-400 font-medium">Cargando expediente del vendedor...</p>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          {!loading && detail && (
            <>
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-3">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                        Datos del Comercio
                      </h3>
                      <div>
                        <span className="text-xs text-slate-500 block">Nombre Comercial</span>
                        <p className="text-white font-medium">{detail.name || 'Sin especificar'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Tipo de Vendedor</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 mt-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          {detail.vendorType || 'No categorizado'}
                        </span>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Rango de Precios</span>
                        <p className="text-slate-300 text-sm">{detail.priceRange || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Descripción</span>
                        <p className="text-slate-300 text-sm">{detail.description || 'Sin descripción registrada'}</p>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800 space-y-3">
                      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                        Ubicación y Contacto
                      </h3>
                      <div>
                        <span className="text-xs text-slate-500 block">Teléfono / WhatsApp</span>
                        <p className="text-white font-medium">{detail.phone || 'Sin teléfono'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Dirección Fija</span>
                        <p className="text-slate-300 text-sm">{detail.fixedAddress || 'No tiene puesto fijo'}</p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Coordenadas Base</span>
                        <p className="text-slate-400 text-xs font-mono">
                          {detail.fixedLatitude && detail.fixedLongitude
                            ? `${detail.fixedLatitude}, ${detail.fixedLongitude}`
                            : 'Sin coordenadas'}
                        </p>
                      </div>
                      <div>
                        <span className="text-xs text-slate-500 block">Fecha de Registro</span>
                        <p className="text-slate-400 text-xs font-mono">
                          {new Date(detail.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-950/60 p-5 rounded-xl border border-slate-800">
                    <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
                      Telemetría y Dispositivo
                    </h3>
                    {detail.device ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <span className="text-xs text-slate-500 block">Dispositivo</span>
                          <p className="text-white font-medium text-sm">{detail.device.name}</p>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 block">Estado</span>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            detail.device.status === 'online'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-slate-800 text-slate-400'
                          }`}>
                            {detail.device.status}
                          </span>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 block">Batería</span>
                          <p className="text-white font-medium text-sm">
                            {detail.device.batteryLevel !== null ? `${detail.device.batteryLevel}%` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <span className="text-xs text-slate-500 block">Última Conexión</span>
                          <p className="text-slate-400 text-xs font-mono">
                            {detail.device.lastConnection
                              ? new Date(detail.device.lastConnection).toLocaleTimeString()
                              : 'Desconocido'}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No hay dispositivo móvil o GPS vinculado a esta cuenta.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div>
                  {detail.products.length === 0 ? (
                    <div className="py-12 text-center text-slate-500">
                      Este vendedor aún no ha cargado productos a su catálogo.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {detail.products.map((product) => (
                        <div
                          key={product.id}
                          className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex flex-col justify-between"
                        >
                          <div>
                            {product.imageUrl && (
                              <img
                                src={product.imageUrl}
                                alt={product.name}
                                className="w-full h-32 object-cover rounded-lg mb-3"
                              />
                            )}
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-semibold text-white text-sm">{product.name}</h4>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                product.isAvailable
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {product.isAvailable ? 'Disponible' : 'Agotado'}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                              {product.description || 'Sin descripción'}
                            </p>
                            {product.categoryName && (
                              <span className="inline-block mt-2 text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded-md">
                                {product.categoryName}
                              </span>
                            )}
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                            <span className="text-xs text-slate-500">Precio Unitario</span>
                            <span className="text-base font-bold text-emerald-400">${product.price.toFixed(2)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'promotions' && (
                <div>
                  {detail.promotions.length === 0 ? (
                    <div className="py-12 text-center text-slate-500">
                      No hay promociones u ofertas activas para este comercio.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {detail.promotions.map((promo) => (
                        <div
                          key={promo.id}
                          className="bg-slate-950/60 border border-slate-800 rounded-xl p-5 relative overflow-hidden"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-bold text-white text-base">{promo.title}</h4>
                            <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${
                              promo.isActive
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : 'bg-slate-800 text-slate-500'
                            }`}>
                              {promo.isActive ? 'Activa' : 'Expirada'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mb-4">{promo.description}</p>
                          <div className="flex items-center gap-4 text-sm font-semibold">
                            {promo.discountPercent && (
                              <span className="text-amber-400">-{promo.discountPercent}% OFF</span>
                            )}
                            {promo.promoPrice && (
                              <span className="text-emerald-400">${promo.promoPrice.toFixed(2)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'sales' && (
                <div>
                  {detail.recentSales.length === 0 ? (
                    <div className="py-12 text-center text-slate-500">
                      No se han registrado transacciones de venta recientes.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-950/80 text-xs uppercase text-slate-400">
                          <tr>
                            <th className="p-3">Fecha</th>
                            <th className="p-3">Producto</th>
                            <th className="p-3">Cantidad</th>
                            <th className="p-3">Precio Unitario</th>
                            <th className="p-3">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                          {detail.recentSales.map((sale) => (
                            <tr key={sale.id} className="hover:bg-slate-800/20">
                              <td className="p-3 text-xs text-slate-400 font-mono">
                                {new Date(sale.createdAt).toLocaleDateString()}
                              </td>
                              <td className="p-3 text-white font-medium">{sale.productName}</td>
                              <td className="p-3 text-slate-300">{sale.quantity}</td>
                              <td className="p-3 text-slate-400">${sale.unitPrice.toFixed(2)}</td>
                              <td className="p-3 font-bold text-emerald-400">${sale.totalAmount.toFixed(2)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
