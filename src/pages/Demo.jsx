import { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import universitydata from "../university-data.json";
import ReactMarkdown from "react-markdown";

// Function to call the Gemini AI API and generate university suggestions
const getUniversitySuggestions = async (extractedText) => {
  const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

  const prompt = `
    A student is seeking advice for choosing a university based on their resume. Here are the details extracted from their resume:

    Resume Details:
    ${extractedText}

    Based on this information, provide a list of universities from the following data that would be a good fit for the student. The university data contains information about various universities, such as name, course offerings, location, tuition fees, and more.

    University Data:
    ${JSON.stringify(universitydata)}

    Please suggest the top 3 universities that would be the best match for this student based on the resume information.
  `;

  const genAI = new GoogleGenerativeAI(API_KEY); // Assuming you're using the global window object
  const model = genAI.getGenerativeModel({
    model: "gemini-pro",
    generationConfig: {
      maxOutputTokens: 250,
      temperature: 0.8,
    },
  });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    return "Sorry, I couldn't find any suitable university suggestions based on the provided resume.";
  }
};

// console.log(JSON.stringify(universitydata));

const ResumeUploadAndSuggestions = () => {
  const [file, setFile] = useState(null);
  const [extractedText, setExtractedText] = useState("");
  const [universitySuggestions, setUniversitySuggestions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Example university data, replace with actual data if needed

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("pdf", file);

    try {
      // Step 1: Upload the PDF to the backend and extract text
      const response = await fetch("http://localhost:3500/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload PDF");
      }

      const data = await response.json();
      const { text } = data;
      setExtractedText(text);

      // Step 2: Use the extracted text to get university suggestions from Gemini AI
      const suggestions = await getUniversitySuggestions(text);
      setUniversitySuggestions(suggestions);
    } catch (err) {
      setError("An error occurred while processing the file.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto bg-white p-6 rounded shadow-lg">
        <h1 className="text-2xl font-bold mb-4">
          University Suggestions from Resume
        </h1>

        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="mb-4 p-2 border rounded"
        />

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <button
          onClick={handleUpload}
          disabled={loading}
          className={`w-full py-2 px-4 text-white font-semibold rounded ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-700"
          }`}
        >
          {loading ? "Processing..." : "Upload & Extract Text"}
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

        {universitySuggestions && (
          <div className="mt-6 p-4 bg-blue-50 rounded shadow-sm">
            <h2 className="text-xl font-semibold mb-4">
              Suggested Universities
            </h2>
            <pre className="whitespace-pre-wrap">
              <ReactMarkdown>{universitySuggestions}</ReactMarkdown>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadAndSuggestions;
