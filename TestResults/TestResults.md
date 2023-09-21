# Test Results

## Query test for monthly profit

### 1. calculate the monthly profit for the year 2022

![Result 1](image.png)

Result: Positive

### 2. show the profit for the first three months only

![Result 2](image-1.png)

Result: Positive

### 3. show the profit for the last three months only

![Result 3](image-2.png)

SQL QUERY GENERATED:
SELECT EXTRACT(MONTH FROM 0.order_date) AS month, SUM((od.unit_price - od.discount) *od.quantity) AS profit FROM orders o JOIN order_details od ON o.order_id = od.order_id WHERE EXTRACT(YEAR FROM 0.order_date) = 2022 AND EXTRACT(MONTH FROM o.order_date) >= 10 GROUP BY EXTRACT (MONTH FROM 0.order_date) ORDER BY month;

Result: Positive

### 4. show the result in ascending order

![Result 6](image-3.png)

SQL QUERY GENERATED:
SELECT EXTRACT(MONTH FROM 0.order_date) AS month, SUM((od.unit_price - od.discount) * od.quantity) AS profit FROM orders o JOIN order_details od ON o.order_id = od.order_id WHERE EXTRACT(YEAR FROM 0.order_date) =
2022 AND EXTRACT(MONTH FROM o.order_date) >= 10 GROUP BY EXTRACT (MONTH FROM o.order_date) ORDER BY month ASC;

Result: Negative
Comments: months taken as ascending

### 5. show the results for the last query in ascending order

Result: Same as 4.

### 6. what is the sum

SQL QUERY GENERATED:
SELECT SUM((od.unit_price - od.discount) * od.quantity) AS total_profit FROM orders o JOIN order_details od ON o.order_id = od.order_id WHERE o.order_date >= CURRENT_DATE - INTERVAL '3 months';

Result: Could not retrieve data
Comments: Interval taken of 3 months but from current date not the year 2022.

### 7. show the profit for the last three months of the year 2022 in ascending order

![Alt text](image-7.png)

Result: Positive

### 8. show the sum of monthly profit for the last three months of the year 2022

![Alt text](image-9.png)

SQL QUERY GENERATED:
SELECT EXTRACT(MONTH FROM 0.order_date) AS month, SUM((od.unit_price - od.discount) * od.quantity) AS monthly_profit FROM orders o JOIN order_details od ON o.order_id = od.order_id WHERE EXTRACT(YEAR FROM o.order_date) = 2022 AND EXTRACT(MONTH FROM 0.order_date) >= 10 GROUP BY EXTRACT (MONTH FROM o.order_date);

Result: Negative
Comments: It seems that Sum was only used for monthly profit calculation

### 9. show the total sum of monthly profit for the last three months of the year 2022

![Alt text](image-11.png)

SQL QUERY GENERATED:
SELECT SUM((od.unit_price - od.discount) * od.quantity) AS total_monthly_profit FROM orders o JOIN order_details od ON o.order_id = od.order_id WHERE EXTRACT (YEAR FROM o.order_date) = 2022 AND EXTRACT (MONTH FROM o.order_date) >= 10;

Result: Positive
Comments: Component for single value yet to be made.

## Query test for Best Categories

### 1. show the best categories according to most sales

![Alt text](image-12.png)

Result: Positive

### 2. show the categories below 8000 sales

![Alt text](image-13.png)

Result: Positive

### 3. show in ascending order

![Alt text](image-14.png)

Result: Positive
Comments: Ascending order done on last query.

### 4. show in descending order

![Alt text](image-15.png)

Result: Positive
Comments: Descending order done on last query.

### 4. show the top 3 from the last query

![Alt text](image-16.png)

Result: Positive
Comments: action performed on last query.

### 5. show the worst category

![Alt text](image-18.png)

Result: Positive
Comments: worst categary taken from list of all categories.
