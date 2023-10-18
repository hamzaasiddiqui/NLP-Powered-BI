import requests

# Define the data you want to send in the request
data = {
    "prompt": "top 5 most selling products according to number of sales",
    "database_schema": """
CREATE TABLE us_states (
    state_id smallint,
    state_name character varying,
    state_abbr character varying,
    state_region character varying
);

CREATE TABLE customers (
    customer_id character varying,
    company_name character varying,
    contact_name character varying,
    contact_title character varying,
    address character varying,
    city character varying,
    region character varying,
    postal_code character varying,
    country character varying,
    phone character varying,
    fax character varying
);

CREATE TABLE orders (
    order_id smallint,
    employee_id smallint,
    order_date date,
    required_date date,
    shipped_date date,
    ship_via smallint,
    freight real,
    ship_country character varying,
    customer_id character varying,
    ship_name character varying,
    ship_address character varying,
    ship_city character varying,
    ship_region character varying,
    ship_postal_code character varying
);

CREATE TABLE employees (
    birth_date date,
    photo bytea,
    hire_date date,
    reports_to smallint,
    employee_id smallint,
    address character varying,
    city character varying,
    region character varying,
    postal_code character varying,
    country character varying,
    home_phone character varying,
    extension character varying,
    notes text,
    photo_path character varying,
    last_name character varying,
    first_name character varying,
    title character varying,
    title_of_courtesy character varying
);

CREATE TABLE shippers (
    shipper_id smallint,
    company_name character varying,
    phone character varying
);

CREATE TABLE products (
    discontinued integer,
    reorder_level smallint,
    product_id smallint,
    supplier_id smallint,
    category_id smallint,
    unit_price real,
    units_in_stock smallint,
    units_on_order smallint,
    product_name character varying,
    quantity_per_unit character varying
);

CREATE TABLE order_details (
    order_id smallint,
    product_id smallint,
    unit_price real,
    quantity smallint,
    discount real
);

CREATE TABLE categories (
    category_id smallint,
    picture bytea,
    category_name character varying,
    description text
);

CREATE TABLE suppliers (
    supplier_id smallint,
    company_name character varying,
    contact_name character varying,
    contact_title character varying,
    address character varying,
    city character varying,
    region character varying,
    postal_code character varying,
    country character varying,
    phone character varying,
    fax character varying,
    homepage text
);

CREATE TABLE region (
    region_id smallint,
    region_description character varying
);

CREATE TABLE territories (
    region_id smallint,
    territory_id character varying,
    territory_description character varying
);

CREATE TABLE employee_territories (
    employee_id smallint,
    territory_id character varying
);

CREATE TABLE customer_demographics (
    customer_type_id character varying,
    customer_desc text
);

CREATE TABLE customer_customer_demo (
    customer_id character varying,
    customer_type_id character varying
);

"""
}

# Define the URL of the destination Flask server
url = "http://10.1.131.235:5000/run_defog"

# Send a POST request to the destination server
response = requests.post(url, json=data)

# Check the response from the destination server
if response.status_code == 200:
    result = response.json()
    print("Response from the destination server:", result)
else:
    print("Failed to send the request. Status code:", response.status_code)
