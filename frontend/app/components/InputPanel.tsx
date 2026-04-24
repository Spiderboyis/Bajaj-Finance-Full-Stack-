"use client";

import React, { useState } from "react";

interface InputPanelProps {
  onSubmit: (data: string[]) => void;
  isLoading: boolean;
}

const EXAMPLE_DATA = `["A->B", "A->C", "B->D", "C->E", "E->F", "X->Y", "Y->Z", "Z->X", "P->Q", "Q->R", "G->H", "G->H", "G->I", "hello", "1->2", "A->"]`;

export default function InputPanel({ onSubmit, isLoading }: InputPanelProps) {
  const [input, setInput] = useState(EXAMPLE_DATA);
  const [error, setError] = useState("");

  const handleSubmit = () => {
    setError("");
    try {
      // Auto-clean common JSON typos (like consecutive commas or trailing commas)
      const cleanedInput = input.replace(/,\s*(?=[,\]])/g, "");
      const parsed = JSON.parse(cleanedInput);
      if (!Array.isArray(parsed)) {
        setError("Input must be a JSON array of strings.");
        return;
      }
      onSubmit(parsed);
    } catch {
      setError("Invalid JSON format. Please enter a valid JSON array.");
    }
  };

  const handleLoadExample = () => {
    setInput(EXAMPLE_DATA);
    setError("");
  };

  return (
    <div className="glass-card p-6 md:p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-white/90">Input Data</h2>
          <p className="text-sm text-white/40 mt-0.5">
            Enter a JSON array of relationship strings
          </p>
        </div>
        <button
          onClick={handleLoadExample}
          className="pill pill-purple cursor-pointer hover:scale-105 transition-transform"
        >
          Load Example
        </button>
      </div>

      {/* Textarea */}
      <textarea
        id="data-input"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setError("");
        }}
        placeholder='["A->B", "A->C", "B->D"]'
        rows={6}
        className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-sm font-mono text-white/80 placeholder-white/20 resize-y focus:border-[#7c3aed]/50 transition-colors"
        spellCheck={false}
      />

      {/* Error message */}
      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-red-400">
          <svg
            className="w-4 h-4 shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </div>
      )}

      {/* Submit button */}
      <button
        id="submit-btn"
        onClick={handleSubmit}
        disabled={isLoading || !input.trim()}
        className="mt-5 w-full relative group cursor-pointer overflow-hidden rounded-xl bg-gradient-to-r from-[#7c3aed] to-[#06b6d4] px-6 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:shadow-[0_0_30px_rgba(124,58,237,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none"
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Process Hierarchies
            </>
          )}
        </span>
        {/* Hover shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
      </button>
    </div>
  );
}
