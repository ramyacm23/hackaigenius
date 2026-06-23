from html import escape

from weasyprint import HTML

from app.models.solution import Solution
from app.schemas.solution import SolutionResult


def _ul(items: list[str]) -> str:
    if not items:
        return "<p class='muted'>—</p>"
    return "<ul>" + "".join(f"<li>{escape(str(i))}</li>" for i in items) + "</ul>"


def _section(title: str, body: str) -> str:
    return f"<section><h2>{escape(title)}</h2>{body}</section>"


def _build_html(solution: Solution) -> str:
    result = SolutionResult.model_validate(solution.result or {})
    title = solution.title or "HackGenius Solution"

    problem = (
        f"<p>{escape(result.problem_analysis.summary)}</p>"
        "<h3>Pain Points</h3>" + _ul(result.problem_analysis.pain_points)
        + "<h3>Stakeholders</h3>" + _ul(result.problem_analysis.stakeholders)
    )

    solution_html = (
        f"<p><strong>Idea:</strong> {escape(result.solution.idea)}</p>"
        "<h3>Key Features</h3>" + _ul(result.solution.key_features)
        + f"<p><strong>Value Proposition:</strong> "
        f"{escape(result.solution.value_proposition)}</p>"
    )

    arch = (
        f"<p>{escape(result.architecture.overview)}</p>"
        "<h3>Components</h3>" + _ul(result.architecture.components)
        + f"<p><strong>Data Flow:</strong> {escape(result.architecture.data_flow)}</p>"
    )

    ts = result.tech_stack
    tech = (
        "<h3>Frontend</h3>" + _ul(ts.frontend)
        + "<h3>Backend</h3>" + _ul(ts.backend)
        + "<h3>Database</h3>" + _ul(ts.database)
        + "<h3>AI</h3>" + _ul(ts.ai)
        + "<h3>Infrastructure</h3>" + _ul(ts.infra)
    )

    roadmap = "".join(
        f"<h3>{escape(p.phase)}</h3><strong>Goals</strong>{_ul(p.goals)}"
        f"<strong>Deliverables</strong>{_ul(p.deliverables)}"
        for p in result.roadmap
    ) or "<p class='muted'>—</p>"

    ppt = "".join(
        f"<div class='slide'><h3>Slide {s.slide}: {escape(s.title)}</h3>"
        f"{_ul(s.bullets)}</div>"
        for s in result.ppt_content
    ) or "<p class='muted'>—</p>"

    innovation = _ul(result.innovation_highlights)

    return f"""<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>
  @page {{ size: A4; margin: 2cm; }}
  body {{ font-family: 'Helvetica', Arial, sans-serif; color: #1f2937; font-size: 12px; }}
  h1 {{ color: #4f46e5; border-bottom: 3px solid #4f46e5; padding-bottom: 8px; }}
  h2 {{ color: #4338ca; margin-top: 24px; }}
  h3 {{ color: #6366f1; margin-bottom: 4px; }}
  ul {{ margin: 4px 0 12px 18px; }}
  .muted {{ color: #9ca3af; }}
  .slide {{ border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px 12px; margin: 8px 0; }}
  .meta {{ color: #6b7280; font-size: 11px; margin-bottom: 16px; }}
</style></head><body>
  <h1>{escape(title)}</h1>
  <p class="meta">Problem: {escape(solution.problem_statement)}</p>
  {_section("1. Problem Analysis", problem)}
  {_section("2. Proposed Solution", solution_html)}
  {_section("3. System Architecture", arch)}
  {_section("4. Recommended Tech Stack", tech)}
  {_section("5. Implementation Roadmap", roadmap)}
  {_section("6. PPT Content", ppt)}
  {_section("7. Innovation Highlights", innovation)}
</body></html>"""


def generate_pdf(solution: Solution) -> bytes:
    html = _build_html(solution)
    return HTML(string=html).write_pdf()
