from fastapi import APIRouter

from app.api.v1 import routes_health, routes_solutions

api_router = APIRouter()
api_router.include_router(routes_health.router)
api_router.include_router(routes_solutions.router)
