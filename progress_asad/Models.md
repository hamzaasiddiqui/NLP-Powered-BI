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

# RESDSQL

- Using seq2seq model in RESDSQL. 
- RESDQL works by decoupling the schema linking and skeleton parsing.
- Encoder and decoder are both seq2seq models
- The encoder takes the natural language input and extracts meaningful information (context) from it.
- The decoder takes this context and generates a sequence of tokens. These tokens represent the SQL queries. Skeleton parsing is done at this point as well.
- “The encoder aims to jointly encode the question and database schema, which is generally divided into sequence encoder and graph encoder. The decoder aims to generate the SQL queries based on the output of the encoder. Due to the special format of SQL, grammar- and execution-guided decoders are studied to constrain the decoding results.”
- RESDSQL firstly ranks the schema links based on the input natural language to select meaningful items tables and columns that are relevant to the question. This is useful when the schema is large and complex.

## Skeleton parsing
Skeleton parsing is a less detailed approach that aims to provide a high-level representation of the query structure. The skeleton typically consists of a set of SQL keywords, along with some information about the tables and columns that are involved in the query, e.g. select, from, where, etc.

## Pros:
- The decoupling of schema linking and skeleton parsing makes the task of Text-to-SQL parsing easier for the seq2seq model.
- The ranking of schema items according to their relevance to the given question helps to improve the accuracy of the schema linking task.
- The implicit constraints imposed by the skeleton on the SQL parsing task help to improve the robustness of the parser.

## Cons:
- It is very complex than traditional Text-to-SQL parsers, which makes it more difficult to train and deploy.
- It requires a lot of parameters (around 3 billion) to tune as it is a pretty large model so it requires a lot of resources.

## Requirements:
This model is trained on an 80GB GPU(A100) so it will be pretty difficult to use this model as we don’t have the resources to train this model.
https://github.com/RUCKBReasoning/RESDSQL



# Graphix-T5
It performs text-to-SQL parsing that combines the strengths of pre-trained transformers with graph-aware layers.
Uses 2 pre-trained transformers:
- T5: The T5 model is a text-to-text transformer model that is pre-trained on a large corpus of text and code. The T5 model is used to encode the natural language question and to generate the SQL query.
- Graph-aware transformer: The graph-aware transformer is a novel transformer model that is designed to reason over the structure of the database. The graph-aware transformer is used to generate the SQL query by reasoning over the graph representation of the database.
It is first trained on T5 and then fine tuned on text-to-SQL queries.
The model can work on unseen databases hence is generalizable.
The T5 model acts as an encoder and the Graph-aware model acts as the decoder
Some of the key steps involved in the working of Graphix-T5:
- The natural language question is first parsed into a sequence of tokens.
- The tokens are then encoded by the pre-trained transformer encoder.
- The encoded hidden states are then passed to the graph-aware decoder.
- The graph-aware decoder generates the SQL query by reasoning over the graph representation of the database.
- The generated SQL query is then executed against the database to retrieve the desired results.
## Graph aware layers:
Graph-aware layers are a type of neural network layer that is designed to be aware of the graph structure of the input data. This means that the layer can take into account the relationships between entities in the graph when making predictions. The graph-aware layers can then be used to reason over the graph and to generate more accurate predictions.
One common approach to implement the model is by using a graph neural network (GNN). GNNs are a type of neural network that can be used to process graph-structured data. GNNs work by propagating information through the graph, taking into account the relationships between entities.
Another approach to implementing graph-aware layers is to use a transformer model. Transformer models are a type of neural network that are typically used for natural language processing tasks. However, transformers can also be used to process graph-structured data. This is done by representing the graph as a sequence of tokens, and then using the transformer model to encode the sequence.
## Pros:
•	Graphix-T5 is able to generalize well to unseen databases.
•	They can help to capture the structural relationships between entities in a graph.
•	They can be used to reason over the graph and to generate more accurate predictions.

## Cons:
•	They can be computationally expensive to train and to use.
•	They can be difficult to interpret.
•	They may not be appropriate for all NLP tasks that involve graphs.
## Resources:
Same as RESDSQL
DAMO-ConvAI/graphix at main · AlibabaResearch/DAMO-ConvAI · GitHub
2301.07507.pdf (arxiv.org)

# LLama2
# defog
