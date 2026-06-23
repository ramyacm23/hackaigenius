from fastapi import Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.repositories.solution_repo import SolutionRepository
from app.services.solution_service import SolutionService


def get_solution_service(db: Session = Depends(get_db)) -> SolutionService:
    return SolutionService(SolutionRepository(db))
