import psycopg2

conn = psycopg2.connect(
    host="db.abc123.supabase.co", 
    database="postgres",
    user="postgres",
    port="5432"
)

cursor = conn.cursor()