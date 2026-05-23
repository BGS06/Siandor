from fastapi import FastAPI, BackgroundTasks, File, UploadFile, Form, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pandas as pd
import datetime
import os
import shutil
import gspread
from google.oauth2.service_account import Credentials
from sqlalchemy import create_engine, Column, Integer, String, desc
from sqlalchemy.orm import sessionmaker, declarative_base, Session

# ==========================================
# TRIK PATH ABSOLUT UNTUK CREDENTIALS
# ==========================================
# Ini akan membuat Python selalu mencari credentials.json tepat di sebelah file index.py ini!
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_PATH = os.path.join(BASE_DIR, 'credentials.json')

# ==========================================
# TRIK VERCEL: PINDAHKAN FILE/FOLDER KE /tmp
# ==========================================
UPLOAD_DIR = "/tmp/uploads"  
if not os.path.exists(UPLOAD_DIR):
    os.makedirs(UPLOAD_DIR)

original_db = "siandor.db"     
tmp_db = "/tmp/siandor.db"     

if os.path.exists(original_db) and not os.path.exists(tmp_db):
    shutil.copy2(original_db, tmp_db)

SQLALCHEMY_DATABASE_URL = f"sqlite:///./siandor.db"
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

# ==========================================
# INISIALISASI FASTAPI & SETTING GOOGLE
# ==========================================
app = FastAPI(title="SIANDOR API", version="1.0")

app.mount("/uploads", StaticFiles(directory="/tmp/uploads"), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = '1Xz9g8VYe0rzPNdNUhnfH-sOXfv5fPuKMUhOP98dP9ls' 

# ==========================================
# FUNGSI SINKRONISASI MANUAL DARI TOMBOL LAPORAN
# ==========================================
@app.post("/api/surat/export/sheets")
def export_ke_google_sheets_manual(tipe: str = None, db: Session = Depends(get_db)):
    try:
        semua_surat = db.query(SuratDB).all()
        
        if tipe == "masuk":
            semua_surat = [s for s in semua_surat if "keluar" not in s.jenis_surat.lower()]
        elif tipe == "keluar":
            semua_surat = [s for s in semua_surat if "keluar" in s.jenis_surat.lower()]

        # Menggunakan CREDENTIALS_PATH yang sudah dijamin akurat lokasinya
        creds = Credentials.from_service_account_file(CREDENTIALS_PATH, scopes=SCOPES)
        client_gspread = gspread.authorize(creds)
        sheet = client_gspread.open_by_key(SPREADSHEET_ID).sheet1
        
        sheet.clear()
        
        header = ["NO AGENDA", "JENIS SURAT", "NAMA / ASAL", "PERIHAL", "NIK", "NO SURAT", "TANGGAL", "DISPOSISI", "STATUS"]
        sheet.append_row(header)
        
        if semua_surat:
            kumpulan_baris = []
            for s in semua_surat:
                kumpulan_baris.append([
                    s.no_agenda, s.jenis_surat, s.nama_pemohon, s.perihal,
                    s.nik or "-", s.no_surat_asli or "-", s.tanggal, s.disposisi, s.status
                ])
            sheet.append_rows(kumpulan_baris)
            
        label_tipe = "Semua Surat" if not tipe else f"Surat {tipe.capitalize()}"
        return {"status": "success", "pesan": f"Berhasil menulis {len(semua_surat)} data {label_tipe} ke Google Spreadsheet!"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ==========================================
# SINKRONISASI OTOMATIS SAAT INPUT DATA BARU
# ==========================================
def robot_kirim_ke_google_sheets(no_agenda, jenis_surat, nama_pemohon, perihal, nik, no_surat_asli, tanggal, disposisi, status):
    print("🤖 Robot Google Cloud mengirim data tunggal...")
    try:
        # Menggunakan CREDENTIALS_PATH yang sudah dijamin akurat lokasinya
        creds = Credentials.from_service_account_file(CREDENTIALS_PATH, scopes=SCOPES)
        client_gspread = gspread.authorize(creds)
        sheet = client_gspread.open_by_key(SPREADSHEET_ID).sheet1
        
        baris_baru = [no_agenda, jenis_surat, nama_pemohon, perihal, nik or "-", no_surat_asli or "-", tanggal, disposisi, status]
        sheet.append_row(baris_baru)
        print("✅ Otomatis sinkron ke Google Spreadsheet!")
    except Exception as e:
        print(f"❌ Gagal otomatis sinkron: {e}")

@app.post("/api/surat")
async def tambah_surat(
    background_tasks: BackgroundTasks,
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
            buffer.write(await file.read())
            
    db_surat = SuratDB(
        no_agenda=no_agenda, jenis_surat=jenis_surat, nama_pemohon=nama_pemohon,
        nik=nik, perihal=perihal, no_surat_asli=no_surat_asli, tanggal=tanggal,
        status=status, disposisi=disposisi, file_path=f"/uploads/{filename}" if file else None
    )
    db.add(db_surat)
    db.commit()
    db.refresh(db_surat)
    
    background_tasks.add_task(
        robot_kirim_ke_google_sheets,
        no_agenda, jenis_surat, nama_pemohon, perihal, nik, no_surat_asli, tanggal, disposisi, status
    )
    return {"status": "success", "pesan": "Surat berhasil!"}

@app.get("/api/surat")
def ambil_semua_surat(db: Session = Depends(get_db)):
    return db.query(SuratDB).order_by(desc(SuratDB.id)).all()

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
            "agenda": s.no_agenda, "jenis": s.jenis_surat, "asal": s.nama_pemohon,
            "perihal": s.perihal, "status": s.status, "tipe": tipe, "b": b_color
        })
    return {
        "total_surat": total_surat, "total_masuk": total_masuk, "total_keluar": total_keluar,
        "total_proses": total_proses, "total_selesai": total_selesai, "terbaru": terbaru
    }

# ==========================================
# ENDPOINT EXPORT EXCEL LANGSUNG
# ==========================================
@app.get("/api/surat/export/excel")
def export_excel_langsung(tipe: str = None, db: Session = Depends(get_db)):
    semua_surat = db.query(SuratDB).all()
    
    if tipe == "masuk":
        semua_surat = [s for s in semua_surat if "keluar" not in s.jenis_surat.lower()]
    elif tipe == "keluar":
        semua_surat = [s for s in semua_surat if "keluar" in s.jenis_surat.lower()]

    if not semua_surat:
        return {"pesan": "Tidak ada data untuk diekspor."}

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
            "STATUS": s.status,
            "DISPOSISI": s.disposisi
        })

    df = pd.DataFrame(data_arsip)
    waktu_sekarang = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    folder_backup = "/tmp/backup_lokal"
    
    if not os.path.exists(folder_backup):
        os.makedirs(folder_backup)
        
    nama_tipe = f"_{tipe.upper()}" if tipe else ""
    nama_file = f"Backup_Arsip{nama_tipe}_{waktu_sekarang}.xlsx"
    file_path = f"{folder_backup}/{nama_file}"
    
    df.to_excel(file_path, index=False)
    
    return FileResponse(
        path=file_path, 
        filename=nama_file, 
        media_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )