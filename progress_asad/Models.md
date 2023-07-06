# PICARD - Parsing Incrementally for Constrained Auto-Regressive Decoding from Language Models

PICARD stands for Parsing Incrementally for Constrained Auto-Regressive Decoding from Language Models. It is a method for constraining the output of large language models (LLMs) when translating natural language questions into SQL queries.

In text-to-SQL translation, the goal is to translate a natural language question into a SQL query. There are two main challenges to this task:

1. The generated SQL needs to be semantically correct, that is, correctly reflect the meaning of the question.
2. The SQL also needs to be valid, that is, it must not result in an execution error.

PICARD addresses these challenges by incrementally parsing the output of the LLM as it is generated. The parser checks each token in the output to make sure that it is valid SQL. If a token is invalid, the parser rejects it and the LLM is forced to generate a different token.

## Parsing

In natural language processing, parsing is used to break down natural language text into its grammatical components. This allows computers to understand the meaning of text and to perform tasks such as machine translation and question answering.

For Spider and CoSQL, we have implemented a parser that supports a subset of the SQLite syntax and that checks additional constraints on the AST.

PICARD uses a parsing library called attoparsec that supports incremental input. This is a special capability that is not available in many other parsing libraries. You can feed attoparsec a string that represents only part of the expected input to parse. When parsing reaches the end of an input fragment, attoparsec will return a continuation function that can be used to continue parsing. Think of the continuation function as a suspended computation that can be resumed later. Input fragments can be parsed one after the other when they become available until the input is complete. This means that it takes chunks of the input and parses them in that way.

This model was initialized with T5-3B and has to be fine-tuned with the Spider dataset.

## Pros

- Very effective at improving the accuracy of text-to-SQL translation. PICARD has been shown to be very effective at improving the accuracy of text-to-SQL translation. On the Spider and CoSQL datasets, PICARD has been shown to achieve state-of-the-art results.
- Constrained Decoding: The algorithm enables constrained decoding by enforcing semantic correctness and validity of SQL queries. It addresses the trade-off between generating correct SQL and ensuring its execution without errors.
- Does not require a special vocabulary. PICARD can be used with any vocabulary, including the vocabulary of the language model itself. It does not require any additional data or configuration.

## Cons

- Can be slow for large queries. PICARD can be slow for large queries, as it must parse the entire query before it can generate the output SQL.
- May not be able to handle queries that include complex joins and subqueries.
- Requires a well-defined database schema. PICARD requires a well-defined database schema in order to generate valid SQL. If the database schema is not well-defined, PICARD may generate invalid SQL.
- Parsing increases the complexity of the model.

## Beam search 
Beam search is a powerful decoding algorithm that can be used to generate text, translate languages, and answer questions. It is a versatile algorithm that can be used with a wide variety of language models.

- Beam search is a type of greedy search that considers multiple possible sequences at each step.
- It starts with a single sequence, and then expands the sequence by adding the next most likely token.
- The algorithm maintains a set of the top-k most likely sequences, and then repeats this process until the end of the sequence isreached, or until the beam size is exhausted.

## Requirement
  - 40GB GPU
https://github.com/ServiceNow/picard
https://huggingface.co/tscholak/cxmefzzi/tree/main
