import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { getUploadUrl } from '../../config/api.js';

export default function ProjectsManager() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Form states
  const [title, setTitle] = useState('');
  const [link, setLink] = useState('');
  const [description, setDescription] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [imageType, setImageType] = useState('upload'); // 'upload' or 'url'

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await axios.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchProjects, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchProjects]);

  const handleEdit = (project) => {
    setEditingProject(project);
    setTitle(project.title);
    setLink(project.link);
    setDescription(project.description || '');
    if (project.image.startsWith('/uploads/')) {
      setImageType('upload');
      setImageUrl('');
    } else {
      setImageType('url');
      setImageUrl(project.image);
    }
    setImageFile(null);
    setShowForm(true);
    setFormError('');
    setFormSuccess('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await axios.delete(`/projects/${id}`);
      fetchProjects();
    } catch (err) {
      alert(err.response?.data?.message || 'Error deleting project');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProject(null);
    setTitle('');
    setLink('');
    setDescription('');
    setImageFile(null);
    setImageUrl('');
    setFormError('');
    setFormSuccess('');
  };

  const handleOpenAddForm = () => {
    setEditingProject(null);
    setTitle('');
    setLink('');
    setDescription('');
    setImageFile(null);
    setImageUrl('');
    setImageType('upload');
    setShowForm(true);
    setFormError('');
    setFormSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setSubmitLoading(true);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('link', link);
    formData.append('description', description);

    if (imageType === 'upload') {
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (!editingProject) {
        setFormError('Please upload an image file');
        setSubmitLoading(false);
        return;
      }
    } else {
      if (imageUrl) {
        formData.append('image', imageUrl);
      } else {
        setFormError('Please enter an image URL');
        setSubmitLoading(false);
        return;
      }
    }

    try {
      if (editingProject) {
        await axios.put(`/projects/${editingProject._id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setFormSuccess('Project updated successfully!');
      } else {
        await axios.post('/projects', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setFormSuccess('Project created successfully!');
      }

      fetchProjects();
      setTimeout(() => {
        handleCloseForm();
      }, 1000);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to save project. Make sure input formats are correct.');
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
            Projects Manager
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            Showcase your work by managing projects on your landing page
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
              Add Project
            </button>
          )}
        </div>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
            <h3 className="text-lg font-bold text-slate-900">
              {editingProject ? 'Edit Project' : 'Create New Project'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                    placeholder="e.g. Portfolio Website"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Project Demo / GitHub Link
                  </label>
                  <input
                    type="text"
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                    placeholder="e.g. https://github.com/..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                    Project Image Type
                  </label>
                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-2 text-sm text-slate-800 cursor-pointer font-semibold">
                      <input
                        type="radio"
                        name="imageType"
                        value="upload"
                        checked={imageType === 'upload'}
                        onChange={() => setImageType('upload')}
                        className="text-[#132247] focus:ring-[#132247] cursor-pointer"
                      />
                      Upload File
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-800 cursor-pointer font-semibold">
                      <input
                        type="radio"
                        name="imageType"
                        value="url"
                        checked={imageType === 'url'}
                        onChange={() => setImageType('url')}
                        className="text-[#132247] focus:ring-[#132247] cursor-pointer"
                      />
                      External URL
                    </label>
                  </div>
                </div>

                {imageType === 'upload' ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Upload Image File
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-[#132247] hover:file:text-white transition-all cursor-pointer"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                      Image URL
                    </label>
                    <input
                      type="text"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                      placeholder="e.g. https://images.unsplash.com/..."
                    />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Project Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                placeholder="Describe your project, features or achievements..."
              />
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
                {submitLoading ? 'Saving...' : 'Save Project'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => {
          // Resolve image URL
          const imageSrc = getUploadUrl(project.image);

          return (
            <article
              key={project._id}
              className="group flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="h-48 overflow-hidden bg-slate-100 flex items-center justify-center border-b border-slate-100">
                <img
                  src={imageSrc}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&q=80&w=600';
                  }}
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg leading-tight mb-2 truncate">
                    {project.title}
                  </h4>
                  <p className="text-xs text-sky-600 font-semibold mb-3 tracking-wide truncate">
                    {project.link !== '#' ? (
                      <a href={project.link} target="_blank" rel="noreferrer" className="hover:underline">
                        {project.link}
                      </a>
                    ) : (
                      'No Demo Link'
                    )}
                  </p>
                  <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-6">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex gap-3 justify-end border-t border-slate-100 pt-4">
                  <button
                    onClick={() => handleEdit(project)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-[#132247] hover:text-white text-xs font-bold text-slate-700 border border-slate-200 transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project._id)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-xs font-bold text-rose-600 border border-rose-200 transition-all cursor-pointer"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}

        {projects.length === 0 && !showForm && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 py-16 text-center text-slate-500 bg-white">
            <svg className="mx-auto h-16 w-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h4 className="text-lg font-bold text-slate-800 mb-1">No Projects Found</h4>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              Create your first showcase project to display it on the main landing page.
            </p>
            <button
              onClick={handleOpenAddForm}
              className="inline-flex rounded-full bg-[#132247] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#1e3264] transition-all cursor-pointer"
            >
              Add Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
