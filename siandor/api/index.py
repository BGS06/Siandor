from fastapi import FastAPI, Form, UploadFile, File, Depends
from fastapi.middleware.cors import CORSMiddleware
from mangum import Mangum
from sqlalchemy import create_engine, Column, Integer, String, desc
from sqlalchemy.orm import sessionmaker, declarative_base, Session
import os

# Mengambil URL Supabase dari Environment Variable Vercel
SQLALCHEMY_DATABASE_URL = os.environ.get("DATABASE_URL")

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class SuratDB(Base):
    __tablename__ = "surat"
    id = Column(Integer, primary_key=True, index=True)
    no_agenda = Column(String)
    jenis_surat = Column(String)
    nama_pemohon = Column(String)
    nik = Column(String, nullable=True)
    perihal = Column(String)
    no_surat_asli = Column(String, nullable=True)
    tanggal = Column(String)
    status = Column(String)
    disposisi = Column(String)
    file_path = Column(String, nullable=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "pesan": "Backend SIANDOR Vercel Aktif!"}

@app.post("/api/surat")
async def tambah_surat(
    no_agenda: str = Form(...),
    jenis_surat: str = Form(...),
    nama_pemohon: str = Form(...),
    nik: str = Form(None),
    perihal: str = Form(...),
    no_surat_asli: str = Form(None),
    tanggal: str = Form(...),
    status: str = Form(...),
    disposisi: str = Form(...),
    db: Session = Depends(get_db)
):
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
        file_path=None 
    )
    db.add(db_surat)
    db.commit()
    db.refresh(db_surat)
    return {"status": "success", "pesan": "Surat berhasil disimpan ke Supabase!"}

@app.get("/api/surat")
def ambil_semua_surat(db: Session = Depends(get_db)):
    surat = db.query(SuratDB).order_by(desc(SuratDB.id)).all()
    return surat

@app.get("/api/statistik")
def ambil_statistik(db: Session = Depends(get_db)):
    semua_surat = db.query(SuratDB).order_by(desc(SuratDB.id)).all()
    
    total_surat = len(semua_surat)
    total_keluar = sum(1 for s in semua_surat if s.jenis_surat and "keluar" in s.jenis_surat.lower())
    total_masuk = total_surat - total_keluar
    
    terbaru = []
    for s in semua_surat[:5]:
        b_color = "bg-hijau-pale text-hijau-tua" if s.status.lower() == "selesai" else "bg-emas-pale text-emas"
        terbaru.append({
            "agenda": s.no_agenda,
            "asal": s.nama_pemohon,
            "perihal": s.perihal,
            "status": s.status,
            "b": b_color
        })

    return {
        "total_surat": total_surat,
        "total_masuk": total_masuk,
        "total_keluar": total_keluar,
        "terbaru": terbaru
    }

# WAJIB: Adapter agar Python bisa dibaca oleh Vercel
handler = Mangum(app)