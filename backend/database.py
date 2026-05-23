import psycopg2
import os

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise Exception("DATABASE_URL não definida")

conn = psycopg2.connect(DATABASE_URL)
cursor = conn.cursor()