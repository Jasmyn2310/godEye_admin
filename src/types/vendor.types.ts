export interface AdminVendorListItem {
  id: string;
  email: string;
  name: string | null;
  photoUrl: string | null;
  vendorType: string | null;
  priceRange: string | null;
  phone: string | null;
  description: string | null;
  fixedAddress: string | null;
  fixedLatitude: number | null;
  fixedLongitude: number | null;
  role: string;
  createdAt: string;
  totalProducts: number;
  totalSalesCount: number;
  totalRevenue: number;
}

export interface AdminVendorProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  imageUrl: string | null;
  isAvailable: boolean;
  categoryName: string | null;
}

export interface AdminVendorPromotion {
  id: string;
  title: string;
  description: string;
  discountPercent: number | null;
  promoPrice: number | null;
  isActive: boolean;
  validUntil: string | null;
}

export interface AdminVendorSale {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  notes: string | null;
  createdAt: string;
}

export interface AdminVendorDevice {
  id: string;
  name: string;
  batteryLevel: number | null;
  status: string;
  lastConnection: string | null;
  currentLat: number | null;
  currentLng: number | null;
}

export interface AdminVendorDetail {
  id: string;
  email: string;
  name: string | null;
  photoUrl: string | null;
  vendorType: string | null;
  priceRange: string | null;
  phone: string | null;
  description: string | null;
  fixedAddress: string | null;
  fixedLatitude: number | null;
  fixedLongitude: number | null;
  role: string;
  createdAt: string;
  device: AdminVendorDevice | null;
  categories: { id: string; name: string }[];
  products: AdminVendorProduct[];
  promotions: AdminVendorPromotion[];
  recentSales: AdminVendorSale[];
}
