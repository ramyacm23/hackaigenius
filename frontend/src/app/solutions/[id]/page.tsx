"use client";

import Link from "next/link";
import { use } from "react";

import { SolutionView } from "@/components/SolutionView";
import { useSolution } from "@/hooks/useSolution";

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6">
        <div className="skeleton mb-3 h-7 w-1/2 rounded" />
        <div className="skeleton h-4 w-3/4 rounded" />
      </div>
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl border border-slate-200 bg-white p-6"
        >
          <div className="skeleton mb-4 h-5 w-1/3 rounded" />
          <div className="skeleton mb-2 h-4 w-full rounded" />
          <div className="skeleton mb-2 h-4 w-5/6 rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
        </div>
      ))}
      <p className="text-center text-sm text-slate-500">
        🤖 HackGenius is generating your solution… this usually takes 15–40
        seconds.
      </p>
    </div>
  );
}

export default function SolutionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { solution, loading, error } = useSolution(id);

  if (loading && !solution) return <LoadingState />;

  if (error && !solution) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-red-600">{error}</p>
        <Link href="/" className="mt-4 inline-block text-sm text-brand underline">
          ← Back to start
        </Link>
      </div>
    );
  }

  if (!solution) return null;

  if (solution.status === "FAILED") {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <h2 className="text-lg font-semibold text-red-700">
          Generation failed
        </h2>
        <p className="mt-2 text-sm text-red-600">
          {solution.error_message ||
            "The AI could not generate a solution. Please try again."}
        </p>
        <Link href="/" className="mt-4 inline-block text-sm text-brand underline">
          ← Try another problem
        </Link>
      </div>
    );
  }

  if (solution.status === "PENDING" || solution.status === "PROCESSING") {
    return <LoadingState />;
  }

  return <SolutionView solution={solution} />;
}
