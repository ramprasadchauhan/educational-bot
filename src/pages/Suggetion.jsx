// import { useState } from "react";
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import universitydata from "../university-data.json";
// import ReactMarkdown from "react-markdown";
// import { AiOutlineRobot } from "react-icons/ai";
// import { MdAttachFile } from "react-icons/md";
// import { FaMicrophone, FaStopCircle } from "react-icons/fa";
// import { IoIosSend } from "react-icons/io";

// const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

// const genAI = new GoogleGenerativeAI(API_KEY);
// const model = genAI.getGenerativeModel({
//   model: "gemini-pro",
//   generationConfig: {
//     maxOutputTokens: 250,
//     temperature: 0.8,
//   },
// });

// const getUniversitySuggestions = async (extractedText) => {
//   const prompt = `
//     A student is seeking advice for choosing a university based on their resume. Here are the details extracted from their resume:

//     Resume Details:
//     ${extractedText}

//     Based on this information, provide a list of universities from the following data that would be a good fit for the student. The university data contains information about various universities, such as name, course offerings, location, tuition fees, and more.

//     University Data:
//     ${JSON.stringify(universitydata)}

//     Please suggest the top 3 universities that would be the best match for this student based on the resume information.
//   `;

//   try {
//     const result = await model.generateContent(prompt);
//     const response = await result.response;
//     return response.text();
//   } catch (error) {
//     console.error("Error generating response:", error);
//     return "Sorry, I couldn't find any suitable university suggestions based on the provided resume.";
//   }
// };

