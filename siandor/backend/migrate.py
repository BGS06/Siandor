"""
Jalankan sekali saja untuk migrasi database lama:
  python migrate.py

Script ini menambahkan kolom 'tipe' dan 'created_at' ke tabel surat
yang sudah ada di siandor.db, tanpa menghapus data yang sudah ada.
"""
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "siandor.db")

def migrate():
    if not os.path.exists(DB_PATH):
        print("siandor.db belum ada, tidak perlu migrasi. Main.py akan membuatnya otomatis.")
        return

    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Cek kolom yang sudah ada
    cur.execute("PRAGMA table_info(surat)")
    existing_columns = [row[1] for row in cur.fetchall()]
    print(f"Kolom yang ada: {existing_columns}")

    # Tambah kolom 'tipe' jika belum ada
    if "tipe" not in existing_columns:
        cur.execute("ALTER TABLE surat ADD COLUMN tipe TEXT DEFAULT 'masuk'")
        print("✅ Kolom 'tipe' berhasil ditambahkan (semua data lama = 'masuk')")
    else:
        print("ℹ️  Kolom 'tipe' sudah ada, skip.")

    # Tambah kolom 'created_at' jika belum ada
    if "created_at" not in existing_columns:
        cur.execute("ALTER TABLE surat ADD COLUMN created_at TEXT DEFAULT (datetime('now','localtime'))")
        print("✅ Kolom 'created_at' berhasil ditambahkan")
    else:
        print("ℹ️  Kolom 'created_at' sudah ada, skip.")

    conn.commit()

    # Verifikasi hasil
    cur.execute("SELECT COUNT(*) FROM surat")
    total = cur.fetchone()[0]
    print(f"\n✅ Migrasi selesai. Total data di DB: {total} surat")

    conn.close()

if __name__ == "__main__":
    migrate()