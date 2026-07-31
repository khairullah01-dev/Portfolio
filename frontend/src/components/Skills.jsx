import { useEffect, useState } from 'react'
import projectFrontend from '../assets/project_frontend.png'
import projectEcommerce1 from '../assets/project_ecommerce_1.png'
import projectEcommerce2 from '../assets/project_ecommerce_2.png'
import { API_BASE_URL, getUploadUrl } from '../config/api.js'

const Skills = () => {
  const [skillsTitle, setSkillsTitle] = useState('')
  const [skillsBio, setSkillsBio] = useState('')
  const [resumeUrl, setResumeUrl] = useState('/resume.pdf')
  const [img1, setImg1] = useState(projectFrontend)
  const [img2, setImg2] = useState(projectEcommerce1)
  const [img3, setImg3] = useState(projectEcommerce2)

  const handleDownloadResume = async () => {
    const targetUrl = resumeUrl || '/resume.pdf'

    try {
      const response = await fetch(targetUrl)
      if (!response.ok) throw new Error('Resume not available')

      const blob = await response.blob()
      const blobUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = 'resume.pdf'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(blobUrl)
      return
    } catch (_error) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer')
    }
  }

  useEffect(() => {
    fetch(`${API_BASE_URL}/contact`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Unable to load skills settings')
        return res.json()
      })
      .then((data) => {
        if (data?.skillsTitle) setSkillsTitle(data.skillsTitle)
        if (data?.skillsBio) setSkillsBio(data.skillsBio)
        if (data?.resume) setResumeUrl(getUploadUrl(data.resume))
        if (data?.skillsImage1) setImg1(getUploadUrl(data.skillsImage1))
        if (data?.skillsImage2) setImg2(getUploadUrl(data.skillsImage2))
        if (data?.skillsImage3) setImg3(getUploadUrl(data.skillsImage3))
      })
      .catch(() => { })
  }, [])

  return (
    <section id="Skills" className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 items-start">

          {/* Left Column - Details */}
          <div className="lg:col-span-5 flex flex-col items-start">
            <span className="text-sm font-semibold uppercase tracking-wider text-sky-500">
              Skills
            </span>
            <h2 className="mt-2 mb-6 text-3xl font-extrabold text-slate-900 sm:text-4xl">
              {skillsTitle}
            </h2>
            <button
              type="button"
              onClick={handleDownloadResume}
              className="inline-flex rounded-full bg-[#132247] px-6 py-3 font-semibold text-white transition-all duration-300 hover:bg-[#1e3264] hover:shadow-md hover:scale-105 active:scale-95"
            >
              Download CV
            </button>
            <p className="mt-8 text-base leading-relaxed text-slate-600">
              {skillsBio}
            </p>
          </div>

          {/* Right Column - Work Layout Showcase */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            {/* Top wide layout */}
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-md hover:shadow-lg transition-shadow duration-300">
              <img
                src={img1}
                alt="Front-end development layout"
                loading="lazy"
                width="800"
                height="500"
                className="w-full h-auto max-h-72 object-cover rounded-lg"
                onError={(e) => { e.target.src = projectFrontend }}
              />
            </div>

            {/* Bottom side-by-side layouts */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src={img2}
                  alt="Project mockup 1"
                  loading="lazy"
                  width="400"
                  height="300"
                  className="w-full h-auto max-h-56 object-cover rounded-lg"
                  onError={(e) => { e.target.src = projectEcommerce1 }}
                />
              </div>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-md hover:shadow-lg transition-shadow duration-300">
                <img
                  src={img3}
                  alt="Project mockup 2"
                  loading="lazy"
                  width="400"
                  height="300"
                  className="w-full h-auto max-h-56 object-cover rounded-lg"
                  onError={(e) => { e.target.src = projectEcommerce2 }}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Skills
