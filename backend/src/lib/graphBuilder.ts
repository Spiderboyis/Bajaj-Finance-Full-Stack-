import { Edge, GraphResult } from "./types";

/**
 * Builds a directed graph from validated edges.
 * - Deduplicates edges: first occurrence is kept, subsequent identical edges
 *   are pushed to duplicateEdges.
 * - Enforces single-parent rule: if a child already has a parent,
 *   the new edge is silently discarded (not added to duplicates).
 *
 * @param edges - Array of validated Edge objects
 * @returns Graph adjacency list, all nodes, parent map, and duplicate edges
 */
export function buildGraph(edges: Edge[]): GraphResult {
  const adjacency = new Map<string, string[]>();
  const allNodes = new Set<string>();
  const parentMap = new Map<string, string>();
  const duplicateEdges: string[] = [];
  const seenEdges = new Set<string>();

  for (const edge of edges) {
    const edgeKey = `${edge.from}->${edge.to}`;

    // Track all nodes regardless
    allNodes.add(edge.from);
    allNodes.add(edge.to);

    // Check for duplicate edges
    if (seenEdges.has(edgeKey)) {
      duplicateEdges.push(edgeKey);
      continue;
    }
    seenEdges.add(edgeKey);

    // Enforce single-parent: if child already has a parent, silently discard
    if (parentMap.has(edge.to)) {
      continue;
    }

    // Add edge to the graph
    parentMap.set(edge.to, edge.from);
    if (!adjacency.has(edge.from)) {
      adjacency.set(edge.from, []);
    }
    adjacency.get(edge.from)!.push(edge.to);
  }

  return { adjacency, allNodes, parentMap, duplicateEdges };
}
