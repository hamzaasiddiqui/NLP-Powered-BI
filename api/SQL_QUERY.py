from langchain.chat_models import ChatOpenAI
from langchain import OpenAI
from langchain.chains import LLMChain
from langchain.prompts.prompt import PromptTemplate
from db_connectors import PostgresConnector
from prompt_formatters import Formatter

def SQL_QUERY(conn):
  
    TABLES = []

    postgres_connector = PostgresConnector()
    
    if len(TABLES) <= 0:
        TABLES.extend(postgres_connector.get_tables(conn))

    print(f"Loading tables: {TABLES}")

    db_schema = [postgres_connector.get_schema(conn, table) for table in TABLES] 
    formatter = Formatter(db_schema)


    prompt = formatter.format_prompt()

    question = """Chat history: {chat_history}
                
                
                HUMAN: {instruction}
                Chatbot: """

    SQL_QUERY_PROMPT = PromptTemplate(
                input_variables=["chat_history", "instruction"],
                template= prompt + question,
            )
    return SQL_QUERY_PROMPT


