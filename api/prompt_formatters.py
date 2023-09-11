from pydantic import BaseModel


class TableColumn(BaseModel):
    """Table column."""

    name: str
    dtype: str | None


class ForeignKey(BaseModel):
    """Foreign key."""

    # Referenced column
    column: TableColumn
    # References table name
    references_name: str
    # References column
    references_column: TableColumn


class Table(BaseModel):
    """Table."""

    name: str
    columns: list[TableColumn] | None
    pks: list[TableColumn] | None
    # FK from this table to another column in another table
    fks: list[ForeignKey] | None


class Formatter:
 

    table_sep: str = "\n\n"

    def __init__(self, tables: list[Table]) -> None:
        self.tables = tables
        self.table_str = self.format_tables(tables)

    def format_table(self, table: Table) -> str:
        """Get table format."""
        table_fmt = []
        table_name = table.name
        for col in table.columns or []:
            # This is technically an incorrect type, but it should be a catchall word
            table_fmt.append(f"    {col.name} {col.dtype or 'any'}")
        if table.pks:
            table_fmt.append(
                f"    primary key ({', '.join(pk.name for pk in table.pks)})"
            )
        for fk in table.fks or []:
            table_fmt.append(
                f"    foreign key ({fk.column.name}) references {fk.references_name}({fk.references_column.name})"  # noqa: E501
            )
        if table_fmt:
            all_cols = ",\n".join(table_fmt)
            create_tbl = f"CREATE TABLE {table_name} (\n{all_cols}\n)"
        else:
            create_tbl = f"CREATE TABLE {table_name}"
        return create_tbl

    def format_tables(self, tables: list[Table]) -> str:
        """Get tables format."""
        return self.table_sep.join(self.format_table(table) for table in tables)

    def format_prompt(
        self
    ) -> str:
        """Get prompt format."""
        sql_prefix = "SQL QUERY:  "
        return f"""{self.table_str}\n\n\nUsing valid SQL, answer the following questions for the tables provided above. 
        The result of the SQL query will be used to make charts for visualisation. 
        Your job is only to create good SQL queries. Add some columns if they are related to the question or if you think they can be useful to get good insight but
        make sure they exist in the tables
        Folow the following rules:
        - The SQL Query should only contain the columns that are provided above.
        - SQL Query must not contain the columns that are not present in the Table which you are referring. 
        - There must be atleast 2 columns inside your query. So that it can be used to make a chart.
        - The SQL Query should respect the case and consider columns and tables as case-sensitive
        - The SQL Query should use quotes around table and column names containing uppercase characters
        - The SQL Query should be syntaxically correct
        - The SQL Query should be the sole content of your message
        - Pay attention to use CURRENT_DATE function to get the current date, if the question involves "today"
        - Your response should be a SQL query and nothing else.
        - Donot make up table and column names by yourself. 
        \n\n"""  # noqa: E501

    def format_model_output(self, output_sql: str) -> str:
        """Format model output.

        Our prompt ends with SELECT so we need to add it back.
        """
        if not output_sql.lower().startswith("select"):
            output_sql = "SELECT " + output_sql.strip()
        return output_sql