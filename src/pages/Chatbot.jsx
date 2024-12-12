// import { useState } from "react";
// import { FaRobot, FaPaperPlane, FaUpload } from "react-icons/fa";

// const Chatbot = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     academicDetails: "",
//     resume: null,
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileUpload = (e) => {
//     setFormData((prev) => ({ ...prev, resume: e.target.files[0] }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Form Data Submitted:", formData);
//     alert("Form submitted successfully! Chatbot will start soon.");
//     // Navigate to the chatbot interface (placeholder for now)
//   };

//   return (
//     <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-blue-100">
//       <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
//         <div className="flex items-center mb-6">
//           <FaRobot className="text-blue-500 text-3xl mr-3" />
//           <h1 className="text-2xl font-bold text-gray-800">
//             Welcome to AI Chatbot
//           </h1>
//         </div>
//         <p className="text-gray-600 mb-4">
//           Please provide your details to get started with the chatbot.
//         </p>
//         <form onSubmit={handleSubmit} className="space-y-4">
//           {/* Name */}
//           <div>
//             <label className="block text-gray-700 font-medium">Name</label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Enter your name"
//               className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//           </div>

//           {/* Email */}
//           <div>
//             <label className="block text-gray-700 font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Enter your email"
//               className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//           </div>

//           {/* Academic Details */}
//           <div>
//             <label className="block text-gray-700 font-medium">
//               Academic Details
//             </label>
//             <textarea
//               name="academicDetails"
//               value={formData.academicDetails}
//               onChange={handleChange}
//               placeholder="Provide a brief about your academic background"
//               className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               rows="3"
//               required
//             />
//           </div>

//           {/* Resume Upload */}
//           <div>
//             <label className=" text-gray-700 font-medium flex items-center">
//               Upload Resume <FaUpload className="ml-2 text-blue-500" />
//             </label>
//             <input
//               type="file"
//               onChange={handleFileUpload}
//               accept=".pdf,.doc,.docx"
//               className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
//               required
//             />
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center"
//           >
//             <FaPaperPlane className="mr-2" />
//             Start Chat
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default Chatbot;

import { useState } from "react";
import { FaRobot, FaPaperPlane, FaSpinner } from "react-icons/fa";

const Chatbot = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    academicDetails: "",
    highestQualification: "",
    lookingFor: "",
    age: "",
    location: "",
    additionalInfo: "",
    resume: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [chatStarted, setChatStarted] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "bot",
      message:
        "Welcome! Thank you for your interest in higher education. How can I assist you today?",
    },
  ]);
  const [userMessage, setUserMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setChatStarted(true);
    }, 2000);
  };

  const handleSendMessage = () => {
    if (!userMessage.trim()) return;

    const newMessage = { sender: "user", message: userMessage };
    const botReply = {
      sender: "bot",
      message: "Thank you for your message. I'll assist you shortly.",
    };

    setChatHistory((prev) => [...prev, newMessage, botReply]);
    setUserMessage(""); // Clear the input
  };

  console.log(chatHistory);

  return (
    <div className="h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-4">
      {!chatStarted ? (
        <div className="flex flex-col items-center justify-center h-full">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
            <div className="flex items-center mb-6">
              <FaRobot className="text-blue-500 text-3xl mr-3" />
              <h1 className="text-2xl font-bold text-gray-800">
                Welcome to AI Chatbot
              </h1>
            </div>
            <p className="text-gray-600 mb-4">
              Please provide your details to get started with the chatbot.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
              <input
                type="text"
                name="highestQualification"
                value={formData.highestQualification}
                onChange={handleChange}
                placeholder="Highest Qualification"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="lookingFor"
                value={formData.lookingFor}
                onChange={handleChange}
                placeholder="Looking for Which Course"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="Age"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Preferred Location for Study"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <textarea
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Any Additional Information"
                className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="3"
              />
              {/* Resume Upload */}
              {/* <div>
                <label className=" text-gray-700 font-medium flex items-center">
                  Upload Resume <FaUpload className="ml-2 text-blue-500" />
                </label>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".pdf,.doc,.docx"
                  className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              </div> */}
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Start Chat
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <div className="flex flex-col h-full bg-white shadow-md rounded-lg p-6">
          <div className="flex-grow overflow-y-auto">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`px-4 py-2 rounded-lg ${
                    msg.sender === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message"
              className="flex-grow px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleSendMessage}
              className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
