# Create virtual environment
# Install libraries from requirements.txt in venv
# pip intall -r requirements.txt
# Run flask app and test on Insomnia or Postman

import os
import psycopg2
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import Chatbot
import requests



app = Flask(__name__)
CORS(app)
CORS(app, origins="http://localhost:3000/")

app.config['CORS_HEADER'] = 'Content-Type'
load_dotenv()
connection = None
chatbot_ = None
openai_api_key = None
 
@app.route('/api/connectDB', methods=['POST'])
def connect_to_db():
    global connection
    global chatbot_
    global openai_api_key
    data = request.json
    connection_type = data.get('connectionType')

    try:
        if connection is None or connection.closed != 0:
            if connection_type == 'url':  
                openai_api_key = data.get('openai_api_key')
                database_url = data.get('databaseUrl')

                connection = psycopg2.connect(database_url)
            else:  # Connect using individual details
                
                host = data.get('host')
                port = data.get('port')
                database = data.get('database')
                user = data.get('user')
                password = data.get('password')
                connection = psycopg2.connect(
                    host=host,
                    port=port,
                    database=database,
                    user=user,
                    password=password
                )
            
            chatbot_ = Chatbot(openai_api_key=openai_api_key, conn=connection)
            response_data = {'message': 'Connected to the database successfully'}
            return jsonify(response_data)
    except psycopg2.Error as e:
        error_message = str(e)
        return jsonify({'error': error_message}), 500



# Route to close DB connection
# FOR FUTURE DEVELOPMENT
@app.route('/api/disconnectDB', methods=['POST'])
def close_db_connection():
    global connection

    if connection:
        connection.close()
        connection = None

        print('DISCONNECTED')
        print(connection)

        response_data = {'message': 'Data received successfully'}  # Create a response dictionary

        return jsonify(response_data)
    else:
        response_data = {'message': 'No databse to disconnect'}  # Create a response dictionary

        return jsonify(response_data)


@app.route('/chatbot', methods=['POST'])
def chatbot():
    
    global chatbot_
    query = request.get_json().get('query')
    model = request.get_json().get('model')
    if query:
        
        result = chatbot_.chatbot(query, model)
        
        print(result)
        return jsonify(result)
    else:
        return 'Invalid query', 400
   

@app.get("/")
def home():
    return "NLP Powered BI"


if __name__ == '__main__':
    load_dotenv()
    app.run(debug=True)