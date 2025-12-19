\
import uuid
from datetime import datetime
from sqlalchemy import ForeignKey, String, DateTime, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class Interaction(Base):
    __tablename__ = "interactions"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id"), index=True)
    movie_id: Mapped[int] = mapped_column(ForeignKey("movies.id"), index=True)

    event: Mapped[str] = mapped_column(String(30))  # view|rate|like|watchlist
    rating: Mapped[float | None] = mapped_column(Float, nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, index=True)
