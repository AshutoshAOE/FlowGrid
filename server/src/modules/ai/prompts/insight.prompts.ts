import { OperationalContext } from '../types/ai.types';

export const buildOperationalSummaryPrompt = (context: OperationalContext): string => {
  return `
Analyze the following operational context and generate a high-level operational intelligence summary.

OPERATIONAL CONTEXT:
${JSON.stringify(context, null, 2)}

TASK:
Identify exactly 3 to 5 key operational insights based on this data. Look for:
- Fleet utilization bottlenecks or risks.
- Inventory pressure issues (e.g., high reserved vs total).
- Shipment workflow delays or pile-ups (e.g., many 'created' but few 'driver_assigned').

OUTPUT REQUIREMENT:
Return a JSON object matching this exact TypeScript interface:
{
  "summary": "A 2-3 sentence overall assessment of current operational health.",
  "insights": [
    {
      "title": "Short punchy title (max 5 words)",
      "description": "Clear explanation of the insight (1-2 sentences)",
      "severity": "info" | "warning" | "critical",
      "category": "inventory" | "dispatch" | "shipment" | "fleet" | "system",
      "recommendedAction": "Actionable advice for the human operator (optional)"
    }
  ]
}

Respond ONLY with the valid JSON. No markdown blocks.
  `.trim();
};

export const buildNaturalLanguageQueryPrompt = (context: OperationalContext, query: string): string => {
  return `
Answer the user's operational query based ONLY on the provided operational context. Do not invent data.

OPERATIONAL CONTEXT:
${JSON.stringify(context, null, 2)}

USER QUERY: "${query}"

OUTPUT REQUIREMENT:
Return a JSON object matching this exact TypeScript interface:
{
  "summary": "Your direct, analytical answer to the query (1-3 sentences)",
  "insights": [
    {
      "title": "Relevant data point",
      "description": "Explanation of the data point in relation to the query",
      "severity": "info" | "warning" | "critical",
      "category": "inventory" | "dispatch" | "shipment" | "fleet" | "system"
    }
  ]
}

Respond ONLY with the valid JSON. No markdown blocks.
  `.trim();
}
