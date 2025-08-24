// src/pages/Profile.tsx
import  { useEffect, useState } from "react";
import { backendActor } from "../ic/actor";

type Profile = { name: string; email: string } | null;

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const actor = backendActor();
        // get_profile(optional Principal) - for our code call with empty array to use caller
        const p: Profile = await actor.get_profile([]);
        if (p) {
          setName(p.name || "");
          setEmail(p.email || "");
        }
      } catch (e) {
        console.warn("profile load", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function save() {
    const actor = backendActor();
    await actor.update_profile(name, email);
    alert("Profile saved");
  }

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Profile</h2>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="space-y-3">
          <input className="w-full p-3 rounded-lg border" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
          <input className="w-full p-3 rounded-lg border" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
          <div>
            <button onClick={save} className="px-4 py-2 rounded-lg bg-indigo-600 text-white">Save</button>
          </div>
        </div>
      )}
    </div>
  );
}
