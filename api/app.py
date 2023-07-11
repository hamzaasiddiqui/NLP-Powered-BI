# Create virtual environment
# Install libraries from requirements.txt in venv
# pip intall -r requirements.txt
# Run flask app and test on Insomnia or Postman

import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask
from flask import jsonify
from flask_cors import CORS

# Queries
REVENUE_PER_DAY = (
    """SELECT DATE_TRUNC('day', o.order_date) AS day, SUM(od.quantity * od.unit_price) AS revenue
        FROM orders AS o
        JOIN order_details AS od ON o.order_id = od.order_id
        GROUP BY DATE_TRUNC('day', o.order_date)
        ORDER BY DATE_TRUNC('day', o.order_date);"""
)

BEST_SELLING_PRODUCT = (
    """SELECT p.product_id, p.product_name, SUM(od.quantity * od.unit_price) AS total_revenue
        FROM products AS p
        JOIN order_details AS od ON p.product_id = od.product_id
        GROUP BY p.product_id, p.product_name
        ORDER BY total_revenue DESC
        LIMIT 1;"""
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

app = Flask(__name__)

CORS(app)
app.config['CORS_HEADER'] = 'Content-Type'

try:
    # Load .env file
    load_dotenv()
    # Retrieve database url
    url = os.getenv("DATABASE_URL")
    # Connect to database
    connection = psycopg2.connect(url)
except psycopg2.Error as e:
    print('ERROR! Cannot connect to database. Check database url.', str(e))

# Defining endpoints
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

@app.get("/api/bestSellingProd")
def get_best_selling_product():
    with connection:
        with connection.cursor() as cursor:
            cursor.execute(BEST_SELLING_PRODUCT)
            product_id = cursor.fetchone()[0]
            cursor.execute(BEST_SELLING_PRODUCT)
            product_name = cursor.fetchone()[1]
            cursor.execute(BEST_SELLING_PRODUCT)
            product_revenue = cursor.fetchone()[2]
    return jsonify({
        "Product ID": str(product_id), 
        "Product Name": product_name, 
        "Product Revenue": str(product_revenue)
    })

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