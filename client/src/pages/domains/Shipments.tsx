import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { shipmentService, driverService, routingService, productService } from '../../services/api/domainApi';
import { X, Map as MapIcon, Clock, Plus, Trash2, BarChart } from 'lucide-react';
import { RouteMap } from '../../components/ui/RouteMap';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { WorkflowPipeline } from '../../components/ui/WorkflowPipeline';
import { Modal } from '../../components/ui/Modal';
import { ScoringBreakdown } from '../../components/ui/ScoringBreakdown';

export function Shipments() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<any>(null);
  const [availableDrivers, setAvailableDrivers] = useState<any[]>([]);
  const [isDriversLoading, setIsDriversLoading] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{ geometry: string, etaMinutes: number, distanceKm: number } | null>(null);
  const [optimizationModalData, setOptimizationModalData] = useState<any>(null);

  // Create Shipment State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    destinationAddress: '',
    items: [{ productId: '', quantity: 1 }]
  });
  const [isGeocoding, setIsGeocoding] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await shipmentService.getAll();
      setData(response.data || []);
    } catch (error) {
      console.error('Failed to fetch shipments', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreateModal = async () => {
    setIsCreateModalOpen(true);
    try {
      const response = await productService.getAll();
      setProducts(response.data || []);
    } catch (error) {
      console.error('Failed to load products', error);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsGeocoding(true);
    try {
      const validItems = formData.items.filter(item => item.productId && item.quantity > 0);
      if (validItems.length === 0) {
        alert('Please add at least one valid product item.');
        setIsSubmitting(false);
        setIsGeocoding(false);
        return;
      }

      // Auto-geocode the destination address
      const destination: any = { address: formData.destinationAddress };
      try {
        const geocodeRes = await routingService.geocode(formData.destinationAddress);
        if (geocodeRes.data) {
          destination.coordinates = { lat: geocodeRes.data.lat, lng: geocodeRes.data.lng };
        }
      } catch (geoErr) {
        console.warn('Geocoding failed, shipment will be created without coordinates', geoErr);
      }
      setIsGeocoding(false);

      await shipmentService.create({
        destination,
        shipmentItems: validItems
      });
      setIsCreateModalOpen(false);
      setFormData({ destinationAddress: '', items: [{ productId: '', quantity: 1 }] });
      fetchData();
    } catch (error: any) {
      console.error('Failed to create shipment', error);
      alert(error.response?.data?.message || 'Failed to create shipment');
    } finally {
      setIsSubmitting(false);
      setIsGeocoding(false);
    }
  };

  const addItemRow = () => {
    setFormData({ ...formData, items: [...formData.items, { productId: '', quantity: 1 }] });
  };

  const removeItemRow = (index: number) => {
    const newItems = formData.items.filter((_, idx) => idx !== index);
    setFormData({ ...formData, items: newItems.length ? newItems : [{ productId: '', quantity: 1 }] });
  };

  const openAssignModal = async (shipment: any) => {
    setSelectedShipment(shipment);
    setAssignModalOpen(true);
    setIsDriversLoading(true);
    setRouteInfo(null);
    try {
      // Fetch available drivers
      const response = await driverService.getAvailable();
      setAvailableDrivers(response.data || []);

      // Get origin from allocation snapshot warehouse coordinates
      let originCoords = null;
      let originLabel = 'Warehouse';
      if (shipment.allocationSnapshots && shipment.allocationSnapshots.length > 0) {
        const firstAlloc = shipment.allocationSnapshots[0];
        if (firstAlloc.warehouseCoordinates?.lat && firstAlloc.warehouseCoordinates?.lng) {
          originCoords = { lat: firstAlloc.warehouseCoordinates.lat, lng: firstAlloc.warehouseCoordinates.lng };
          originLabel = firstAlloc.warehouseName || 'Warehouse';
        }
      }

      // Get destination from shipment
      const destCoords = shipment.destination?.coordinates;

      // Only calculate route if we have both real coordinates
      if (originCoords && destCoords?.lat && destCoords?.lng) {
        const routeRes = await routingService.calculateRoute({
          origin: originCoords,
          destination: destCoords
        });
        
        const etaRes = await routingService.calculateETA({
          origin: originCoords,
          destination: destCoords
        });

        setRouteInfo({
          geometry: routeRes.data.geometry,
          etaMinutes: etaRes.data.etaMinutes,
          distanceKm: Math.round(routeRes.data.distanceMeters / 100) / 10,
          originCoords,
          originLabel,
          destCoords,
        } as any);
      }
    } catch (error) {
      console.error('Failed to fetch modal data', error);
      // Non-blocking error for route failure
    } finally {
      setIsDriversLoading(false);
    }
  };

  const closeAssignModal = () => {
    setAssignModalOpen(false);
    setSelectedShipment(null);
    setAvailableDrivers([]);
    setRouteInfo(null);
  };

  const [isAssigning, setIsAssigning] = useState(false);

  const handleAssignDriver = async (driverId: string) => {
    if (!selectedShipment?._id || isAssigning) return;
    setIsAssigning(true);
    try {
      await shipmentService.assignDriver(selectedShipment._id, { driverId });
      closeAssignModal();
      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to assign driver');
    } finally {
      setIsAssigning(false);
    }
  };

  const handleWorkflowAction = async (action: string, id: string) => {
    try {
      if (action === 'optimize') await shipmentService.optimize(id);
      if (action === 'transit') await shipmentService.startTransit(id);
      if (action === 'deliver') await shipmentService.deliver(id);
      if (action === 'cancel') await shipmentService.cancel(id);
      if (action === 'release') await shipmentService.releaseDriver(id);

      await fetchData();
    } catch (error: any) {
      alert(error.response?.data?.message || `Workflow transition failed`);
    }
  };

  const columns = [
    { header: 'ID', accessor: (row: any) => row._id.slice(-6).toUpperCase() },
    { header: 'Destination', accessor: (row: any) => row.destination.address },
    { header: 'Items', accessor: (row: any) => `${row.shipmentItems.length} items` },
    { header: 'Driver', accessor: (row: any) => row.assignedDriver?.fullName || 'Unassigned' },
    { 
      header: 'Status', 
      accessor: (row: any) => <StatusBadge type="shipment" status={row.status} />
    },
    {
      header: 'Pipeline',
      accessor: (row: any) => <WorkflowPipeline currentStatus={row.status} className="w-48" />
    },
    {
      header: 'Allocations',
      accessor: (row: any) => {
        if (!row.allocationSnapshots || row.allocationSnapshots.length === 0) {
          return <span className="text-white/20 text-xs italic">Pending</span>;
        }
        return (
          <div className="flex flex-col space-y-1">
            {row.allocationSnapshots.map((alloc: any, idx: number) => (
              <button 
                key={idx} 
                onClick={() => { if (alloc.optimizationMetadata) setOptimizationModalData(alloc.optimizationMetadata) }}
                className={`text-[10px] bg-white/[0.03] border border-white/[0.06] rounded px-1.5 py-1 text-left flex items-center justify-between transition-all ${alloc.optimizationMetadata ? 'hover:border-red-500/30 hover:text-white text-white/60 cursor-pointer group' : 'text-white/40'}`}
              >
                <span>{alloc.quantity} units from {alloc.warehouseName || 'WH: ' + alloc.warehouseId.toString().slice(-4).toUpperCase()}</span>
                {alloc.optimizationMetadata && <BarChart className="w-3 h-3 text-white/20 group-hover:text-red-400 ml-2" />}
              </button>
            ))}
          </div>
        );
      }
    },
    {
      header: 'Actions',
      accessor: (row: any) => (
        <div className="flex gap-1.5 flex-wrap">
          {row.status === 'created' && (
            <>
              <button onClick={() => handleWorkflowAction('optimize', row._id)} className="text-[11px] bg-purple-500/10 text-purple-400 px-2.5 py-1 rounded border border-purple-500/20 hover:bg-purple-500/20 transition-all">Optimize</button>
              <button onClick={() => handleWorkflowAction('cancel', row._id)} className="text-[11px] bg-red-500/10 text-red-400 px-2.5 py-1 rounded border border-red-500/20 hover:bg-red-500/20 transition-all">Cancel</button>
            </>
          )}
          {row.status === 'optimized' && (
            <>
              <button onClick={() => openAssignModal(row)} className="text-[11px] bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded border border-indigo-500/20 hover:bg-indigo-500/20 transition-all">Assign Driver</button>
              <button onClick={() => handleWorkflowAction('cancel', row._id)} className="text-[11px] bg-red-500/10 text-red-400 px-2.5 py-1 rounded border border-red-500/20 hover:bg-red-500/20 transition-all">Cancel</button>
            </>
          )}
          {row.status === 'driver_assigned' && (
            <>
              <button onClick={() => handleWorkflowAction('transit', row._id)} className="text-[11px] bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded border border-amber-500/20 hover:bg-amber-500/20 transition-all">Dispatch</button>
              <button onClick={() => handleWorkflowAction('release', row._id)} className="text-[11px] bg-orange-500/10 text-orange-400 px-2.5 py-1 rounded border border-orange-500/20 hover:bg-orange-500/20 transition-all">Release</button>
              <button onClick={() => handleWorkflowAction('cancel', row._id)} className="text-[11px] bg-red-500/10 text-red-400 px-2.5 py-1 rounded border border-red-500/20 hover:bg-red-500/20 transition-all">Cancel</button>
            </>
          )}
          {row.status === 'in_transit' && (
            <button onClick={() => handleWorkflowAction('deliver', row._id)} className="text-[11px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">Delivered</button>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6 relative">
      <PageHeader 
        title="Shipments" 
        description="Monitor and manage operational shipment workflows."
        actionLabel="Create Shipment"
        onAction={openCreateModal}
      />
      <DataTable columns={columns} data={data} isLoading={isLoading} emptyMessage="No active shipments." />

      {/* Create Shipment Modal */}
      <Modal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        title="Create New Shipment"
        description="Initialize a new outbound logistics operation."
      >
        <form onSubmit={handleCreateSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Destination Address</label>
            <input 
              required type="text" placeholder="e.g. Nagpur Chawl, Pune or Warehouse 7, Sector 12, Noida"
              value={formData.destinationAddress} onChange={e => setFormData({...formData, destinationAddress: e.target.value})}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
            />
            <p className="text-[10px] text-white/25 mt-1">📍 GPS coordinates will be auto-resolved from the address for route intelligence.</p>
          </div>
          
          <div className="border-t border-white/[0.06] pt-4">
            <div className="flex justify-between items-center mb-3">
              <label className="block text-xs font-medium text-white/70">Shipment Items</label>
              <button type="button" onClick={addItemRow} className="text-[10px] text-red-400 flex items-center hover:text-red-300 transition-colors">
                <Plus size={12} className="mr-1" /> Add Product
              </button>
            </div>
            
            <div className="space-y-3">
              {formData.items.map((item, index) => (
                <div key={index} className="flex gap-3 items-start bg-white/[0.01] p-2 rounded-lg border border-white/[0.04]">
                  <div className="flex-1">
                    <select 
                      required 
                      value={item.productId} 
                      onChange={e => {
                        const newItems = [...formData.items];
                        newItems[index].productId = e.target.value;
                        setFormData({ ...formData, items: newItems });
                      }}
                      className="w-full bg-[#0d0d0d] border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
                    >
                      <option value="">Select Product...</option>
                      {products.map(p => (
                        <option key={p._id} value={p._id}>{p.name} ({p.SKU})</option>
                      ))}
                    </select>
                  </div>
                  <div className="w-20">
                    <input 
                      required type="number" min="1" placeholder="Qty"
                      value={item.quantity} 
                      onChange={e => {
                        const newItems = [...formData.items];
                        newItems[index].quantity = Number(e.target.value);
                        setFormData({ ...formData, items: newItems });
                      }}
                      className="w-full bg-[#0d0d0d] border border-white/[0.06] rounded-lg px-2 py-1.5 text-xs text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all text-center"
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={() => removeItemRow(index)}
                    className="p-1.5 text-white/30 hover:text-red-400 transition-colors mt-0.5"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-2 flex justify-end gap-3 border-t border-white/[0.06] mt-4">
            <button 
              type="button" 
              onClick={() => setIsCreateModalOpen(false)}
              className="px-4 py-2 text-sm font-medium text-white/50 hover:text-white hover:bg-white/[0.05] rounded-lg transition-all"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-lg shadow-red-900/20 hover:from-red-500 hover:to-red-600 disabled:opacity-50 transition-all"
            >
              {isGeocoding ? '📍 Resolving address...' : isSubmitting ? 'Creating...' : 'Initialize Shipment'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Assign Driver Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#0d0d0d] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col rounded-xl shadow-2xl shadow-red-950/10 border border-white/[0.08]">
            <div className="flex justify-between items-center p-6 border-b border-white/[0.06]">
              <div>
                <h3 className="text-base font-semibold text-white/90">Operational Dispatch</h3>
                <p className="text-xs text-white/30 mt-0.5">
                  Shipment <span className="text-red-400 font-mono">#{selectedShipment?._id.slice(-6).toUpperCase()}</span> • {selectedShipment?.destination.address}
                </p>
              </div>
              <button onClick={closeAssignModal} className="text-white/30 hover:text-white/70 transition-colors p-1">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Left Panel: Route Intelligence */}
              <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-white/[0.06] flex flex-col space-y-4">
                <div className="flex items-center space-x-2 text-red-400 font-medium text-sm">
                  <MapIcon className="h-4 w-4" />
                  <span>Route Intelligence</span>
                </div>
                
                {routeInfo ? (
                  <>
                    <div className="flex space-x-3 mb-2">
                      <div className="bg-white/[0.03] border border-white/[0.06] p-3 rounded-lg flex-1">
                        <div className="text-[10px] text-white/30 flex items-center uppercase tracking-wider"><MapIcon className="h-3 w-3 mr-1"/> Distance</div>
                        <div className="text-lg font-bold text-white/80 mt-1">{routeInfo.distanceKm} km</div>
                      </div>
                      <div className="bg-white/[0.03] border border-white/[0.06] p-3 rounded-lg flex-1">
                        <div className="text-[10px] text-white/30 flex items-center uppercase tracking-wider"><Clock className="h-3 w-3 mr-1"/> ETA</div>
                        <div className="text-lg font-bold text-white/80 mt-1">{routeInfo.etaMinutes} mins</div>
                      </div>
                    </div>
                    <div className="flex-1 min-h-[300px] rounded-lg overflow-hidden border border-white/[0.06]">
                      <RouteMap 
                        encodedGeometry={routeInfo.geometry}
                        origin={{ lat: (routeInfo as any).originCoords.lat, lng: (routeInfo as any).originCoords.lng, label: (routeInfo as any).originLabel }}
                        destination={{ lat: (routeInfo as any).destCoords.lat, lng: (routeInfo as any).destCoords.lng, label: 'Delivery' }}
                        height="100%"
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center bg-white/[0.02] rounded-lg min-h-[300px] border border-white/[0.04]">
                    <div className="flex flex-col items-center gap-2 text-center px-6">
                      {isDriversLoading ? (
                        <>
                          <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          <span className="text-xs text-white/25">Calculating optimal route...</span>
                        </>
                      ) : (
                        <>
                          <MapIcon className="h-6 w-6 text-white/15" />
                          <span className="text-xs text-white/30">Route unavailable. Add coordinates to your warehouse and shipment destination to see route intelligence.</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Panel: Driver Selection */}
              <div className="w-full md:w-80 p-6 flex flex-col bg-white/[0.01] overflow-y-auto">
                <h4 className="font-semibold text-white/80 mb-4 text-sm">Available Fleet</h4>
                
                <div className="space-y-3">
                  {isDriversLoading ? (
                    <div className="text-xs text-white/25 text-center py-6 flex flex-col items-center gap-2">
                      <div className="flex gap-1">
                        {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-red-500/40" style={{ animation: `pulse 1s ease-in-out ${i*200}ms infinite` }} />)}
                      </div>
                      Scanning active fleet...
                    </div>
                  ) : availableDrivers.length === 0 ? (
                    <div className="text-xs text-white/25 text-center py-6 border border-dashed border-white/[0.06] rounded-lg p-4">No drivers available.<br/>Wait for deliveries to complete.</div>
                  ) : (
                    availableDrivers.map(driver => (
                      <div key={driver._id} className="flex flex-col p-3.5 border border-white/[0.06] rounded-lg bg-white/[0.02] hover:border-red-500/20 transition-all">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <div className="font-medium text-white/80 text-sm">{driver.fullName}</div>
                            <div className="text-[11px] text-white/30">{driver.vehicleType}</div>
                          </div>
                          <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold rounded">ONLINE</span>
                        </div>
                        
                        <div className="text-[11px] text-white/25 mb-3 bg-white/[0.02] p-2 rounded flex justify-between border border-white/[0.04]">
                          <span>Capacity</span>
                          <span className="font-medium text-white/60">{driver.vehicleCapacity} kg</span>
                        </div>

                        <button 
                          onClick={() => handleAssignDriver(driver._id)}
                          disabled={isAssigning}
                          className="w-full py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-semibold rounded-lg hover:from-red-500 hover:to-red-600 disabled:opacity-50 transition-all shadow-lg shadow-red-900/20"
                        >
                          {isAssigning ? 'Dispatching...' : 'Dispatch Driver'}
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Optimization Breakdown Modal */}
      <Modal
        isOpen={!!optimizationModalData}
        onClose={() => setOptimizationModalData(null)}
        title="Optimization Breakdown"
        description="Detailed operational scoring factors that influenced this allocation decision."
      >
        <div className="mt-4">
          <ScoringBreakdown metadata={optimizationModalData} />
        </div>
      </Modal>
    </div>
  );
}
