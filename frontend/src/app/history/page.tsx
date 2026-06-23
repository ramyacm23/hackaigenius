"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { StatusBadge } from "@/components/StatusBadge";
import { ApiError, api } from "@/lib/api";
import type { SolutionListItem } from "@/lib/types";

export default function HistoryPage() {
  const [items, setItems] = useState<SolutionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.listSolutions(50, 0);
      setItems(data.items);
      setError(null);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this solution?")) return;
    try {
      await api.deleteSolution(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Your Solutions</h1>

      {loading && (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton h-16 rounded-xl" />
          ))}
        </div>
      )}

      {error && !loading && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <p className="text-slate-500">No solutions yet.</p>
          <Link
            href="/"
            className="mt-3 inline-block rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark"
          >
            Generate your first one
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-brand/40"
          >
            <Link href={`/solutions/${item.id}`} className="min-w-0 flex-1">
              <p className="truncate font-medium text-slate-800">
                {item.title || "Untitled solution"}
              </p>
              <p className="text-xs text-slate-400">
                {new Date(item.created_at).toLocaleString()}
              </p>
            </Link>
            <div className="ml-4 flex items-center gap-3">
              <StatusBadge status={item.status} />
              <button
                onClick={() => handleDelete(item.id)}
                className="text-sm text-slate-400 hover:text-red-500"
                aria-label="Delete"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
