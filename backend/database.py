import psycopg2

conn = psycopg2.connect(
    "postgresql://postgres.rurlaawrltoddeascnqy:Okaiomandarim7&!@aws-1-sa-east-1.pooler.supabase.com:6543/postgres"
)

cursor = conn.cursor()

# conn = psycopg2.connect(
#     host="aws-0-us-east-1.pooler.supabase.com",
#     database="postgres",
#     user="postgres.rurlaawrltoddeascnqy",  # ✅ corrigido
#     password="Okaiomandarim7&!",
#     port="6543"
# )

# cursor = conn.cursor()
