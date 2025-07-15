import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import VideoChat from "../components/VideoChat";

export default function VideoCallPage() {
  const { userId: otherId } = useParams();
  const myId = localStorage.getItem("userId");
  const navigate = useNavigate();
  const [otherUser, setOtherUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3034/users/${otherId}`);
        const data = await res.json();
        setOtherUser(data);
      } catch (err) {
        console.error("Error fetching user:", err.message);
      }
    };

    fetchUser();
  }, [otherId]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      {/* Header */}
     <header className="relative px-4 py-3 border-b shadow-sm bg-white">
  {/* Back Button*/}
  <button
    onClick={() => navigate(`/messages/${otherId}`)}
    className="absolute text-2xl left-4 top-1/2 -translate-y-1/2   text-black px-3 py-1 rounded-full  "
  >
    ←
  </button>

  {/* Centered Title */}
  <h1 className="text-lg font-semibold text-blue-600 text-center">
    {otherUser?.firstName || "User"}
  </h1>
</header>

      {/* Video + End Call */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 gap-6 max-w-md mx-auto">
        <VideoChat myId={myId} otherId={otherId} isCalling={true} />

        {/* End Call Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate(`/messages/${otherId}`)}
            className="px-5 h-12 flex items-center justify-center rounded-full bg-red-500 text-white font-medium shadow-md hover:bg-red-600 active:scale-95 transition"
            title="End Call"
          >
           
            End Call
          </button>
        </div>
      </main>
    </div>
  );
}
