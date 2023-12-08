import psycopg2
from flask import Flask, request, jsonify, current_app
from flask_cors import CORS
from chatbot import Chatbot
from schema import execute_query

def create_app():
    app = Flask(__name__)
    app.config['CORS_HEADER'] = 'Content-Type'
    CORS(app)
    CORS(app, origins="http://localhost:3000")

    with app.app_context():
        # Initialize non-global variables within the app context
        setattr(current_app, 'connection', None)
        setattr(current_app, 'chatbot', None)
        setattr(current_app, 'openai_api_key', None)
        setattr(current_app, 'schema', None)

    return app

def connect_to_db(data):
    connection_type = data.get('connectionType')

    try:
        
        current_app.openai_api_key = data.get('openai_api_key')
        database_url = data.get('databaseUrl')
        current_app.schema = data.get('schema')
        current_app.connection = psycopg2.connect(database_url)
    

        current_app.chatbot = Chatbot(openai_api_key=current_app.openai_api_key, conn=current_app.connection, schema = current_app.schema)
        response_data = {'message': 'Connected to the database successfully'}
        return jsonify(response_data)

    except psycopg2.Error as e:
        error_message = str(e)
        return jsonify({'error': error_message}), 500

def close_db_connection():
    if current_app.connection:
        current_app.connection.close()
        current_app.connection = None
        print('DISCONNECTED')
        response_data = {'message': 'Disconnected from the database successfully'}
        return jsonify(response_data)
    else:
        response_data = {'message': 'No database to disconnect'}
        return jsonify(response_data)

def chatbot(query, model):
    if current_app.connection and current_app.chatbot:
        result = current_app.chatbot.chatbot(query, model)
        return jsonify(result)
    else:
        return jsonify({'error': 'Database not connected'}), 500

app = create_app()

@app.route('/api/connectDB', methods=['POST'])
def api_connect_db():
    data = request.json
    return connect_to_db(data)

@app.route('/api/disconnectDB', methods=['POST'])
def api_disconnect_db():
    return close_db_connection()

@app.route('/api/SQL', methods=['POST'])
def run_sql():
    schema = request.get_json().get('schema')
    sql = request.get_json().get('sql')
    url = request.get_json().get('url')
    
    connection = psycopg2.connect(url)
    result = execute_query(sql, connection, schema)
    res = [list(tuple_item) for tuple_item in result]
    return {'data': res}

@app.route('/chatbot', methods=['POST'])
def chatbot_route():
    query = request.get_json().get('query')
    model = request.get_json().get('model')

    if query:
        return chatbot(query, model)
    else:
        return 'Invalid query', 400