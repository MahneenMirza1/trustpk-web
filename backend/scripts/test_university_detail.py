import sys
from pathlib import Path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

from sqlalchemy import select
from app.db.database import SessionLocal
from app.models.university import University
from app.schemas.university import UniversityDetailResponse, DepartmentProgramsResponse, ProgramResponse

db = SessionLocal()
nust = db.scalar(select(University).where(University.name.ilike("%nust%")))
if not nust:
    print("NUST not found!")
    sys.exit(1)

dept_map = {}
for p in nust.programs:
    dept_name = p.department or "General Faculty"
    if dept_name not in dept_map:
        dept_map[dept_name] = []
    dept_map[dept_name].append(p)

departments_list = [
    DepartmentProgramsResponse(
        department=d_name,
        programs_count=len(d_progs),
        programs=[ProgramResponse.model_validate(dp) for dp in d_progs],
    )
    for d_name, d_progs in sorted(dept_map.items())
]

res = UniversityDetailResponse.model_validate(nust)
res.departments = departments_list

print(f"University: {res.name}")
print(f"Total departments: {len(res.departments)}")
for d in res.departments:
    print(f"\n--- Department: {d.department} ({d.programs_count} programs) ---")
    for prog in d.programs:
        print(f"  * {prog.name} [{prog.degree_level}]")
        print(f"    Closing Merit: {prog.closing_merit_display}")
        print(f"    Admission Deadline: {prog.admission_deadline}")
        print(f"    Accreditation: {prog.accreditation_body} - {prog.accreditation_status}")
        print(f"    Test: {prog.admission_test}")
        print(f"    Fee: {prog.fee_display}")
        print(f"    Source: {prog.source_url}")
        print(f"    Last Verified: {prog.last_verified}")
db.close()
