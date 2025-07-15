import { useEffect, useState } from "react";

export default function Notepad() {
  const [note, setNote] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("notepad");
    if (saved) setNote(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("notepad", note);
  }, [note]);

  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h2 className="text-lg font-semibold mb-2">Notepad</h2>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Write your ideas, your thoughts..."
        className="w-full h-40 p-2 border rounded resize-none"
      />
    </div>
  );
}
