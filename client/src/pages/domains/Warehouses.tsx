import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { warehouseService } from '../../services/api/domainApi';
import { Modal } from '../../components/ui/Modal';

export function Warehouses() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    storageCapacity: '',
    lat: '',
    lng: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await warehouseService.getAll();
      setData(response.data || []);
    } catch (error) {
      console.error('Failed to fetch warehouses', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload: any = {
        name: formData.name,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip
        },
        storageCapacity: Number(formData.storageCapacity)
      };
      if (formData.lat && formData.lng) {
        payload.coordinates = { lat: Number(formData.lat), lng: Number(formData.lng) };
      }
      await warehouseService.create(payload);
      setIsModalOpen(false);
      setFormData({ name: '', street: '', city: '', state: '', zip: '', storageCapacity: '', lat: '', lng: '' });
      fetchData();
    } catch (error: any) {
      console.error('Failed to create warehouse', error);
      alert(error.response?.data?.message || 'Failed to create warehouse');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: 'Name', accessor: 'name' as const },
    { 
      header: 'Address', 
      accessor: (row: any) => `${row.address.street}, ${row.address.city}, ${row.address.state} ${row.address.zip}` 
    },
    { header: 'Capacity', accessor: 'storageCapacity' as const },
    { 
      header: 'Status', 
      accessor: (row: any) => (
        <span className={`px-2 inline-flex text-[10px] leading-5 font-semibold rounded ${row.isActive ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
          {row.isActive ? 'ACTIVE' : 'INACTIVE'}
        </span>
      )
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Warehouses" 
        description="Manage your operational facilities and storage locations."
        actionLabel="Add Warehouse"
        onAction={() => setIsModalOpen(true)}
      />
      <DataTable columns={columns} data={data} isLoading={isLoading} emptyMessage="No warehouses found. Create one to get started." />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Create New Warehouse"
        description="Register a new operational facility to your logistics network."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Facility Name</label>
            <input 
              required type="text" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-white/70 mb-1">Street Address</label>
              <input 
                required type="text" 
                value={formData.street} onChange={e => setFormData({...formData, street: e.target.value})}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">City</label>
              <input 
                required type="text" 
                value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">State / Region</label>
              <input 
                required type="text" 
                value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">ZIP / Postal Code</label>
              <input 
                required type="text" 
                value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Storage Capacity (Units)</label>
              <input 
                required type="number" min="1" 
                value={formData.storageCapacity} onChange={e => setFormData({...formData, storageCapacity: e.target.value})}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
              />
            </div>
          </div>
          <div className="border-t border-white/[0.06] pt-4 mt-2">
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">GPS Coordinates (for Route Intelligence)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Latitude</label>
                <input 
                  type="number" step="0.0001" placeholder="e.g. 21.1458" 
                  value={formData.lat} onChange={e => setFormData({...formData, lat: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1">Longitude</label>
                <input 
                  type="number" step="0.0001" placeholder="e.g. 79.0882"
                  value={formData.lng} onChange={e => setFormData({...formData, lng: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
                />
              </div>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-lg shadow-red-900/20 hover:from-red-500 hover:to-red-600 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Creating...' : 'Register Warehouse'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
