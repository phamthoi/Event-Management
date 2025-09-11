import React from "react";

function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-600 text-white py-4 px-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <span className="font-semibold">Welcome, Admin!</span>
      </header>
      <main className="p-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Dashboard Content</h2>
          <p className="text-gray-700">This is your dashboard. Add widgets, charts, or management features here.</p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
