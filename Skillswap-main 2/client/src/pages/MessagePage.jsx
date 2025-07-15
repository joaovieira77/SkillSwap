import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";

export default function MessagePage() {
  const [conversations, setConversations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await fetch(`http://localhost:3034/matches/${userId}`);
        const allMatches = await res.json();

        const matched = allMatches.filter(
          (m) =>
            m.status === "matched" &&
            (String(m.user1) === userId || String(m.user2) === userId)
        );

        // 🔄 Group unique conversations by user
        const uniqueMatches = new Map();
        matched.forEach((match) => {
          const otherId =
            String(match.user1) === userId ? String(match.user2) : String(match.user1);
          if (!uniqueMatches.has(otherId)) {
            uniqueMatches.set(otherId, match); // keep only first match per user
          }
        });

        const userRes = await fetch("http://localhost:3034/api/all-users");
        const users = await userRes.json();

        // 🔍 Enrich each conversation with user info and last message
        const enriched = await Promise.all(
          Array.from(uniqueMatches.values()).map(async (match) => {
            const otherId =
              String(match.user1) === userId ? match.user2 : match.user1;
            const otherUser = users.find((u) => u._id === otherId);

            const msgRes = await fetch(
              `http://localhost:3034/messages/${userId}/${otherId}`
            );
            const messages = await msgRes.json();
            const lastMessage = messages[messages.length - 1];

            return {
              id: otherId,
              name: `${otherUser?.firstName || "Unknown"} ${otherUser?.lastName || ""}`,
              message: lastMessage?.content || "Sem mensagens ainda",
              time: lastMessage ? new Date(lastMessage.timestamp).toLocaleTimeString() : "",
              timestamp: lastMessage ? new Date(lastMessage.timestamp).getTime() : 0,
            };
          })
        );

        // ⏱ Sort by most recent message
        enriched.sort((a, b) => b.timestamp - a.timestamp);

        setConversations(enriched);
      } catch (err) {
        console.error("Erro ao carregar mensagens:", err.message);
      }
    };

    if (userId) fetchConversations();
  }, [userId]);

  const filteredConversations = conversations.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800 font-sans pb-20">
      {/*  Header */}
      <header className="flex items-center justify-center py-4 border-b shadow-md">
        <img src="/logo.png" alt="SKILLSWAP" className="h-10 mr-2" />
        <h1 className="text-2xl font-bold">SKILLSWAP</h1>
      </header>

      {/*  Search */}
      <h2 className="text-2xl mt-5 font-semibold text-center">Messages</h2>
      <div className="p-4">
        <input
          type="text"
          placeholder="Search for conversations..."
          className="w-full border px-4 py-2 rounded-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/*  Conversation List */}
      <div className="space-y-4 px-4">
        {filteredConversations.length === 0 ? (
          <p className="text-center text-gray-500">
            No conversations yet.
          </p>
        ) : (
          filteredConversations.map((user) => (
            <div
              key={user.id}
              onClick={() => navigate(`/messages/${user.id}`)}
              className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg shadow-sm cursor-pointer hover:bg-blue-100 transition"
            >
              <div className="w-12 h-12 rounded-full bg-gray-300" />
              <div>
                <p className="text-sm font-bold">{user.name}</p>
                <p className="text-sm text-gray-700">{user.message}</p>
                <p className="text-xs text-gray-500 mt-1">{user.time}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/*  Bottom Navigation */}
      <NavBar />
    </div>
  );
}
