function ChatRoomCard({ room, onJoin }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded shadow">
            <div className="flex flex-col">
                <span className="text-lg font-bold">{room.title}</span> {/* ✅ 제목 표시 */}
                <span className="text-sm text-gray-500">{room.currentUsers}/{room.maxUsers} 참여중</span> {/* ✅ 인원수 표시 */}
            </div>
            <button
                onClick={onJoin}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded"
            >
                참여하기
            </button>
        </div>
    );
}

export default ChatRoomCard;
