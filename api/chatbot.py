from langchain.chat_models import ChatOpenAI
from langchain import OpenAI
import os
import sqlalchemy
from langchain.chains import LLMChain
from langchain.prompts.prompt import PromptTemplate
from langchain.memory import ConversationBufferWindowMemory
from schema import execute_query
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.chat_models import ChatOpenAI
from langchain.schema import SystemMessage
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder
import SQL_QUERY
import numpy as np
import Defog
import sqlparse
from prompt_formatters import Formatter


class Chatbot:
    def __init__(self, openai_api_key, conn, schema):
        self.schema = schema
        self.openai_api_key = openai_api_key
        # self.SQL_QUERY_PROMPT, self.SCHEMA = SQL_QUERY.SQL_QUERY(conn)
        self.collection, self.SCHEMA = SQL_QUERY.SQL_QUERY(conn, schema)
        self.connection = conn
        # self.prompt = ChatPromptTemplate.from_messages([
        #     SystemMessage(content=self.SQL_QUERY_PROMPT), # The persistent system prompt
        #     MessagesPlaceholder(variable_name="chat_history"), # Where the memory will be stored.
        #     HumanMessagePromptTemplate.from_template("{instruction}"), # Where the human input will injected
        # ])

        self.memory = ConversationBufferWindowMemory(k=3, memory_key="chat_history")
    def make_table(self, res, size=1):
        max_name_length = max(len(name) for name, _ in res)
        table_str = ""
        for i in range(size):
            if i >= len(res):
                break
            name, number = res[i]
            row = f"| {name:<{max_name_length}} | {number} |\n"
            table_str += row
        return table_str
    
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

            # Strip any leading/trailing whitespace and comma
            select_portion = select_portion.strip().strip(',')

            columns = select_portion.split(',')
            columns = [column.strip() for column in columns]

        return columns
    


    def chatbot(self, question, model): 
        results = self.collection.query(
            query_texts=[question],
            n_results=5
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
            self.llm = ChatOpenAI(temperature=0.5, openai_api_key=self.openai_api_key, model='gpt-3.5-turbo')
            self.SQL_CHAIN = LLMChain(llm=self.llm, prompt=self.prompt, memory=self.memory, verbose=True)
            sql_query = self.SQL_CHAIN.predict(instruction = question)
            sql_query = sql_query.split("```sql")[-1].split("```")[0].split(";")[0].strip() + ";"
        elif model == "Defog":
            
            defog = Defog.Defog(question, NEW_SCHEMA, self.memory.load_memory_variables({}))
            sql_query = defog.run()
            self.memory.chat_memory.add_user_message(question)
            self.memory.chat_memory.add_ai_message(sql_query)
      
        columns = self.extract_columns_from_query(sql_query)
       
        result = execute_query(sql_query, self.connection, self.schema) 
        
        
        res = [list(tuple_item) for tuple_item in result]
    
        return {'SQL_QUERY': sql_query, 'DATA': res, 'columns' : columns}




