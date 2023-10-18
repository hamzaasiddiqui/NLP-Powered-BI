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
import requests
import sqlparse
defog_url = "http://10.1.131.235:5000/run_defog"

class Chatbot:
    def __init__(self, openai_api_key, conn):
        self.openai_api_key = openai_api_key
        self.SQL_QUERY_PROMPT, self.SCHEMA = SQL_QUERY.SQL_QUERY(conn)
        self.connection = conn
        self.prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=self.SQL_QUERY_PROMPT), # The persistent system prompt
            MessagesPlaceholder(variable_name="chat_history"), # Where the memory will be stored.
            HumanMessagePromptTemplate.from_template("{instruction}"), # Where the human input will injected
        ])
        self.memory = ConversationBufferWindowMemory(k=3, return_messages=True, memory_key="chat_history")
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
        
            
        # memory = ConversationBufferMemory(memory_key="chat_history", return_messages=True)
        # memory = ConversationBufferWindowMemory(k=10, return_messages=True, memory_key="chat_history")
        if model == "GPT3.5":
            self.llm = ChatOpenAI(temperature=0.4, openai_api_key=self.openai_api_key, model='gpt-3.5-turbo')
            self.SQL_CHAIN = LLMChain(llm=self.llm, prompt=self.prompt, memory=self.memory, verbose=True)
            sql_query = self.SQL_CHAIN.predict(instruction = question)
        elif model == "Defog":
            data = {
                "prompt": question,
                "database_schema": self.SCHEMA,
            }
            response = requests.post(defog_url, json=data)
            sql_query = response.json()
        
        columns = self.extract_columns_from_query(sql_query)
       
        result = execute_query(sql_query, self.connection) 
        print(result)
        
        res = [list(tuple_item) for tuple_item in result]
        # print(memory.load_memory_variables({}))      
        return {'SQL_QUERY': sql_query, 'DATA': res, 'columns' : columns}




