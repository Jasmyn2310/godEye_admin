import { useEffect, useRef, useState } from 'react';
import { adminVendorsService } from '../../../services/admin-vendors.service';
import type { AdminVendorListItem } from '../../../types/vendor.types';

interface LiveMapProps {
  token: string;
}

interface LeafletWindow extends Window {
  L?: {
    map: (element: HTMLElement, options?: Record<string, unknown>) => LeafletMapInstance;
    tileLayer: (url: string, options?: Record<string, unknown>) => LeafletTileLayer;
    marker: (coords: [number, number], options?: Record<string, unknown>) => LeafletMarker;
    divIcon: (options: Record<string, unknown>) => unknown;
  };
}

interface LeafletTileLayer {
  addTo: (map: LeafletMapInstance) => LeafletTileLayer;
}

interface LeafletMarker {
  addTo: (map: LeafletMapInstance) => LeafletMarker;
  bindPopup: (html: string) => LeafletMarker;
  openPopup: () => LeafletMarker;
}

interface LeafletMapInstance {
  setView: (coords: [number, number], zoom: number) => LeafletMapInstance;
  flyTo: (coords: [number, number], zoom: number) => LeafletMapInstance;
  remove: () => void;
}

export const LiveMap = ({ token }: LiveMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMapInstance | null>(null);
  const markersRef = useRef<LeafletMarker[]>([]);

  const [vendors, setVendors] = useState<AdminVendorListItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'fixed' | 'mobile'>('all');
  const [selectedVendor, setSelectedVendor] = useState<AdminVendorListItem | null>(null);
  const [leafletReady, setLeafletReady] = useState<boolean>(false);

  useEffect(() => {
    const customWindow = window as unknown as LeafletWindow;
    if (customWindow.L) {
      setLeafletReady(true);
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      setLeafletReady(true);
    };
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    let isMounted = true;
    const loadVendors = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await adminVendorsService.getVendors(token);
        if (isMounted) {
          setVendors(data);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Error al cargar telemetría de vendedores');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadVendors();

    return () => {
      isMounted = false;
    };
  }, [token]);

  const geolocatedVendors = vendors.filter((v) => {
    const lat = Number(v.fixedLatitude);
    const lng = Number(v.fixedLongitude);
    const hasCoords = !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0;

    if (!hasCoords) return false;
    if (filterType === 'fixed') return Boolean(v.fixedAddress);
    if (filterType === 'mobile') return !v.fixedAddress;
    return true;
  });

  useEffect(() => {
    const customWindow = window as unknown as LeafletWindow;
    if (!leafletReady || !customWindow.L || !mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const defaultCenter: [number, number] = [-13.1631, -74.2236];
      const initialMap = customWindow.L.map(mapContainerRef.current, {
        zoomControl: true,
      }).setView(defaultCenter, 13);

      customWindow.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(initialMap);

      mapInstanceRef.current = initialMap;
    }

    const currentMap = mapInstanceRef.current;

    markersRef.current = [];

    if (geolocatedVendors.length > 0) {
      geolocatedVendors.forEach((vendor) => {
        const lat = Number(vendor.fixedLatitude);
        const lng = Number(vendor.fixedLongitude);

        const popupContent = `
          <div style="color: #0f172a; font-family: sans-serif; min-width: 180px; padding: 4px;">
            <p style="font-weight: bold; margin: 0 0 4px 0; font-size: 14px;">${vendor.name || 'Comercio GodEyes'}</p>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #475569;">${vendor.vendorType || 'Comercio'}</p>
            <p style="margin: 0 0 4px 0; font-size: 12px; font-weight: 600; color: #059669;">Ventas: S/ ${Number(vendor.totalRevenue).toFixed(2)}</p>
            <p style="margin: 0; font-size: 11px; color: #64748b;">${vendor.fixedAddress || 'Puesto móvil en ruta'}</p>
          </div>
        `;

        if (customWindow.L) {
          const marker = customWindow.L.marker([lat, lng])
            .addTo(currentMap)
            .bindPopup(popupContent);

          markersRef.current.push(marker);
        }
      });

      const first = geolocatedVendors[0];
      currentMap.setView([Number(first.fixedLatitude), Number(first.fixedLongitude)], 13);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [leafletReady, geolocatedVendors]);

  const handleSelectVendor = (vendor: AdminVendorListItem) => {
    setSelectedVendor(vendor);
    if (!mapInstanceRef.current) return;

    const lat = Number(vendor.fixedLatitude);
    const lng = Number(vendor.fixedLongitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      mapInstanceRef.current.flyTo([lat, lng], 16);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Mapa en Tiempo Real</h1>
          <p className="text-slate-400 mt-1">
            Visualización georreferenciada de vendedores y puestos de comercio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filterType === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setFilterType('fixed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filterType === 'fixed'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Puestos Fijos
          </button>
          <button
            onClick={() => setFilterType('mobile')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filterType === 'mobile'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Ambulantes
          </button>
        </div>
      </header>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-sm flex flex-col h-[650px] relative">
          {!leafletReady && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/80">
              <span className="text-sm font-medium text-slate-400">
                Iniciando servicio cartográfico OpenStreetMap...
              </span>
            </div>
          )}
          <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col h-[650px] overflow-hidden">
          <div className="pb-3 border-b border-slate-800">
            <h2 className="text-base font-bold text-white tracking-tight">Comercios en Radar</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {geolocatedVendors.length} comercios con señal GPS
            </p>
          </div>

          <div className="flex-1 overflow-y-auto py-3 space-y-2">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-500">
                Cargando posiciones geográficas...
              </div>
            ) : geolocatedVendors.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                No hay comerciantes con coordenadas registradas bajo este filtro.
              </div>
            ) : (
              geolocatedVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  onClick={() => handleSelectVendor(vendor)}
                  className={`p-3 rounded-md border text-left cursor-pointer transition-all ${
                    selectedVendor?.id === vendor.id
                      ? 'bg-blue-600/15 border-blue-500/40 text-white'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-800/40 text-slate-300'
                  }`}
                >
                  <p className="font-semibold text-sm text-white line-clamp-1">
                    {vendor.name || 'Sin nombre comercial'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{vendor.vendorType || 'Comercio'}</p>
                  <p className="text-xs font-bold text-emerald-400 mt-1 font-mono">
                    Ventas: S/ {Number(vendor.totalRevenue).toFixed(2)}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 truncate">
                    {vendor.fixedAddress || 'Puesto móvil en ruta'}
                  </p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectVendor(vendor);
                    }}
                    className="mt-2 w-full py-1 text-[11px] font-medium text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-md transition-colors"
                  >
                    Ubicar en Mapa
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
