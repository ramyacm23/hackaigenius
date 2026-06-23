import type { Solution } from "@/lib/types";

import { ExportPdfButton } from "./ExportPdfButton";
import { BulletList, SectionCard, TagList } from "./SectionCard";
import { StatusBadge } from "./StatusBadge";

export function SolutionView({ solution }: { solution: Solution }) {
  const r = solution.result;
  if (!r) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900">
              {solution.title || "Generated Solution"}
            </h1>
            <StatusBadge status={solution.status} />
          </div>
          <p className="text-sm text-slate-500">{solution.problem_statement}</p>
        </div>
        <ExportPdfButton id={solution.id} />
      </div>

      <SectionCard icon="🔍" title="1. Problem Analysis">
        <p>{r.problem_analysis.summary}</p>
        <h3 className="font-semibold text-slate-700">Pain Points</h3>
        <BulletList items={r.problem_analysis.pain_points} />
        <h3 className="font-semibold text-slate-700">Stakeholders</h3>
        <BulletList items={r.problem_analysis.stakeholders} />
      </SectionCard>

      <SectionCard icon="💡" title="2. Proposed Solution">
        <p>
          <span className="font-semibold text-slate-700">Idea: </span>
          {r.solution.idea}
        </p>
        <h3 className="font-semibold text-slate-700">Key Features</h3>
        <BulletList items={r.solution.key_features} />
        <p>
          <span className="font-semibold text-slate-700">
            Value Proposition:{" "}
          </span>
          {r.solution.value_proposition}
        </p>
      </SectionCard>

      <SectionCard icon="🏗️" title="3. System Architecture">
        <p>{r.architecture.overview}</p>
        <h3 className="font-semibold text-slate-700">Components</h3>
        <BulletList items={r.architecture.components} />
        <p>
          <span className="font-semibold text-slate-700">Data Flow: </span>
          {r.architecture.data_flow}
        </p>
      </SectionCard>

      <SectionCard icon="🧰" title="4. Recommended Tech Stack">
        <h3 className="font-semibold text-slate-700">Frontend</h3>
        <TagList items={r.tech_stack.frontend} />
        <h3 className="font-semibold text-slate-700">Backend</h3>
        <TagList items={r.tech_stack.backend} />
        <h3 className="font-semibold text-slate-700">Database</h3>
        <TagList items={r.tech_stack.database} />
        <h3 className="font-semibold text-slate-700">AI</h3>
        <TagList items={r.tech_stack.ai} />
        <h3 className="font-semibold text-slate-700">Infrastructure</h3>
        <TagList items={r.tech_stack.infra} />
      </SectionCard>

      <SectionCard icon="🗺️" title="5. Implementation Roadmap">
        <div className="space-y-4">
          {r.roadmap.map((phase, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-100 bg-slate-50 p-4"
            >
              <h3 className="font-semibold text-brand-dark">{phase.phase}</h3>
              <p className="mt-2 text-xs font-semibold uppercase text-slate-400">
                Goals
              </p>
              <BulletList items={phase.goals} />
              <p className="mt-2 text-xs font-semibold uppercase text-slate-400">
                Deliverables
              </p>
              <BulletList items={phase.deliverables} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon="📊" title="6. PPT Content">
        <div className="grid gap-4 sm:grid-cols-2">
          {r.ppt_content.map((slide) => (
            <div
              key={slide.slide}
              className="rounded-lg border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-4"
            >
              <p className="text-xs font-semibold text-slate-400">
                Slide {slide.slide}
              </p>
              <h3 className="mb-2 font-semibold text-slate-800">
                {slide.title}
              </h3>
              <BulletList items={slide.bullets} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard icon="🚀" title="7. Innovation Highlights">
        <BulletList items={r.innovation_highlights} />
      </SectionCard>
    </div>
  );
}
