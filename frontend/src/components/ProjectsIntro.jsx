import { useEffect, useState } from 'react'
import projectFrontend from '../assets/project_frontend.png'
import projectEcommerce1 from '../assets/project_ecommerce_1.png'
import projectEcommerce2 from '../assets/project_ecommerce_2.png'
import { API_BASE_URL, getUploadUrl } from '../config/api.js'

const fallbackProjects = [
  {
    id: 1,
    title: 'Portfolio',
    image: projectFrontend,
    link: '#',
  },
  {
    id: 2,
    title: 'site web ecommerce',
    image: projectEcommerce1,
    link: '#',
  },
  {
    id: 3,
    title: 'site web ecommerce',
    image: projectEcommerce2,
    link: '#',
  },
]

const ProjectsIntro = () => {
  const [projects, setProjects] = useState(fallbackProjects);
  const [projectsBio, setProjectsBio] = useState('Explore a selection of recent web applications and projects built with cutting-edge technologies.');

  useEffect(() => {
    const fetchProjectsData = () => {
      fetch(`${API_BASE_URL}/projects`)
        .then((res) => {
          if (!res.ok) throw new Error('API server returned error');
          return res.json();
        })
        .then((data) => {
          if (data && data.length > 0) {
            const formatted = data.map((proj) => ({
              id: proj._id,
              title: proj.title,
              image: getUploadUrl(proj.image),
              link: proj.link || '#',
            }));
            setProjects(formatted);
          }
        })
        .catch((err) => {
          console.warn('Backend API not available, using local fallback data:', err.message);
        });

      fetch(`${API_BASE_URL}/contact`)
        .then(async (res) => {
          if (!res.ok) return;
          const data = await res.json();
          if (data?.projectsBio) setProjectsBio(data.projectsBio);
        })
        .catch(() => {});
    };

    fetchProjectsData();
    const intervalId = setInterval(fetchProjectsData, 3000);
    window.addEventListener('focus', fetchProjectsData);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', fetchProjectsData);
    };
  }, []);
  return (
    <section id="Projects" className="bg-[#132247] px-6 py-24 text-white">
      <div className="mx-auto max-w-7xl">
        
        {/* Header Grid */}
        <div className="grid grid-cols-1 gap-8 items-start lg:grid-cols-12 mb-16">
          <div className="lg:col-span-4 flex flex-col items-start">
            <h2 className="text-3xl font-extrabold sm:text-4xl">My projects</h2>
            <a
              href="#Projects"
              className="mt-6 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-slate-900 transition-all duration-300 hover:bg-slate-100 hover:scale-105 active:scale-95"
            >
              View all
            </a>
          </div>
          <div className="lg:col-span-8">
            <p className="text-base leading-relaxed text-slate-300">
              {projectsBio}
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <article key={project.id} className="group flex flex-col">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-800/40 p-1.5 transition-all duration-300 group-hover:border-white/20 group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)]">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-auto object-cover rounded-lg transition-transform duration-500 group-hover:scale-[1.01]"
                />
              </div>
              <h3 className="mt-4 text-lg font-bold text-white tracking-wide">
                {project.title}
              </h3>
              <a
                href={project.link}
                className="mt-1 inline-flex text-sm text-sky-400 font-medium hover:underline hover:text-sky-300 transition-all duration-300"
              >
                Fullscreen
              </a>
            </article>
          ))}
        </div>

      </div>
    </section>
  )
}

export default ProjectsIntro
