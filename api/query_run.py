import psycopg2

db_params = {
    'dbname': 'puttplgt',
    'user': 'puttplgt',
    'password': 'BliGMxjlgIxuqLudrJb56yVWm8p1Uq5U',
    'host': 'lucky.db.elephantsql.com',
    'port': '5432',  # Default PostgreSQL port
}

try:
    conn = psycopg2.connect(**db_params)
    cursor = conn.cursor()
    sql_query = """SELECT customer_id, COUNT(order_id) AS order_count
FROM orders
GROUP BY customer_id
ORDER BY order_count DESC
LIMIT 3;"""
    cursor.execute(sql_query)
    results = cursor.fetchall()
    for row in results:
        print(row)

    cursor.close()
    conn.close()
    print("Connection closed")
except Exception as e:
    print(f"Error: {e}")
