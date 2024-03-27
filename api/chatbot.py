
from langchain import OpenAI
import os
import sqlalchemy
from langchain.chains import LLMChain
from langchain.prompts.prompt import PromptTemplate
from langchain.memory import ConversationBufferWindowMemory
from schema import execute_query as exec_query
from langchain_openai import ChatOpenAI
import SQL_QUERY
import Defog
import sqlparse
from langchain.pydantic_v1 import BaseModel, Field
from langchain.tools import BaseTool, StructuredTool, tool
import psycopg2
from psycopg2 import extensions
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
from langchain.agents.format_scratchpad.openai_tools import (
    format_to_openai_tool_messages,
)
from langchain.agents import AgentExecutor
from langchain_core.messages import AIMessage, HumanMessage

connection_ = None
schema_ = None

@tool
def execute_query(query: str) -> str:
    """Executes SQL Query on Database and returns the first 3 results if successfull else it return the error message"""
    global connection_, schema_
    connection = connection_
    
    try:
        if connection.get_transaction_status() == extensions.TRANSACTION_STATUS_INTRANS:
            connection.rollback()

        # Add the schema to the query
        schema = schema_
        query_with_schema = f"SET search_path TO {schema}; {query}"

        cursor = connection.cursor()
        cursor.execute(query_with_schema)
        result = cursor.fetchall()
        cursor.close()
        return result[:3]
    except psycopg2.Error as e:
        error_code = e.pgcode
        error_message = str(e)
        connection.rollback()
        if error_code:
            if error_code == '42P01':  # Table not found error
                return f"ERROR: Table not found: {error_message}"
            else:
                return f"ERROR: PostgreSQL Error ({error_code}): {error_message}"
        else:
            return f"ERROR: PostgreSQL Error: {error_message}"
    except Exception as e:
        connection.rollback()
        return f"ERROR: Database Error: {str(e)}"


