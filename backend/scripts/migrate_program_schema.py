"""
Migration script to ensure all department and program-level fields exist in the programs table.
"""
from sqlalchemy import text
from app.db.database import engine

def migrate():
    with engine.connect() as conn:
        print("Checking/migrating programs table columns...")
        statements = [
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS name VARCHAR(255) DEFAULT 'BS Program';",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS degree_level VARCHAR(50) DEFAULT 'BS';",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS department VARCHAR(255) DEFAULT 'General Faculty';",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS merit_formula JSONB;",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS last_closing_merit NUMERIC(6,2);",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS closing_merit_display VARCHAR(100);",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS admission_deadline VARCHAR(100);",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS admission_test VARCHAR(150);",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS accreditation_body VARCHAR(100);",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS accreditation_status VARCHAR(100);",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS eligibility_criteria TEXT;",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS fee_per_semester NUMERIC(10,2);",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS fee_display VARCHAR(150);",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS source_url VARCHAR(1000) DEFAULT 'https://www.hec.gov.pk';",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS effective_year INTEGER DEFAULT 2026;",
            "ALTER TABLE programs ADD COLUMN IF NOT EXISTS last_verified DATE DEFAULT '2026-09-20';",
        ]
        for stmt in statements:
            conn.execute(text(stmt))
        conn.commit()
        print("Successfully migrated programs table schema!")

if __name__ == "__main__":
    migrate()
