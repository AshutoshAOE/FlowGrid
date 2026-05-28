import { apiClient } from './client';

export const warehouseService = {
  getAll: () => apiClient.get('/warehouses'),
  getById: (id: string) => apiClient.get(`/warehouses/${id}`),
  create: (data: any) => apiClient.post('/warehouses', data),
  update: (id: string, data: any) => apiClient.patch(`/warehouses/${id}`, data),
  delete: (id: string) => apiClient.delete(`/warehouses/${id}`),
};

export const productService = {
  getAll: () => apiClient.get('/products'),
  getById: (id: string) => apiClient.get(`/products/${id}`),
  create: (data: any) => apiClient.post('/products', data),
  update: (id: string, data: any) => apiClient.patch(`/products/${id}`, data),
  delete: (id: string) => apiClient.delete(`/products/${id}`),
};

export const inventoryService = {
  getAll: (warehouseId?: string) => apiClient.get('/inventory', { params: { warehouseId } }),
  adjust: (data: any) => apiClient.post('/inventory/adjust', data),
  reserve: (data: any) => apiClient.post('/inventory/reserve', data),
  release: (data: any) => apiClient.post('/inventory/release', data),
  deduct: (data: any) => apiClient.post('/inventory/deduct', data),
};

export const driverService = {
  create: (data: any) => apiClient.post('/drivers', data),
  getAll: () => apiClient.get('/drivers'),
  getAvailable: () => apiClient.get('/drivers/available'),
  getById: (id: string) => apiClient.get(`/drivers/${id}`),
  update: (id: string, data: any) => apiClient.patch(`/drivers/${id}`, data),
  delete: (id: string) => apiClient.delete(`/drivers/${id}`),
};

export const shipmentService = {
  create: (data: any) => apiClient.post('/shipments', data),
  getAll: () => apiClient.get('/shipments'),
  getById: (id: string) => apiClient.get(`/shipments/${id}`),
  optimize: (id: string) => apiClient.post(`/shipments/${id}/optimize`),
  assignDriver: (id: string, data: { driverId: string }) => apiClient.post(`/shipments/${id}/assign-driver`, data),
  releaseDriver: (id: string) => apiClient.post(`/shipments/${id}/release-driver`),
  startTransit: (id: string) => apiClient.post(`/shipments/${id}/transit`),
  deliver: (id: string) => apiClient.post(`/shipments/${id}/deliver`),
  cancel: (id: string) => apiClient.post(`/shipments/${id}/cancel`),
};

export const routingService = {
  calculateRoute: (data: { origin: {lat: number, lng: number}, destination: {lat: number, lng: number} }) => 
    apiClient.post('/routing/calculate', data),
  calculateETA: (data: { origin: {lat: number, lng: number}, destination: {lat: number, lng: number} }) => 
    apiClient.post('/routing/eta', data),
  geocode: (address: string) => 
    apiClient.post('/routing/geocode', { address }),
};

export const dashboardService = {
  getMetrics: () => apiClient.get('/dashboard/metrics'),
};

export const aiService = {
  getOperationalInsights: () => apiClient.post('/ai/insights/operational'),
  getInventoryInsights: () => apiClient.post('/ai/insights/inventory'),
  getDispatchInsights: () => apiClient.post('/ai/insights/dispatch'),
  queryOperations: (query: string) => apiClient.post('/ai/query', { query }),
};
