import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config/api.js'

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contactDetails, setContactDetails] = useState({
    phone: '+99 999999999',
    email: 'myemail@eamil.com',
    linkedin: 'mylinkedin',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/contact`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Unable to load contact details');
        return res.json();
      })
      .then((data) => {
        if (data) {
          setContactDetails({
            phone: data.phone || '+99 999999999',
            email: data.email || 'myemail@eamil.com',
            linkedin: data.linkedin || 'mylinkedin',
          });
        }
      })
      .catch((err) => {
        console.warn('Contact details load failed:', err.message);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, subject, message }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Something went wrong');
        setSuccess('Your message has been sent successfully!');
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
      })
      .catch((err) => {
        setError(err.message || 'Could not connect to server.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <section id="Contact" className="bg-slate-50 px-6 py-24 text-slate-800">
      <div className="mx-auto max-w-7xl">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl text-center">Contact Me</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-500 text-center">
          Have an exciting project or want to collaborate? Send me a message, and I'll get back to you shortly!
        </p>

        <div className="mt-16 grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">
          {/* Contact Details */}
          <div className="lg:col-span-5 flex flex-col gap-8 justify-center lg:py-8">
            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 hover:scale-[1.02] hover:shadow-md transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-500">
                  <svg className="w-6 h-6 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.387a12.035 12.035 0 0 1-7.108-7.108c-.157-.44.009-.927.387-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Phone</span>
                  <a
                    href={`tel:${contactDetails.phone}`}
                    className="text-base font-extrabold text-slate-800 mt-0.5 inline-block hover:text-sky-600"
                  >
                    {contactDetails.phone}
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 hover:scale-[1.02] hover:shadow-md transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                  <svg className="w-6 h-6 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Email</span>
                  <a
                    href={`mailto:${contactDetails.email}`}
                    className="text-base font-extrabold text-slate-800 mt-0.5 inline-block hover:text-sky-600"
                  >
                    {contactDetails.email}
                  </a>
                </div>
              </div>

              {/* LinkedIn */}
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 hover:scale-[1.02] hover:shadow-md transition-all duration-300">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                  <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
                <div>
                  <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">LinkedIn</span>
                  <a
                    href={contactDetails.linkedin || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-extrabold text-slate-800 mt-0.5 inline-block hover:text-sky-600"
                  >
                    {contactDetails.linkedin || 'LinkedIn Profile'}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_10px_40px_rgba(0,0,0,0.03)] w-full">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Send Message</h3>

            {success && (
              <div className="mb-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-600">
                {success}
              </div>
            )}

            {error && (
              <div className="mb-6 rounded-xl bg-rose-500/10 border border-rose-500/20 p-4 text-sm text-rose-600">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-450 focus:bg-white focus:border-sky-500 focus:outline-none transition-all duration-300"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-450 focus:bg-white focus:border-sky-500 focus:outline-none transition-all duration-300"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Subject</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-450 focus:bg-white focus:border-sky-500 focus:outline-none transition-all duration-300"
                  placeholder="Inquiry / Feedback / Hello"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Message</label>
                <textarea
                  required
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 placeholder-slate-450 focus:bg-white focus:border-sky-500 focus:outline-none transition-all duration-300"
                  placeholder="Write your message here..."
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto inline-flex justify-center rounded-xl bg-[#132247] px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:bg-[#1e3264] hover:shadow-lg focus:outline-none disabled:opacity-50 cursor-pointer"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
