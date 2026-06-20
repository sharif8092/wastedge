import { apiClient, USE_MOCK_DB } from './client';
import { PickupRequest } from '../types';

export const getPickupRequestsWP = async (): Promise<PickupRequest[]> => {
  if (USE_MOCK_DB) {
    throw new Error('Using mock DB');
  }
  // This assumes you create a Custom Post Type called 'scrap_request' in WordPress
  const response = await apiClient('/wp/v2/scrap_request?_embed');
  
  // Transform the WordPress response into the frontend PickupRequest type
  return response.map((post: any) => ({
    id: post.id.toString(),
    customerId: post.meta.customer_id,
    vendorId: post.meta.vendor_id,
    category: post.meta.category,
    weight: post.meta.weight,
    status: post.meta.status,
    createdAt: post.date,
    address: post.meta.address,
    scheduledDate: post.meta.scheduled_date,
    photos: post.meta.photos || [],
  }));
};

export const createPickupRequestWP = async (requestData: Partial<PickupRequest>) => {
  if (USE_MOCK_DB) {
    throw new Error('Using mock DB');
  }
  return apiClient('/wp/v2/scrap_request', {
    method: 'POST',
    body: JSON.stringify({
      title: `Scrap Request - ${requestData.category}`,
      status: 'publish',
      meta: {
        customer_id: requestData.customerId,
        category: requestData.category,
        weight: requestData.weight,
        status: requestData.status,
        address: requestData.address,
        scheduled_date: requestData.scheduledDate,
        photos: requestData.photos,
      }
    }),
  });
};

export const updatePickupRequestStatusWP = async (id: string, status: PickupRequest['status'], vendorId?: string) => {
  if (USE_MOCK_DB) {
    throw new Error('Using mock DB');
  }
  return apiClient(`/wp/v2/scrap_request/${id}`, {
    method: 'POST', // WP REST API uses POST for updates to meta fields
    body: JSON.stringify({
      meta: {
        status,
        ...(vendorId ? { vendor_id: vendorId } : {})
      }
    }),
  });
};
