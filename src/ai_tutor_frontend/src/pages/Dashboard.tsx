// src/pages/Dashboard.tsx

function StatCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-semibold mt-2">{value}</div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <StatCard title="Learning Sessions" value="12" />
        <StatCard title="AI Chats" value="23" />
        <StatCard title="Resume Analyses" value="3" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-2">Recent Activity</h3>
          <div className="text-sm text-gray-600">No activity yet — start by talking to your AI Coach.</div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h3 className="font-semibold mb-2">Quick Actions</h3>
          <div className="flex gap-2">
            <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white">Open AI Coach</button>
            <button className="px-3 py-2 rounded-lg border">Analyze Resume</button>
          </div>
        </div>
      </div>
    </div>
  );
}
