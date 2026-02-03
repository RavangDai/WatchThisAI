from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.movie import Movie

router = APIRouter()

def make_absolute_url(request: Request, path: str) -> str:
    # path like "/static/posters/toy_story.jpg"
    return str(request.base_url).rstrip("/") + path

from sqlalchemy import or_

@router.get("/")
def list_movies(
    request: Request,
    q: str | None = None,
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
):
    query = db.query(Movie)
    
    if q:
        search = f"%{q}%"
        # Search title OR genre (stored as JSON/text, so cast to text for SQLite search if needed, but simple ilike works for strings)
        # Note: genres is JSON. In SQLite we can cast to text or just check if it contains query if possible. 
        # For simplicity in this dev environment with SQLite, we'll try simple ILIKE on title first.
        # To search JSON array in SQLite via SQLAlchemy is tricky without specific functions.
        # Let's start with Title search for robustness, and we can try to improve genre search if simple text matching fails.
        # Actually, since genres is just a list of strings, in SQLite it's stored as a JSON string like '["Action", "Comedy"]'.
        # So ilike on the column might work if we treat it as text. 
        # But safest is Title for now.
        
        # Search title OR genre
        # In SQLite, JSON is text, so we can cast and search.
        from sqlalchemy import cast, String
        
        query = query.filter(
            or_(
                Movie.title.ilike(search),
                cast(Movie.genres, String).ilike(search)
            )
        )

    movies = query.offset(skip).limit(limit).all()

    results = []
    for m in movies:
        # Pick poster filename if you have it in DB; else default
        db_poster = getattr(m, "poster_path", None)
        if db_poster and db_poster.startswith("http"):
             final_poster_url = db_poster
        else:
             poster_filename = getattr(m, "poster_file", None) or "toy_story.jpg"
             final_poster_url = make_absolute_url(request, f"/static/posters/{poster_filename}")

        results.append(
            {
                "id": m.id,
                "title": m.title,
                "year": m.year,
                "popularity": m.popularity,
                "genres": getattr(m, "genres", None),
                # ✅ absolute URL for frontend
                "poster_url": final_poster_url,
            }
        )

    return results
