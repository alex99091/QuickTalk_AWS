# kafka_producer.py

from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers='localhost:9092',
    value_serializer=lambda m: json.dumps(m).encode('utf-8')
)

def send_alert(message: dict):
    producer.send('danger-alert-topic', message)
    producer.flush()
    print("🚨 Kafka에 danger-alert-topic 경고 전송 완료.")
