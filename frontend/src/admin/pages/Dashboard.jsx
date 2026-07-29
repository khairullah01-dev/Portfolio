import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    experiences: 0,
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, messagesRes, experiencesRes] = await Promise.all([
          axios.get('/projects'),
          axios.get('/messages'),
          axios.get('/experience'),
        ]);

        setStats({
          projects: projectsRes.data.length,
          messages: messagesRes.data.length,
          experiences: experiencesRes.data.length,
        });

        setRecentMessages(messagesRes.data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-sky-500 border-r-transparent" />
      </div>
    );
  }

  const statCards = [
    {
      label: 'Projects',
      value: stats.projects,
      color: 'from-sky-500/10 to-indigo-500/10 border-sky-500/20 text-sky-400',
      icon: (
        <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      link: '/admin/projects',
    },
    {
      label: 'Messages',
      value: stats.messages,
      color: 'from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400',
      icon: (
        <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      link: '/admin/messages',
    },
    {
      label: 'Stats / Counters',
      value: stats.experiences,
      color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400',
      icon: (
        <svg className="w-8 h-8 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 012 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      link: '/admin/stats',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Dashboard Overview
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Analyze and update your portfolio details instantly
        </p>
      </div>

      {/* Cards list */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <Link
            key={card.label}
            to={card.link}
            className={`flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
          >
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-sky-600">
                {card.label}
              </span>
              <p className="mt-2 text-4xl font-extrabold text-slate-900">
                {card.value}
              </p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3.5 border border-slate-100">
              {card.icon}
            </div>
          </Link>
        ))}
      </div>

      {/* Layout panels */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Messages */}
        <div className="lg:col-span-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              Recent Messages
            </h3>
            <Link
              to="/admin/messages"
              className="text-xs font-bold text-sky-600 hover:text-sky-700 transition-colors"
            >
              View Inbox &rarr;
            </Link>
          </div>

          {recentMessages.length === 0 ? (
            <div className="rounded-xl bg-slate-50 py-12 text-center text-slate-500 border border-dashed border-slate-200">
              <svg className="mx-auto h-12 w-12 text-slate-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              No incoming messages yet
            </div>
          ) : (
            <div className="space-y-4">
              {recentMessages.map((msg) => (
                <div
                  key={msg._id}
                  className="rounded-xl bg-slate-50 border border-slate-100 p-4 transition-all hover:bg-slate-100/80"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-slate-900 text-sm">
                      {msg.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(msg.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-sky-600 mb-1">
                    Subject: {msg.subject}
                  </p>
                  <p className="text-sm text-slate-600 line-clamp-2">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="lg:col-span-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-6">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <Link
                to="/admin/contact"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-[#132247] hover:text-white border border-slate-100 text-sm text-slate-800 font-semibold transition-all duration-300 group"
              >
                <svg className="w-5 h-5 text-sky-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                Site & Contact Settings
              </Link>
              <Link
                to="/admin/projects"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-[#132247] hover:text-white border border-slate-100 text-sm text-slate-800 font-semibold transition-all duration-300 group"
              >
                <svg className="w-5 h-5 text-sky-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Manage Projects
              </Link>
              <Link
                to="/admin/stats"
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-slate-50 hover:bg-[#132247] hover:text-white border border-slate-100 text-sm text-slate-800 font-semibold transition-all duration-300 group"
              >
                <svg className="w-5 h-5 text-amber-500 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit Statistics
              </Link>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50/60 border border-blue-100 rounded-xl">
            <span className="text-xs font-black text-[#132247] tracking-wider block uppercase mb-1">
              Admin Tip
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              Ensure you regularly review your client message inquiries and update your portfolio with recent projects to maximize engagements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
