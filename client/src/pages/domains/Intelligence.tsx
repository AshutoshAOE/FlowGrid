import React, { useEffect, useState } from 'react';
import { aiService } from '../../services/api/domainApi';
import { InsightCard } from '../../components/ai/InsightCard';
import { QueryBar } from '../../components/ai/QueryBar';
import { Brain, Activity, RefreshCw } from 'lucide-react';

export function Intelligence() {
  const [operationalData, setOperationalData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOperationalSummary = async () => {
    setIsLoading(true);
    try {
      const res = await aiService.getOperationalInsights();
      setOperationalData(res.data);
    } catch (error) {
      console.error('Failed to load operational AI summary', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationalSummary();
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-xl border border-white/[0.06] bg-gradient-to-r from-[#0d0d0d] via-[#1a0a0a] to-[#0d0d0d] p-6">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
        
        <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Brain className="h-4 w-4 text-red-500" />
              <span className="text-[10px] font-bold tracking-[0.3em] text-red-500/70 uppercase">AI Intelligence</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Operational Advisory</h2>
            <p className="text-white/40 text-sm mt-1">AI-generated operational intelligence, summaries, and workflow recommendations.</p>
          </div>
          <button 
            onClick={fetchOperationalSummary}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={isLoading ? "animate-spin text-red-500" : "text-white/60"} />
            <span className="text-xs text-white/70 font-medium">Refresh Analysis</span>
          </button>
        </div>
      </div>

      {/* Query Bar */}
      <div className="mb-8">
        <QueryBar />
      </div>

      {/* Main Operational Summary */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 px-2">
          <Activity className="h-4 w-4 text-red-400" />
          <h3 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Current Operational State</h3>
        </div>

        {isLoading ? (
          <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="relative mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center animate-pulse">
                <Brain size={24} className="text-red-500" />
              </div>
              <div className="absolute inset-0 bg-red-500/20 blur-xl animate-pulse" />
            </div>
            <p className="text-sm text-white/40 tracking-wide">Analyzing operational workflows and inventory state...</p>
          </div>
        ) : operationalData ? (
          <div className="space-y-6">
            <div className="rounded-xl border border-white/[0.06] bg-[#0d0d0d] p-6 animate-fade-in">
              <p className="text-white/80 text-sm leading-relaxed">
                {operationalData.summary}
              </p>
            </div>
            
            {operationalData.insights && operationalData.insights.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {operationalData.insights.map((insight: any, i: number) => (
                  <InsightCard 
                    key={i} 
                    {...insight} 
                    style={{ animationDelay: `${i * 100}ms` }}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-8 text-center text-red-400">
            Failed to load AI intelligence. Ensure Gemini API key is configured.
          </div>
        )}
      </div>

    </div>
  );
}