// const ResumeUploadAndSuggestions = () => {
//   const [file, setFile] = useState(null);
//   const [formData, setFormData] = useState({
//     budget: "",
//     preferredLocation: "",
//     courseInterest: "",
//   });
//   const [extractedText, setExtractedText] = useState("");
//   const [universitySuggestions, setUniversitySuggestions] = useState("");
//   const [chatHistory, setChatHistory] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile && selectedFile.type === "application/pdf") {
//       setFile(selectedFile);
//       setError("");
//     } else {
//       setError("Please upload a valid PDF file.");
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleUpload = async () => {
//     if (!file) {
//       setError("Please select a PDF file.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     const uploadData = new FormData();
//     uploadData.append("pdf", file);

//     try {
//       const response = await fetch("http://localhost:3500/api/upload", {
//         method: "POST",
//         body: uploadData,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to upload PDF");
//       }

//       const data = await response.json();
//       const { text } = data;
//       setExtractedText(text);

//       const suggestions = await getUniversitySuggestions(text);
//       setUniversitySuggestions(suggestions);
//       setChatHistory((prev) => [
//         ...prev,
//         { role: "bot", content: "Here are the university suggestions." },
//         { role: "bot", content: suggestions },
//       ]);
//     } catch (err) {
//       setError("An error occurred while processing the file.");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log(chatHistory);

//   const handleChat = async (query) => {
//     const prompt = `
//       The user has been interacting with the chatbot. Here is the chat history, and university data so far:
//       ${chatHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n")},
//        ${JSON.stringify(universitydata)}

//       The user just asked:
//       User: ${query}

//       Based on the previous chat history and the university data provided earlier, generate an appropriate response for the user's query.
//     `;

//     try {
//       const result = await model.generateContent(prompt);
//       const response = result.response.text();

//       setChatHistory((prev) => [
//         ...prev,
//         { role: "user", content: query },
//         { role: "bot", content: response },
//       ]);
//     } catch (error) {
//       console.error("Error generating chat response:", error);
//       setChatHistory((prev) => [
//         ...prev,
//         { role: "user", content: query },
//         {
//           role: "bot",
//           content:
//             "Sorry, I encountered an issue generating a response. Please try again later.",
//         },
//       ]);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-lg">
//         <h1 className="text-2xl font-bold mb-4 flex items-center">
//           <AiOutlineRobot className="mr-2" /> University Suggestions
//         </h1>

//         <div className="mb-4">
//           <label className="block font-medium mb-2">Budget:</label>
//           <input
//             type="text"
//             name="budget"
//             value={formData.budget}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded"
//             placeholder="Enter your budget"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block font-medium mb-2">Preferred Location:</label>
//           <input
//             type="text"
//             name="preferredLocation"
//             value={formData.preferredLocation}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded"
//             placeholder="Enter preferred location"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block font-medium mb-2">Course Interest:</label>
//           <input
//             type="text"
//             name="courseInterest"
//             value={formData.courseInterest}
//             onChange={handleInputChange}
//             className="w-full p-2 border rounded"
//             placeholder="Enter your course of interest"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block font-medium mb-2">Upload Resume:</label>
//           <div className="flex items-center">
//             <MdAttachFile className="mr-2 text-xl" />
//             <input
//               type="file"
//               accept=".pdf"
//               onChange={handleFileChange}
//               className="p-2 border rounded"
//             />
//           </div>
//         </div>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <button
//           onClick={handleUpload}
//           disabled={loading}
//           className={`w-full py-2 px-4 text-white font-semibold rounded ${
//             loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
//           }`}
//         >
//           {loading ? "Processing..." : "Upload & Get Suggestions"}
//         </button>

//         {loading && (
//           <p className="mt-4 text-gray-600">
//             Extracting text and generating suggestions...
//           </p>
//         )}

//         {extractedText && (
//           <div className="mt-6 p-4 bg-gray-50 rounded shadow-sm">
//             <h2 className="text-xl font-semibold mb-4">Extracted Text</h2>
//             <pre className="whitespace-pre-wrap">{extractedText}</pre>
//           </div>
//         )}

//         {/* {universitySuggestions && (
//           <div className="mt-6 p-4 bg-blue-50 rounded shadow-sm">
//             <h2 className="text-xl font-semibold mb-4">
//               Suggested Universities
//             </h2>
//             <ReactMarkdown>{universitySuggestions}</ReactMarkdown>
//           </div>
//         )} */}

//         <div className="mt-6 p-4 bg-gray-50 rounded shadow-sm">
//           <h2 className="text-xl font-semibold mb-4">Chat with Bot</h2>
//           <div className="space-y-4">
//             {chatHistory.map((message, index) => (
//               <div
//                 key={index}
//                 className={`p-2 rounded shadow-sm ${
//                   message.role === "bot" ? "bg-blue-100" : "bg-green-100"
//                 }`}
//               >
//                 <strong>{message.role === "bot" ? "Bot" : "You"}:</strong>{" "}
//                 <ReactMarkdown>{message.content}</ReactMarkdown>
//               </div>
//             ))}
//           </div>

//           <div className="mt-4">
//             <textarea
//               className="w-full p-2 border rounded"
//               placeholder="Ask a question..."
//               onKeyDown={(e) => {
//                 if (e.key === "Enter" && e.target.value.trim()) {
//                   handleChat(e.target.value);
//                   e.target.value = ""; // Clear the input field
//                 }
//               }}
//             />
//             <button
//               onClick={handleChat}
//               disabled={loading}
//               className="p-2 absolute right-6 text-yellow-400 hover:bg-black/40 text-2xl rounded-full"
//             >
//               {loading ? <FaStopCircle /> : <IoIosSend />}
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResumeUploadAndSuggestions;

import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import universitydata from "../university-data.json";
import ReactMarkdown from "react-markdown";
import { AiOutlineRobot } from "react-icons/ai";
import { MdAttachFile } from "react-icons/md";
import { FaMicrophone, FaStopCircle } from "react-icons/fa";
import { IoIosSend } from "react-icons/io";
import { Link } from "react-router";

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  generationConfig: {
    maxOutputTokens: 250,
    temperature: 0.8,
  },
});

console.log(universitydata.universities.map((uni) => uni.university));

