from contextlib import contextmanager
from dataclasses import dataclass
from functools import cached_property
from typing import Any, Generator, List
import pandas as pd
import sqlalchemy

from prompt_formatters import TableColumn, Table


@dataclass
class PostgresConnector:
    def get_tables(self, conn) -> List[str]:
        cursor = conn.cursor()
        cursor.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public';")
        table_names = [row[0] for row in cursor.fetchall()]
        return table_names[1:]

    def get_schema(self, conn, table: str) -> Table:
        """Return Table."""
        cursor = conn.cursor()
        sql = f"""
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = %s;
        """
        cursor.execute(sql, (table,))
        schema = cursor.fetchall()
        
        columns = []
        for col, type_ in schema:
            columns.append(TableColumn(name=col, dtype=type_))
        
        return Table(name=table, columns=columns)

