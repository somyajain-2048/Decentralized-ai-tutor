// src/pages/Landing.tsx

import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
      <div className="max-w-2xl text-center p-8">
        <h1 className="text-4xl font-extrabold mb-4">Your Decentralized AI Tutor</h1>
        <p className="mb-6 text-gray-700">
          Learn faster, generate career roadmaps, optimize your resume — privately on the Internet Computer.
        </p>
        <Link to="/app" className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl shadow">
          Get Started
        </Link>
      </div>
    </div>
  );
}
