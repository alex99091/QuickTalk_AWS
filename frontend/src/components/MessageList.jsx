function MessageList({ messages = [] }) {
    return (
        <div className="space-y-3">
            {messages.length === 0 ? (
                <div className="text-center text-gray-400">아직 메시지가 없습니다.</div>
            ) : (
                messages.map((msg, index) => (
                    <div
                        key={index}
                        className="flex flex-col items-start bg-gray-50 p-2 rounded shadow-sm"
                    >
                        <div className="text-sm font-semibold text-blue-600 mb-1">{msg.sender}</div>
                        <div className="text-gray-700">{msg.text}</div>
                    </div>
                ))
            )}
        </div>
    );
}

export default MessageList;
