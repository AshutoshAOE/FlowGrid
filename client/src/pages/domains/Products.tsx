import { useEffect, useState } from 'react';
import { PageHeader } from '../../components/ui/PageHeader';
import { DataTable } from '../../components/ui/DataTable';
import { productService } from '../../services/api/domainApi';
import { Modal } from '../../components/ui/Modal';

export function Products() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    SKU: '',
    name: '',
    category: '',
    weight: '',
    length: '',
    width: '',
    height: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await productService.getAll();
      setData(response.data || []);
    } catch (error) {
      console.error('Failed to fetch products', error);
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
        SKU: formData.SKU,
        name: formData.name,
        category: formData.category,
      };
      
      if (formData.weight) payload.weight = Number(formData.weight);
      if (formData.length || formData.width || formData.height) {
        payload.dimensions = {
          length: Number(formData.length || 0),
          width: Number(formData.width || 0),
          height: Number(formData.height || 0),
        };
      }

      await productService.create(payload);
      setIsModalOpen(false);
      setFormData({ SKU: '', name: '', category: '', weight: '', length: '', width: '', height: '' });
      fetchData();
    } catch (error: any) {
      console.error('Failed to create product', error);
      alert(error.response?.data?.message || 'Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: 'SKU', accessor: 'SKU' as const },
    { header: 'Name', accessor: 'name' as const },
    { header: 'Category', accessor: 'category' as const },
    { 
      header: 'Weight (kg)', 
      accessor: (row: any) => row.weight ? row.weight.toString() : 'N/A' 
    },
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
        title="Products" 
        description="Manage your product catalog and operational SKUs."
        actionLabel="Add Product"
        onAction={() => setIsModalOpen(true)}
      />
      <DataTable columns={columns} data={data} isLoading={isLoading} emptyMessage="No products found. Add an item to your catalog." />

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Register New Product"
        description="Add a new SKU to your operational catalog."
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">SKU</label>
              <input 
                required type="text" placeholder="e.g. LAP-001"
                value={formData.SKU} onChange={e => setFormData({...formData, SKU: e.target.value.toUpperCase()})}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1">Category</label>
              <input 
                required type="text" placeholder="e.g. Electronics"
                value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-medium text-white/70 mb-1">Product Name</label>
            <input 
              required type="text" 
              value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
            />
          </div>

          <div className="pt-2 border-t border-white/[0.06]">
            <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Logistics Metrics (Optional)</h4>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-medium text-white/70 mb-1">Weight (kg)</label>
                <input 
                  type="number" step="0.1" min="0" 
                  value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})}
                  className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
                />
              </div>
              <div className="col-span-3 grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Length</label>
                  <input 
                    type="number" step="0.1" min="0" 
                    value={formData.length} onChange={e => setFormData({...formData, length: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Width</label>
                  <input 
                    type="number" step="0.1" min="0" 
                    value={formData.width} onChange={e => setFormData({...formData, width: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-white/70 mb-1">Height</label>
                  <input 
                    type="number" step="0.1" min="0" 
                    value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-lg px-3 py-2 text-sm text-white/90 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/50 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="pt-4 flex justify-end gap-3 border-t border-white/[0.06] mt-4">
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
              {isSubmitting ? 'Registering...' : 'Register Product'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
