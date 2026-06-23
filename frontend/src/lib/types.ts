export type SolutionStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface ProblemAnalysis {
  summary: string;
  pain_points: string[];
  stakeholders: string[];
}

export interface ProposedSolution {
  idea: string;
  key_features: string[];
  value_proposition: string;
}

export interface Architecture {
  overview: string;
  components: string[];
  data_flow: string;
}

export interface TechStack {
  frontend: string[];
  backend: string[];
  database: string[];
  ai: string[];
  infra: string[];
}

export interface RoadmapPhase {
  phase: string;
  goals: string[];
  deliverables: string[];
}

export interface PptSlide {
  slide: number;
  title: string;
  bullets: string[];
}

export interface SolutionResult {
  problem_analysis: ProblemAnalysis;
  solution: ProposedSolution;
  architecture: Architecture;
  tech_stack: TechStack;
  roadmap: RoadmapPhase[];
  ppt_content: PptSlide[];
  innovation_highlights: string[];
}

export interface Solution {
  id: string;
  title: string | null;
  problem_statement: string;
  status: SolutionStatus;
  model_used: string | null;
  result: SolutionResult | null;
  error_message: string | null;
  created_at: string;
  updated_at: string;
}

export interface SolutionListItem {
  id: string;
  title: string | null;
  status: SolutionStatus;
  created_at: string;
}

export interface SolutionList {
  items: SolutionListItem[];
  total: number;
  limit: number;
  offset: number;
}

export interface CreateSolutionPayload {
  problem_statement: string;
  title?: string;
}
