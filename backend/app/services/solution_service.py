import uuid

from app.ai.gemini_client import get_gemini_client
from app.core.exceptions import GeminiError, NotFoundError
from app.core.logging import get_logger
from app.db.session import SessionLocal
from app.models.solution import Solution, SolutionStatus
from app.repositories.solution_repo import SolutionRepository
from app.schemas.solution import SolutionResult

logger = get_logger(__name__)


class SolutionService:
    def __init__(self, repo: SolutionRepository):
        self.repo = repo

    def create_solution(self, problem_statement: str, title: str | None) -> Solution:
        return self.repo.create(problem_statement=problem_statement, title=title)

    def get_solution(self, solution_id: uuid.UUID) -> Solution:
        solution = self.repo.get(solution_id)
        if not solution:
            raise NotFoundError("Solution not found")
        return solution

    def list_solutions(self, limit: int, offset: int):
        return self.repo.list(limit=limit, offset=offset)

    def delete_solution(self, solution_id: uuid.UUID) -> None:
        solution = self.get_solution(solution_id)
        self.repo.delete(solution)


def run_generation(solution_id: uuid.UUID) -> None:
    """Background task: own its own DB session and lifecycle."""
    db = SessionLocal()
    repo = SolutionRepository(db)
    try:
        solution = repo.get(solution_id)
        if not solution:
            logger.error("Solution %s vanished before generation", solution_id)
            return

        repo.update_status(solution, SolutionStatus.PROCESSING)

        client = get_gemini_client()
        raw_result = client.generate_solution(
            solution.problem_statement, solution.title
        )

        # Validate & normalize against our Pydantic schema.
        validated = SolutionResult.model_validate(raw_result)

        repo.update_status(
            solution,
            SolutionStatus.COMPLETED,
            result=validated.model_dump(),
            model_used=client.model_name,
        )
        logger.info("Solution %s completed", solution_id)

    except (GeminiError, Exception) as exc:  # noqa: BLE001
        logger.exception("Generation failed for %s", solution_id)
        solution = repo.get(solution_id)
        if solution:
            repo.update_status(
                solution,
                SolutionStatus.FAILED,
                error_message=str(exc),
            )
    finally:
        db.close()
