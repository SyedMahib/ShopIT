import React from "react";

interface Props {
  current: number;
  total: number;
  onChange: (page: number) => void;
}

const range = (start: number, end: number) => Array.from({ length: end - start + 1 }, (_, i) => start + i);

export default function Pagination({ current, total, onChange }: Props) {
  const start = Math.max(1, current - 2);
  const end = Math.min(total, current + 2);
  const pages = range(start, end);

  return (
    <nav className="mt-6 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, current - 1))}
        disabled={current === 1}
        className="rounded border bg-white px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        Prev
      </button>
      {start > 1 && (
        <button type="button" onClick={() => onChange(1)} className="rounded border bg-white px-3 py-2 text-sm">
          1
        </button>
      )}
      {start > 2 && <span className="px-2 text-sm text-slate-500">...</span>}
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`rounded border px-3 py-2 text-sm ${p === current ? "bg-blue-600 text-white" : "bg-white"}`}
        >
          {p}
        </button>
      ))}
      {end < total - 1 && <span className="px-2 text-sm text-slate-500">...</span>}
      {end < total && (
        <button type="button" onClick={() => onChange(total)} className="rounded border bg-white px-3 py-2 text-sm">
          {total}
        </button>
      )}
      <button
        type="button"
        onClick={() => onChange(Math.min(total, current + 1))}
        disabled={current === total}
        className="rounded border bg-white px-3 py-2 text-sm transition disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next
      </button>
    </nav>
  );
}
