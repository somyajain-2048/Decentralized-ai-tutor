// src/pages/History.tsx
import  { useEffect, useState } from "react";
import { backendActor } from "../ic/actor";

type Activity = { timestamp: bigint | number; action: string; details: string };

export default function History() {
  const [items, setItems] = useState<Activity[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const actor = backendActor();
        const res: Activity[] = await actor.get_history([]); // no principal param
        setItems(res || []);
      } catch (e) {
        console.warn(e);
      }
    })();
  }, []);

  return (
    <div className="max-w-3xl space-y-3">
      <h2 className="text-xl font-semibold">Activity History</h2>
      <div className="space-y-2">
        {items.length === 0 && <div className="text-gray-500">No activity yet.</div>}
        {items.map((it, idx) => (
          <div key={idx} className="p-3 bg-white rounded-lg border">
            <div className="text-sm text-gray-500">{new Date(Number(it.timestamp)).toLocaleString()}</div>
            <div className="font-medium">{it.action}</div>
            <div className="text-gray-700 whitespace-pre-wrap">{it.details}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
