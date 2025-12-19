from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.movie import Movie

router = APIRouter()

def make_absolute_url(request: Request, path: str) -> str:
    # path like "/static/posters/toy_story.jpg"
    return str(request.base_url).rstrip("/") + path

@router.get("/")
def list_movies(
    request: Request,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    movies = db.query(Movie).limit(limit).all()

    results = []
    for m in movies:
        # Pick poster filename if you have it in DB; else default
        poster_filename = getattr(m, "poster_file", None) or "toy_story.jpg"
        poster_path = f"/static/posters/{poster_filename}"

        results.append(
            {
                "id": m.id,
                "title": m.title,
                "year": m.year,
                "popularity": m.popularity,
                "genres": getattr(m, "genres", None),
                # ✅ absolute URL for frontend
                "poster_url": make_absolute_url(request, poster_path),
            }
        )

    return results
