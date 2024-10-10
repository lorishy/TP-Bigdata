from flask import Flask, request, jsonify
from kafka import KafkaProducer
from marshmallow import Schema, fields, ValidationError
import json
from flask_cors import CORS


app = Flask(__name__)
CORS(app)


producer = KafkaProducer(
    bootstrap_servers='kafka:9092',
    value_serializer=lambda v: json.dumps(v).encode('utf-8')
)

class MessageSchema(Schema):
    message = fields.Str(required=True)

# Selectionner mon topic
kafka_topic_name = "topic1"
 
# Selectionner mon server
kafka_bootstrap_servers = 'kafka:9092'

@app.route('/message', methods=['POST'])
def add_message():
    json_data = request.get_json()
    if not json_data:
        return jsonify({"message": "No input data provided"}), 400

    try:
        data = message_schema.load(json_data)
    except ValidationError as err:
        return jsonify(err.messages), 422

    producer.send('topic1', data)
    producer.flush()

    return jsonify({"message": "User data received and sent to Kafka"}), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5550)
