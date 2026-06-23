import uuid
from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


# ---------- Structured AI result sub-models ----------
class ProblemAnalysis(BaseModel):
    summary: str = ""
    pain_points: List[str] = Field(default_factory=list)
    stakeholders: List[str] = Field(default_factory=list)


class ProposedSolution(BaseModel):
    idea: str = ""
    key_features: List[str] = Field(default_factory=list)
    value_proposition: str = ""


class Architecture(BaseModel):
    overview: str = ""
    components: List[str] = Field(default_factory=list)
    data_flow: str = ""


class TechStack(BaseModel):
    frontend: List[str] = Field(default_factory=list)
    backend: List[str] = Field(default_factory=list)
    database: List[str] = Field(default_factory=list)
    ai: List[str] = Field(default_factory=list)
    infra: List[str] = Field(default_factory=list)


class RoadmapPhase(BaseModel):
    phase: str = ""
    goals: List[str] = Field(default_factory=list)
    deliverables: List[str] = Field(default_factory=list)


class PptSlide(BaseModel):
    slide: int = 0
    title: str = ""
    bullets: List[str] = Field(default_factory=list)


class SolutionResult(BaseModel):
    problem_analysis: ProblemAnalysis = Field(default_factory=ProblemAnalysis)
    solution: ProposedSolution = Field(default_factory=ProposedSolution)
    architecture: Architecture = Field(default_factory=Architecture)
    tech_stack: TechStack = Field(default_factory=TechStack)
    roadmap: List[RoadmapPhase] = Field(default_factory=list)
    ppt_content: List[PptSlide] = Field(default_factory=list)
    innovation_highlights: List[str] = Field(default_factory=list)


# ---------- API DTOs ----------
class SolutionCreate(BaseModel):
    problem_statement: str = Field(min_length=10, max_length=5000)
    title: Optional[str] = Field(default=None, max_length=200)


class SolutionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: Optional[str]
    problem_statement: str
    status: str
    model_used: Optional[str]
    result: Optional[SolutionResult]
    error_message: Optional[str]
    created_at: datetime
    updated_at: datetime


class SolutionListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    title: Optional[str]
    status: str
    created_at: datetime


class SolutionList(BaseModel):
    items: List[SolutionListItem]
    total: int
    limit: int
    offset: int
