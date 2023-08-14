# Create virtual environment
# Install libraries from requirements.txt in venv
# pip intall -r requirements.txt
# Run flask app and test on Insomnia or Postman

import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS

# Queries
REVENUE_PER_DAY = (
    """SELECT DATE_TRUNC('day', o.order_date) AS day, SUM(od.quantity * od.unit_price) AS revenue
        FROM orders AS o
        JOIN order_details AS od ON o.order_id = od.order_id
        GROUP BY DATE_TRUNC('day', o.order_date)
        ORDER BY DATE_TRUNC('day', o.order_date);"""
)

BEST_SELLING_PRODUCTS = (
    """SELECT p.product_id, p.product_name, ROUND(SUM(od.quantity * od.unit_price)) AS total_revenue
        FROM products AS p
        JOIN order_details AS od ON p.product_id = od.product_id
        GROUP BY p.product_id, p.product_name
        ORDER BY total_revenue DESC
        LIMIT 5;"""
)

TOP_CITIES = (
    """SELECT city, COUNT(*) AS customer_count
        FROM customers
        GROUP BY city
        ORDER BY customer_count DESC
        LIMIT 5;"""
)

ORDERS_PER_DAY = (
    """SELECT order_date, COUNT(*) AS order_count
        FROM orders
        GROUP BY order_date
        ORDER BY order_date;"""
)

TOP_CATEGORIES = (
    """SELECT c.category_name, COUNT(o.order_id) AS order_count
        FROM categories AS c
        JOIN products AS p ON c.category_id = p.category_id
        JOIN order_details AS od ON p.product_id = od.product_id
        JOIN orders AS o ON od.order_id = o.order_id
        GROUP BY c.category_name
        ORDER BY order_count DESC
        LIMIT 5;"""
)

TOTAL_CUSTOMERS = (
    """SELECT COUNT(*) AS total_customers
        FROM customers;"""
)

TOTAL_REVENUE = (
    """SELECT ROUND(SUM(od.unit_price * od.quantity)) AS TotalRevenue
        FROM order_details as od;"""
)

TOTAL_PROFIT = (
    """SELECT ROUND(SUM(od.unit_price * od.quantity) - SUM(p.unit_price * od.quantity)) AS Profit
        FROM order_details AS od
        INNER JOIN orders AS o ON od.order_id = o.order_id
        INNER JOIN products AS p ON od.product_id = p.product_id;"""
)

TOTAL_ORDERS = (
    """SELECT COUNT(*) AS TotalOrders
        FROM orders;"""
)

LATEST_ORDERS = (
        """SELECT
                o.order_id,
                c.company_name,
                o.order_date,
                CASE
                    WHEN o.shipped_date IS NULL THEN 'Not Shipped'
                    ELSE 'Shipped'
                END AS status
            FROM
                orders AS o
            JOIN
                customers AS c ON o.customer_id = c.customer_id
            ORDER BY
                o.order_date DESC
            LIMIT 6;"""
)

REVENUE_PER_MONTH = (
    """SELECT
            DATE_TRUNC('month', o.order_date) AS month,
            ROUND(SUM(od.unit_price * od.quantity)) AS total_revenue
        FROM
            orders AS o
        JOIN
            order_details AS od ON o.order_id = od.order_id
        WHERE
            o.order_date >= (CURRENT_DATE - INTERVAL '18 months')
        GROUP BY
            DATE_TRUNC('month', o.order_date)
        ORDER BY
            month;"""
)

app = Flask(__name__)

CORS(app)

CORS(app, origins="http://localhost:3000/")

app.config['CORS_HEADER'] = 'Content-Type'
load_dotenv()
connection = None

@app.route('/api/connectDB', methods=['POST'])
def connect_to_db():
    global connection

    data = request.json

    host = data.get('host')
    port = data.get('port')
    database = data.get('database')
    user = data.get('user')
    password = data.get('password')

    try:
        if connection is None or connection.closed != 0:
            connection = psycopg2.connect(
                host=host,
                port=port,
                database=database,
                user=user,
                password=password
            )

        response_data = {'message': 'Data received successfully'}  # Create a response dictionary

        return jsonify(response_data)
    except psycopg2.Error as e:
        # return str(e)
        error_message = str(e)
        return jsonify({'error': error_message}), 500
    
