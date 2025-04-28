import Button from "./Button";
import { motion } from "framer-motion";

function CreateRoomModal({ onClose, onSubmit, newTitle, setNewTitle, newMaxUsers, setNewMaxUsers }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-6 rounded-lg shadow-lg w-80"
            >
                <h2 className="text-xl font-semibold mb-4">대화방 만들기</h2>

                <input
                    type="text"
                    placeholder="방 제목"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full mb-4 px-3 py-2 border rounded"
                />
                <input
                    type="number"
                    placeholder="최대 인원 수"
                    value={newMaxUsers}
                    min={2}
                    max={50}
                    onChange={(e) => setNewMaxUsers(Number(e.target.value))}
                    className="w-full mb-6 px-3 py-2 border rounded"
                />

                <div className="flex justify-between">
                    <Button onClick={onSubmit}>만들기</Button>
                    <Button onClick={onClose} className="bg-gray-400 hover:bg-gray-500">
                        취소
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}

export default CreateRoomModal;