class Chatbot:
    def __init__(self, openai_api_key, conn, schema):
        
        self.schema = schema
        self.openai_api_key = openai_api_key
        self.collection, self.SCHEMA = SQL_QUERY.SQL_QUERY(conn, schema)
        self.connection = conn
        self.memory = ConversationBufferWindowMemory(k=3, memory_key="chat_history")
        self.chat_history = []
        global connection_, schema_
        schema_ = schema
        connection_ = conn
    
    def extract_columns_from_query(self, query):
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
            print(type(select_portion))
            print(select_portion)

            # Strip any leading/trailing whitespace and comma
            

            columns = select_portion
            columns = [column.strip() for column in columns]
            print(columns)
            selected_columns = []
            for col in columns:
                parts = col.split()
                if 'AS' in parts:
                    index = parts.index('AS')
                    col_ = parts[index + 1].strip('"')
                    col_ = col_.strip("'")
                    selected_columns.append(col_)
                else:
                    col_ = parts[0].split('.')[-1].strip('"')
                    col_ = col_.strip("'")
                    selected_columns.append(col_)
                

            # Output the selected column names
            print("Selected Columns:")
            for name in selected_columns:
                print(name)

        return selected_columns
    


    def chatbot(self, question, model): 
        results = self.collection.query(
            query_texts=[question],
            n_results=10
        )   
        
        NEW_SCHEMA = ''.join(results['documents'][0])
        
        self.template = f"""{NEW_SCHEMA}\n\n\nUsing valid SQL, answer the following questions for the tables provided above. 
        The result of the SQL query will be used to make charts for visualisation. 
        Your job is only to create good SQL queries.
        Folow the following rules:
        - The SQL Query should only contain the columns that are provided above.
        - SQL Query must not contain the columns that are not present in the Table which you are referring. 
        - The SQL Query should respect the case and consider columns and tables as case-sensitive
        - The SQL Query should use quotes around table and column names containing uppercase characters
        - The SQL Query should be syntaxically correct
        - The SQL Query should be the sole content of your message
        - Pay attention to use CURRENT_DATE function to get the current date, if the question involves "today"
        - Your response should be a SQL query and nothing else.
        - Donot make up table and column names by yourself. 
        \n\n""" + """
Previous conversation:
{chat_history}

New human question: {instruction}

Response:
""" 
        self.prompt = PromptTemplate.from_template(self.template)

            
        if model == "GPT3.5":

            self.llm = ChatOpenAI(temperature=0, openai_api_key=self.openai_api_key, model='gpt-3.5-turbo')
            tools = [execute_query]
            prompt = ChatPromptTemplate.from_messages(
  [
      (
          "system",
          f"""
  {NEW_SCHEMA}\n\n\nUsing valid SQL for Postgres, answer the following question for the SCHEMA provided above. 

  Your job is to create a valid SQL code and then you need to run the query, If the query runs successfully, you must return the SQL code only.
  If there is an error then you need to resolve the error and write a new SQL query and then execute it again. You must run the query first to check if it is correct.
  If the Query runs successfully, You should review the results to check if the query you wrote was logically correct.  
  Always include 2 or more columns to make SQL query.
  Folow the following rules:
  - You should only run SELECT queries. (Donot update or delete anything from database)
  - The SQL Query should only contain the columns that are provided above.
  - SQL Query must not contain the columns that are not present in the Table which you are referring. 
  - The SQL Query should respect the case and consider columns and tables as case-sensitive
  - The SQL Query should use quotes around table and column names containing uppercase characters
  - Pay attention to use CURRENT_DATE function to get the current date, if the question involves "today"
  - Your response should be a SQL query and nothing else.
  - Donot make up table and column names by yourself. 
  """,
      ),
      MessagesPlaceholder(variable_name='chat_history'),
      ("user", "{input}"),
      MessagesPlaceholder(variable_name="agent_scratchpad"),
      
  ]
)
            llm_with_tools = self.llm.bind_tools(tools)

           

            agent = (
                {
                    "input": lambda x: x["input"],
                    "agent_scratchpad": lambda x: format_to_openai_tool_messages(
                        x["intermediate_steps"]
                    ),
                    "chat_history": lambda x: x["chat_history"],
                    
                }
                | prompt
                | llm_with_tools
                | OpenAIToolsAgentOutputParser()
            )
            # self.SQL_CHAIN = LLMChain(llm=self.llm, prompt=self.prompt, memory=self.memory, verbose=True)
            agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)
            sql_query = agent_executor.invoke({"input": question, "chat_history": self.chat_history})
            
            sql_query = sql_query['output'].split("```sql")[-1].split("```")[0].split(";")[0].strip() + ";"
            
            self.chat_history.extend(
                [
                    HumanMessage(content=question),
                    AIMessage(content=sql_query),
                ]
            )
        elif model == "Defog":
            
            defog = Defog.Defog(question, NEW_SCHEMA, self.memory.load_memory_variables({}))
            sql_query = defog.run()
            self.memory.chat_memory.add_user_message(question)
            self.memory.chat_memory.add_ai_message(sql_query)

        sql_template = f"""
User will give you an SQL query and you need to extract the column names from it.
Your response should only be a python list of column names

for example:
    SQL QUERY = SELECT product_name, SUM(quantity) as total_quantity JOIN products ON order_details.product_id = products.product_id GROUP BY product_name ORDER BY total_quantity DESC LIMIT 5;
    Response = [product_name, total_quantity]

Below is the provided SQL QUERY 
SQL QUERY: {sql_query}
Response:
"""
        sql_prompt = PromptTemplate.from_template(sql_template)
        llm = ChatOpenAI(temperature=0, openai_api_key=self.openai_api_key, model='gpt-3.5-turbo')
        sql_chain = LLMChain(llm=llm, prompt=sql_prompt, verbose=False)
        columns = sql_chain.predict(sql_query = sql_query)
        columns = columns.strip('[]').split(', ')
        columns = [item.strip('"') for item in columns]
        print(columns)
        
        result = exec_query(sql_query, self.connection, self.schema) 
        
        
        res = [list(tuple_item) for tuple_item in result]
    
        return {'SQL_QUERY': sql_query, 'DATA': res, 'columns' : columns}