import uuid

from fastapi import APIRouter, BackgroundTasks, Depends, Query, status
from fastapi.responses import Response

from app.api.v1.deps import get_solution_service
from app.schemas.solution import (
    SolutionCreate,
    SolutionList,
    SolutionRead,
)
from app.services.pdf_service import generate_pdf
from app.services.solution_service import SolutionService, run_generation

router = APIRouter(prefix="/solutions", tags=["solutions"])


@router.post("", response_model=SolutionRead, status_code=status.HTTP_201_CREATED)
def create_solution(
    payload: SolutionCreate,
    background_tasks: BackgroundTasks,
    service: SolutionService = Depends(get_solution_service),
) -> SolutionRead:
    solution = service.create_solution(
        problem_statement=payload.problem_statement, title=payload.title
    )
    background_tasks.add_task(run_generation, solution.id)
    return solution


@router.get("", response_model=SolutionList)
def list_solutions(
    limit: int = Query(default=20, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    service: SolutionService = Depends(get_solution_service),
) -> SolutionList:
    items, total = service.list_solutions(limit=limit, offset=offset)
    return SolutionList(items=items, total=total, limit=limit, offset=offset)


@router.get("/{solution_id}", response_model=SolutionRead)
def get_solution(
    solution_id: uuid.UUID,
    service: SolutionService = Depends(get_solution_service),
) -> SolutionRead:
    return service.get_solution(solution_id)


@router.get("/{solution_id}/pdf")
def export_pdf(
    solution_id: uuid.UUID,
    service: SolutionService = Depends(get_solution_service),
) -> Response:
    solution = service.get_solution(solution_id)
    pdf_bytes = generate_pdf(solution)
    filename = f"hackgenius-{solution_id}.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.delete("/{solution_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_solution(
    solution_id: uuid.UUID,
    service: SolutionService = Depends(get_solution_service),
) -> Response:
    service.delete_solution(solution_id)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
