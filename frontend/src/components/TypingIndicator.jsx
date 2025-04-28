function TypingIndicator({ nickname }) {
    return (
        <div className="text-sm text-gray-500 mb-2">
            {nickname} 님이 입력 중입니다...
        </div>
    );
}

export default TypingIndicator;
