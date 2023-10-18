from flask import Flask, request, jsonify
import defog
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
CORS(app, origins="*")
app.config['CORS_HEADER'] = 'Content-Type'
model = defog.Defog()



@app.route('/run_defog', methods=['POST'])
def run_defog():
    
    prompt = request.json.get('prompt')
    database_schema = request.json.get('database_schema')
    output = model.run(prompt, database_schema)
    return jsonify(output)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=False)