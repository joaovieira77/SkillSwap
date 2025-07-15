import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";

export default function RequestsPage() {
  const [activeView, setActiveView] = useState("requests");
  const [requests, setRequests] = useState([]);
  const [matches, setMatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const reqRes = await fetch(`http://localhost:3034/api/match-requests/${userId}`);
        const reqData = await reqRes.json();
        setRequests(reqData);

        const swapRes = await fetch("http://localhost:3034/api/all-swaps");
        const allSwaps = await swapRes.json();

        //  Confirmed swaps sorted chronologically (newest first)
        const confirmed = allSwaps
          .filter(
            (swap) =>
              swap.status === "matched" &&
              (swap.user1?.toString() === userId || swap.user2?.toString() === userId)
          )
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setMatches(confirmed);

        const userRes = await fetch("http://localhost:3034/api/all-users");
        const userData = await userRes.json();
        setUsers(userData);
      } catch (err) {
        console.error("Erro ao carregar dados:", err.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const handleAccept = async (requestId) => {
    try {
      await fetch(`http://localhost:3034/api/match-requests/${requestId}/accept`, {
        method: "POST",
      });
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Erro ao aceitar pedido:", err.message);
    }
  };

  const handleReject = async (requestId) => {
    try {
      await fetch(`http://localhost:3034/api/match-requests/${requestId}/reject`, {
        method: "POST",
      });
      setRequests((prev) => prev.filter((r) => r._id !== requestId));
    } catch (err) {
      console.error("Erro ao rejeitar pedido:", err.message);
    }
  };

  const getMatchedUser = (match) => {
    const otherId = match.user1?.toString() === userId ? match.user2 : match.user1;
    return users.find((u) => u._id === otherId?.toString());
  };

  const getRequestUser = (req) => {
    return users.find((u) => u._id === req.user2?.toString());
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 flex flex-col justify-between font-sans">
      {/*  Header */}
      <header className="flex items-center justify-center py-4 border-b shadow-md">
        <img src="/logo.png" alt="SKILLSWAP" className="h-10 mr-2" />
        <h1 className="text-2xl font-bold">SKILLSWAP</h1>
      </header>

      {/*  Tabs */}
      <div className="flex justify-center mt-4 gap-4">
        <button
          className={`px-4 py-2 rounded-full font-semibold transition ${
            activeView === "requests" ? "bg-green-400 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveView("requests")}
        >
          Requests
        </button>
        <button
          className={`px-4 py-2 rounded-full font-semibold transition ${
            activeView === "matches" ? "bg-green-400 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveView("matches")}
        >
          Matches
        </button>
      </div>

      {/*  Content */}
      <div className="px-4 pt-6 space-y-4 mb-24 flex-1">
        {loading ? (
          <p className="text-gray-500">A carregar dados...</p>
        ) : activeView === "requests" ? (
          requests.length === 0 ? (
            <p className="text-gray-500">No new Swaps pending.</p>
          ) : (
   requests.map((req) => {
  const requestUser = getRequestUser(req);
  return (
    <div
      key={req._id}
      className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-100 rounded-xl shadow"
    >
      <div className="flex items-center gap-7 flex-1">
        <div className="w-20 h-20 rounded-md bg-gray-300 flex items-center justify-center overflow-hidden" />
        <div>
          <h3 className="font-semibold text-lg">Swap Request</h3>
          <p className="text-sm text-gray-500">
            {req.skillFrom} → {req.skillTo}
          </p>
          {requestUser && (
            <>
              <p className="text-sm text-gray-700 mt-1">
                {requestUser.firstName} {requestUser.lastName}
              </p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <img
                  src="/location-sign.svg"
                  alt="Location Icon"
                  className="w-3 h-3 mr-1"
                />
                {requestUser.location}
              </div>
            </>
          )}
          <p className="text-sm text-gray-400 mt-1">
            Sent at: {new Date(req.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex gap-2 mt-4 md:mt-0">
        <button
          onClick={() => handleAccept(req._id)}
          className="bg-green-400 hover:bg-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold w-32"
        >
          Accept
        </button>
        <button
          onClick={() => handleReject(req._id)}
          className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold w-32"
        >
          Reject
        </button>
      </div>
    </div>
  );
})

          )
        ) : matches.length === 0 ? (
          <p className="text-gray-500">No confirmed matches.</p>
        ) : (
          matches.map((match) => {
            const matchedUser = getMatchedUser(match);
            return (
              <div
                key={match._id}
                className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-100 rounded-xl shadow"
              >
                <div className="flex items-center gap-7 flex-1">
                  <div className="w-20 h-20 rounded-md bg-gray-300 flex items-center justify-center overflow-hidden" />
                  <div>
                    <h3 className="font-semibold text-lg">Match Confirmed</h3>
                    <p className="text-sm text-gray-500">
                      {match.skillFrom} → {match.skillTo}
                    </p>
                    {matchedUser && (
                      <>
                        <p className="text-sm text-gray-700 mt-1">
                          {matchedUser.firstName} {matchedUser.lastName}
                        </p>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <img src="/location-sign.svg" alt="Location Icon" className="w-3 h-3 mr-1" />
                          {matchedUser.location}
                        </div>
                      </>
                    )}
                    <p className="text-sm text-gray-400 mt-1">
                      Confirmed at: {new Date(match.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                  <button
                    className="bg-green-400 hover:bg-green-500 transition text-white px-4 py-2 rounded-full text-sm font-semibold w-32"
                    onClick={() => matchedUser && navigate(`/messages/${matchedUser._id}`)}
                  >
                    Message
                  </button>
                  <button
                    className="bg-blue-500 hover:bg-blue-600 transition text-white px-4 py-2 rounded-full text-sm font-semibold w-32"
                    onClick={() => matchedUser && navigate(`/profile/${matchedUser._id}`)}
                  >
                    View Profile
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/*  Footer Navigation */}
      <NavBar />
    </div>
  );
}
