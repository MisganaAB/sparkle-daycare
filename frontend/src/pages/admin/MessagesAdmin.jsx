import { useState, useEffect } from 'react';
import { adminMessages } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function MessagesAdmin() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminMessages()
      .then(setMessages)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Contact Messages</h1>

      {loading ? (
        <LoadingSpinner />
      ) : messages.length === 0 ? (
        <p className="text-gray-500 text-center py-12">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className="bg-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-bold text-gray-900">{msg.name}</div>
                  <div className="text-sm text-gray-500">
                    {msg.email}
                    {msg.phone && ` · ${msg.phone}`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">
                    {new Date(msg.created_at).toLocaleString()}
                  </div>
                  {msg.telegram_sent && (
                    <span className="text-xs text-emerald-600 font-medium">✓ Telegram sent</span>
                  )}
                </div>
              </div>
              {msg.subject && (
                <div className="text-sm font-semibold text-gray-700 mb-1">{msg.subject}</div>
              )}
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap">
                {msg.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
