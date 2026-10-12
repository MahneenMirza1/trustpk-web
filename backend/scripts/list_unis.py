import sys
from pathlib import Path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import select
from app.db.database import SessionLocal
from app.models.university import University

db = SessionLocal()
unis = db.scalars(select(University).order_by(University.id)).all()
for u in unis:
    print(f"ID={u.id} | Name={u.name} | Sector={u.sector} | Status={u.hec_recognition_status}")
db.close()
