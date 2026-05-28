import { BarChart, Compass, Package, MapPin, Truck } from 'lucide-react';

interface FactorScores {
  rawDistanceMeters: number;
  normalizedDistanceScore: number;
  rawEtaSeconds: number;
  normalizedEtaScore: number;
  rawInventoryAvailable: number;
  normalizedInventoryScore: number;
  rawDriverProximityMeters: number;
  normalizedDriverProximityScore: number;
}

interface OptimizationMetadata {
  strategy: string;
  finalScore: number;
  factors?: FactorScores;
}

export function ScoringBreakdown({ metadata }: { metadata?: OptimizationMetadata }) {
  if (!metadata) {
    return <div className="text-xs text-white/30 italic py-2">No optimization metadata available.</div>;
  }

  // Fallback for older allocation snapshots without the rich metadata
  if (!metadata.factors) {
    return (
      <div className="bg-white/[0.02] border border-white/[0.05] rounded-lg p-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-white/50">Strategy:</span>
          <span className="font-mono text-red-400">{metadata.strategy}</span>
        </div>
        <div className="flex justify-between items-center text-xs mt-1">
          <span className="text-white/50">Score:</span>
          <span className="font-bold text-white/90">{metadata.finalScore.toFixed(2)}</span>
        </div>
      </div>
    );
  }

  const { factors } = metadata;

  const metrics = [
    { label: 'Distance', icon: Compass, raw: `${Math.round(factors.rawDistanceMeters / 1000)} km`, score: factors.normalizedDistanceScore, weight: '40%' },
    { label: 'Inventory', icon: Package, raw: `${factors.rawInventoryAvailable} units`, score: factors.normalizedInventoryScore, weight: '35%' },
    { label: 'Driver Proximity', icon: Truck, raw: `${Math.round(factors.rawDriverProximityMeters / 1000)} km`, score: factors.normalizedDriverProximityScore, weight: '15%' },
    { label: 'ETA', icon: MapPin, raw: `${Math.round(factors.rawEtaSeconds / 60)} mins`, score: factors.normalizedEtaScore, weight: '10%' },
  ];

  return (
    <div className="bg-white/[0.02] border border-white/[0.05] rounded-xl overflow-hidden flex flex-col">
      <div className="p-3 border-b border-white/[0.05] flex justify-between items-center bg-white/[0.01]">
        <div className="flex items-center space-x-2">
          <BarChart className="w-4 h-4 text-red-400" />
          <span className="text-xs font-semibold text-white/80 tracking-wide uppercase">Operational Score</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-[10px] text-white/40 font-mono bg-white/[0.05] px-1.5 py-0.5 rounded">{metadata.strategy}</span>
          <span className="text-sm font-bold text-white/90">{(metadata.finalScore * 100).toFixed(0)}</span>
        </div>
      </div>
      
      <div className="p-3 space-y-3">
        {metrics.map((m, idx) => (
          <div key={idx} className="flex items-center justify-between group">
            <div className="flex items-center space-x-2 w-1/3">
              <m.icon className="w-3.5 h-3.5 text-white/30 group-hover:text-red-400 transition-colors" />
              <span className="text-[11px] text-white/60">{m.label}</span>
            </div>
            
            <div className="flex-1 px-4 flex items-center space-x-2">
              <div className="flex-1 h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 to-red-400 rounded-full" 
                  style={{ width: `${Math.max(m.score * 100, 2)}%` }} 
                />
              </div>
              <span className="text-[9px] text-white/30 font-mono w-8 text-right">{m.weight}</span>
            </div>

            <div className="w-1/4 text-right">
              <span className="text-[11px] font-medium text-white/80">{m.raw}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
