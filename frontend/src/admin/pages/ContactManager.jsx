import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { getUploadUrl } from '../../config/api.js';

export default function ContactManager() {
  const [contact, setContact] = useState({
    heroName: '',
    heroBio: '',
    skillsTitle: '',
    skillsBio: '',
    experienceBio: '',
    projectsBio: '',
    phone: '',
    email: '',
    linkedin: '',
    facebook: '',
    twitter: '',
    instagram: '',
    picture: '',
    resume: '',
    skillsImage1: '',
    skillsImage2: '',
    skillsImage3: '',
  });

  const [pictureFile, setPictureFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [skillsFile1, setSkillsFile1] = useState(null);
  const [skillsFile2, setSkillsFile2] = useState(null);
  const [skillsFile3, setSkillsFile3] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingSkillsImg, setUploadingSkillsImg] = useState({ 1: false, 2: false, 3: false });
  const [status, setStatus] = useState({ type: '', message: '' });

  const fetchContact = useCallback(async () => {
    try {
      const res = await axios.get('/contact');
      setContact((prev) => ({ ...prev, ...(res.data || {}) }));
    } catch (err) {
      console.error('Error fetching contact settings:', err);
      setStatus({ type: 'error', message: err.response?.data?.message || 'Could not load settings.' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(fetchContact, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchContact]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus({ type: '', message: '' });

    try {
      const res = await axios.put('/contact', contact);
      setContact((prev) => ({ ...prev, ...(res.data || {}) }));
      setStatus({ type: 'success', message: 'All site & contact settings updated successfully!' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to save site settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handleUploadPicture = async () => {
    if (!pictureFile) {
      setStatus({ type: 'error', message: 'Please select a picture to upload.' });
      return;
    }

    setUploadingPicture(true);
    setStatus({ type: '', message: '' });

    try {
      const formData = new FormData();
      formData.append('picture', pictureFile);
      const res = await axios.post('/contact/picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setContact((prev) => ({ ...prev, ...(res.data || {}) }));
      setPictureFile(null);
      setStatus({ type: 'success', message: 'Profile picture uploaded successfully.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to upload picture.' });
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleUploadResume = async () => {
    if (!resumeFile) {
      setStatus({ type: 'error', message: 'Please select a resume PDF to upload.' });
      return;
    }

    setUploadingResume(true);
    setStatus({ type: '', message: '' });

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const res = await axios.post('/contact/resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setContact((prev) => ({ ...prev, ...(res.data || {}) }));
      setResumeFile(null);
      setStatus({ type: 'success', message: 'Resume PDF uploaded successfully.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to upload resume.' });
    } finally {
      setUploadingResume(false);
    }
  };

  const handleUploadSkillsImage = async (num, file, clearFileState) => {
    if (!file) {
      setStatus({ type: 'error', message: `Please select an image file for Skills Image ${num}.` });
      return;
    }

    setUploadingSkillsImg((prev) => ({ ...prev, [num]: true }));
    setStatus({ type: '', message: '' });

    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await axios.post(`/contact/skills-image/${num}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setContact((prev) => ({ ...prev, ...(res.data || {}) }));
      clearFileState(null);
      setStatus({ type: 'success', message: `Skills Image ${num} uploaded successfully.` });
    } catch (err) {
      setStatus({ type: 'error', message: err.response?.data?.message || `Failed to upload Skills Image ${num}.` });
    } finally {
      setUploadingSkillsImg((prev) => ({ ...prev, [num]: false }));
    }
  };

  const handleChange = (field, value) => setContact((prev) => ({ ...prev, [field]: value }));

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-sky-400 border-r-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Site & Contact Settings
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          Manage all content, hero text, section bios, contact information, social links, and assets across your portfolio site.
        </p>
      </div>

      {status.message && (
        <div
          className={`rounded-2xl px-5 py-4 text-sm font-medium flex items-center justify-between shadow-sm transition-all ${
            status.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          <span>{status.message}</span>
          <button
            onClick={() => setStatus({ type: '', message: '' })}
            className="text-xs opacity-70 hover:opacity-100 ml-4 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Hero & Main Intro */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h3 className="text-lg font-bold text-slate-900">1. Hero Section Settings</h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Hero Name / Title
              </label>
              <input
                type="text"
                value={contact.heroName || ''}
                onChange={(e) => handleChange('heroName', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                placeholder="e.g. Khairullah"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Hero Tagline / Bio Description
              </label>
              <textarea
                rows="3"
                value={contact.heroBio || ''}
                onChange={(e) => handleChange('heroBio', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                placeholder="Describe your role or value proposition shown in the hero section..."
              />
            </div>
          </div>
        </div>

        {/* Section 2: Skills Section */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
            <h3 className="text-lg font-bold text-slate-900">2. Skills Section Settings</h3>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Skills Section Title
              </label>
              <input
                type="text"
                value={contact.skillsTitle || ''}
                onChange={(e) => handleChange('skillsTitle', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                placeholder="e.g. Front-end developer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Skills Section Bio / Summary
              </label>
              <textarea
                rows="3"
                value={contact.skillsBio || ''}
                onChange={(e) => handleChange('skillsBio', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                placeholder="Overview of your technical expertise and background..."
              />
            </div>
          </div>
        </div>

        {/* Section 3: Experience & Projects Section Bios */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <h3 className="text-lg font-bold text-slate-900">3. Section Description Texts</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Experience Section Description
              </label>
              <textarea
                rows="3"
                value={contact.experienceBio || ''}
                onChange={(e) => handleChange('experienceBio', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                placeholder="Text displayed above the stats counters..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">
                Projects Section Description
              </label>
              <textarea
                rows="3"
                value={contact.projectsBio || ''}
                onChange={(e) => handleChange('projectsBio', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                placeholder="Text displayed above the project cards grid..."
              />
            </div>
          </div>
        </div>

        {/* Section 4: Contact Information */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-bold text-slate-900">4. Contact Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Phone</label>
              <input
                type="text"
                value={contact.phone || ''}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                placeholder="+99 999999999"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                value={contact.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                placeholder="myemail@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">LinkedIn Profile URL</label>
              <input
                type="text"
                value={contact.linkedin || ''}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                placeholder="https://linkedin.com/in/..."
              />
            </div>
          </div>
        </div>

        {/* Section 5: Social Links */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            <h3 className="text-lg font-bold text-slate-900">5. Social Media Links</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Facebook URL</label>
              <input
                type="text"
                value={contact.facebook || ''}
                onChange={(e) => handleChange('facebook', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                placeholder="https://facebook.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Twitter / X URL</label>
              <input
                type="text"
                value={contact.twitter || ''}
                onChange={(e) => handleChange('twitter', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                placeholder="https://twitter.com/..."
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-2">Instagram URL</label>
              <input
                type="text"
                value={contact.instagram || ''}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:bg-white focus:border-[#132247] focus:outline-none transition-all duration-300"
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-xl bg-[#132247] hover:bg-[#1e3264] px-8 py-3.5 text-sm font-bold text-white shadow-md hover:scale-105 active:scale-95 disabled:opacity-60 transition-all duration-300 cursor-pointer"
          >
            {saving ? 'Saving Settings...' : 'Save All Settings'}
          </button>
        </div>
      </form>

      {/* Asset Uploads Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Picture Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Hero Profile Picture
          </h3>

          {contact.picture ? (
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
              <img
                src={getUploadUrl(contact.picture)}
                alt="Profile Preview"
                className="h-20 w-20 rounded-xl object-cover border border-slate-200 shadow-xs"
              />
              <div className="flex-1">
                <p className="text-xs text-slate-600 mb-1 font-semibold">Active hero profile image</p>
                <a
                  href={getUploadUrl(contact.picture)}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-600 hover:underline text-xs font-bold inline-block"
                >
                  View full image &rarr;
                </a>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
              Using default profile image. Upload a custom image below.
            </p>
          )}

          <div className="space-y-3">
            <label className="block w-full">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Select New Image File</span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPictureFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-[#132247] hover:file:text-white transition-all cursor-pointer"
              />
            </label>
            <button
              type="button"
              onClick={handleUploadPicture}
              disabled={uploadingPicture}
              className="w-full inline-flex items-center justify-center rounded-xl bg-[#132247] hover:bg-[#1e3264] px-4 py-3 text-xs font-bold text-white transition-all duration-300 disabled:opacity-60 cursor-pointer"
            >
              {uploadingPicture ? 'Uploading Image...' : 'Upload Profile Picture'}
            </button>
          </div>
        </div>

        {/* Resume PDF Card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Resume PDF File
          </h3>

          {contact.resume ? (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-1">
              <p className="text-xs text-slate-600 font-semibold">Active CV download document</p>
              <a
                href={getUploadUrl(contact.resume)}
                download
                target="_blank"
                rel="noreferrer"
                className="text-sky-600 hover:underline text-xs font-bold inline-block"
              >
                Download active PDF &rarr;
              </a>
            </div>
          ) : (
            <p className="text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
              Using default resume file. Upload a new PDF below.
            </p>
          )}

          <div className="space-y-3">
            <label className="block w-full">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block mb-1">Select PDF File</span>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-slate-100 file:text-slate-800 hover:file:bg-[#132247] hover:file:text-white transition-all cursor-pointer"
              />
            </label>
            <button
              type="button"
              onClick={handleUploadResume}
              disabled={uploadingResume}
              className="w-full inline-flex items-center justify-center rounded-xl bg-[#132247] hover:bg-[#1e3264] px-4 py-3 text-xs font-bold text-white transition-all duration-300 disabled:opacity-60 cursor-pointer"
            >
              {uploadingResume ? 'Uploading Resume...' : 'Upload Resume PDF'}
            </button>
          </div>
        </div>
      </div>

      {/* Skills Showcase Pictures Section (Download CV Side Images) */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-bold text-slate-900">Download CV Section Side Pictures (3 Showcase Images)</h3>
          </div>
          <span className="text-xs font-semibold text-slate-500">Appears next to the "Download CV" button</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Image 1 (Top Wide) */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Image 1 (Top Banner)</span>
              {contact.skillsImage1 ? (
                <img
                  src={getUploadUrl(contact.skillsImage1)}
                  alt="Skills Showcase 1"
                  className="h-28 w-full object-cover rounded-lg border border-slate-200 mb-2"
                />
              ) : (
                <div className="h-28 w-full bg-slate-200/60 rounded-lg flex items-center justify-center text-xs text-slate-500 mb-2">
                  Default Banner
                </div>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSkillsFile1(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white file:text-slate-800 hover:file:bg-[#132247] hover:file:text-white transition-all cursor-pointer"
              />
              <button
                type="button"
                onClick={() => handleUploadSkillsImage(1, skillsFile1, setSkillsFile1)}
                disabled={uploadingSkillsImg[1]}
                className="w-full inline-flex items-center justify-center rounded-lg bg-[#132247] hover:bg-[#1e3264] py-2 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-60"
              >
                {uploadingSkillsImg[1] ? 'Uploading...' : 'Upload Image 1'}
              </button>
            </div>
          </div>

          {/* Image 2 (Bottom Left) */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Image 2 (Bottom Left)</span>
              {contact.skillsImage2 ? (
                <img
                  src={getUploadUrl(contact.skillsImage2)}
                  alt="Skills Showcase 2"
                  className="h-28 w-full object-cover rounded-lg border border-slate-200 mb-2"
                />
              ) : (
                <div className="h-28 w-full bg-slate-200/60 rounded-lg flex items-center justify-center text-xs text-slate-500 mb-2">
                  Default Mockup 1
                </div>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSkillsFile2(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white file:text-slate-800 hover:file:bg-[#132247] hover:file:text-white transition-all cursor-pointer"
              />
              <button
                type="button"
                onClick={() => handleUploadSkillsImage(2, skillsFile2, setSkillsFile2)}
                disabled={uploadingSkillsImg[2]}
                className="w-full inline-flex items-center justify-center rounded-lg bg-[#132247] hover:bg-[#1e3264] py-2 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-60"
              >
                {uploadingSkillsImg[2] ? 'Uploading...' : 'Upload Image 2'}
              </button>
            </div>
          </div>

          {/* Image 3 (Bottom Right) */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">Image 3 (Bottom Right)</span>
              {contact.skillsImage3 ? (
                <img
                  src={getUploadUrl(contact.skillsImage3)}
                  alt="Skills Showcase 3"
                  className="h-28 w-full object-cover rounded-lg border border-slate-200 mb-2"
                />
              ) : (
                <div className="h-28 w-full bg-slate-200/60 rounded-lg flex items-center justify-center text-xs text-slate-500 mb-2">
                  Default Mockup 2
                </div>
              )}
            </div>
            <div className="space-y-2">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setSkillsFile3(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-600 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-white file:text-slate-800 hover:file:bg-[#132247] hover:file:text-white transition-all cursor-pointer"
              />
              <button
                type="button"
                onClick={() => handleUploadSkillsImage(3, skillsFile3, setSkillsFile3)}
                disabled={uploadingSkillsImg[3]}
                className="w-full inline-flex items-center justify-center rounded-lg bg-[#132247] hover:bg-[#1e3264] py-2 text-xs font-bold text-white transition-all cursor-pointer disabled:opacity-60"
              >
                {uploadingSkillsImg[3] ? 'Uploading...' : 'Upload Image 3'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
