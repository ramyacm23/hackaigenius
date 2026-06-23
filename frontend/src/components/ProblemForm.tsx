"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { ApiError, api } from "@/lib/api";

const EXAMPLES = [
  "Reduce food waste in college canteens using real-time demand prediction.",
  "Help visually impaired users navigate public transport independently.",
  "Detect early signs of crop disease for small-scale farmers using phone cameras.",
];

export function ProblemForm() {
  const router = useRouter();
  const [problem, setProblem] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (problem.trim().length < 10) {
      setError("Please describe the problem in at least 10 characters.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const solution = await api.createSolution({
        problem_statement: problem.trim(),
        title: title.trim() || undefined,
      });
      router.push(`/solutions/${solution.id}`);
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Something went wrong.",
      );
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <label className="mb-2 block text-sm font-medium text-slate-700">
        Project title (optional)
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. SmartCanteen"
        maxLength={200}
        className="mb-5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />

      <label className="mb-2 block text-sm font-medium text-slate-700">
        Problem statement
      </label>
      <textarea
        value={problem}
        onChange={(e) => setProblem(e.target.value)}
        placeholder="Describe the hackathon problem you want to solve…"
        rows={6}
        maxLength={5000}
        className="w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
      />

      <div className="mt-3 flex flex-wrap gap-2">
        {EXAMPLES.map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => setProblem(ex)}
            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs text-slate-600 hover:border-brand hover:text-brand"
          >
            {ex.slice(0, 40)}…
          </button>
        ))}
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 font-medium text-white transition hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Generating…" : "Generate Solution ⚡"}
      </button>
    </form>
  );
}
