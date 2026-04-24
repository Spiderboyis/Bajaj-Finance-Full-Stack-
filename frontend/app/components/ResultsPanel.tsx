"use client";

import React from "react";
import TreeView from "./TreeView";

interface Hierarchy {
  root: string;
  tree: Record<string, unknown>;
  depth?: number;
  has_cycle?: true;
}

interface Summary {
  total_trees: number;
  total_cycles: number;
  largest_tree_root: string;
}

interface ApiResponse {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: Hierarchy[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: Summary;
}

interface ResultsPanelProps {
  data: ApiResponse;
}

export default function ResultsPanel({ data }: ResultsPanelProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <IdentityCard data={data} />
        <SummaryCard summary={data.summary} />
      </div>
      <HierarchiesSection hierarchies={data.hierarchies} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {data.invalid_entries.length > 0 && (
          <ListCard title="Invalid Entries" items={data.invalid_entries} variant="red" />
        )}
        {data.duplicate_edges.length > 0 && (
          <ListCard title="Duplicate Edges" items={data.duplicate_edges} variant="amber" />
        )}
      </div>
    </div>
  );
}

function IdentityCard({ data }: { data: ApiResponse }) {
  const fields = [
    { label: "User ID", value: data.user_id },
    { label: "Email", value: data.email_id },
    { label: "Roll Number", value: data.college_roll_number },
  ];
  return (
    <div className="glass-card gradient-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-white/80">Identity</h3>
      </div>
      <div className="space-y-3">
        {fields.map((f) => (
          <div key={f.label} className="flex flex-col gap-0.5">
            <span className="text-[10px] uppercase tracking-wider text-white/30">{f.label}</span>
            <span className="text-sm font-mono text-white/70">{f.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({ summary }: { summary: Summary }) {
  const stats = [
    { label: "Valid Trees", value: summary.total_trees, color: "text-emerald-400" },
    { label: "Cycle Groups", value: summary.total_cycles, color: "text-red-400" },
    { label: "Deepest Root", value: summary.largest_tree_root || "—", color: "text-purple-400" },
  ];
  return (
    <div className="glass-card gradient-border p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#06b6d4] to-[#22c55e] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-white/80">Summary</h3>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-[10px] uppercase tracking-wider text-white/30 mt-1">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HierarchiesSection({ hierarchies }: { hierarchies: Hierarchy[] }) {
  if (hierarchies.length === 0) return null;
  return (
    <div className="glass-card p-6 md:p-8">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7c3aed] to-[#ec4899] flex items-center justify-center">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </div>
        <h3 className="text-sm font-semibold text-white/80">
          Hierarchies <span className="ml-2 text-white/30 font-normal">({hierarchies.length})</span>
        </h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {hierarchies.map((h, i) => (
          <HierarchyCard key={`${h.root}-${i}`} hierarchy={h} index={i} />
        ))}
      </div>
    </div>
  );
}

function HierarchyCard({ hierarchy, index }: { hierarchy: Hierarchy; index: number }) {
  const isCycle = !!hierarchy.has_cycle;
  return (
    <div
      className={`rounded-xl border p-5 transition-all duration-300 hover:scale-[1.01] ${
        isCycle ? "bg-red-500/[0.04] border-red-500/20" : "bg-white/[0.02] border-white/[0.06] hover:border-[#7c3aed]/30"
      }`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#7c3aed] to-[#06b6d4] text-white text-sm font-bold shadow-lg shadow-purple-500/20">
            {hierarchy.root}
          </span>
          <div>
            <span className="text-xs text-white/40">Root Node</span>
            <div className="text-sm font-semibold text-white/80">{hierarchy.root}</div>
          </div>
        </div>
        {isCycle ? (
          <span className="pill pill-red flex items-center gap-1.5">
            <svg className="w-3 h-3 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Cycle
          </span>
        ) : (
          <span className="pill pill-green">Depth: {hierarchy.depth}</span>
        )}
      </div>
      {isCycle ? (
        <div className="flex items-center justify-center py-6 rounded-lg bg-red-500/[0.04] border border-red-500/10">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full border-2 border-dashed border-red-500/30 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400 animate-spin-slow" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-xs text-red-400/70">Cyclic dependency detected</p>
          </div>
        </div>
      ) : (
        <div className="rounded-lg bg-white/[0.02] border border-white/[0.04] p-4 overflow-x-auto">
          <TreeView tree={hierarchy.tree} />
        </div>
      )}
    </div>
  );
}

function ListCard({ title, items, variant }: { title: string; items: string[]; variant: "red" | "amber" }) {
  const pillClass = variant === "red" ? "pill-red" : "pill-amber";
  const iconBg = variant === "red" ? "bg-gradient-to-br from-red-500 to-red-700" : "bg-gradient-to-br from-amber-500 to-amber-700";
  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center text-white`}>
          {variant === "red" ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
          )}
        </div>
        <h3 className="text-sm font-semibold text-white/80">
          {title} <span className="ml-2 text-white/30 font-normal">({items.length})</span>
        </h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className={`pill ${pillClass} font-mono`}>{item}</span>
        ))}
      </div>
    </div>
  );
}