const ResumeUploadAndSuggestions = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    budget: "",
    preferredLocation: "",
    courseInterest: "",
  });
  const [extractedText, setExtractedText] = useState("");
  const [universitySuggestions, setUniversitySuggestions] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState(""); // This will store the user's input

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
      setError("");
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    setLoading(true);
    setError("");

    const uploadData = new FormData();
    uploadData.append("pdf", file);

    try {
      const response = await fetch("http://localhost:3500/api/upload", {
        method: "POST",
        body: uploadData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload PDF");
      }

      const data = await response.json();
      const { text } = data;
      setExtractedText(text);

      const suggestions = await getUniversitySuggestions(text);
      setUniversitySuggestions(suggestions);
      setChatHistory((prev) => [
        ...prev,
        { role: "bot", content: "Here are the university suggestions." },
        { role: "bot", content: suggestions },
      ]);
    } catch (err) {
      setError("An error occurred while processing the file.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChat = async (query) => {
    if (query.trim()) {
      // Add the user query to chat history immediately, before loading state
      setChatHistory((prev) => [...prev, { role: "user", content: query }]);

      // Clear the question input immediately
      setQuestion("");

      setLoading(true);

      try {
        const prompt = `
          The user has been interacting with the chatbot. Here is the chat history, and university data so far:
          ${chatHistory.map((msg) => `${msg.role}: ${msg.content}`).join("\n")},
          ${JSON.stringify(universitydata)}
  
          The user just asked:
          User: ${query}
  
          Based on the previous chat history and the university data provided earlier, generate an appropriate response for the user's query.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response.text();

        // Append the bot response to the chat history after generating the response
        setChatHistory((prev) => [...prev, { role: "bot", content: response }]);
      } catch (error) {
        console.error("Error generating chat response:", error);
        setChatHistory((prev) => [
          ...prev,
          {
            role: "bot",
            content:
              "Sorry, I encountered an issue generating a response. Please try again later.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }
  };

  const getUniversitySuggestions = async (extractedText) => {
    const prompt = `
      A student is seeking advice for choosing a university based on their resume. Here are the details extracted from their resume:
  
      Resume Details:
      ${extractedText}
  
      Based on this information, provide a list of universities from the following data that would be a good fit for the student. The university data contains information about various universities, such as name, course offerings, location, tuition fees, and more based on .
  
      University Data:
      ${JSON.stringify(universitydata)}
      Student's Preferences:
      - Budget: ${formData.budget}
      - Preferred Location: ${formData.preferredLocation}
      - Course Interest: ${formData.courseInterest}
  
      Please suggest the top 3 universities that would be the best match for this student based on the resume information.
    `;
    try {
      console.log(prompt);
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error generating response:", error);
      return "Sorry, I couldn't find any suitable university suggestions based on the provided resume.";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <Link to="/">
            <AiOutlineRobot className="mr-2" />
          </Link>
          University Suggestions
        </h1>

        {/* Form Inputs for University Suggestions */}
        <div className="mb-4">
          <label className="block font-medium mb-2">Budget:</label>
          <input
            type="text"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter your budget"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">Preferred Location:</label>
          <input
            type="text"
            name="preferredLocation"
            value={formData.preferredLocation}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter preferred location"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">Course Interest:</label>
          <input
            type="text"
            name="courseInterest"
            value={formData.courseInterest}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="Enter your course of interest"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-2">Upload Resume:</label>
          <div className="flex items-center">
            <MdAttachFile className="mr-2 text-xl" />
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="p-2 border rounded"
            />
          </div>
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-semibold rounded ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Upload & Get Suggestions"}
        </button>

        {loading && (
          <p className="mt-4 text-gray-600">
            Extracting text and generating suggestions...
          </p>
        )}

        {extractedText && (
          <div className="mt-6 p-4 bg-gray-50 rounded shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Extracted Text</h2>
            <pre className="whitespace-pre-wrap">{extractedText}</pre>
          </div>
        )}

        {/* Chat Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Chat with Bot</h2>
          <div className="space-y-4">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`p-2 rounded shadow-sm ${
                  message.role === "bot" ? "bg-blue-100" : "bg-green-100"
                }`}
              >
                <strong>{message.role === "bot" ? "Bot" : "You"}:</strong>{" "}
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            ))}
          </div>

          {/* Chat Input Section */}
          <div className="relative mt-4">
            <textarea
              className="w-full p-4 pl-10 pr-20 border border-gray-300 rounded-full bg-[#002b17] text-gray-200 focus:outline-none resize-none"
              placeholder="Ask a question..."
              rows="1"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && e.target.value.trim()) {
                  handleChat(e.target.value);
                  e.target.value = ""; // Clear the input field after submitting
                }
              }}
            />

            {/* Send Button */}
            <button
              onClick={() => {
                if (question.trim()) {
                  handleChat(question);
                  setQuestion(""); // Clear input after sending
                }
              }}
              disabled={loading}
              className="p-3 absolute right-6 text-yellow-400 hover:bg-black/40 text-2xl rounded-full"
            >
              {loading ? <FaStopCircle /> : <IoIosSend />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeUploadAndSuggestions;
