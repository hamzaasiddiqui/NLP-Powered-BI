-- COLLECTION OF QUERIES THAT CAN BE USED FOR THE DASHBOARD

-- Total revenue generated per day

SELECT DATE_TRUNC('day', o.order_date) AS day, SUM(od.quantity * od.unit_price) AS revenue
FROM orders AS o
JOIN order_details AS od ON o.order_id = od.order_id
GROUP BY DATE_TRUNC('day', o.order_date)
ORDER BY DATE_TRUNC('day', o.order_date);

-- Top 5 top-selling products (that generated highest revenue)

SELECT p.product_id, p.product_name, SUM(od.quantity * od.unit_price) AS total_revenue
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
