import { useEffect, useState } from 'react';
import { dashboardService } from '../services/api/domainApi';
import { MetricCard } from '../components/ui/MetricCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { WorkflowPipeline } from '../components/ui/WorkflowPipeline';
import { Truck, Package, Activity, AlertTriangle, Layers, Navigation, Zap, ArrowUpRight, Radio } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await dashboardService.getMetrics();
        setMetrics(res.data);
      } catch (error) {
        console.error('Failed to load dashboard metrics', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-2 border-red-500/20 flex items-center justify-center">
              <Truck className="h-7 w-7 text-red-500 animate-pulse" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-red-500/40 animate-ping" />
          </div>
          <span className="text-sm text-white/40 tracking-wide">Initializing Control Center...</span>
        </div>
      </div>
    );
  }

  if (!metrics) return (
    <div className="flex h-[40vh] items-center justify-center">
      <div className="text-center">
        <AlertTriangle className="h-8 w-8 text-red-500/50 mx-auto mb-3" />
        <p className="text-white/40 text-sm">Failed to load operational metrics.</p>
      </div>
    </div>
  );

  const { shipments, fleet, inventory, recentActivity } = metrics;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-r from-[#0d0d0d] via-[#1a0a0a] to-[#0d0d0d] p-6">
        {/* Animated truck driving across */}
        <div className="absolute bottom-3 left-0 right-0 overflow-hidden opacity-[0.06] pointer-events-none">
          <Truck className="h-6 w-6 text-red-500 animate-truck-drive" />
        </div>
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap className="h-4 w-4 text-red-500" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-red-500/70 uppercase">Live Operations</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Operational Control Center</h2>
            <p className="text-white/30 text-sm mt-1">Real-time logistics coordination and workflow monitoring.</p>
          </div>

        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard 
          title="Active Shipments" 
          value={shipments.activeCount} 
          icon={<Package className="h-5 w-5" />}
          description="In progress or awaiting dispatch"
          className="border-l-2 border-l-red-500"
          style={{ animationDelay: '100ms' }}
        />
        <MetricCard 
          title="Active Fleet" 
          value={fleet.totalActive} 
          icon={<Truck className="h-5 w-5" />}
          description={`${fleet.distribution.AVAILABLE || 0} drivers awaiting dispatch`}
          className="border-l-2 border-l-emerald-500"
          style={{ animationDelay: '200ms' }}
        />
        <MetricCard 
          title="Inventory Pressure" 
          value={`${inventory.pressurePercent}%`} 
          icon={<Layers className="h-5 w-5" />}
          description={`${inventory.totalReserved} reserved / ${inventory.totalQuantity} total`}
          className={inventory.pressurePercent > 80 ? "border-l-2 border-l-red-500" : "border-l-2 border-l-amber-500"}
          style={{ animationDelay: '300ms' }}
        />
        <MetricCard 
          title="System Status" 
          value="Optimal" 
          icon={<Activity className="h-5 w-5" />}
          description="Orchestration & FSM engines active"
          className="border-l-2 border-l-white/20"
          style={{ animationDelay: '400ms' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Pipeline + Active Operations */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipment Pipeline */}
          <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] overflow-hidden animate-fade-in">
            <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
              <h3 className="font-semibold text-white/90 flex items-center text-sm">
                <Navigation className="w-4 h-4 mr-2 text-red-500" /> 
                Shipment Pipeline
              </h3>
              <span className="text-[10px] font-medium text-white/20 tracking-widest uppercase">Distribution</span>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-5 gap-2 text-center mb-3">
                {['Created', 'Optimized', 'Assigned', 'Transit', 'Delivered'].map((label, i) => (
                  <div key={label} className="text-[10px] font-semibold text-white/25 uppercase tracking-wider">{label}</div>
                ))}
              </div>
              
              {/* Pipeline bar */}
              <div className="flex h-10 rounded overflow-hidden border border-white/[0.06] bg-white/[0.02]">
                {(() => {
                  const pipelineTotal = shipments.activeCount + (shipments.distribution.delivered || 0);
                  return [
                    { val: shipments.distribution.created, color: 'from-blue-600 to-blue-500' },
                    { val: shipments.distribution.optimized, color: 'from-purple-600 to-purple-500' },
                    { val: shipments.distribution.driver_assigned, color: 'from-indigo-600 to-indigo-500' },
                    { val: shipments.distribution.in_transit, color: 'from-amber-600 to-amber-500' },
                    { val: shipments.distribution.delivered, color: 'from-emerald-600 to-emerald-500' },
                  ].map((seg, i) => (
                    <div 
                      key={i}
                      style={{ width: `${(seg.val / Math.max(1, pipelineTotal)) * 100}%`, transition: 'width 1s ease-out' }} 
                      className={`bg-gradient-to-t ${seg.color} ${i < 4 && seg.val > 0 ? 'border-r border-black/30' : ''}`}
                    />
                  ));
                })()}
              </div>

              <div className="grid grid-cols-5 gap-2 text-center mt-3">
                {[
                  shipments.distribution.created,
                  shipments.distribution.optimized,
                  shipments.distribution.driver_assigned,
                  shipments.distribution.in_transit,
                  shipments.distribution.delivered,
                ].map((count, i) => (
                  <div key={i} className={`text-lg font-bold ${i === 4 ? 'text-white/30' : 'text-white/80'}`}>
                    {count || 0}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Active Operations Table */}
          <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] overflow-hidden animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="p-5 border-b border-white/[0.06] flex justify-between items-center">
              <h3 className="font-semibold text-white/90 text-sm">Active Operations</h3>
              <Link to="/shipments" className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center gap-1">
                View All <ArrowUpRight size={12} />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] text-white/25 uppercase tracking-wider border-b border-white/[0.04]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Shipment</th>
                    <th className="px-5 py-3 font-semibold">Destination</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Pipeline</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.length > 0 ? recentActivity.map((shipment: any, idx: number) => (
                    <tr 
                      key={shipment._id} 
                      className="border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors"
                      style={{ animation: `fadeIn 0.4s ease-out ${idx * 80}ms forwards`, opacity: 0 }}
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-xs text-red-400/80 bg-red-500/5 px-1.5 py-0.5 rounded">
                          #{shipment._id.slice(-6).toUpperCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-white/50 truncate max-w-[200px]">{shipment.destination.address}</td>
                      <td className="px-5 py-3.5"><StatusBadge type="shipment" status={shipment.status} /></td>
                      <td className="px-5 py-3.5 w-48"><WorkflowPipeline currentStatus={shipment.status} /></td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-5 py-12 text-center">
                        <Truck className="h-6 w-6 text-white/10 mx-auto mb-2" />
                        <span className="text-white/25 text-sm">No active shipments in the pipeline.</span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT: Fleet + Alerts */}
        <div className="space-y-6">
          
          {/* Fleet Utilization */}
          <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] overflow-hidden animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="p-5 border-b border-white/[0.06]">
              <h3 className="font-semibold text-white/90 text-sm flex items-center">
                <Truck className="w-4 h-4 mr-2 text-red-500" />
                Fleet Utilization
              </h3>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Available', key: 'AVAILABLE', color: 'bg-emerald-500', glow: 'shadow-emerald-500/30' },
                { label: 'Assigned', key: 'ASSIGNED', color: 'bg-indigo-500', glow: 'shadow-indigo-500/30' },
                { label: 'In Transit', key: 'IN_TRANSIT', color: 'bg-amber-500', glow: 'shadow-amber-500/30' },
                { label: 'Offline', key: 'OFFLINE', color: 'bg-white/20', glow: '' },
              ].map(({ label, key, color, glow }) => (
                <div key={key} className="flex justify-between items-center py-1 group">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-2 h-2 rounded-full ${color} ${glow ? `shadow-lg ${glow}` : ''}`} />
                    <span className={`text-sm ${key === 'OFFLINE' ? 'text-white/30' : 'text-white/60'} group-hover:text-white/80 transition-colors`}>
                      {label}
                    </span>
                  </div>
                  <span className={`font-bold text-sm tabular-nums ${key === 'OFFLINE' ? 'text-white/30' : 'text-white/80'}`}>
                    {fleet.distribution[key] || 0}
                  </span>
                </div>
              ))}

              {/* Fleet progress bar */}
              <div className="pt-3 mt-2 border-t border-white/[0.04]">
                <div className="flex h-2 rounded-full overflow-hidden bg-white/[0.04] mb-3">
                  {fleet.totalActive > 0 && (
                    <>
                      <div style={{ width: `${((fleet.distribution.AVAILABLE || 0) / fleet.totalActive) * 100}%` }} className="bg-emerald-500 transition-all duration-700" />
                      <div style={{ width: `${((fleet.distribution.ASSIGNED || 0) / fleet.totalActive) * 100}%` }} className="bg-indigo-500 transition-all duration-700" />
                      <div style={{ width: `${((fleet.distribution.IN_TRANSIT || 0) / fleet.totalActive) * 100}%` }} className="bg-amber-500 transition-all duration-700" />
                    </>
                  )}
                </div>
                <Link 
                  to="/drivers" 
                  className="w-full inline-flex justify-center items-center px-4 py-2 text-xs font-medium border border-white/[0.08] rounded-lg text-white/50 hover:text-red-400 hover:border-red-500/30 hover:bg-red-500/5 transition-all duration-200"
                >
                  Manage Fleet
                </Link>
              </div>
            </div>
          </div>

          {/* Operational Alerts */}
          <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] overflow-hidden animate-fade-in" style={{ animationDelay: '200ms' }}>
            <div className="p-5 border-b border-white/[0.06]">
              <h3 className="font-semibold text-white/90 text-sm flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 text-amber-500" />
                Operational Alerts
              </h3>
            </div>
            <div className="p-5">
              {inventory.pressurePercent > 80 ? (
                <div className="flex gap-3 p-3.5 bg-red-500/5 rounded-lg border border-red-500/10 text-sm">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-500 mt-0.5" />
                  <div>
                    <strong className="block font-semibold text-red-400 text-xs mb-0.5">HIGH INVENTORY PRESSURE</strong>
                    <span className="text-white/40 text-xs">
                      Critical capacity at {inventory.pressurePercent}%. Reserved stock exceeds safe thresholds.
                    </span>
                  </div>
                </div>
              ) : fleet.totalActive === 0 ? (
                <div className="flex gap-3 p-3.5 bg-amber-500/5 rounded-lg border border-amber-500/10 text-sm">
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 text-amber-500 mt-0.5" />
                  <div>
                    <strong className="block font-semibold text-amber-400 text-xs mb-0.5">NO ACTIVE FLEET</strong>
                    <span className="text-white/40 text-xs">
                      No drivers online to fulfill dispatch operations.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mx-auto mb-3">
                    <Activity className="h-4 w-4 text-emerald-500/50" />
                  </div>
                  <span className="text-xs text-white/30">No critical alerts. Operations stable.</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Inline keyframes for table rows */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
