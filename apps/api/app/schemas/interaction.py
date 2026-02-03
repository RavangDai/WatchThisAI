from typing import Any, Dict, Optional
from pydantic import BaseModel


class InteractionCreate(BaseModel):
    event_type: str
    movie_id: Optional[int] = None
    session_id: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None


class InteractionOut(BaseModel):
    id: int
    event_type: str
    movie_id: Optional[int]
    session_id: Optional[str]
    meta: Optional[Dict[str, Any]]

    class Config:
        from_attributes = True
