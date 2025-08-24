// src/ic/actor.ts
import { HttpAgent, Actor } from "@dfinity/agent";
// after dfx deploy / dfx generate you will have this declarations path
import { idlFactory as backend_idl, canisterId as backend_id } from "../../../ai_tutor_backend";

const isLocal =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

export function backendActor() {
  const host = isLocal ? "http://127.0.0.1:4943" : undefined;
  const agent = new HttpAgent({ host });
  if (isLocal) agent.fetchRootKey().catch(() => console.warn("Could not fetch root key"));
  const actor = Actor.createActor(backend_idl as any, {
    agent,
    canisterId: backend_id as any,
  }) as any;
  return actor;
}
