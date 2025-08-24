// src/pages/AICoach.tsx
import  { useState } from "react";
import { backendActor } from "../ic/actor";

export default function AICoach() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [busy, setBusy] = useState(false);

  async function ask() {
    setBusy(true);
    setAnswer("");
    try {
      const actor = backendActor();
      // ai_coach returns a Result<string, string> from the canister
      const res = await actor.ai_coach(question);
      // handle Candid Result shape - either { Ok: "..." } or { Err: "..." }
      if (res && "Ok" in res) setAnswer(res.Ok as string);
      else if (res && "Err" in res) setAnswer("Error: " + (res.Err as string));
      else setAnswer(String(res));
    } catch (e) {
      setAnswer("Call failed: " + String(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-2xl space-y-4">
      <h2 className="text-xl font-semibold">AI Coach</h2>
      <textarea className="w-full p-3 rounded-lg border" placeholder="Ask anything..." value={question} onChange={(e) => setQuestion(e.target.value)} />
      <div className="flex gap-2">
        <button onClick={ask} disabled={busy} className="px-4 py-2 bg-indigo-600 text-white rounded-lg">
          {busy ? "Thinking..." : "Ask Coach"}
        </button>
        <button onClick={() => { setQuestion(""); setAnswer(""); }} className="px-4 py-2 border rounded-lg">
          Clear
        </button>
      </div>
      {answer && (
        <div className="bg-white p-4 rounded-lg border whitespace-pre-wrap">
          <strong>Answer:</strong>
          <div className="mt-2">{answer}</div>
        </div>
      )}
    </div>
  );
}
