import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SkillSetupPage() {
  const [skills, setSkills] = useState([]);
  const [offeredSkills, setOfferedSkills] = useState([]);
  const [wantedSkills, setWantedSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch("http://localhost:3034/api/skills");
        if (!res.ok) throw new Error("Failed to fetch skills");
        const data = await res.json();
        setSkills(data);
      } catch (err) {
        console.error("Error loading skills:", err.message);
      }
    };

    fetchSkills();
  }, []);

  const toggleSkill = (skillId, type) => {
    const id = String(skillId);
    const list = type === "offer" ? offeredSkills : wantedSkills;
    const setter = type === "offer" ? setOfferedSkills : setWantedSkills;

    setter(
      list.includes(id)
        ? list.filter((s) => s !== id)
        : [...list, id]
    );
  };

  const handleSubmit = async () => {
    const userId = localStorage.getItem("userId");
    const firstName = localStorage.getItem("firstName");
    const lastName = localStorage.getItem("lastName");
    const location = localStorage.getItem("location");

    if (!userId) {
      console.error("No userId found in localStorage");
      return;
    }

    // Convert skill IDs to skill names
    const offeredNames = offeredSkills
      .map((id) => skills.find((s) => String(s._id) === id)?.name)
      .filter(Boolean);

    const wantedNames = wantedSkills
      .map((id) => skills.find((s) => String(s._id) === id)?.name)
      .filter(Boolean);

    const payload = {
      userId,
      firstName,
      lastName,
      location,
      offeredSkills: offeredNames,
      wantedSkills: wantedNames,
    };

    try {
      const res = await fetch("http://localhost:3034/api/users/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save profile and skills");

      navigate("/home");
    } catch (err) {
      console.error("Error saving profile:", err.message);
    }
  };

  if (skills.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading skills...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center px-4 py-8">
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Set Up Your Skills</h2>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Skills You Can Offer</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => {
              const id = String(skill._id);
              return (
                <button
                  key={`offer-${id}`}
                  onClick={() => toggleSkill(id, "offer")}
                  className={`px-4 py-2 rounded-full border ${
                    offeredSkills.includes(id)
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {skill.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Skills You Want to Learn</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => {
              const id = String(skill._id);
              return (
                <button
                  key={`want-${id}`}
                  onClick={() => toggleSkill(id, "want")}
                  className={`px-4 py-2 rounded-full border ${
                    wantedSkills.includes(id)
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {skill.name}
                </button>
              );
            })}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
