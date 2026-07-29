import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

export default function StatsManager() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingStat, setEditingStat] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await axios.get('/experience');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchStats, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchStats]);

  const handleEdit = (stat) => {
    setEditingStat(stat);
    setTitle(stat.title);
    setSubtitle(stat.subtitle);
    setShowForm(true);
    setFormError('');
    setFormSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this stat?')) return;

    try {
      await axios.delete(`/experience/${id}`);
      fetchStats();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting stat');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingStat(null);
    setTitle('');
    setSubtitle('');
    setFormError('');
    setFormSuccess('');
  };

  const handleOpenAddForm = () => {
    setEditingStat(null);
    setTitle('');
    setSubtitle('');
    setShowForm(true);
    setFormError('');
    setFormSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitLoading(true);

    try {
      if (editingStat) {
        await axios.put(`/experience/${editingStat._id}`, { title, subtitle });
        setFormSuccess('Stat updated successfully!');
      } else {
        await axios.post('/experience', { title, subtitle });
        setFormSuccess('Stat created successfully!');
      }

      fetchStats();
      setTimeout(() => {
        handleCloseForm();
      }, 1000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save stat. Make sure fields are valid.');
    } finally {
      setSubmitLoading(false);
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
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Stats & Experience Manager
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Edit the metrics and stats boxes displayed on your home section
          </p>
        </div>
        <div>
          {!showForm && (
            <button
              onClick={handleOpenAddForm}
              className="flex items-center gap-2 rounded-xl bg-[#132247] px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#1e3264] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Stat Box
            </button>
          )}
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm max-w-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              {editingStat ? 'Edit Stat Item' : 'Create New Stat Item'}
            </h3>
            <button
              onClick={handleCloseForm}
              className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {formError && (
            <div className="mb-6 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-700">
              {formError}
            </div>
          )}

          {formSuccess && (
            <div className="mb-6 rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-700">
              {formSuccess}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Title / Metric Value
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                  placeholder="e.g. +10 ans, 100%, etc."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                  Subtitle / Description Label
                </label>
                <input
                  type="text"
                  required
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                  placeholder="e.g. experience, clients, etc."
                />
              </div>
            </div>

            <div className="flex gap-4 justify-end">
              <button
                type="button"
                onClick={handleCloseForm}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-all duration-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitLoading}
                className="flex items-center gap-2 rounded-xl bg-[#132247] px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#1e3264] disabled:opacity-50 transition-all duration-300 cursor-pointer"
              >
                {submitLoading ? 'Saving...' : 'Save Stat'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats List Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <article
            key={stat._id}
            className="flex flex-col items-center justify-between rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 w-full"
          >
            <div className="text-center py-4">
              <p className="text-3xl font-extrabold text-[#132247]">{stat.title}</p>
              <p className="mt-1 text-sm text-slate-600 font-medium tracking-wide capitalize">{stat.subtitle}</p>
            </div>

            <div className="flex gap-3 justify-center border-t border-slate-100 w-full pt-4 mt-2">
              <button
                onClick={() => handleEdit(stat)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-[#132247] hover:text-white text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(stat._id)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-600 border border-rose-200 transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </article>
        ))}

        {stats.length === 0 && !showForm && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-500 bg-white">
            <svg className="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2" />
            </svg>
            <h4 className="text-lg font-bold text-slate-800 mb-1">No Statistics Found</h4>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              Create statistics boxes to show off metrics like client count or experience duration.
            </p>
            <button
              onClick={handleOpenAddForm}
              className="inline-flex rounded-full bg-[#132247] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#1e3264] transition-all cursor-pointer"
            >
              Add Stat Box
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
