import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ChatRoomCard from "../components/ChatRoomCard";
import CreateRoomModal from "../components/CreateRoomModal";
import NicknameModal from "../components/NicknameModal";
import Button from "../components/Button";

function Home() {
    const navigate = useNavigate();

    const [chatRooms, setChatRooms] = useState([
        { id: 1, title: "게임 이야기방", currentUsers: 3, maxUsers: 10 },
        { id: 2, title: "코딩 스터디", currentUsers: 5, maxUsers: 8 },
        { id: 3, title: "고양이 사진 공유", currentUsers: 2, maxUsers: 5 },
    ]);

    const [nickname, setNickname] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showNicknameModal, setShowNicknameModal] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newMaxUsers, setNewMaxUsers] = useState(5);

    useEffect(() => {
        setChatRooms(prevRooms => prevRooms.filter(room => room.currentUsers > 0));
    }, []);

    const handleCreateRoom = () => {
        setShowCreateModal(true);
    };

    const handleSubmitRoom = () => {
        if (!newTitle.trim()) {
            alert("방 제목을 입력하세요!");
            return;
        }
        const newRoomId = Date.now();
        const newRoom = {
            id: newRoomId,
            title: newTitle,
            currentUsers: 1,
            maxUsers: newMaxUsers,
        };
        setChatRooms([...chatRooms, newRoom]);
        setShowCreateModal(false);
        setNewTitle('');
        setNewMaxUsers(5);

        navigate(`/chat/${newRoomId}`, { state: { nickname } });
    };

    const handleJoinRoom = (roomId) => {
        let finalNickname = nickname.trim();
        if (!finalNickname) {
            
            finalNickname = `익명${Math.floor(Math.random() * 10000)}`;
        }
    
        setChatRooms(prevRooms =>
            prevRooms.map(room =>
                room.id === roomId ? { ...room, currentUsers: room.currentUsers + 1 } : room
            )
        );
        navigate(`/chat/${roomId}`, { state: { nickname: finalNickname } });
    };
    

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
            <h1 className="text-4xl font-bold text-blue-600 mb-8">QuickTalk - 랜덤채팅</h1>

            {/* 채팅방 리스트 */}
            <div className="w-full max-w-md space-y-4 mb-8">
                {chatRooms.map((room) => (
                    <ChatRoomCard
                        key={room.id}
                        room={room}
                        onJoin={() => handleJoinRoom(room.id)}
                    />
                ))}
            </div>

            {/* 버튼 묶음 */}
            <div className="flex gap-4">
                <Button onClick={handleCreateRoom} className="px-6 py-2 text-sm">
                    대화방 만들기
                </Button>
                <Button
                    onClick={() => setShowNicknameModal(true)}
                    className="px-6 py-2 text-sm bg-purple-500 hover:bg-purple-600"
                >
                    닉네임 설정하기
                </Button>
            </div>

            {/* 모달들 */}
            {showCreateModal && (
                <CreateRoomModal
                    onClose={() => setShowCreateModal(false)}
                    onSubmit={handleSubmitRoom}
                    newTitle={newTitle}
                    setNewTitle={setNewTitle}
                    newMaxUsers={newMaxUsers}
                    setNewMaxUsers={setNewMaxUsers}
                />
            )}

            {showNicknameModal && (
                <NicknameModal
                    onClose={() => setShowNicknameModal(false)}
                    nickname={nickname}
                    setNickname={setNickname}
                />
            )}
        </div>
    );
}

export default Home;
