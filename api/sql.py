import sqlparse

def extract_columns_from_query(query):
    parsed = sqlparse.parse(query)

    # Find the first valid SQL statement
    statement = parsed[0] if parsed else None

    columns = []

    if statement and statement.get_type() == "SELECT":
        inside_select = False
        select_tokens = []
        for token in statement.tokens:
            if token.value.upper() == "SELECT":
                inside_select = True
                continue
            if token.value.upper() == "FROM":
                inside_select = False
                break
            if inside_select:
                select_tokens.append(token)
        
        # Join tokens to form the portion between SELECT and FROM
        select_portion = str(sqlparse.sql.TokenList(select_tokens))

        # Strip any leading/trailing whitespace and comma
        select_portion = select_portion.strip().strip(',')

        columns = select_portion.split(',')
        columns = [column.strip() for column in columns]

    return columns

sql_query = "SELECT product_name, SUM(quantity) as total_quantity, abc FROM order_details JOIN products ON order_details.product_id = products.product_id GROUP BY product_name ORDER BY total_quantity DESC LIMIT 5;"
columns = extract_columns_from_query(sql_query)
print("Column Names:", columns)
