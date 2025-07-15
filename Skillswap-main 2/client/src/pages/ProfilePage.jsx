import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar";
export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [location, setLocation] = useState("");
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [wantedSkills, setWantedSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return;

    const fetchUser = async () => {
      try {
        const res = await fetch(`http://localhost:3034/users/${userId}`);
        const data = await res.json();
        setUser(data);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setLocation(data.location || "");
        setOfferedSkills(data.offeredSkills || []);
        setWantedSkills(data.wantedSkills || []);
      } catch (err) {
        console.error("Erro ao buscar utilizador:", err.message);
      }
    };

    const fetchSkills = async () => {
      try {
        const res = await fetch("http://localhost:3034/api/skills");
        const data = await res.json();
        setAllSkills(data);
      } catch (err) {
        console.error("Erro ao buscar skills:", err.message);
      }
    };

    fetchUser();
    fetchSkills();
  }, []);

  const handleAddSkill = (type, skillId) => {
    const skillName = allSkills.find((s) => s._id === skillId)?.name;
    if (!skillName) return;

    if (type === "offered" && !offeredSkills.includes(skillName)) {
      setOfferedSkills([...offeredSkills, skillName]);
    } else if (type === "wanted" && !wantedSkills.includes(skillName)) {
      setWantedSkills([...wantedSkills, skillName]);
    }
  };

  const handleRemoveSkill = (type, skillName) => {
    if (type === "offered") {
      setOfferedSkills(offeredSkills.filter((s) => s !== skillName));
    } else {
      setWantedSkills(wantedSkills.filter((s) => s !== skillName));
    }
  };

const handleSave = async () => {
  setIsSaving(true);
  setSaveMessage("");

  try {
    const res = await fetch("http://localhost:3034/api/users/update-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user._id,
        firstName,
        lastName,
        location,
        offeredSkills,
        wantedSkills,
      }),
    });

    if (!res.ok) throw new Error("Erro ao atualizar perfil");

    setEditing(false);
    setUser((prev) => ({
      ...prev,
      firstName,
      lastName,
      location,
      offeredSkills,
      wantedSkills,
    }));
    setSaveMessage("✅ Profile updated successfully!");
  } catch (err) {
    console.error(err.message);
    setSaveMessage("❌ An error occured saving.");
  } finally {
    setIsSaving(false);
  }
};



  const handleCancel = () => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setLocation(user.location || "");
    setOfferedSkills(user.offeredSkills || []);
    setWantedSkills(user.wantedSkills || []);
    setEditing(false);
    setSaveMessage("");
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
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
          <div className="w-24 h-24 rounded-md bg-gray-300 mb-4 flex items-center justify-center">
            <img
              src="/purple-butterfly.jpg"
              alt="Profile"
              className="w-full h-full rounded object-cover"
            />
          </div>

          {editing ? (
            <div className="flex flex-col gap-2 w-full">
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First Name"
                className="border px-3 py-2 rounded"
              />
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last Name"
                className="border px-3 py-2 rounded"
              />
            </div>
          ) : (
            <h2 className="text-xl font-semibold">
              {user.firstName} {user.lastName}
            </h2>
          )}
{/* 
          <p className="text-sm text-gray-600">Bio goes here</p>
          <p className="text-sm mt-1">Idade</p> */}
          <div className="flex items-center justify-center mt-1 text-sm">
            <img src="/location-sign.svg" alt="Location Icon" className="w-4 h-4 mr-2" />
            {editing ? (
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Location"
                className="border px-3 py-2 rounded text-center"
              />
            ) : (
              <span>{user.location}</span>
            )}
          </div>

          {!editing && (
            <button
              className="px-4 py-2 mt-2 bg-blue-800 text-white rounded-full hover:bg-blue-700 transition"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Skills and Interests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-md">
          <section>
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            {offeredSkills.map((skill, i) => (
              <div
                key={i}
                className="inline-flex items-center bg-blue-100 text-blue-800 ml-2 px-4 py-2 rounded-full text-sm font-medium mb-2"
              >
                {skill}
                {editing && (
                  <button
                    onClick={() => handleRemoveSkill("offered", skill)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {editing && (
              <select
                onChange={(e) => handleAddSkill("offered", e.target.value)}
                className="mt-2 border p-2 rounded w-full"
                defaultValue=""
              >
                <option value="" disabled>Select skills to add</option>
                {allSkills
                  .filter((s) => !offeredSkills.includes(s.name))
                  .map((skill) => (
                    <option key={skill._id} value={skill._id}>
                      {skill.name}
                    </option>
                  ))}
              </select>
            )}
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Interests</h3>
            {wantedSkills.map((interest, i) => (
              <div
                key={i}
                className="inline-flex items-center bg-green-100 text-green-800 ml-2 px-4 py-2 rounded-full text-sm font-medium mb-2"
              >
                {interest}
                {editing && (
                  <button
                    onClick={() => handleRemoveSkill("wanted", interest)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {editing && (
              <select
                onChange={(e) => handleAddSkill("wanted", e.target.value)}
                className="mt-2 border p-2 rounded w-full"
                defaultValue=""
              >
                                <option value="" disabled>Select interests to add</option>
                {allSkills
                  .filter((s) => !wantedSkills.includes(s.name))
                  .map((skill) => (
                    <option key={skill._id} value={skill._id}>
                      {skill.name}
                    </option>
                  ))}
              </select>
            )}
          </section>
        </div>

        {/* error or sucess message */}
        {saveMessage && (
          <p className="mt-4 text-sm text-center">
            {saveMessage}
          </p>
        )}

        {/* Buttons */}
        {editing && (
          <div className="flex gap-4 mt-6 mb-10"> {/* Added mb-10 for more space */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        )}

        {!editing && (
          <button
            onClick={() => {
              localStorage.removeItem("userId");
              navigate("/auth");
            }}
            className="mt-2 px-6 py-2 mb-10  text-sm text-red-600 bg-red-100 rounded-full hover:bg-red-200 transition"
          >
            Logout
          </button>
        )}
      </main>

      {/* Footer */}
   <NavBar />
    </div>
  );
}
