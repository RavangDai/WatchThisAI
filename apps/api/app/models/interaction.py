from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import relationship

from app.db.base import Base


class Interaction(Base):
    __tablename__ = "interactions"

    id = Column(Integer, primary_key=True, index=True)

    # Optional user (later when auth exists)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)

    # Movie being interacted with (can be null for "search" events if you want)
    movie_id = Column(Integer, ForeignKey("movies.id"), nullable=True, index=True)

    # Anonymous session tracking (frontend will send it)
    session_id = Column(String(64), nullable=True, index=True)

    # event types: "view", "click", "hover", "search", etc.
    event_type = Column(String(32), nullable=False, index=True)

    # any extra info: {"query": "...", "page": "home"} etc.
    meta = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    # Optional relationships
    movie = relationship("Movie", lazy="joined")
    user = relationship("User", lazy="joined")
