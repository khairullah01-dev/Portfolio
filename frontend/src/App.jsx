import Hero from './components/Hero.jsx'
import Skills from './components/Skills.jsx'
import Experience from './components/Experience.jsx'
import ProjectsIntro from './components/ProjectsIntro.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'


const App = () => {
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

export default App
