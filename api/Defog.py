import requests
defog_url = "http://10.1.131.235:5000//run_defog"

class Defog:
    def __init__(self, question, schema, memory) -> None:
        self.question = question
        self.schema = schema
        self.memory = memory['chat_history']
        self.memory = self.memory.splitlines() 
        self.memory = '\n'.join(self.memory) 

    def run(self):
        prompt = f"""### Task
Generate a SQL query to answer the following question:
{self.question}

### Database Schema
This query will run on a database whose schema is represented in this string:

{self.schema}


{self.memory}

### SQL
Given the database schema, here is the SQL query that answers {self.question}:
```sql
"""  

        data = {
            "prompt": prompt,
        }
        response = requests.post(defog_url, json=data)
        sql_query = response.json()

        return sql_query

    