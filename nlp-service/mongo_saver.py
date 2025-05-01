# mongo_saver.py

from pymongo import MongoClient
from datetime import datetime

# MongoDB 연결 (로컬 기준)
client = MongoClient('mongodb://localhost:27017')
db = client['quicktalk']
collection = db['danger_logs']

def save_to_mongo(message: dict):
    message['detected_at'] = datetime.utcnow()
    collection.insert_one(message)
    print("💾 MongoDB에 위험 메시지 저장 완료.")
