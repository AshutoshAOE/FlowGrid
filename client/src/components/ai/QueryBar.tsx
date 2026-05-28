import React, { useState } from 'react';
import { Search, Brain, Loader2 } from 'lucide-react';
import { aiService } from '../../services/api/domainApi';
import { InsightCard } from './InsightCard';
import { cn } from '../../lib/utils';

export function QueryBar() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await aiService.queryOperations(query);
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to process operational query');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-red-500/10 rounded-xl blur-xl transition-all duration-500 group-hover:opacity-100 opacity-50" />
        <div className="relative flex items-center bg-[#0d0d0d] border border-white/[0.08] rounded-xl overflow-hidden focus-within:border-red-500/50 focus-within:ring-1 focus-within:ring-red-500/50 transition-all">
          <div className="pl-4 pr-3 text-white/40">
            {isLoading ? <Loader2 size={18} className="animate-spin text-red-500" /> : <Brain size={18} />}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about inventory pressure, fleet status, or workflow delays..."
            className="flex-1 bg-transparent border-none py-4 px-2 text-sm text-white placeholder:text-white/30 focus:outline-none focus:ring-0"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="m-2 px-4 py-2 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.04] rounded-lg text-xs font-medium text-white/70 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Search size={14} />
            Analyze
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-fade-in">
          {error}
        </div>
      )}

      {result && (
        <div className="bg-[#0a0a0a] border border-white/[0.06] rounded-xl p-5 animate-fade-in slide-up">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={16} className="text-red-500" />
            <h3 className="text-sm font-medium text-white/90">AI Analysis</h3>
          </div>
          <p className="text-white/70 text-sm leading-relaxed mb-6">
            {result.summary}
          </p>
          
          {result.insights && result.insights.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.insights.map((insight: any, i: number) => (
                <InsightCard
                  key={i}
                  {...insight}
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
