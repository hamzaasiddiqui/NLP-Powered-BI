import torch
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
import warnings
import sqlparse



class Defog:
    def __init__(self):
        warnings.filterwarnings("ignore")
        model_name = "defog/sqlcoder2"
        self.model_name = "defog/sqlcoder2"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type='nf4',
            bnb_4bit_use_double_quant=True,
            bnb_4bit_compute_dtype=torch.bfloat16
        )
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name,
            trust_remote_code=True,
            quantization_config=bnb_config,
            device_map="auto",
        )
        torch.cuda.empty_cache()

    def run(self, question, database_schema):
        prompt = f"""### Task
Generate a SQL query to answer the following question:
`{question}`

### Database Schema
This query will run on a database whose schema is represented in this string:

`{database_schema}`


### SQL
Given the database schema, here is the SQL query that answers `{question}`:
```sql
        """.format(database_schema=database_schema, question=question)

        input_ids = self.tokenizer(prompt, return_tensors="pt").input_ids
        eos_token_id = self.tokenizer.convert_tokens_to_ids(["```"])[0]

        generated_ids = self.model.generate(
            input_ids,
            num_return_sequences=1,
            eos_token_id=eos_token_id,
            pad_token_id=eos_token_id,
            max_new_tokens=400,
            do_sample=False,
        )

        outputs = self.tokenizer.batch_decode(generated_ids, skip_special_tokens=True)
        torch.cuda.empty_cache()
        # print(sqlparse.format(outputs[0].split("```sql")[-1], reindent=True))
        # Extract and return the SQL query from the model's output
        # return outputs[0].split("```sql")[-1].split("```")[0].split(";")[0].strip() + ";"
        return outputs[0].split("```sql")[-1].split("```")[0].split(";")[0].strip() + ";"
        # return sqlparse.format(outputs[0].split("```sql")[-1], reindent=True)
        
