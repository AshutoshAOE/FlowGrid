/**
 * Normalizes an array of numerical values into a 0.0 to 1.0 scale.
 * 
 * @param values Array of raw numerical values
 * @param inverse If true, lower values get higher scores (e.g., Distance, ETA). If false, higher values get higher scores (e.g., Inventory).
 * @returns Array of normalized scores corresponding to the input array
 */
export const normalizeScores = (values: number[], inverse: boolean = false): number[] => {
  if (values.length === 0) return [];
  if (values.length === 1) return [1.0]; // Only one option gets a perfect score

  const min = Math.min(...values);
  const max = Math.max(...values);

  // If all values are identical, they all get a perfect score
  if (min === max) {
    return values.map(() => 1.0);
  }

  return values.map(val => {
    if (inverse) {
      // Lower is better: score 1.0 for min value, 0.0 for max value
      return (max - val) / (max - min);
    } else {
      // Higher is better: score 1.0 for max value, 0.0 for min value
      return (val - min) / (max - min);
    }
  });
};
