// src/pages/ResumeAnalyzer.tsx
import React, { useState } from "react";
import { backendActor } from "../ic/actor";

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState("");
  const [role, setRole] = useState("Frontend Developer");
  const [out, setOut] = useState("");
  const [busy, setBusy] = useState(false);

  async function analyze() {
    setBusy(true); setOut("");
    try {
      const actor = backendActor();
      const res = await actor.resume_analyze(resumeText, role);
      if (res && "Ok" in res) setOut(res.Ok);
      else if (res && "Err" in res) setOut("Error: " + res.Err);
      else setOut(String(res));
    } catch (e) {
      setOut(String(e));
    } finally {
      setBusy(false);
    }
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const t = await f.text();
    setResumeText(t);
  }

  return (
    <div className="max-w-3xl space-y-4">
      <h2 className="text-xl font-semibold">Resume Analyzer</h2>
      <input className="p-2 border rounded-lg w-full" value={role} onChange={(e) => setRole(e.target.value)} />
      <div>
        <label className="block text-sm text-gray-600 mb-1">Upload resume (.txt or paste below)</label>
        <input type="file" accept=".txt,.md,.pdf" onChange={handleFile} />
      </div>
      <textarea value={resumeText} onChange={(e) => setResumeText(e.target.value)} className="w-full p-3 border rounded-lg min-h-[160px]" />
      <div>
        <button onClick={analyze} disabled={busy} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">{busy ? "Analyzing..." : "Analyze"}</button>
      </div>
      {out && <div className="bg-white p-4 rounded-lg border whitespace-pre-wrap mt-3">{out}</div>}
    </div>
  );
}
