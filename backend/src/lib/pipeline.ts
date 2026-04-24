import { PipelineResult } from "./types";
import { validateEntries } from "./validator";
import { buildGraph } from "./graphBuilder";
import { findComponents } from "./componentFinder";
import { processComponent } from "./processor";
import { buildSummary } from "./summaryBuilder";

/**
 * Master orchestrator — runs the full BFHL processing pipeline.
 *
 * Flow:
 * 1. Validate entries (trim, regex check, reject self-loops)
 * 2. Build directed graph (deduplicate, enforce single-parent)
 * 3. Find connected components
 * 4. Process each component (cycle detect or build tree + depth)
 * 5. Build summary
 *
 * @param data - Raw array of input strings from the request body
 * @returns Complete pipeline result (hierarchies, invalid, duplicates, summary)
 */
export function processBfhl(data: string[]): PipelineResult {
  // Step 1: Validate
  const { validEdges, invalidEntries } = validateEntries(data);

  // Step 2: Build graph
  const { adjacency, allNodes, parentMap, duplicateEdges } =
    buildGraph(validEdges);

  // Step 3: Find connected components
  const components = findComponents(adjacency, allNodes);

  // Step 4: Process each component
  // Maintain order by first appearance in input
  const componentOrder = orderComponentsByFirstAppearance(
    components,
    validEdges.map((e) => e.from)
  );

  const hierarchies = componentOrder.map((component) =>
    processComponent(component, adjacency, parentMap)
  );

  // Step 5: Build summary
  const summary = buildSummary(hierarchies);

  return {
    hierarchies,
    invalid_entries: invalidEntries,
    duplicate_edges: duplicateEdges,
    summary,
  };
}

/**
 * Orders components by the first appearance of any of their nodes in the input.
 */
function orderComponentsByFirstAppearance(
  components: Set<string>[],
  nodeOrder: string[]
): Set<string>[] {
  const nodeToComponent = new Map<string, number>();
  components.forEach((component, idx) => {
    for (const node of component) {
      nodeToComponent.set(node, idx);
    }
  });

  const firstAppearance = new Map<number, number>();
  nodeOrder.forEach((node, idx) => {
    const compIdx = nodeToComponent.get(node);
    if (compIdx !== undefined && !firstAppearance.has(compIdx)) {
      firstAppearance.set(compIdx, idx);
    }
  });

  // Also handle components with nodes that only appear as children
  components.forEach((_, idx) => {
    if (!firstAppearance.has(idx)) {
      firstAppearance.set(idx, Infinity);
    }
  });

  const sorted = [...components];
  sorted.sort((a, b) => {
    const idxA = components.indexOf(a);
    const idxB = components.indexOf(b);
    return (firstAppearance.get(idxA) ?? Infinity) - (firstAppearance.get(idxB) ?? Infinity);
  });

  return sorted;
}
