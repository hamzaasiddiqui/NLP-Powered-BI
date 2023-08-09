from langchain.chat_models import ChatOpenAI
from langchain import OpenAI
import os
import sqlalchemy
from langchain.chains import LLMChain
from langchain.prompts.prompt import PromptTemplate
from db_connectors import PostgresConnector
from prompt_formatters import Formatter

DATABASE = "puttplgt"
USER = "puttplgt"
PASSWORD = "BliGMxjlgIxuqLudrJb56yVWm8p1Uq5U"
HOST = "lucky.db.elephantsql.com"
PORT = 8000
TABLES = []

# Get the connector and formatter
postgres_connector = PostgresConnector(
    user=USER, password=PASSWORD, dbname=DATABASE, host=HOST, port=PORT
)
postgres_connector.connect()
if len(TABLES) <= 0:
    TABLES.extend(postgres_connector.get_tables())

print(f"Loading tables: {TABLES}")

db_schema = [postgres_connector.get_schema(table) for table in TABLES]
formatter = Formatter(db_schema)


prompt = formatter.format_prompt()

question = "QUESTION: {instruction}\nSQL QUERY: "

SQL_QUERY_PROMPT = PromptTemplate(
            input_variables=["instruction"],
            template= prompt + question,
        )
# llm = ChatOpenAI(temperature=0.5, openai_api_key="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", model='gpt-3.5-turbo')
# SQL_CHAIN = LLMChain(llm=llm, prompt=SQL_QUERY_PROMPT)

