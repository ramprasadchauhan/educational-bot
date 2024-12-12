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

const ResumeUploadAndSuggestions = () => {
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gpa: "",
    toefl: "",
    ielts: "",
    sat: "",
    act: "",
    gre: "",
    field: "",
    major: "",
    type: "Public",
    location: "",
    budget: "",
    finance: "",
    career: "",
    internship: false,
    programs: "",
    research: false,
    faculty: false,
    safety: false,
  });
  const [extractedText, setExtractedText] = useState("");
  const [universitySuggestions, setUniversitySuggestions] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [question, setQuestion] = useState("");
  const [formVisible, setFormVisible] = useState(false); // Control form visibility

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

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  // Function to extract relevant information from the resume using Gemini API
  const extractDataFromResume = async (resumeText) => {
    const prompt = `
    Extract the following information from the resume:

    Resume Text:
    ${resumeText}

    Please provide the following fields, if available:
    1. Full Name
    2. Email Address
    3. Phone Number
    4. GPA
    5. TOEFL Score
    6. IELTS Score
    7. SAT Score
    8. ACT Score
    9. GRE Score
    10. Field of Study
    11. Preferred Major
    12. Budget
    13. Career Path (if mentioned)
    14. Internship Preference (Yes/No)
    15. Research Opportunities (Yes/No)
    16. Faculty Expertise (Yes/No)
    17. Campus Safety Preference (Yes/No)

    If any of these fields are not found in the resume, respond with "Not Available".`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response.text();
      return response;
    } catch (error) {
      console.error("Error extracting data from resume:", error);
      return "Error extracting data from resume.";
    }
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
      const response = await fetch(
        "https://educational-bot-backend.onrender.com/api/upload",
        {
          method: "POST",
          body: uploadData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload PDF");
      }

      const data = await response.json();
      const { text } = data;
      setExtractedText(text);

      // Use Gemini to extract relevant fields from the resume
      const extractedData = await extractDataFromResume(text);
      console.log(extractedData);
      const dataFields = extractedData.split("\n");

      // Update the form with the extracted data
      setFormData((prevState) => ({
        ...prevState,
        name: dataFields[0]?.split(":")[1] || "",
        email: dataFields[1]?.split(":")[1] || "",
        phone: dataFields[2]?.split(":")[1] || "",
        gpa: dataFields[3]?.split(":")[1] || "",
        toefl: dataFields[4]?.split(":")[1] || "",
        ielts: dataFields[5]?.split(":")[1] || "",
        sat: dataFields[6]?.split(":")[1] || "",
        act: dataFields[7]?.split(":")[1] || "",
        gre: dataFields[8]?.split(":")[1] || "",
        field: dataFields[9]?.split(":")[1] || "",
        major: dataFields[10]?.split(":")[1] || "",
        budget: dataFields[11]?.split(":")[1] || "",
        career: dataFields[12]?.split(":")[1] || "",
        internship:
          dataFields[13]?.split(":")[1]?.toLowerCase() === "yes" || false,
        research:
          dataFields[14]?.split(":")[1]?.toLowerCase() === "yes" || false,
        faculty:
          dataFields[15]?.split(":")[1]?.toLowerCase() === "yes" || false,
        safety: dataFields[16]?.split(":")[1]?.toLowerCase() === "yes" || false,
      }));

      setFormVisible(true);
    } catch (err) {
      setError("An error occurred while processing the file.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const prompt = `
    //   A student is seeking advice for choosing a university Based on the following student's data, suggest the top 3 universities for them.

    //   Name: ${formData.name}
    //   Email: ${formData.email}
    //   Phone: ${formData.phone}
    //   GPA: ${formData.gpa}
    //   TOEFL: ${formData.toefl}
    //   IELTS: ${formData.ielts}
    //   SAT: ${formData.sat}
    //   ACT: ${formData.act}
    //   GRE: ${formData.gre}
    //   Field: ${formData.field}
    //   Major: ${formData.major}
    //   Budget: ${formData.budget}
    //   Career Path: ${formData.career}
    //   Internship Preference: ${formData.internship ? "Yes" : "No"}
    //   Research Opportunities: ${formData.research ? "Yes" : "No"}
    //   Faculty Expertise: ${formData.faculty ? "Yes" : "No"}
    //   Campus Safety: ${formData.safety ? "Yes" : "No"}

    //   Resume Details: ${extractedText}

    //   Please suggest 3 universities based on this information from the available university data: ${JSON.stringify(
    //     universitydata.universities
    //   )}.
    // `;

    const prompt = `
    I am seeking guidance for choosing the best universities based on my academic background, career goals, and preferred learning environment. Below is the relevant data to help you make the best recommendations.

    **Academic Background:**
    - Name: ${formData.name}
    - GPA: ${formData.gpa}
    - TOEFL: ${formData.toefl}
    - IELTS: ${formData.ielts}
    - SAT: ${formData.sat}
    - ACT: ${formData.act}
    - GRE: ${formData.gre}
    - Major: ${formData.major}
    - Minor: ${formData.minor}
    - Relevant Coursework/Research/Extracurriculars: ${extractedText}

    **Career Goals:**
    - Desired Career Path(s): ${formData.career}
    - Industry Preferences: ${formData.field}
    - Internship Preference: ${formData.internship ? "Yes" : "No"}
    - Research Opportunities: ${formData.research ? "Yes" : "No"}
    - Faculty Expertise: ${formData.faculty ? "Yes" : "No"}
    
    **Preferred Learning Environment:**
    - Desired Teaching Style: ${
      formData.teachingStyle
    } (e.g., lecture-based, discussion-based, project-based)
    - Campus Size: ${formData.campusSize}
    - Campus Culture: ${formData.campusCulture}
    - Student Life and Extracurriculars: ${formData.studentLife}
    - Campus Safety: ${formData.safety ? "Yes" : "No"}

    **Geographic Preferences:**
    - Preferred Location: ${formData.location}

    **Budget Considerations:**
    - Budget: ${formData.budget}

    Based on the above data, please suggest 5 top universities that best match my profile.

    Key Considerations:
    - **Academic Reputation:** Prioritize universities with strong academic reputations in my field of interest.
    - **Acceptance Rates and Financial Aid:** Consider universities with realistic acceptance rates and good financial aid options.
    - **Teaching and Learning Environment:** Match the universities with my preferred teaching styles, campus size, culture, and student life.
    - **Research and Internship Opportunities:** Ensure universities with ample research and internship opportunities that align with my career goals.

    Additionally, please provide:
    - Links to relevant resources for each university (e.g., website, virtual tours, student testimonials).
    - Insights into each university's environment and its alignment with my academic and career goals.

    Please suggest universities from the available data: ${JSON.stringify(
      universitydata.universities
    )}.
`;

    // Submit the data and request suggestions
    const result = await model.generateContent(prompt);
    const suggestions = await result.response.text();
    setUniversitySuggestions(suggestions);
    setChatHistory((prev) => [
      ...prev,
      { role: "bot", content: "Here are the university suggestions." },
      { role: "bot", content: suggestions },
    ]);
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold mb-6 flex items-center text-gray-800">
          <Link to="/">
            <AiOutlineRobot className="mr-3 text-4xl text-blue-500" />
          </Link>
          University Application Form
        </h1>

        {/* File Upload Section */}
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-4 p-2 text-gray-700 rounded-lg border border-gray-300 focus:ring-1 focus:ring-blue-400"
        />
        <button
          onClick={handleUpload}
          className="mb-4 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Upload Resume
        </button>
        {error && <p className="text-red-500">{error}</p>}

        {/* Form - Initially hidden, only shown after resume upload */}
        {formVisible && (
          <form onSubmit={handleSubmit}>
            <h2 className="mt-6 text-xl font-semibold text-gray-800">
              Personal Information
            </h2>

            <label htmlFor="name" className="block mt-4 text-gray-600">
              Full Name:
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1 p-3 border rounded-lg w-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />

            <label htmlFor="email" className="block mt-4 text-gray-600">
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 p-3 border rounded-lg w-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />

            <label htmlFor="phone" className="block mt-4 text-gray-600">
              Phone Number:
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1 p-3 border rounded-lg w-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />

            <h2 className="mt-6 text-xl font-semibold text-gray-800">
              Academic Information
            </h2>

            <label htmlFor="gpa" className="block mt-4 text-gray-600">
              GPA:
            </label>
            <input
              type="number"
              id="gpa"
              name="gpa"
              value={formData.gpa}
              onChange={handleInputChange}
              className="mt-1 p-3 border rounded-lg w-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />

            <label htmlFor="toefl" className="block mt-4 text-gray-600">
              TOEFL Score:
            </label>
            <input
              type="number"
              id="toefl"
              name="toefl"
              value={formData.toefl}
              onChange={handleInputChange}
              className="mt-1 p-3 border rounded-lg w-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />

            <label htmlFor="ielts" className="block mt-4 text-gray-600">
              IELTS Score:
            </label>
            <input
              type="number"
              id="ielts"
              name="ielts"
              value={formData.ielts}
              onChange={handleInputChange}
              className="mt-1 p-3 border rounded-lg w-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />

            <label htmlFor="sat" className="block mt-4 text-gray-600">
              SAT Score:
            </label>
            <input
              type="number"
              id="sat"
              name="sat"
              value={formData.sat}
              onChange={handleInputChange}
              className="mt-1 p-3 border rounded-lg w-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />

            <h2 className="mt-6 text-xl font-semibold text-gray-800">
              Program Preferences
            </h2>

            <label htmlFor="field" className="block mt-4 text-gray-600">
              Field of Study:
            </label>
            <input
              type="text"
              id="field"
              name="field"
              value={formData.field}
              onChange={handleInputChange}
              className="mt-1 p-3 border rounded-lg w-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />

            <label htmlFor="major" className="block mt-4 text-gray-600">
              Preferred Major:
            </label>
            <input
              type="text"
              id="major"
              name="major"
              value={formData.major}
              onChange={handleInputChange}
              className="mt-1 p-3 border rounded-lg w-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />

            <h2 className="mt-6 text-xl font-semibold text-gray-800">
              University Preferences
            </h2>

            <label htmlFor="type" className="block mt-4 text-gray-600">
              University Type:
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="mt-1 p-3 border rounded-lg w-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
            </select>

            <label htmlFor="location" className="block mt-4 text-gray-600">
              Location:
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="mt-1 p-3 border rounded-lg w-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />

            <h2 className="mt-6 text-xl font-semibold text-gray-800">
              Financial Information
            </h2>

            <label htmlFor="budget" className="block mt-4 text-gray-600">
              Budget:
            </label>
            <input
              type="number"
              id="budget"
              name="budget"
              value={formData.budget}
              onChange={handleInputChange}
              className="mt-1 p-3 border rounded-lg w-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />

            <label htmlFor="finance" className="block mt-4 text-gray-600">
              Funding Sources:
            </label>
            <textarea
              id="finance"
              name="finance"
              value={formData.finance}
              onChange={handleInputChange}
              className="mt-1 p-3 border rounded-lg w-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />

            <h2 className="mt-6 text-xl font-semibold text-gray-800">
              Career and Research Interests
            </h2>

            <label htmlFor="career" className="block mt-4 text-gray-600">
              Career Path:
            </label>
            <textarea
              id="career"
              name="career"
              value={formData.career}
              onChange={handleInputChange}
              className="mt-1 p-3 border rounded-lg w-full focus:ring-1 focus:ring-blue-400 focus:outline-none"
            />

            <div className="mt-4 space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="internship"
                  checked={formData.internship}
                  onChange={handleCheckboxChange}
                  className="mr-2 text-blue-500 focus:ring-blue-500"
                />
                Internship Preference
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="research"
                  checked={formData.research}
                  onChange={handleCheckboxChange}
                  className="mr-2 text-blue-500 focus:ring-blue-500"
                />
                Research Opportunities
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="faculty"
                  checked={formData.faculty}
                  onChange={handleCheckboxChange}
                  className="mr-2 text-blue-500 focus:ring-blue-500"
                />
                Faculty Expertise
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="safety"
                  checked={formData.safety}
                  onChange={handleCheckboxChange}
                  className="mr-2 text-blue-500 focus:ring-blue-500"
                />
                Campus Safety Preference
              </label>
            </div>

            <button
              type="submit"
              className="mt-6 py-2 px-6 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Get University Suggestions
            </button>
          </form>
        )}

        {/* University Suggestions */}
        {/* {universitySuggestions && (
          <div className="mt-6 bg-gray-200 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800">
              Suggested Universities
            </h3>
            <ReactMarkdown className="mt-2">
              {universitySuggestions}
            </ReactMarkdown>
          </div>
        )} */}

        {/* Chat Section */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Chat with Bot
          </h2>
          <div className="space-y-4">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg shadow-sm ${
                  message.role === "bot" ? "bg-blue-100" : "bg-green-100"
                }`}
              >
                <strong>{message.role === "bot" ? "Bot" : "You"}:</strong>
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
