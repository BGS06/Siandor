from fastapi import FastAPI, BackgroundTasks, File, UploadFile, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import pandas as pd
import datetime
import os
import gspread
from google.oauth2.service_account import Credentials

# --- 1. SETUP DATABASE SQLITE ---
from sqlalchemy import create_engine, Column, Integer, String, desc
from sqlalchemy.orm import sessionmaker, declarative_base, Session

SQLALCHEMY_DATABASE_URL = "sqlite:///./siandor.db"
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

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI(title="SIANDOR API", version="1.0")

# --- 2. SETUP FOLDER UPLOAD ---
UPLOAD_DIR = "uploads"
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = 'GANTI_DENGAN_ID_SPREADSHEET_BARU' # Pastikan ID Spreadsheet-mu tetap di sini

# --- 3. ENDPOINT CRUD SURAT ---

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
    
    return {"status": "success", "pesan": "Surat berhasil disimpan ke database asli!"}

# API BARU: Mengambil seluruh data surat untuk ditampilkan di Frontend
@app.get("/api/surat")
def ambil_semua_surat(db: Session = Depends(get_db)):
    surat = db.query(SuratDB).order_by(desc(SuratDB.id)).all()
    return surat

# API BARU: Mengambil statistik untuk halaman Laporan dan Dashboard
@app.get("/api/statistik")
def ambil_statistik(db: Session = Depends(get_db)):
    semua_surat = db.query(SuratDB).order_by(desc(SuratDB.id)).all()
    
    total_surat = len(semua_surat)
    total_proses = sum(1 for s in semua_surat if s.status.lower() == "proses")
    total_selesai = sum(1 for s in semua_surat if s.status.lower() == "selesai")
    
    # Asumsi: Jika nama jenis surat mengandung kata "keluar", maka itu Surat Keluar
    total_keluar = sum(1 for s in semua_surat if "keluar" in s.jenis_surat.lower())
    total_masuk = total_surat - total_keluar
    
    # Mengambil 5 surat terbaru untuk tabel kecil di Dashboard/Laporan
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

# --- 4. FUNGSI BACKUP (SEKARANG TERHUBUNG KE DATABASE ASLI) ---
def proses_backup_otomatis(tipe: str = None):
    print("Memulai proses backup Database...")
    db = SessionLocal() # Buka koneksi database khusus untuk task latar belakang
    try:
        semua_surat = db.query(SuratDB).all()
        
        # Filter jika tombol yang ditekan adalah "Backup Surat Masuk" / "Keluar"
        if tipe == "masuk":
            semua_surat = [s for s in semua_surat if "keluar" not in s.jenis_surat.lower()]
        elif tipe == "keluar":
            semua_surat = [s for s in semua_surat if "keluar" in s.jenis_surat.lower()]

        if not semua_surat:
            print("Tidak ada data untuk dibackup.")
            return

        # Mengubah data dari Database menjadi format yang siap diekspor ke Excel/Sheets
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
        folder_backup = "backup_lokal"
        nama_tipe = f"_{tipe.upper()}" if tipe else ""
        nama_file_excel = f"{folder_backup}/Backup_Arsip{nama_tipe}_{waktu_sekarang}.xlsx"
        
        # LAPIS 1: EXCEL LOKAL
        if not os.path.exists(folder_backup):
            os.makedirs(folder_backup)
        df.to_excel(nama_file_excel, index=False)
        print(f"✅ LAPIS 1 SUKSES: Excel tersimpan di {nama_file_excel}")

        # LAPIS 2: GOOGLE SPREADSHEET
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
        db.close() # Tutup database setelah selesai
        
    print("BACKUP DATABASE SELESAI DENGAN AMAN!")

@app.post("/api/backup")
def jalankan_backup(background_tasks: BackgroundTasks, tipe: str = None):
    background_tasks.add_task(proses_backup_otomatis, tipe)
    return {
        "status": "success",
        "pesan": "Database asli berhasil diamankan ke Excel & Google Spreadsheet!"
    }