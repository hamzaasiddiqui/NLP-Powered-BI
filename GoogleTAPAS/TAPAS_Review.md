# Google TAPAS (TAble PArSing) Analysis
[Documentation-HuggingFace](https://huggingface.co/google/tapas-large)

TAPAS is a BERT-like transformers model pretrained on a large corpus of English data from Wikipedia in a self-supervised fashion. This means it was pretrained on the raw tables and associated texts only, with no humans labelling them in any way (which is why it can use lots of publicly available data) with an automatic process to generate inputs and labels from those texts.

## Working Mechanism

TAPAS is based on and extends a transformer architecture to process data in form of rows and columns.

1. TAPAS uses a tokenizer to break down the input table and queries into smaller units called tokens. Each token represents a word or a subword in the input text.
2. The embedding captures the semantic meaning of each token
3. TAPAS uses positional encoding to help the model understand the position of each token in the table.
4. TAPAS also uses cross-attention to capture relationship between table and the queries.
5. During inference, TAPAS predicts the answer coordinates of the query and applies aggregation if must, and hence extracts the answer.

## Summary

As TAPAS is a table parser, it tokenizes the input table and extracts the semantic meaning from the tokens and predicts answers using different encodings.

TAPAS' purpose is to parse a table and extract information using natural language input. Hence, it is able to take only one talbe input at a time and cannot serve the purpose of generating a database query.