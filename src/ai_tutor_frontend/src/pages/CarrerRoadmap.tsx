// src/pages/CareerRoadmap.tsx
import  { useState } from "react";
import { backendActor } from "../ic/actor";

export default function CareerRoadmap() {
  const [skills, setSkills] = useState("JS, React, basic DSA");
  const [role, setRole] = useState("Blockchain Developer");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  async function gen() {
    setBusy(true); setOut("");
    try {
      const actor = backendActor();
      const res = await actor.career_roadmap(skills, role);
      if (res && "Ok" in res) setOut(res.Ok);
      else if (res && "Err" in res) setOut("Error: " + res.Err);
      else setOut(String(res));
    } catch (e) {
      setOut(String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="text-xl font-semibold">Career Roadmap Generator</h2>
      <input className="w-full p-3 rounded-lg border" value={role} onChange={(e) => setRole(e.target.value)} />
      <textarea className="w-full p-3 rounded-lg border" value={skills} onChange={(e) => setSkills(e.target.value)} />
      <div>
        <button onClick={gen} disabled={busy} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">{busy ? "Generating..." : "Generate Roadmap"}</button>
      </div>
      {out && <div className="bg-white p-4 rounded-lg border whitespace-pre-wrap">{out}</div>}
    </div>
  );
}
