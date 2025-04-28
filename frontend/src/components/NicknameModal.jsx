import { motion } from "framer-motion";
import Button from "./Button";

function NicknameModal({ onClose, nickname, setNickname }) {
    const handleSave = () => {
        if (!nickname.trim()) {
            alert("닉네임을 입력하세요!");
            return;
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg w-80"
            >
                <h2 className="text-xl font-semibold mb-4 text-center">닉네임 설정</h2>

                <input
                    type="text"
                    placeholder="닉네임을 입력하세요"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full px-4 py-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                />

                <div className="flex justify-between">
                    <Button onClick={handleSave} className="w-full">
                        저장
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

export default NicknameModal;
