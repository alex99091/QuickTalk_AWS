from kafka import KafkaConsumer
from danger_analyzer import is_dangerous
from mongo_saver import save_to_mongo
from kafka_producer import send_alert

import json

# Kafka Consumer 설정
consumer = KafkaConsumer(
    'chat-monitor-topic',
    bootstrap_servers='localhost:9092',
    auto_offset_reset='latest',
    enable_auto_commit=True,
    group_id='nlp-analyzer-group',
    value_deserializer=lambda m: json.loads(m.decode('utf-8'))
)

print("🟢 Kafka Consumer is running...")

for message in consumer:
    msg = message.value
    print(f"📩 받은 메시지: {msg}")

    if is_dangerous(msg.get("content", "")):
        print("⚠️ 위험 메시지 감지됨! MongoDB에 저장 및 알림 전송 중...")
        save_to_mongo(msg)
        send_alert(msg)
