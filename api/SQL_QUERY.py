from langchain.chat_models import ChatOpenAI
from langchain import OpenAI
from langchain.chains import LLMChain
from langchain.prompts.prompt import PromptTemplate
from db_connectors import PostgresConnector
from prompt_formatters import Formatter
import chromadb


def SQL_QUERY(conn, schema):
    chroma_client = chromadb.Client()
    collection_name = "collection"
    print(chroma_client.list_collections())
    if chroma_client.list_collections():
        for i in chroma_client.list_collections():
            print(i.name)
            if collection_name == i.name:
                chroma_client.delete_collection(name=collection_name)
                print(f"Collection '{collection_name}' deleted successfully.")

    collection = chroma_client.create_collection(name=collection_name)
    TABLES = []

    postgres_connector = PostgresConnector()
    
    if len(TABLES) <= 0:
        TABLES.extend(postgres_connector.get_tables(conn, schema))

    print(f"Loading tables: {TABLES}")

    db_schema = [postgres_connector.get_schema(conn, table) for table in TABLES] 
    formatter = Formatter(db_schema)


    tables_schema = formatter.format_prompt()
  

    collection.add(
        documents= tables_schema,
        metadatas=[{"source": table} for table in TABLES],
        ids=["id" + str(i + 1) for i in range(len(TABLES))]
    )
    return collection, tables_schema
    



