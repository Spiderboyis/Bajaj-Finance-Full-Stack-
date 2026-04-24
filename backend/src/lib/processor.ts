import { HierarchyResult } from "./types";

enum Color {
  WHITE = 0,
  GRAY = 1,
  BLACK = 2,
}

/**
 * Detects if a component has a cycle using DFS with white/gray/black coloring
 * on the directed graph.
 */
function hasCycle(
  component: Set<string>,
  adjacency: Map<string, string[]>
): boolean {
  const color = new Map<string, Color>();
  for (const node of component) {
    color.set(node, Color.WHITE);
  }

  function dfs(node: string): boolean {
    color.set(node, Color.GRAY);
    for (const child of adjacency.get(node) || []) {
      if (!component.has(child)) continue;
      const childColor = color.get(child);
      if (childColor === Color.GRAY) return true; // back edge = cycle
      if (childColor === Color.WHITE && dfs(child)) return true;
    }
    color.set(node, Color.BLACK);
    return false;
  }

  for (const node of component) {
    if (color.get(node) === Color.WHITE) {
      if (dfs(node)) return true;
    }
  }

  return false;
}

/**
 * Finds the root node of an acyclic component (in-degree 0 within the component).
 * If multiple roots exist, returns the lexicographically smallest.
 */
function findRoot(
  component: Set<string>,
  parentMap: Map<string, string>
): string {
  const roots: string[] = [];

  for (const node of component) {
    const parent = parentMap.get(node);
    // A root is a node that either has no parent, or whose parent is outside this component
    if (!parent || !component.has(parent)) {
      roots.push(node);
    }
  }

  // Sort lexicographically and return the smallest
  roots.sort();
  return roots[0];
}

/**
 * Builds a nested tree object via DFS from the root.
 */
function buildTree(
  node: string,
  adjacency: Map<string, string[]>
): Record<string, any> {
  const children = adjacency.get(node) || [];
  const subtree: Record<string, any> = {};

  // Sort children lexicographically for consistent output
  const sortedChildren = [...children].sort();
  for (const child of sortedChildren) {
    subtree[child] = buildTree(child, adjacency);
  }

  return subtree;
}

/**
 * Calculates the depth of a tree (number of nodes on the longest root-to-leaf path).
 */
function calculateDepth(
  node: string,
  adjacency: Map<string, string[]>
): number {
  const children = adjacency.get(node) || [];
  if (children.length === 0) return 1;

  let maxChildDepth = 0;
  for (const child of children) {
    maxChildDepth = Math.max(maxChildDepth, calculateDepth(child, adjacency));
  }

  return 1 + maxChildDepth;
}

/**
 * Processes a single connected component into a HierarchyResult.
 *
 * - If the component has a cycle: returns { root, tree: {}, has_cycle: true }.
 * - If acyclic: finds root, builds nested tree, calculates depth.
 *
 * @param component - Set of nodes in this component
 * @param adjacency - Directed adjacency list
 * @param parentMap - Map of child -> parent
 * @returns HierarchyResult for this component
 */
export function processComponent(
  component: Set<string>,
  adjacency: Map<string, string[]>,
  parentMap: Map<string, string>
): HierarchyResult {
  if (hasCycle(component, adjacency)) {
    // For cycles, root = lexicographically smallest node
    const nodes = Array.from(component).sort();
    return {
      root: nodes[0],
      tree: {},
      has_cycle: true,
    };
  }

  const root = findRoot(component, parentMap);
  const tree = { [root]: buildTree(root, adjacency) };
  const depth = calculateDepth(root, adjacency);

  return { root, tree, depth };
}
