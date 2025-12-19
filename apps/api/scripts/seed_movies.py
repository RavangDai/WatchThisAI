import csv
import re
from pathlib import Path

from sqlalchemy import delete
from app.db.session import SessionLocal
from app.models.movie import Movie

ROOT = Path(__file__).resolve().parents[2]  # repo root
CSV_PATH = ROOT / "data" / "ml-latest-small" / "movies.csv"

YEAR_RE = re.compile(r"\((\d{4})\)\s*$")

def parse_title_year(title: str):
    m = YEAR_RE.search(title)
    if not m:
        return title, None
    year = int(m.group(1))
    clean_title = YEAR_RE.sub("", title).strip()
    return clean_title, year

def main():
    if not CSV_PATH.exists():
        raise FileNotFoundError(f"Missing {CSV_PATH}. Download MovieLens first.")

    db = SessionLocal()
    try:
        # safe reset for dev
        db.execute(delete(Movie))
        db.commit()

        count = 0
        with CSV_PATH.open("r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                movie_id = int(row["movieId"])
                raw_title = row["title"]
                genres_raw = row["genres"] or ""
                genres = [] if genres_raw == "(no genres listed)" else genres_raw.split("|")

                title, year = parse_title_year(raw_title)

                db.add(
                    Movie(
                        id=movie_id,
                        title=title,
                        year=year,
                        genres=genres,
                        overview=None,
                        popularity=0.0,
                        embedding=None,
                    )
                )
                count += 1

                if count % 500 == 0:
                    db.commit()
                    print(f"Inserted {count} movies...")

        db.commit()
        print(f"✅ Done. Inserted {count} movies into movies table.")
    finally:
        db.close()

if __name__ == "__main__":
    main()

