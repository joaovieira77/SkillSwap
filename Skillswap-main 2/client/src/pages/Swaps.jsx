import { useState, useEffect } from "react";

// create swap
import { useNavigate } from "react-router-dom";

export default function Swaps() {
  const [yourSkill, setYourSkill] = useState("");
  const [learnSkill, setLearnSkill] = useState("");
  const [allSkills, setAllSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("http://localhost:3034/api/skills");
        const data = await res.json();
        setAllSkills(data);
      } catch (err) {
        console.error("Erro ao buscar skills:", err.message);
      }
    };

    fetchSkills();
  }, []);

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");

    if (!yourSkill || !learnSkill || !userId) {
      alert("All fields required.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3034/matches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          skillFrom: yourSkill,
          skillTo: learnSkill,
        }),
      });

      if (!res.ok) throw new Error("Erro ao criar swap");

      alert("Swap created successfully!");
      navigate("/home");
    } catch (err) {
      console.error(err.message);
      alert("Erro ao criar swap.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-gray-800 font-sans">
      <header className="flex items-center justify-center py-4 border-b shadow-md">
        <img src="/logo.png" alt="SKILLSWAP" className="h-10 mr-2" />
        <h1 className="text-2xl font-bold">SKILLSWAP</h1>
      </header>

      <main className="flex flex-col items-center flex-grow px-6 pt-6">
        <h2 className="text-xl font-semibold mb-20">Create Swap</h2>

        <div className="w-full max-w-md">
          <label className="block text-gray-700 mb-2">Skill you offer:</label>
          <select
            value={yourSkill}
            onChange={(e) => setYourSkill(e.target.value)}
            className="w-full p-3 mb-4 border border-gray-300 rounded-full focus:outline-none focus:ring focus:border-blue-400"
          >
            <option value="">Select a skill:</option>
            {allSkills.map((skill) => (
              <option key={skill._id} value={skill.name}>
                {skill.name}
              </option>
            ))}
          </select>

          <div className="flex justify-center mb-4">
            <img src="/imagesswap.png" alt="Swap icon" className="h-12 mt-9" />
          </div>

          <label className="block text-gray-700 mb-2">Skill you want to learn:</label>
          <select
            value={learnSkill}
            onChange={(e) => setLearnSkill(e.target.value)}
            className="w-full p-3 mb-6 border border-gray-300 rounded-full focus:outline-none focus:ring focus:border-blue-400"
          >
            <option value="">Select a skill</option>
            {allSkills.map((skill) => (
              <option key={skill._id} value={skill.name}>
                {skill.name}
              </option>
            ))}
          </select>

          <div className="flex justify-around mt-4">
            <button
              onClick={handleSave}
              className="bg-green-500 text-white py-2 px-6 ml-10 rounded-full hover:bg-green-600 transition"
            >
              Create
            </button>
            <button
              onClick={() => navigate("/home")}
              className="bg-red-500 text-white py-2 px-6 mr-10 rounded-full hover:bg-red-600 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
