"use client";

import React, { useState } from "react";

interface TreeViewProps {
  tree: Record<string, unknown>;
  isRoot?: boolean;
}

export default function TreeView({ tree, isRoot = true }: TreeViewProps) {
  const keys = Object.keys(tree);

  if (keys.length === 0) {
    return (
      <span className="text-white/30 text-xs italic ml-2">empty</span>
    );
  }

  return (
    <div className={isRoot ? "" : "ml-6 relative"}>
      {keys.map((key, index) => (
        <TreeNode
          key={key}
          name={key}
          children={(tree as Record<string, Record<string, unknown>>)[key]}
          isLast={index === keys.length - 1}
          depth={isRoot ? 0 : 1}
        />
      ))}
    </div>
  );
}

interface TreeNodeProps {
  name: string;
  children: Record<string, unknown>;
  isLast: boolean;
  depth: number;
}

function TreeNode({ name, children, isLast, depth }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = Object.keys(children).length > 0;

  return (
    <div className="relative">
      {/* Connector lines */}
      {depth > 0 && (
        <>
          {/* Vertical line */}
          <div
            className={`absolute left-[-20px] top-0 w-px bg-gradient-to-b from-[#7c3aed]/30 to-[#06b6d4]/30 ${
              isLast ? "h-[14px]" : "h-full"
            }`}
          />
          {/* Horizontal line */}
          <div className="absolute left-[-20px] top-[14px] w-[20px] h-px bg-gradient-to-r from-[#7c3aed]/30 to-[#06b6d4]/30" />
        </>
      )}

      {/* Node */}
      <div className="flex items-center gap-2 py-1">
        {hasChildren && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-5 h-5 flex items-center justify-center rounded-md bg-white/[0.06] hover:bg-white/[0.12] transition-colors text-white/60 text-xs cursor-pointer"
          >
            {expanded ? "−" : "+"}
          </button>
        )}
        {!hasChildren && <div className="w-5" />}
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold ${
              depth === 0
                ? "bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] text-white shadow-lg shadow-purple-500/20"
                : hasChildren
                ? "bg-[#7c3aed]/15 text-[#c4b5fd] border border-[#7c3aed]/20"
                : "bg-[#06b6d4]/15 text-[#67e8f9] border border-[#06b6d4]/20"
            }`}
          >
            {name}
          </span>
          {!hasChildren && (
            <span className="text-[10px] text-white/25 uppercase tracking-wider">
              leaf
            </span>
          )}
        </div>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="ml-6 relative">
          {Object.keys(children).map((childKey, index) => (
            <TreeNode
              key={childKey}
              name={childKey}
              children={
                (children as Record<string, Record<string, unknown>>)[childKey]
              }
              isLast={index === Object.keys(children).length - 1}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
