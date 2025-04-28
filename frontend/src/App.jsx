import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ChatRoom from "./pages/ChatRoom";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/chat/:id" element={<ChatRoom />} />
            </Routes>
        </Router>
    );
}

export default App;
