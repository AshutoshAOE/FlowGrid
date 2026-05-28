import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { driverService, routingService } from '../../services/api/domainApi';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { Power, MapPin } from 'lucide-react';

export function Drivers() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    vehicleType: '',
    vehicleCapacity: '',
    currentLocation: ''
  });
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await driverService.getAll();
      setData(response.data || []);
    } catch (error) {
      console.error('Failed to fetch drivers', error);
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
    setIsGeocoding(true);
    try {
      let currentCoordinates;
      if (formData.currentLocation) {
        try {
          const geocodeRes = await routingService.geocode(formData.currentLocation);
          if (geocodeRes.data) {
            currentCoordinates = { lat: geocodeRes.data.lat, lng: geocodeRes.data.lng };
          }
        } catch (geoErr) {
          console.warn('Geocoding failed for driver location', geoErr);
        }
      }
      setIsGeocoding(false);

      await driverService.create({
        fullName: formData.fullName,
        phone: formData.phone,
        vehicleType: formData.vehicleType,
        vehicleCapacity: Number(formData.vehicleCapacity),
        currentCoordinates
      });
      setIsModalOpen(false);
      setFormData({ fullName: '', phone: '', vehicleType: '', vehicleCapacity: '', currentLocation: '' });
      fetchData();
    } catch (error: any) {
      console.error('Failed to create driver', error);
      alert(error.response?.data?.message || 'Failed to register driver');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleDriverStatus = async (driver: any) => {
    const newStatus = driver.status === 'OFFLINE' ? 'AVAILABLE' : 'OFFLINE';
    try {
      await driverService.update(driver._id, { status: newStatus });
      fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update driver status');
    }
  };

  const columns = [
    { header: 'Driver Name', accessor: (row: any) => (
        <div className="flex items-center gap-2">
          <span>{row.fullName}</span>
          {row.currentCoordinates?.lat && <MapPin size={12} className="text-red-400" title={`Lat: ${row.currentCoordinates.lat}, Lng: ${row.currentCoordinates.lng}`} />}
        </div>
      )},
      { header: 'Phone', accessor: 'phone' as const },
      { header: 'Vehicle', accessor: (row: any) => `${row.vehicleType} (Cap: ${row.vehicleCapacity})` },
    { 
      header: 'Status', 
      accessor: (row: any) => <StatusBadge type="driver" status={row.status} />
    },
    {
      header: 'Actions',
      accessor: (row: any) => {
        // Only allow toggling between OFFLINE and AVAILABLE
        // If driver is ASSIGNED or IN_TRANSIT, don't show toggle
        const canToggle = row.status === 'OFFLINE' || row.status === 'AVAILABLE';
        if (!canToggle) return <span className="text-[10px] text-white/25 italic">On duty</span>;
        
        return (
          <button
            onClick={() => toggleDriverStatus(row)}
            className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-lg border transition-all ${
              row.status === 'OFFLINE' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20' 
                : 'bg-orange-500/10 text-orange-400 border-orange-500/20 hover:bg-orange-500/20'
            }`}
          >
            <Power size={12} />
            {row.status === 'OFFLINE' ? 'Go Online' : 'Go Offline'}
          </button>
        );
      }
    }
  ];

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Drivers & Fleet" 
        description="Manage your operational drivers and vehicle resources."
        actionLabel="Register Driver"
        onAction={() => setIsModalOpen(true)}
      />
      <DataTable columns={columns} data={data} isLoading={isLoading} emptyMessage="No drivers found in the fleet." />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Register Fleet Driver"
        description="Add a new driver resource to your logistics operations."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Full Name</label>
            <input 
              required type="text" 
              value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Contact Phone</label>
            <input 
              required type="tel" 
              value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Current Location (Optional)</label>
            <input 
              type="text" placeholder="e.g. Pune or Mumbai"
              value={formData.currentLocation} onChange={e => setFormData({...formData, currentLocation: e.target.value})}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-4 mt-2">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Vehicle Type</label>
              <select 
                required 
                value={formData.vehicleType} onChange={e => setFormData({...formData, vehicleType: e.target.value})}
                className="w-full bg-[#0d0d0d] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
              >
                <option value="">Select Type</option>
                <option value="Van">Van</option>
                <option value="Light Truck">Light Truck</option>
                <option value="Heavy Truck">Heavy Truck</option>
                <option value="Refrigerated">Refrigerated</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Capacity (kg)</label>
              <input 
                required type="number" min="1" 
                value={formData.vehicleCapacity} onChange={e => setFormData({...formData, vehicleCapacity: e.target.value})}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 mt-4">
            <button 
              type="button" 
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting || isGeocoding}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-lg shadow-red-900/20 hover:from-red-500 hover:to-red-600 disabled:opacity-50 transition-all"
            >
              {isGeocoding ? '📍 Resolving...' : isSubmitting ? 'Registering...' : 'Register Driver'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
