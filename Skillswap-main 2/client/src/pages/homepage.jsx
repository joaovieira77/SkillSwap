import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Notepad from "../components/notepad";
import NavBar from "../components/navbar";

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [matches, setMatches] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId || userId === "undefined" || userId === "null") {
      console.error("User ID inválido:", userId);
      setLoading(false);
      return;
    }

    const fetchAll = async () => {
      try {
        const [userRes, skillsRes, swapsRes] = await Promise.all([
          fetch(`http://localhost:3034/users/${userId}`),
          fetch("http://localhost:3034/api/skills"),
          fetch("http://localhost:3034/api/all-swaps"),
        ]);

        if (!userRes.ok || !skillsRes.ok || !swapsRes.ok) {
          throw new Error("Erro ao buscar dados");
        }

        const userData = await userRes.json();
        const skillsData = await skillsRes.json();
        const allSwaps = await swapsRes.json();

        setUser(userData);
        setSkills(skillsData);

        const myOpenSwaps = allSwaps.filter(
          (swap) =>
            swap.user1?.toString() === userId &&
            swap.status === "open" &&
            !swap.user2
        );

        setMatches(myOpenSwaps);
      } catch (err) {
        console.error("Erro ao carregar dados:", err.message);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [userId]);

  useEffect(() => {
    if (!user || skills.length === 0) return;

    const wantedSkills = skills.filter((skill) =>
      user.wantedSkills?.includes(skill.name)
    );

    const shuffled = [...wantedSkills].sort(() => 0.5 - Math.random());
    setRecommended(shuffled.slice(0, 5));
  }, [user, skills]);

  const handleDeleteSwap = async (swapId) => {
    const confirmDelete = window.confirm("Tens a certeza que queres eliminar este swap?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`http://localhost:3034/api/swaps/${swapId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Erro ao eliminar swap");

      setMatches((prev) => prev.filter((s) => s._id !== swapId));
    } catch (err) {
      console.error("Erro ao eliminar swap:", err.message);
    }
  };

  const filteredSkills = skills.filter((skill) =>
    skill.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading data...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">Error: user not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col justify-between font-sans">
      {/* Header */}
    <header className="flex items-center justify-center py-4 border-b shadow-md">
        <img src="/logo.png" alt="SKILLSWAP" className="h-10 mr-2" />
        <h1 className="text-2xl font-bold">SKILLSWAP</h1>
      </header>

      {/*  Recommendations */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Recommendations</h2>
        <div className="flex gap-2 overflow-x-auto">
          {recommended.map((skill) => (
            <div
              key={skill._id}
              onClick={() => navigate(`/skills/${encodeURIComponent(skill.name)}`)}
              className="min-w-[120px] bg-white p-3 rounded shadow text-center cursor-pointer hover:bg-blue-100 transition"
            >
              <p className="font-medium">{skill.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/*  Active Swaps */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Active Swaps</h2>
        {Array.isArray(matches) && matches.length > 0 ? (
          <div className="space-y-2">
            {matches.map((swap) => (
              <div
                key={swap._id}
                className="bg-white p-3 rounded shadow flex justify-between items-start"
              >
                <div>
                  <p>
                    <strong>You offer:</strong> <em>{swap.skillFrom}</em>
                  </p>
                  <p>
                    <strong>You want to learn:</strong> <em>{swap.skillTo}</em>
                  </p>
                  <p className="text-xs text-gray-500">
                    Created at: {new Date(swap.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDeleteSwap(swap._id)}
                  className="ml-4 mt-4 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 transition text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No open swaps.</p>
        )}
      </div>

      {/* All Skills */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-2">Explore all the skills</h2>
         {/*  Search bar */}
      <div className=" p-4 ">
        <input
          type="text"
          placeholder="Search for skills..."
          className="w-full border px-4 py-2 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
        {filteredSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {filteredSkills.map((skill) => (
              <div
                key={skill._id}
                onClick={() => navigate(`/skills/${encodeURIComponent(skill.name)}`)}
                className="cursor-pointer bg-gray-200 hover:bg-blue-200 text-gray-800 px-3 py-1 rounded-full transition"
              >
                {skill.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No skills match your search.</p>
        )}
      </div>

      <Notepad />

      {/*  Floating Button */}
      <button
        onClick={() => navigate("/createswap")}
        className="fixed bottom-20 right-4 bg-blue-800 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg hover:bg-blue-700 transition"
        aria-label="Criar novo swap"
      >
        +
      </button>

      <NavBar />
    </div>
  );
}
