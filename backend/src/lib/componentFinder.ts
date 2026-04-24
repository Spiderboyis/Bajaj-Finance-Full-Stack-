/**
 * Finds all connected components in the graph using BFS.
 * Treats edges as undirected for the purpose of grouping nodes
 * into components (so A->B puts A and B in the same component).
 *
 * @param adjacency - Directed adjacency list (parent -> children)
 * @param allNodes  - Set of all nodes in the graph
 * @returns Array of node sets, one per connected component
 */
export function findComponents(
  adjacency: Map<string, string[]>,
  allNodes: Set<string>
): Set<string>[] {
  // Build an undirected adjacency list for component finding
  const undirected = new Map<string, Set<string>>();

  for (const node of allNodes) {
    if (!undirected.has(node)) {
      undirected.set(node, new Set());
    }
  }

  for (const [parent, children] of adjacency) {
    for (const child of children) {
      undirected.get(parent)!.add(child);
      undirected.get(child)!.add(parent);
    }
  }

  const visited = new Set<string>();
  const components: Set<string>[] = [];

  for (const node of allNodes) {
    if (visited.has(node)) continue;

    const component = new Set<string>();
    const queue: string[] = [node];
    visited.add(node);

    while (queue.length > 0) {
      const current = queue.shift()!;
      component.add(current);

      for (const neighbor of undirected.get(current) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    components.push(component);
  }

  return components;
}
