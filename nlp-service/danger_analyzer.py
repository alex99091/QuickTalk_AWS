# danger_analyzer.py

# 기본 키워드 필터 (나중에 AI 모델로 교체 가능)
DANGEROUS_KEYWORDS = ["죽고싶어", "자살", "마약", "극단적", "총", "칼", "피"]

def is_dangerous(text: str) -> bool:
    text = text.lower()
    for keyword in DANGEROUS_KEYWORDS:
        if keyword in text:
            return True
    return False
