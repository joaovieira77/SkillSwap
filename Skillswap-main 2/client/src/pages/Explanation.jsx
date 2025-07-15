import React, { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // Add this import

export default function Explanation() {
  const containerRef = useRef(null);
  const [pageIndex, setPageIndex] = useState(0);
  const navigate = useNavigate(); // Add this line

  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.clientWidth;
      const index = Math.round(scrollLeft / width);
      setPageIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative w-full h-screen">
      {/* Swipeable Slides */}
      <div
        ref={containerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full h-full"
      >
        {/* Slide 1 */}
        <section className="flex-shrink-0 w-full h-full snap-center flex flex-col items-center justify-center bg-white px-6">
          <h1 className="text-5xl text-center font-bold text-gray-800 mb-9">
            What is SkillSwap?
          </h1>
          <p className="text-gray-600 max-w-md mb-4 text">
            A community platform where you can learn new skills by exchanging what you already know.
          </p>
          <img
            src="/first.png"
            alt="SkillSwap Puzzle Illustration"
            className="max-w-sm mb-6"
          />
          <ul className="text-gray-600 text-sm space-y-1 list-outside pl-6 list-disc max-w-md">
            <li>Share your skills & learn from others</li>
            <li>Discover exciting new hobbies or professional abilities</li>
            <li>Build real connections through mutual growth</li>
          </ul>
        </section>

        {/* Slide 2 */}
        <section className="flex-shrink-0 w-full h-full snap-center flex flex-col items-center justify-center bg-[#FFFFFF] px-6">
          
          <h1 className="text-5xl text-center text font-bold text-gray-800 mb-6">
            How does skill exchange work?
          </h1>
          <p className="text text-gray-600 max-w-md mb-1">
            Teach what you know. Learn what you want. It’s a fair trade!
          </p>
          <img
            src="/flow.png"
            alt="Exchange Process Illustration"
            className="w-3/4 max-w-sm mb-4"
          />
          <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside max-w-md mb-5">
            <li>List your skills and interests</li>
            <li>Match with people who want to learn from you</li>
          </ul>
        </section>

        {/* Slide 3 */}
        <section className="flex-shrink-0 w-full h-full snap-center flex flex-col items-center justify-center bg-[#FFFFFF] px-6">
          <h1 className="text-5xl font-bold text-gray-800 mt-6">Benefits:</h1>
          <h1 className="text-5xl font-bold text-gray-800 mb-4 mt-2">Learn & Teach</h1>
          <p className="text-center text-gray-600 max-w-md mt-2">
            Grow faster by sharing your knowledge and learning from peers.
          </p>
          <img
            src="/third.png"
            alt="Learning Benefits Illustration"
            className="w max-w-sm"
          />
          <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside max-w-md mb-2">
            <li>Learn for free, just by helping others</li>
            <li>Gain teaching experience & boost your confidence</li>
            <li>Make friends with similar passions</li>
          </ul>
          <button
            className="px-6 py-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
            onClick={() => navigate("/welcome")} // Add this handler
          >
            Get started
          </button>
        </section>
      </div>
      {/* Dot Indicators */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-3">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`w-2 h-2 rounded-full transition ${
              pageIndex === i ? "bg-black" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}


