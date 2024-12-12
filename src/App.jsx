import { Routes, Route } from "react-router";
import Home from "./pages/Home";
import Chatbot from "./pages/Chatbot";
import Suggestion from "./pages/Suggetion";
import UpdatedSuggetion from "./pages/UpdatedSuggetion";

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/suggetion" element={<Suggestion />} />
        <Route path="/student-bot" element={<UpdatedSuggetion />} />
      </Routes>
    </div>
  );
};

export default App;
