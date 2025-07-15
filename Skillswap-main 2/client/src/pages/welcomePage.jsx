// src/pages/WelcomePage.jsx
import { Link } from "react-router-dom";
import VantaBackground from "../components/backg";

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
        <div>
      <VantaBackground />
      <div style={{ position: 'relative', zIndex: 1, padding: '2rem' }}>
      
      </div>
    </div>
  
      <h1 className="text-3xl font-bold   text-gray-800">Welcome to SkillSwap</h1>
      <p className="text-base mb-8 text-gray-600 text-center max-w-md">
        Share what you know, learn what you love!</p>
      <Link to="/auth">
        <button className="px-6 py-3 bg-blue-900 text-white rounded-lg shadow-md hover:bg-blue-700 transition font-semibold">
          Sign Up / Log In
        </button>
      </Link>
      
    </div>
  );
}
