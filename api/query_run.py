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
    sql_query = """SELECT products.product_name,
       products.product_id,
       sum(order_details.quantity * order_details.unit_price) AS total_revenue
FROM   products
         INNER JOIN order_details ON products.product_id = order_details.product_id
WHERE  products.discontinued = 0
GROUP BY products.product_name, products.product_id
ORDER BY total_revenue DESC NULLS LAST, products.product_name ASC
LIMIT 5;"""



# SELECT product_name FROM products ORDER BY units_in_stock DESC LIMIT 5  LLAMA-2 7B
# SELECT product_name, SUM(quantity) FROM order_details GROUP BY product_name ORDER BY SUM(quantity) DESC LIMIT 5 LLAMA-2 13B
    cursor.execute(sql_query)
    results = cursor.fetchall()
    for row in results:
        print(row)

    cursor.close()
    conn.close()
    print("Connection closed")
except Exception as e:
    print(f"Error: {e}")
