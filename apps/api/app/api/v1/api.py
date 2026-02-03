from fastapi import APIRouter
from app.api.v1.movies import router as movies_router
from app.api.v1 import movies
from app.api.v1 import interactions

api_router = APIRouter()
api_router.include_router(movies_router)
api_router.include_router(movies.router, prefix="/movies", tags=["movies"])
api_router.include_router(interactions.router, prefix="/interactions", tags=["interactions"])