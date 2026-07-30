import { useEffect, useState } from 'react'
import { API_BASE_URL } from '../config/api.js'

const fallbackStats = [
  { title: '+10 ans', subtitle: 'experience' },
  { title: '+1.3K', subtitle: 'Client' },
  { title: '+74', subtitle: 'Completed projects' },
  { title: '+1.5k', subtitle: 'Services' },
]

const Experience = () => {
  const [stats, setStats] = useState(fallbackStats);
  const [experienceBio, setExperienceBio] = useState('');

  useEffect(() => {
    fetch(`${API_BASE_URL}/experience`)
      .then((res) => {
        if (!res.ok) throw new Error('API server returned error');
        return res.json();
      })
      .then((data) => {
        if (data && data.length > 0) {
          const formatted = data.map((item) => ({
            title: item.title,
            subtitle: item.subtitle,
          }));
          setStats(formatted);
        }
      })
      .catch((err) => {
        console.warn('Backend API not available, using local fallback stats:', err.message);
      });

    fetch(`${API_BASE_URL}/contact`)
      .then(async (res) => {
        if (!res.ok) return;
        const data = await res.json();
        if (data?.experienceBio) setExperienceBio(data.experienceBio);
      })
      .catch(() => { });
  }, []);
  return (
    <section id="Experience" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">Experience</h2>
        <p className="mx-auto mt-4 max-w-4xl text-base leading-relaxed text-slate-500">
          {experienceBio}
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <article
              key={stat.title}
              className="flex flex-col items-center justify-center rounded-xl border border-blue-100/60 bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(59,130,246,0.06)] hover:-translate-y-0.5"
            >
              <p className="text-3xl font-extrabold text-slate-900">{stat.title}</p>
              <p className="mt-2 text-sm text-slate-400 font-medium">{stat.subtitle}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Experience
