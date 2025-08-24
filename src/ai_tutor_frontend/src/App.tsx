// src/App.tsx

import {BrowserRouter,Routes,Route,Navigate} from "react-router-dom";

import Layout from "../src/components/Layout";
import Landing from "../src/pages/Landing";
import Dashboard from "./pages/Dashboard"
import Profile from "../src/pages/Profile"
import History from "../src/pages/History"
import AICoach from "../src/pages/AICoach"
import ResumeAnalyzer from "../src/pages/ResumeAnalyzer"
import CareerRoadmap from "../src/pages/CarrerRoadmap"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="history" element={<History />} />
          <Route path="coach" element={<AICoach />} />
          <Route path="resume" element={<ResumeAnalyzer />} />
          <Route path="roadmap" element={<CareerRoadmap />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
