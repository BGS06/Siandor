from fastapi import FastAPI, BackgroundTasks, File, UploadFile, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import pandas as pd
import datetime
import os
import shutil
import gspread
from google.oauth2.service_account import Credentials
from sqlalchemy import create_engine, Column, Integer, String, desc
from sqlalchemy.orm import sessionmaker, declarative_base, Session

# ==========================================
# TRIK VERCEL: PINDAHKAN FILE/FOLDER KE /tmp
# ==========================================
# 1. Setup Lokasi Folder Uploads
UPLOAD_DIR = "/tmp/uploads"  # WAJIB menggunakan /tmp untuk Vercel
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

# 2. Setup Lokasi Database SQLite
original_db = "siandor.db"     # File lokalmu (hanya bisa dibaca oleh Vercel)
tmp_db = "/tmp/siandor.db"     # File duplikat yang diizinkan untuk ditulis

# Jika file db asli ada, copy ke /tmp agar siap digunakan
if os.path.exists(original_db) and not os.path.exists(tmp_db):
    shutil.copy2(original_db, tmp_db)

# Hubungkan SQLAlchemy ke database yang ada di /tmp
SQLALCHEMY_DATABASE_URL = f"sqlite:///{tmp_db}"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class SuratDB(Base):
    __tablename__ = "surat"
    id = Column(Integer, primary_key=True, index=True)
    no_agenda = Column(String, index=True)
    jenis_surat = Column(String)
    nama_pemohon = Column(String)
    nik = Column(String, nullable=True)
    perihal = Column(String)
    no_surat_asli = Column(String, nullable=True)
    tanggal = Column(String)
    status = Column(String)
    disposisi = Column(String)
    file_path = Column(String, nullable=True)

# Generate table jika belum ada
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# INISIALISASI FASTAPI
# ==========================================
app = FastAPI(title="SIANDOR API", version="1.0")

app.mount("/uploads", StaticFiles(directory="/tmp/uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Mengizinkan semua origin untuk deploy Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = '1Xz9g8VYe0rzPNdNUhnfH-sOXfv5fPuKMUhOP98dP9ls' 

# ==========================================
# ENDPOINT CRUD SURAT
# ==========================================
@app.post("/api/surat")
async def tambah_surat(
    no_agenda: str = Form(...),
    jenis_surat: str = Form(...),
    nama_pemohon: str = Form(...),
    nik: str = Form(""),
    perihal: str = Form(...),
    no_surat_asli: str = Form(""),
    tanggal: str = Form(...),
    status: str = Form(...),
    disposisi: str = Form(...),
    file: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    file_path = None
    if file:
        timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
        filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)
            
    db_surat = SuratDB(
        no_agenda=no_agenda,
        jenis_surat=jenis_surat,
        nama_pemohon=nama_pemohon,
        nik=nik,
        perihal=perihal,
        no_surat_asli=no_surat_asli,
        tanggal=tanggal,
        status=status,
        disposisi=disposisi,
        file_path=f"/uploads/{filename}" if file else None
    )
    db.add(db_surat)
    db.commit()
    db.refresh(db_surat)
    
    return {"status": "success", "pesan": "Surat berhasil disimpan ke Vercel /tmp!"}

@app.get("/api/surat")
def ambil_semua_surat(db: Session = Depends(get_db)):
    surat = db.query(SuratDB).order_by(desc(SuratDB.id)).all()
    return surat

@app.get("/api/statistik")
def ambil_statistik(db: Session = Depends(get_db)):
    semua_surat = db.query(SuratDB).order_by(desc(SuratDB.id)).all()
    
    total_surat = len(semua_surat)
    total_proses = sum(1 for s in semua_surat if s.status.lower() == "proses")
    total_selesai = sum(1 for s in semua_surat if s.status.lower() == "selesai")
    
    total_keluar = sum(1 for s in semua_surat if "keluar" in s.jenis_surat.lower())
    total_masuk = total_surat - total_keluar
    
    terbaru = []
    for s in semua_surat[:5]:
        tipe = "keluar" if "keluar" in s.jenis_surat.lower() else "masuk"
        b_color = "bg-hijau-pale text-hijau-tua" if s.status.lower() == "selesai" else "bg-emas-pale text-emas"
        terbaru.append({
            "agenda": s.no_agenda,
            "jenis": s.jenis_surat,
            "asal": s.nama_pemohon,
            "perihal": s.perihal,
            "status": s.status,
            "tipe": tipe,
            "b": b_color
        })

    return {
        "total_surat": total_surat,
        "total_masuk": total_masuk,
        "total_keluar": total_keluar,
        "total_proses": total_proses,
        "total_selesai": total_selesai,
        "terbaru": terbaru
    }

# ==========================================
# FUNGSI BACKUP
# ==========================================
def proses_backup_otomatis(tipe: str = None):
    print("Memulai proses backup Database...")
    db = SessionLocal() 
    try:
        semua_surat = db.query(SuratDB).all()
        
        if tipe == "masuk":
            semua_surat = [s for s in semua_surat if "keluar" not in s.jenis_surat.lower()]
        elif tipe == "keluar":
            semua_surat = [s for s in semua_surat if "keluar" in s.jenis_surat.lower()]

        if not semua_surat:
            print("Tidak ada data untuk dibackup.")
            return

        data_arsip = []
        for s in semua_surat:
            data_arsip.append({
                "NO AGENDA": s.no_agenda,
                "JENIS SURAT": s.jenis_surat,
                "NAMA / ASAL": s.nama_pemohon,
                "PERIHAL": s.perihal,
                "NIK": s.nik or "-",
                "NO SURAT": s.no_surat_asli or "-",
                "TANGGAL": s.tanggal,
                "DISPOSISI": s.disposisi
            })

        df = pd.DataFrame(data_arsip)
        waktu_sekarang = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        
        # 3. Ubah Folder Backup Lokal ke /tmp
        folder_backup = "/tmp/backup_lokal"
        nama_tipe = f"_{tipe.upper()}" if tipe else ""
        nama_file_excel = f"{folder_backup}/Backup_Arsip{nama_tipe}_{waktu_sekarang}.xlsx"
        
        if not os.path.exists(folder_backup):
            os.makedirs(folder_backup)
        df.to_excel(nama_file_excel, index=False)
        print(f"✅ LAPIS 1 SUKSES: Excel tersimpan di {nama_file_excel}")

        creds = Credentials.from_service_account_file('credentials.json', scopes=SCOPES)
        client_gspread = gspread.authorize(creds)
        sheet = client_gspread.open_by_key(SPREADSHEET_ID).sheet1
        
        for data in data_arsip:
            baris_baru = [
                data["NO AGENDA"], data["JENIS SURAT"], data["NAMA / ASAL"], 
                data["PERIHAL"], data["NIK"], data["NO SURAT"], 
                data["TANGGAL"], data["DISPOSISI"]
            ]
            sheet.append_row(baris_baru)
        print("✅ LAPIS 2 SUKSES: Data tersinkronisasi ke Google Spreadsheet.")

    except Exception as e:
        print(f"❌ Error Proses Backup: {e}")
    finally:
        db.close() 
        
    print("BACKUP DATABASE SELESAI DENGAN AMAN!")

@app.post("/api/backup")
def jalankan_backup(background_tasks: BackgroundTasks, tipe: str = None):
    background_tasks.add_task(proses_backup_otomatis, tipe)
    return {
        "status": "success",
        "pesan": "Database berhasil diamankan ke Excel & Google Spreadsheet!"
    }