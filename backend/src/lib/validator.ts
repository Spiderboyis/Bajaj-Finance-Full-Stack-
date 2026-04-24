import { Edge, ValidationResult } from "./types";

const VALID_EDGE_PATTERN = /^[A-Z]->[A-Z]$/;

/**
 * Validates an array of raw input strings.
 * - Trims whitespace from each entry before validation.
 * - Validates against the pattern: single uppercase letter -> single uppercase letter.
 * - Self-loops (e.g., "A->A") are treated as invalid.
 *
 * @param data - Array of raw input strings
 * @returns Validated edges and invalid entries
 */
export function validateEntries(data: string[]): ValidationResult {
  const validEdges: Edge[] = [];
  const invalidEntries: string[] = [];

  for (const raw of data) {
    const trimmed = raw.trim();

    if (!VALID_EDGE_PATTERN.test(trimmed)) {
      invalidEntries.push(trimmed);
      continue;
    }

    const [from, to] = trimmed.split("->");

    // Self-loops are invalid
    if (from === to) {
      invalidEntries.push(trimmed);
      continue;
    }

    validEdges.push({ from, to, raw: trimmed });
  }

  return { validEdges, invalidEntries };
}
