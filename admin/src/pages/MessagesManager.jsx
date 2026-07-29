import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export default function MessagesManager() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await axios.get('/messages');
      setMessages(res.data);
      if (res.data.length > 0) {
        setActiveMessage(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchMessages, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchMessages]);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      await axios.delete(`/messages/${id}`);
      const updatedMessages = messages.filter((m) => m._id !== id);
      setMessages(updatedMessages);
      if (activeMessage && activeMessage._id === id) {
        setActiveMessage(updatedMessages.length > 0 ? updatedMessages[0] : null);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting message');
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-sky-500 border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Inbox Messages
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Read customer inquiries submitted through your landing page's contact form
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 py-20 text-center text-slate-500 bg-white">
          <svg className="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          <h4 className="text-lg font-bold text-slate-800 mb-1">Inbox Empty</h4>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            You don't have any messages yet. Form submissions will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start h-[calc(100vh-240px)] min-h-[500px]">
          {/* Messages list pane */}
          <div className="lg:col-span-5 border border-slate-200 rounded-2xl overflow-hidden bg-white h-full flex flex-col shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <span className="text-xs font-black tracking-wider uppercase text-slate-500">
                All Messages ({messages.length})
              </span>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
              {messages.map((msg) => (
                <div
                  key={msg._id}
                  onClick={() => setActiveMessage(msg)}
                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors flex flex-col justify-between gap-2 relative ${
                    activeMessage && activeMessage._id === msg._id
                      ? 'bg-blue-50/70 border-l-4 border-[#132247]'
                      : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-sm truncate pr-2">
                        {msg.name}
                      </span>
                      <span className="text-xs text-slate-400 whitespace-nowrap shrink-0">
                        {new Date(msg.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-sky-600 truncate mt-0.5">
                      {msg.subject}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-500 line-clamp-1 flex-1 pr-4">
                      {msg.message}
                    </p>
                    <button
                      onClick={(e) => handleDelete(msg._id, e)}
                      className="p-1 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete message"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Message reading pane */}
          <div className="lg:col-span-7 border border-slate-200 rounded-2xl bg-white h-full flex flex-col overflow-hidden shadow-sm">
            {activeMessage ? (
              <div className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 bg-slate-50 space-y-3 shrink-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-lg">
                        {activeMessage.name}
                      </h4>
                      <p className="text-sm text-slate-600 font-semibold mt-0.5">
                        Email:{' '}
                        <a href={`mailto:${activeMessage.email}`} className="text-sky-600 hover:underline">
                          {activeMessage.email}
                        </a>
                      </p>
                    </div>
                    <div className="text-xs text-slate-400 font-semibold">
                      Date:{' '}
                      {new Date(activeMessage.createdAt).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-xs font-bold text-sky-600 block tracking-wide uppercase">
                      Subject
                    </span>
                    <h5 className="font-bold text-slate-900 text-sm mt-0.5">
                      {activeMessage.subject}
                    </h5>
                  </div>
                </div>

                {/* Message Content */}
                <div className="flex-1 p-6 overflow-y-auto bg-white text-slate-700 leading-relaxed text-sm whitespace-pre-wrap">
                  {activeMessage.message}
                </div>

                {/* Footer bar */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
                  <button
                    onClick={(e) => handleDelete(activeMessage._id, e)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-50 text-rose-600 hover:bg-rose-100 text-xs font-bold border border-rose-200 transition-all cursor-pointer"
                  >
                    Delete Message
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                Select a message to read details
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
