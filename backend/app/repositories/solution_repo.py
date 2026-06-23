import uuid
from typing import Sequence

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.models.solution import Solution, SolutionStatus


class SolutionRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, problem_statement: str, title: str | None) -> Solution:
        solution = Solution(
            problem_statement=problem_statement,
            title=title,
            status=SolutionStatus.PENDING.value,
        )
        self.db.add(solution)
        self.db.commit()
        self.db.refresh(solution)
        return solution

    def get(self, solution_id: uuid.UUID) -> Solution | None:
        return self.db.get(Solution, solution_id)

    def list(self, limit: int, offset: int) -> tuple[Sequence[Solution], int]:
        total = self.db.scalar(select(func.count()).select_from(Solution)) or 0
        items = (
            self.db.execute(
                select(Solution)
                .order_by(Solution.created_at.desc())
                .limit(limit)
                .offset(offset)
            )
            .scalars()
            .all()
        )
        return items, total

    def update_status(
        self,
        solution: Solution,
        status: SolutionStatus,
        *,
        result: dict | None = None,
        model_used: str | None = None,
        error_message: str | None = None,
    ) -> Solution:
        solution.status = status.value
        if result is not None:
            solution.result = result
        if model_used is not None:
            solution.model_used = model_used
        if error_message is not None:
            solution.error_message = error_message
        self.db.add(solution)
        self.db.commit()
        self.db.refresh(solution)
        return solution

    def delete(self, solution: Solution) -> None:
        self.db.delete(solution)
        self.db.commit()
