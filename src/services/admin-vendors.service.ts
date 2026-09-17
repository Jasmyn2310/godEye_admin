import { apiClient } from './api-client';
import type { AdminVendorDetail, AdminVendorListItem } from '../types/vendor.types';

export const adminVendorsService = {
  async getVendors(token?: string): Promise<AdminVendorListItem[]> {
    return apiClient.get<AdminVendorListItem[]>('/admin/vendors', { token });
  },

  async getVendorDetail(vendorId: string, token?: string): Promise<AdminVendorDetail> {
    return apiClient.get<AdminVendorDetail>(`/admin/vendors/${vendorId}`, { token });
  },
};
