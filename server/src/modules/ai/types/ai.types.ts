export type InsightSeverity = 'info' | 'warning' | 'critical';
export type InsightCategory = 'inventory' | 'dispatch' | 'shipment' | 'fleet' | 'optimization' | 'system';

export interface AIInsightResponse {
  insights: {
    title: string;
    description: string;
    severity: InsightSeverity;
    category: InsightCategory;
    recommendedAction?: string;
  }[];
  summary: string;
}

export interface OperationalContext {
  companyId: string;
  timestamp: string;
  metrics: {
    shipments: {
      activeCount: number;
      distribution: Record<string, number>;
    };
    fleet: {
      totalActive: number;
      distribution: Record<string, number>;
    };
    inventory: {
      totalQuantity: number;
      totalReserved: number;
      pressurePercent: number;
      productDetails?: {
        sku: string;
        productName: string;
        warehouseName: string;
        availableQuantity: number;
      }[];
    };
  };
  recentActivity: any[]; // Subset of recent shipments
}

export interface ExplainResponse {
  explanation: string;
  factors: string[];
  alternativesConsidered?: string[];
}
