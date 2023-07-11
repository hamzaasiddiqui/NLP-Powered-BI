-- COLLECTION OF QUERIES THAT CAN BE USED FOR THE DASHBOARD

-- Total revenue generated per day

SELECT DATE_TRUNC('day', o.order_date) AS day, SUM(od.quantity * od.unit_price) AS revenue
FROM orders AS o
JOIN order_details AS od ON o.order_id = od.order_id
GROUP BY DATE_TRUNC('day', o.order_date)
ORDER BY DATE_TRUNC('day', o.order_date);

-- Top 5 top-selling products (that generated highest revenue)

SELECT p.product_id, p.product_name, ROUND(SUM(od.quantity * od.unit_price)) AS total_revenue
FROM products AS p
JOIN order_details AS od ON p.product_id = od.product_id
GROUP BY p.product_id, p.product_name
ORDER BY total_revenue DESC
LIMIT 5;

-- Inverntory turnover

SELECT (SUM(od.quantity) / COUNT(DISTINCT p.product_id)) AS inventory_turnover_rate
FROM products AS p
JOIN order_details AS od ON p.product_id = od.product_id;

-- Average order processing time in hours

SELECT AVG(EXTRACT(EPOCH FROM AGE(o.shipped_date, o.order_date)) / 3600) AS average_processing_time_hours
FROM orders AS o
WHERE o.shipped_date IS NOT NULL;

-- Customer percentage by region

SELECT
    region,
    COUNT(*) AS total_customers,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM customers), 2) AS percentage
FROM
    customers
GROUP BY
    region
ORDER BY
    percentage DESC;

-- Top 5 cities according to customer count
SELECT city, COUNT(*) AS customer_count
FROM customers
GROUP BY city
ORDER BY customer_count DESC
LIMIT 5;

-- Number of orders per day
SELECT order_date, COUNT(*) AS order_count
FROM orders
GROUP BY order_date
ORDER BY order_date;

-- Top 5 most ordered categories
SELECT c.category_name, COUNT(o.order_id) AS order_count
FROM categories AS c
JOIN products AS p ON c.category_id = p.category_id
JOIN order_details AS od ON p.product_id = od.product_id
JOIN orders AS o ON od.order_id = o.order_id
GROUP BY c.category_name
ORDER BY order_count DESC
LIMIT 5;

-- Total revenue
SELECT SUM((od.unit_price - p.unit_price) * od.quantity) AS total_profit
FROM order_details AS od
JOIN products AS p ON od.product_id = p.product_id;

-- Total customers
SELECT COUNT(*) AS total_customers
FROM customers;

-- Total revenue
SELECT ROUND(SUM(od.unit_price * od.quantity)) AS TotalRevenue
FROM order_details as od;

-- Total profit
SELECT ROUND(SUM(od.unit_price * od.quantity) - SUM(p.unit_price * od.quantity)) AS Profit
FROM order_details AS od
INNER JOIN orders AS o ON od.order_id = o.order_id
INNER JOIN products AS p ON od.product_id = p.product_id;

-- Total orders
SELECT COUNT(*) AS TotalOrders
FROM orders;
