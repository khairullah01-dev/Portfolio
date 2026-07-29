import Hero from './Hero.jsx'
import Skills from './Skills.jsx'
import Experience from './Experience.jsx'
import ProjectsIntro from './ProjectsIntro.jsx'
import Contact from './Contact.jsx'
import Footer from './Footer.jsx'

export default function PublicSite() {
  return (
    <div className="font-sans bg-white">
      <Hero />
      <Skills />
      <Experience />
      <ProjectsIntro />
      <Contact />
      <Footer />
    </div>
  )
}
