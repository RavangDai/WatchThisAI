
from sqlalchemy import Integer, String, Text, Float
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column
from pgvector.sqlalchemy import Vector
from app.db.base import Base

class Movie(Base):
    __tablename__ = "movies"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)  # MovieLens id
    title: Mapped[str] = mapped_column(String(300), index=True)
    year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    genres: Mapped[list[str]] = mapped_column(ARRAY(String(50)), default=list)
    overview: Mapped[str | None] = mapped_column(Text, nullable=True)
    popularity: Mapped[float] = mapped_column(Float, default=0.0)

    embedding: Mapped[list[float] | None] = mapped_column(Vector(384), nullable=True)
