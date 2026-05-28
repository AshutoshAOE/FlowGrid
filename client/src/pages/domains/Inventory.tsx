import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { inventoryService, warehouseService, productService } from '../../services/api/domainApi';
import { Modal } from '../../components/ui/Modal';
import { Warehouse as WarehouseIcon } from 'lucide-react';

export function Inventory() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Warehouse filter
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  
  // For dropdowns
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    warehouseId: '',
    productId: '',
    quantity: '',
    type: 'ADD'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchInventory = async (warehouseId?: string) => {
    setIsLoading(true);
    try {
      const response = await inventoryService.getAll(warehouseId || undefined);
      setData(response.data || []);
    } catch (error) {
      console.error('Failed to fetch inventory', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [whRes, prRes] = await Promise.all([
        warehouseService.getAll(),
        productService.getAll()
      ]);
      setWarehouses(whRes.data || []);
      setProducts(prRes.data || []);
    } catch (error) {
      console.error('Failed to load dropdown data', error);
    }
  };

  useEffect(() => {
    fetchInventory();
    fetchDropdownData();
  }, []);

  // Re-fetch when warehouse filter changes
  useEffect(() => {
    fetchInventory(selectedWarehouse);
  }, [selectedWarehouse]);

  const handleAdjustSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const quantity = Number(formData.quantity);
      const quantityAdjustment = formData.type === 'ADD' ? quantity : -quantity;

      await inventoryService.adjust({
        warehouseId: formData.warehouseId,
        productId: formData.productId,
        quantityAdjustment
      });
      setIsModalOpen(false);
      setFormData({ warehouseId: '', productId: '', quantity: '', type: 'ADD' });
      fetchInventory(selectedWarehouse);
    } catch (error: any) {
      console.error('Failed to adjust inventory', error);
      alert(error.response?.data?.message || 'Failed to adjust inventory');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: 'Warehouse', accessor: (row: any) => row.warehouseId?.name || 'Unknown' },
    { header: 'Product (SKU)', accessor: (row: any) => `${row.productId?.name} (${row.productId?.SKU})` },
    { 
      header: 'Total Quantity', 
      accessor: (row: any) => (
        <span className="text-white/60 font-mono">{row.quantity}</span>
      )
    },
    { 
      header: 'Reserved', 
      accessor: (row: any) => (
        <span className={`font-medium px-2 py-0.5 rounded text-xs ${row.reservedQuantity > 0 ? 'text-amber-400 bg-amber-500/10 border border-amber-500/20' : 'text-white/20'}`}>
          {row.reservedQuantity}
        </span>
      )
    },
    { 
      header: 'Available', 
      accessor: (row: any) => {
        const available = row.quantity - row.reservedQuantity;
        return (
          <span className={`font-bold ${available > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {available}
          </span>
        );
      } 
    },
  ];

  const selectedWh = warehouses.find(w => w._id === selectedWarehouse);

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Inventory State" 
        description="View real-time operational inventory across all warehouses."
        actionLabel="Adjust Inventory"
        onAction={() => setIsModalOpen(true)}
      />

      {/* Warehouse Filter Bar */}
      <div className="flex items-center gap-3 bg-white/[0.02] border border-white/[0.06] rounded-xl p-3">
        <div className="flex items-center gap-2 text-white/40">
          <WarehouseIcon className="h-4 w-4" />
          <span className="text-xs font-medium uppercase tracking-wider">Filter by Facility</span>
        </div>
        <div className="flex-1 flex items-center gap-2 overflow-x-auto">
          <button
            onClick={() => setSelectedWarehouse('')}
            className={`text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
              !selectedWarehouse 
                ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-sm shadow-red-500/10' 
                : 'bg-white/[0.02] text-white/40 border-white/[0.06] hover:bg-white/[0.05] hover:text-white/60'
            }`}
          >
            All Warehouses
          </button>
          {warehouses.map(w => (
            <button
              key={w._id}
              onClick={() => setSelectedWarehouse(w._id)}
              className={`text-xs px-3 py-1.5 rounded-lg border whitespace-nowrap transition-all ${
                selectedWarehouse === w._id
                  ? 'bg-red-500/10 text-red-400 border-red-500/30 shadow-sm shadow-red-500/10'
                  : 'bg-white/[0.02] text-white/40 border-white/[0.06] hover:bg-white/[0.05] hover:text-white/60'
              }`}
            >
              {w.name}
            </button>
          ))}
        </div>
        {selectedWh && (
          <div className="hidden md:flex items-center gap-3 text-[10px] text-white/25 border-l border-white/[0.06] pl-3 ml-2">
            <span>{selectedWh.address?.city}, {selectedWh.address?.state}</span>
            <span>•</span>
            <span>Cap: {selectedWh.storageCapacity} units</span>
          </div>
        )}
      </div>

      <DataTable columns={columns} data={data} isLoading={isLoading} emptyMessage={selectedWarehouse ? "No inventory in this warehouse." : "No inventory records found."} />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Adjust Inventory"
        description="Manually add or remove stock from a warehouse."
      >
        <form onSubmit={handleAdjustSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Facility / Warehouse</label>
            <select 
              required 
              value={formData.warehouseId} onChange={e => setFormData({...formData, warehouseId: e.target.value})}
              className="w-full bg-[#0d0d0d] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
            >
              <option value="">Select Warehouse...</option>
              {warehouses.map(w => (
                <option key={w._id} value={w._id}>{w.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Product</label>
            <select 
              required 
              value={formData.productId} onChange={e => setFormData({...formData, productId: e.target.value})}
              className="w-full bg-[#0d0d0d] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
            >
              <option value="">Select Product...</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>{p.name} ({p.SKU})</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4 border-t border-white/[0.06] pt-4 mt-2">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Adjustment Type</label>
              <select 
                required 
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-[#0d0d0d] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
              >
                <option value="ADD">Stock In (Add)</option>
                <option value="REMOVE">Stock Out (Remove)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Quantity</label>
              <input 
                required type="number" min="1" 
                value={formData.quantity} onChange={e => setFormData({...formData, quantity: e.target.value})}
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
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg shadow-lg shadow-red-900/20 hover:from-red-500 hover:to-red-600 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Adjusting...' : 'Commit Adjustment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
