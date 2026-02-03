
from sqlalchemy import Integer, String, Text, Float, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.db.base import Base

class Movie(Base):
    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)  # MovieLens id
    title: Mapped[str] = mapped_column(String(300), index=True)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    genres: Mapped[list[str]] = mapped_column(JSON, default=list)
    overview: Mapped[str | None] = mapped_column(Text, nullable=True)
    popularity: Mapped[float] = mapped_column(Float, default=0.0)
    poster_path: Mapped[str | None] = mapped_column(String(500), nullable=True)

    # Storing embedding as JSON for SQLite compatibility (no vector search)
    embedding: Mapped[list[float] | None] = mapped_column(JSON, nullable=True)
