"use client";

import React, { useState } from "react";
import InputPanel from "./components/InputPanel";
import ResultsPanel from "./components/ResultsPanel";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

interface ApiResponse {
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: Array<{
    root: string;
    tree: Record<string, unknown>;
    depth?: number;
    has_cycle?: true;
  }>;
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: {
    total_trees: number;
    total_cycles: number;
    largest_tree_root: string;
  };
}

export default function Home() {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data: string[]) => {
    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(`${API_URL}/bfhl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || `Server responded with ${res.status}`);
      }

      const json: ApiResponse = await res.json();
      setResult(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect to the API. Please check if the server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex-1 flex flex-col">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c3aed]/[0.04] blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#06b6d4]/[0.04] blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 md:py-12">
        {/* Header */}
        <header className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-white/50 font-medium">API Online</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            <span className="gradient-text">BFHL</span>{" "}
            <span className="text-white/90">Hierarchy Processor</span>
          </h1>
          <p className="text-sm md:text-base text-white/40 max-w-lg mx-auto">
            Process relationship strings into hierarchical trees, detect cycles,
            and analyze graph structures in real-time.
          </p>
        </header>

        {/* Input Section */}
        <section className="mb-8">
          <InputPanel onSubmit={handleSubmit} isLoading={isLoading} />
        </section>

        {/* Error Display */}
        {error && (
          <div className="mb-8 animate-fade-in">
            <div className="glass-card border-red-500/20 p-5 flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-red-400 mb-1">Request Failed</h3>
                <p className="text-sm text-red-400/70">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <section>
            <ResultsPanel data={result} />
          </section>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-xs text-white/20">
          Built by Harshit Mathur • RA2311053010096 • SRM IST
        </footer>
      </div>
    </main>
  );
}
