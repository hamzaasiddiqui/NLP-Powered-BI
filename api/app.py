# Create virtual environment
# Install libraries from requirements.txt in venv
# pip intall -r requirements.txt
# Run flask app and test on Insomnia or Postman

import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask

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

# Load .env file
load_dotenv()

app = Flask(__name__)
url = os.getenv("DATABASE_URL")
connection = psycopg2.connect(url)

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
    return {
        "Product ID": str(product_id), 
        "Product Name": product_name, 
        "Product Revenue": str(product_revenue)
    }
