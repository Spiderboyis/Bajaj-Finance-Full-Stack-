// ─── Type definitions for the BFHL hierarchical data processor ───

export interface Edge {
  from: string;
  to: string;
  raw: string;
}

export interface ValidationResult {
  validEdges: Edge[];
  invalidEntries: string[];
}

export interface GraphResult {
  adjacency: Map<string, string[]>;
  allNodes: Set<string>;
  parentMap: Map<string, string>;
  duplicateEdges: string[];
}

export interface HierarchyResult {
  root: string;
  tree: Record<string, any>;
  depth?: number;
  has_cycle?: true;
}

export interface Summary {
  total_trees: number;
  total_cycles: number;
  largest_tree_root: string;
}

export interface ApiResponse {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: HierarchyResult[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: Summary;
}

export interface PipelineResult {
  hierarchies: HierarchyResult[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: Summary;
}
