import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function SkillSwaps() {
  const { skillName } = useParams();
  const decodedSkill = decodeURIComponent(skillName);
  const [swaps, setSwaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUserId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchSwaps = async () => {
      try {
        const encodedSkill = encodeURIComponent(decodedSkill);
        const res = await fetch(`http://localhost:3034/api/swaps/${encodedSkill}`);
        const data = await res.json();
        setSwaps(data);
      } catch (err) {
        console.error("Erro ao buscar swaps:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSwaps();
  }, [decodedSkill]);

  const handleSendRequest = async (swapId) => {
    try {
      const res = await fetch("http://localhost:3034/api/match-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ swapId, user2: currentUserId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(" Match request sent successfully!");
        setSwaps((prev) => prev.filter((swap) => swap._id !== swapId));
      } else {
        alert(data.error || "Erro ao enviar pedido.");
      }
    } catch (err) {
      console.error("Erro ao enviar pedido:", err.message);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <header className="flex items-center justify-center py-4 border-b shadow-md mb-6">
        <img src="/logo.png" alt="SKILLSWAP" className="h-10 mr-2" />
        <h1 className="text-2xl font-bold">SKILLSWAP</h1>
      </header>

      <h2 className="text-xl font-semibold mb-4">
        People want to learn <span className="text-blue-600">{decodedSkill}</span>
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading swaps...</p>
      ) : swaps.length === 0 ? (
        <p className="text-gray-500">No Swaps for this skill.</p>
      ) : (
        <ul className="space-y-4">
          {swaps.map((swap) => {
            const isOwnSwap = String(swap.user1) === String(currentUserId);
            return (
              <li
                key={swap._id}
                className="border p-4 rounded shadow-sm bg-gray-50"
              >
                <p><strong>Offer:</strong> {swap.skillFrom}</p>
                <p><strong>Wants:</strong> {swap.skillTo}</p>
                <p className="text-sm text-gray-500">
                  Created at: {new Date(swap.createdAt).toLocaleDateString()}
                </p>

                {isOwnSwap ? (
                  <p className="mt-2 text-sm text-blue-600 font-medium">This is your swap</p>
                ) : (
                  <button
                    onClick={() => handleSendRequest(swap._id)}
                    className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    Send Swap
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-6">
        <Link to="/home" className="text-blue-600 hover:underline">
          ← Go back
        </Link>
      </div>
    </div>
  );
}
