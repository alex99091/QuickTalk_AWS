function ChatRoomCard({ room, onJoin }) {
    return (
        <div className="flex items-center justify-between p-4 bg-white rounded shadow">
            <div>
                <p className="font-semibold text-lg">{room.title}</p> {/* ⭐ 여기가 중요 */}
                <p className="text-sm text-gray-500">
                    {room.currentUsers}/{room.maxUsers} 참여중
                </p>
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
