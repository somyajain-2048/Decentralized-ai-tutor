// src/components/Topbar.tsx


export default function Topbar() {
  return (
    <header className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-4">
        <span className="text-lg font-semibold">Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm text-gray-600">Local Dev</div>
      </div>
    </header>
  );
}
