from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.interaction import Interaction
from app.schemas.interaction import InteractionCreate, InteractionOut

router = APIRouter()


@router.post("/", response_model=InteractionOut)
def create_interaction(payload: InteractionCreate, db: Session = Depends(get_db)):
    row = Interaction(
        event_type=payload.event_type,
        movie_id=payload.movie_id,
        session_id=payload.session_id,
        meta=payload.meta,
    )
    db.add(row)
    db.commit()
    db.refresh(row)
    return row
