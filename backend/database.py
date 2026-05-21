import psycopg2

conn = psycopg2.connect(
    "postgresql://postgres.rurlaawrltoddeascnqy:Okaiomandarim7&!@aws-1-sa-east-1.pooler.supabase.com:6543/postgres"
)

cursor = conn.cursor()