import { useState, useEffect } from 'react';
import { adminDashboard } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminDashboard()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Gallery Photos', value: stats?.photos ?? 0, icon: '📷', color: 'from-sky-50 to-blue-50 border-blue-100' },
            { label: 'Published Programs', value: stats?.programs ?? 0, icon: '📋', color: 'from-emerald-50 to-teal-50 border-emerald-100' },
            { label: 'Messages', value: stats?.messages ?? 0, icon: '💬', color: 'from-amber-50 to-orange-50 border-amber-100' },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className={`rounded-2xl border bg-gradient-to-br ${color} p-6`}>
              <div className="text-4xl mb-3">{icon}</div>
              <div className="text-3xl font-bold text-gray-900">{value}</div>
              <div className="text-sm text-gray-500 mt-1">{label}</div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h2 className="font-bold text-gray-900 mb-4">Getting Started</h2>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">→</span>
            <span>Use <strong>Programs</strong> to create and publish this week's activities.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">→</span>
            <span>Use <strong>Gallery</strong> to upload and manage photos.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">→</span>
            <span>Check <strong>Messages</strong> to see contact form submissions.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-emerald-500 mt-0.5">→</span>
            <span>Go to <strong>Settings</strong> to update daycare contact info and hero image.</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
