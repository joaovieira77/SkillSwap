import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VantaBackground from "../components/backg";

export default function AuthPage() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    firstName: "",
    lastName: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");

    const endpoint = mode === "signup" ? "/api/signup" : "/api/login";
    const payload =
      mode === "signup"
        ? {
            email: form.email,
            password: form.password,
            confirmPassword: form.confirmPassword,
            firstName: form.firstName,
            lastName: form.lastName,
            location: form.location,
          }
        : {
            email: form.email,
            password: form.password,
          };

    try {
      const res = await fetch(`http://localhost:3034${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Authentication failed");

      localStorage.setItem("userId", data.userId);

      if (mode === "signup") {
        localStorage.setItem("firstName", form.firstName);
        localStorage.setItem("lastName", form.lastName);
        localStorage.setItem("location", form.location);
        navigate("/skills");
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <VantaBackground />

      <div className="flex mt-10 items-center justify-center h-full px-4">
        <div className="bg-white/10 backdrop-blur-md p-6 rounded-lg shadow-xl w-full max-w-sm z-10">
          <h2 className="text-2xl font-bold mb-4 text-center">
            {mode === "login" ? "Log In" : "Sign Up"}
          </h2>

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full border px-3 py-2 mb-3 rounded"
            value={form.email}
            onChange={handleChange}
            required
          />

          {/*  Password Field with Toggle */}
          <div className="relative mb-3">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              className="w-full border px-3 py-2 rounded pr-10"
              value={form.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-2 text-sm text-blue-600"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {mode === "signup" && (
            <>
              {/*  Confirm Password Field with Toggle */}
              <div className="relative mb-3">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full border px-3 py-2 rounded pr-10"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2 top-2 text-sm text-blue-600"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>

              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full border px-3 py-2 mb-3 rounded"
                value={form.firstName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full border px-3 py-2 mb-3 rounded"
                value={form.lastName}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                className="w-full border px-3 py-2 mb-3 rounded"
                value={form.location}
                onChange={handleChange}
                required
              />
            </>
          )}

          {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {mode === "login" ? "Log In" : "Sign Up"}
          </button>

          <p className="text-sm text-center mt-4 text-gray-700">
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="text-blue-600 underline"
            >
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
