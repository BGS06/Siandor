from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import datetime
import os

import gspread
from google.oauth2.service_account import Credentials

app = FastAPI(title="SIANDOR API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

# GANTI DENGAN ID SPREADSHEET MILIKMU
SPREADSHEET_ID = '1spWunxld0aNRcCgq4aqqQcrt4sm403AN3RQlPOaC2Y4'

def proses_backup_otomatis():
    print("Memulai proses backup Database...")
    
    # Data Dummy
    data_arsip = [
        {"No Surat": f"001/SK-DOM/XII/{datetime.datetime.now().year}", "Jenis": "Domisili", "Pemohon": "Budi Santoso", "Tanggal": datetime.datetime.now().strftime("%d/%m/%Y")},
        {"No Surat": f"002/SKTM/XII/{datetime.datetime.now().year}", "Jenis": "SKTM", "Pemohon": "Siti Aminah", "Tanggal": datetime.datetime.now().strftime("%d/%m/%Y")}
    ]
    df = pd.DataFrame(data_arsip)
    
    # LAPIS 1: EXCEL LOKAL
    try:
        folder_backup = "backup_lokal"
        if not os.path.exists(folder_backup):
            os.makedirs(folder_backup)
            
        waktu_sekarang = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        nama_file_excel = f"{folder_backup}/Backup_Arsip_{waktu_sekarang}.xlsx"
        df.to_excel(nama_file_excel, index=False)
        print(f"✅ LAPIS 1 SUKSES: Excel tersimpan di {nama_file_excel}")
    except Exception as e:
        print(f"❌ Error Lapis 1: {e}")

    # LAPIS 2: GOOGLE SPREADSHEET via Robot (Service Account)
    try:
        creds = Credentials.from_service_account_file('credentials.json', scopes=SCOPES)
        client_gspread = gspread.authorize(creds)
        sheet = client_gspread.open_by_key(SPREADSHEET_ID).sheet1
        
        for data in data_arsip:
            baris_baru = [data["No Surat"], data["Jenis"], data["Pemohon"], data["Tanggal"]]
            sheet.append_row(baris_baru)
        print("✅ LAPIS 2 SUKSES: Data tersinkronisasi ke Google Spreadsheet.")
    except Exception as e:
        print(f"❌ Error Lapis 2: Cek file credentials.json atau ID Spreadsheet. Error: {e}")

    print("BACKUP DATABASE SELESAI!")

@app.get("/")
def read_root():
    return {"pesan": "Server Backend SIANDOR Berjalan Lancar!"}

@app.post("/api/backup")
def jalankan_backup(background_tasks: BackgroundTasks):
    background_tasks.add_task(proses_backup_otomatis)
    return {
        "status": "success",
        "pesan": "Database berhasil diamankan ke Excel Lokal & Google Spreadsheet!"
    }