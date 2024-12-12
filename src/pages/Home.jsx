// import { Link } from "react-router";

// const Home = () => {
//   return (
//     <div className="flex flex-col items-center justify-center h-screen">
//       <h1 className="text-4xl font-bold text-gray-800">Educational AI Bot</h1>
//       <p className="mt-4 text-lg text-gray-600">
//         A personalized assistant for academic guidance.
//       </p>
//       <Link
//         to="/suggetion"
//         className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
//       >
//         Start Chatbot
//       </Link>
//     </div>
//   );
// };

// export default Home;

import { Link } from "react-router"; // Correct import for React Router v6
import { useEffect } from "react";

// Helper function to add bubble effects
const generateBubbles = () => {
  const bubblesContainer = document.querySelector(".bubbles-container");

  for (let i = 0; i < 20; i++) {
    // Generate more bubbles
    const bubble = document.createElement("div");
    bubble.classList.add("bubble");
    const size = Math.random() * 30 + 20; // Bubble size between 20 and 50
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.animationDuration = `${Math.random() * 3 + 3}s`; // Duration between 3-6 seconds
    bubble.style.animationDelay = `${Math.random() * 5}s`; // Random delay
    bubble.style.left = `${Math.random() * 100}%`; // Random left position
    bubble.style.bottom = `${Math.random() * 100}%`; // Random bottom position
    bubblesContainer.appendChild(bubble);
  }
};

const Home = () => {
  useEffect(() => {
    generateBubbles(); // Trigger bubble generation on component mount
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 overflow-hidden">
      {/* Bubble Container */}
      <div className="bubbles-container absolute top-0 left-0 w-full h-full pointer-events-none"></div>

      {/* Main Title */}
      <h1 className="text-6xl font-bold text-white text-center drop-shadow-lg animate__animated animate__fadeIn">
        Educational AI Bot
      </h1>

      {/* Description */}
      <p className="mt-6 text-xl text-white drop-shadow-lg max-w-xl text-center animate__animated animate__fadeIn animate__delay-1s">
        A personalized assistant for academic guidance that evolves with your
        needs.
      </p>

      {/* Start Button */}
      <Link
        to="/student-bot"
        className="mt-8 px-8 py-4 bg-gradient-to-r from-teal-400 to-cyan-500 text-white rounded-full shadow-lg text-xl transform transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
      >
        Start Chatbot
      </Link>
    </div>
  );
};

export default Home;
