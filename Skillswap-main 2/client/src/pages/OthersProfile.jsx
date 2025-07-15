import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/navbar";

export default function UserProfilePage() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3034/users/${userId}`);
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Erro ao carregar perfil:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  if (loading) {
    return <p className="text-center mt-10 text-gray-500">Loading profile...</p>;
  }

  if (!user) {
    return <p className="text-center mt-10 text-red-500">User not found.</p>;
  }

  return (
    <div className="min-h-screen flex flex-col justify-between bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="flex items-center justify-center py-4 border-b shadow-md">
        <img src="/logo.png" alt="SKILLSWAP" className="h-10 mr-2" />
        <h1 className="text-2xl font-bold">SKILLSWAP</h1>
      </header>

      {/* Profile Section */}
      <main className="p-6 flex flex-col items-center">
        <div className="text-center flex flex-col items-center bg-white shadow-md rounded-lg p-6 w-full max-w-md">
          <div className="w-24 h-24 rounded-md bg-gray-300 mb-4 flex items-center justify-center overflow-hidden">
            <img
              src="/purple-butterfly.jpg"
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-semibold">
            {user.firstName} {user.lastName}
          </h2>

{/*         <p className="text-sm text-gray-600">{user.bio || "Sem biografia."}</p>
          <p className="text-sm mt-1">{user.age ? `${user.age} anos` : "Idade não disponível"}</p>
*/}
          <div className="flex items-center justify-center mt-1 text-sm">
            <img src="/location-sign.svg" alt="Location Icon" className="w-4 h-4 mr-2" />
            <span>{user.location || "Localização não definida"}</span>
          </div>
        </div>

        {/* Skills and Interests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-md">
          <section>
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            {user.offeredSkills?.length > 0 ? (
              user.offeredSkills.map((skill, i) => (
                <div
                  key={i}
                  className="inline-block bg-blue-100 text-blue-800 ml-2 px-8 py-2 rounded-full text-sm font-medium mb-2"
                >
                  {skill}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No skills.</p>
            )}
          </section>
          <section>
            <h3 className="text-lg font-semibold mb-2">Interests</h3>
            {user.wantedSkills?.length > 0 ? (
              user.wantedSkills.map((interest, i) => (
                <div
                  key={i}
                  className="inline-block bg-green-100 text-green-800 px-8 ml-2 py-2 rounded-full text-sm font-medium mb-10"
                >
                  {interest}
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No interests.</p>
            )}
          </section>
        </div>
      </main>

      {/* Request Swap Button 
      <div className="flex justify-center mb-6">
        <button className="px-4 py-2 mb-10 bg-green-500 text-white rounded-full hover:bg-green-600 transition">
          Request Swap
        </button>
      </div>*/}

      {/* Footer Navigation */}
    <Navbar />
    </div>
  );
}