# Route to close DB connection
# FOR FUTURE DEVELOPMENT
@app.route('/api/disconnectDB', methods=['POST'])
def close_db_connection():
    global connection

    if connection:
        connection.close()
        connection = None

        print('DISCONNECTED')
        print(connection)

        response_data = {'message': 'Data received successfully'}  # Create a response dictionary

        return jsonify(response_data)
    else:
        response_data = {'message': 'No databse to disconnect'}  # Create a response dictionary

        return jsonify(response_data)

# # Retrieve database URL from environment variable
# db_url = os.getenv('DATABASE_URL')

# # Helper function to execute SQL queries
# def execute_query(query):
#     try:
#         connection = psycopg2.connect(db_url)
#         cursor = connection.cursor()
#         cursor.execute(query)
#         result = cursor.fetchall()
#         cursor.close()
#         connection.close()
#         return result
#     except psycopg2.Error as e:
#         return str(e)

# # Endpoint to handle SQL queries
# @app.route('/query', methods=['POST'])
# def handle_query():
#     query = request.get_json().get('query')
#     if query:
#         result = execute_query(query)
#         return jsonify(result)
#     else:
#         return 'Invalid query', 400
    

@app.route('/chatbot', methods=['POST'])
def chatbot():
    from chatbot import chatbot
    query = request.get_json().get('query')
    if query:
        result = chatbot(query)
        print(result)
        return jsonify(result)
    else:
        return 'Invalid query', 400
   

@app.get("/")
def home():
    return "NLP Powered BI"

@app.get("/api/revenue")
def get_revenue_per_day():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(REVENUE_PER_DAY)
            revenue = cursor.fetchall()
    return {
        "Revenue": revenue
    }

@app.get("/api/bestSellingProds")
def get_best_selling_products():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(BEST_SELLING_PRODUCTS)
            products = cursor.fetchall()
    return {
        "Products": products
    }

@app.get("/api/topCities")
def get_top_cities():
    with connection.cursor() as cursor:
        cursor.execute(TOP_CITIES)
        top_cities = cursor.fetchall()
    return {
        "Top cities": top_cities
    }

@app.get("/api/ordersPerDay")
def get_orders_per_day():
    with connection.cursor() as cursor:
        cursor.execute(ORDERS_PER_DAY)
        orders = cursor.fetchall()
    return {
        "Orders per day": orders
    }

@app.get("/api/topCategories")
def get_top_categories():
    with connection.cursor() as cursor:
        cursor.execute(TOP_CATEGORIES)
        top_categories = cursor.fetchall()
    return {
        "Top categories": top_categories
    }

@app.get("/api/totalCustomers")
def get_total_customers():
    with connection.cursor() as cursor:
        cursor.execute(TOTAL_CUSTOMERS)
        top_customers = cursor.fetchall()
    return {
        "Total Customers": top_customers
    }

@app.get("/api/totalRevenue")
def get_total_revenue():
    with connection.cursor() as cursor:
        cursor.execute(TOTAL_REVENUE)
        total_revenue = cursor.fetchone()
    return {
        "Total Revenue": total_revenue
    }

@app.get("/api/totalProfit")
def get_total_profit():
    with connection.cursor() as cursor:
        cursor.execute(TOTAL_PROFIT)
        total_profit = cursor.fetchone()
    return {
        "Total Profit": total_profit
    }

@app.get("/api/totalOrders")
def get_total_orders():
    with connection.cursor() as cursor:
        cursor.execute(TOTAL_ORDERS)
        total_orders = cursor.fetchone()
    return {
        "Total Orders": total_orders
    }

@app.get("/api/latestOrders")
def get_latest_orders():
    with connection.cursor() as cursor:
        cursor.execute(LATEST_ORDERS)
        latest_orders = cursor.fetchall()
    return {
        "Latest Orders": latest_orders
    }

@app.get("/api/revenuePerMonth")
def get_revenue_per_month():
    with connection.cursor() as cursor:
        cursor.execute(REVENUE_PER_MONTH)
        revenue = cursor.fetchall()
    return {
        "Revenue": revenue
    }


if __name__ == '__main__':
    # Load .env file
    load_dotenv()
    # Retrieve database url
    url = os.getenv("DATABASE_URL")
    # Connect to database
    connection = psycopg2.connect(url)

    app.run(debug=True)