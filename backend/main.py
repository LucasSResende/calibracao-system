from fastapi import FastAPI, Depends, HTTPException
from fastapi import Form
from datetime import datetime, timedelta
from fastapi.middleware.cors import CORSMiddleware
from database import conn, cursor
from security import hash_password, verify_password
from jose import jwt
from fastapi.security import OAuth2PasswordBearer
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel

class UserCreate(BaseModel):
    username: str
    password: str


app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# JWT CONFIG
SECRET_KEY = "minha-chave-super-secreta"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# CRIAR TOKEN
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

from fastapi import Header

def verify_token(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")

        if username is None:
            raise HTTPException(status_code=401, detail="Token inválido")

        return username

    except:
        raise HTTPException(status_code=401, detail="Token inválido")



# LOGIN SEGURO

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    try:
        username = form_data.username
        password = form_data.password.strip()  # ✅ IMPORTANTE

        cursor.execute("SELECT * FROM users WHERE username=%s", (username,))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")

        hashed_password = user[2]

        if not verify_password(password, hashed_password):
            raise HTTPException(status_code=401, detail="Senha inválida")

        token = create_access_token({"sub": username})

        return {
            "access_token": token,
            "token_type": "bearer"
        }

    except Exception as e:
        print("ERRO LOGIN:", e)
        raise HTTPException(status_code=500, detail=str(e))


# CADASTRAR USUÁRIO

@app.post("/register")
def register(user: UserCreate):
    try:
        username = user.username
        password = user.password

        hashed = hash_password(password)

        cursor.execute(
            "INSERT INTO users (username, password) VALUES (%s,%s)",
            (username, hashed)
        )
        conn.commit()

        return {"msg": "Usuário criado"}

    except Exception as e:
        print("ERRO REGISTER:", e)
        raise HTTPException(status_code=500, detail=str(e))


# CRIAR FERRAMENTA
@app.post("/tools")
def create_tool(name: str, responsible: str, entry_date: str, months: int, user: str = Depends(verify_token)):

    entry = datetime.strptime(entry_date, "%Y-%m-%d")
    expiry = entry + timedelta(days=months * 30)

    cursor.execute(
        "INSERT INTO tools (name, responsible, entry_date, expiry_date) VALUES (%s,%s,%s,%s)",
        (name, responsible, entry_date, expiry.date())
    )
    conn.commit()

    return {"msg": "salvo"}

# LISTAR
@app.get("/tools")
def list_tools(user: str = Depends(verify_token)):
    cursor.execute("SELECT * FROM tools")
    rows = cursor.fetchall()

    result = []
    for r in rows:
        result.append({
            "id": str(r[0]),
            "name": r[1],
            "responsible": r[2],
            "entry_date": str(r[3]),
            "expiry_date": str(r[4])
        })
    
    return result  # ✅ aqui dentro


@app.get("/")
def home():
    return {"status": "Backend online 🚀"}

