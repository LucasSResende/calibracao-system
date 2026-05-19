from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import cursor, conn
from datetime import datetime, timedelta

app = FastAPI()

# 🔹 LIBERAR FRONTEND
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ LOGIN SIMPLES (pode mudar depois)
users = [
    {"username": "admin", "password": "1234"}
]

@app.post("/login")
def login(username: str, password: str):
    for u in users:
        if u["username"] == username and u["password"] == password:
            return {"status": "ok"}
    raise HTTPException(status_code=401, detail="Login inválido")

# ✅ CRIAR FERRAMENTA
@app.post("/tools")
def create_tool(name: str, responsible: str, entry_date: str, months: int):

    entry = datetime.strptime(entry_date, "%Y-%m-%d")
    expiry = entry + timedelta(days=months * 30)

    cursor.execute(
        "INSERT INTO tools (name, responsible, entry_date, expiry_date) VALUES (%s,%s,%s,%s)",
        (name, responsible, entry_date, expiry.date())
    )
