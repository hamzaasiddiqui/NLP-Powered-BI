import os
import psycopg2
import io
import psycopg2

def execute_query(query, connection):
    try:
        cursor = connection.cursor()
        cursor.execute(query)
        result = cursor.fetchall()
        cursor.close()
        return result
    except psycopg2.Error as e:
        # Handle different types of PostgreSQL errors
        error_code = e.pgcode
        error_message = str(e)
        
        if error_code:
            # You can handle specific error codes here if needed
            if error_code == '42P01':  # Table not found error
                return f"ERROR: Table not found: {error_message}"
            else:
                return f"ERROR: PostgreSQL Error ({error_code}): {error_message}"
        else:
            return f"ERROR: PostgreSQL Error: {error_message}"
    except Exception as e:
        # Handle other exceptions (e.g., connection errors)
        return f"ERROR: Database Error: {str(e)}"


def get_schema_info(connection):
    try:
        
        cursor = connection.cursor()

        # Get table names
        cursor.execute("""
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = 'public';
        """)
        table_names = cursor.fetchall()

        schema_info = {}

        for table_name, in table_names:
            # Get column names
            cursor.execute(f"""
                SELECT column_name
                FROM information_schema.columns
                WHERE table_schema = 'public' AND table_name = '{table_name}';
            """)
            columns_info = cursor.fetchall()

            # Get primary key constraints
            cursor.execute(f"""
                SELECT kc.column_name
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kc
                ON kc.constraint_name = tc.constraint_name
                WHERE tc.constraint_type = 'PRIMARY KEY' AND tc.table_schema = 'public' AND tc.table_name = '{table_name}';
            """)
            primary_keys_info = cursor.fetchall()

            # Get foreign key constraints
            cursor.execute(f"""
                SELECT kcu.column_name, ccu.table_name AS foreign_table, ccu.column_name AS foreign_column
                FROM information_schema.table_constraints tc
                JOIN information_schema.key_column_usage kcu
                ON tc.constraint_name = kcu.constraint_name
                JOIN information_schema.constraint_column_usage ccu
                ON tc.constraint_name = ccu.constraint_name
                WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_schema = 'public' AND tc.table_name = '{table_name}';
            """)
            foreign_keys_info = cursor.fetchall()

            schema_info[table_name] = {
                'columns': [col[0] for col in columns_info],
                'primary_keys': [pk[0] for pk in primary_keys_info],
                'foreign_keys': [(fk[0], fk[1], fk[2]) for fk in foreign_keys_info],
            }

        cursor.close()
        

        output_stream = io.StringIO()
        first_iteration = True
        for table_name, info in schema_info.items():
            if first_iteration:
                first_iteration = False
                continue
            output_stream.write(f"\n\nTABLE: {table_name}\n")
            output_stream.write(f"Columns: {', '.join(info['columns'])}\n")
            output_stream.write(f"Primary Key: {', '.join(info['primary_keys'])}\n")

            output_stream.write("Foreign Keys: ")
            for fk_column, fk_table, fk_column_ref in info['foreign_keys']:
                output_stream.write(f"{fk_column} references {fk_table}({fk_column_ref}), ")
            output_stream.write('\n')

        result_str = output_stream.getvalue()
        output_stream.close()

        return result_str

        
    except psycopg2.Error as e:
        return str(e)

