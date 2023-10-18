import psycopg2
from db_connectors import PostgresConnector
from prompt_formatters import Formatter
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
    sql_query = """

SELECT COUNT(order_id) AS total_orders_2021, COUNT(order_id) AS total_orders_2022 FROM orders WHERE EXTRACT(YEAR FROM order_date) IN (2018, 2022);

"""
    # TABLES = []

    # postgres_connector = PostgresConnector()
    
    # if len(TABLES) <= 0:
    #     TABLES.extend(postgres_connector.get_tables(conn))

    # print(f"Loading tables: {TABLES}")

    # db_schema = [postgres_connector.get_schema(conn, table) for table in TABLES] 
    # formatter = Formatter(db_schema)
    # prompt = formatter.format_prompt()
    # print(prompt)
#     sql_query = """
#     SELECT table_name FROM information_schema.tables WHERE table_schema='public';
#     """
    



# # SELECT product_name FROM products ORDER BY units_in_stock DESC LIMIT 5  LLAMA-2 7B
# # SELECT product_name, SUM(quantity) FROM order_details GROUP BY product_name ORDER BY SUM(quantity) DESC LIMIT 5 LLAMA-2 13B
    cursor.execute(sql_query)
    results = cursor.fetchall()
    for row in results:
        print(row)

    cursor.close()
    conn.close()
    print("Connection closed")
except Exception as e:
    print(f"Error: {e}")
