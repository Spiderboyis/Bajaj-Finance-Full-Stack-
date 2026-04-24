import { HierarchyResult, Summary } from "./types";

/**
 * Builds the summary object from the processed hierarchies.
 *
 * - total_trees: count of hierarchies without has_cycle
 * - total_cycles: count of hierarchies with has_cycle
 * - largest_tree_root: root of the tree with the greatest depth.
 *   Tiebreaker: lexicographically smaller root wins.
 *   If no valid trees exist, returns an empty string.
 *
 * @param hierarchies - Array of processed HierarchyResult objects
 * @returns Summary object
 */
export function buildSummary(hierarchies: HierarchyResult[]): Summary {
  let totalTrees = 0;
  let totalCycles = 0;
  let largestTreeRoot = "";
  let maxDepth = -1;

  for (const h of hierarchies) {
    if (h.has_cycle) {
      totalCycles++;
    } else {
      totalTrees++;
      const depth = h.depth ?? 0;
      if (
        depth > maxDepth ||
        (depth === maxDepth && h.root < largestTreeRoot)
      ) {
        maxDepth = depth;
        largestTreeRoot = h.root;
      }
    }
  }

  return {
    total_trees: totalTrees,
    total_cycles: totalCycles,
    largest_tree_root: largestTreeRoot,
  };
}
