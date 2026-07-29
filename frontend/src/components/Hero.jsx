import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import profileImage from '../assets/handsome.jpg'
import { API_BASE_URL, getUploadUrl } from '../config/api.js'

const Hero = () => {
    const [heroImage, setHeroImage] = useState(profileImage)
    const [heroName, setHeroName] = useState('Khairullah')
    const [heroBio, setHeroBio] = useState('Passionate developer crafting modern, high-performance web applications.')

    useEffect(() => {
        fetch(`${API_BASE_URL}/contact`)
            .then(async (res) => {
                if (!res.ok) throw new Error('Unable to load hero data')
                return res.json()
            })
            .then((data) => {
                if (data?.picture) {
                    setHeroImage(getUploadUrl(data.picture))
                }
                if (data?.heroName) {
                    setHeroName(data.heroName)
                }
                if (data?.heroBio) {
                    setHeroBio(data.heroBio)
                }
            })
            .catch(() => {
                setHeroImage(profileImage)
            })
    }, [])

    return (
        <section id="Home" className="relative min-h-[600px] sm:min-h-[700px] bg-[#132247] flex flex-col justify-between overflow-hidden">

            {/* Header / Navbar container */}
            <div className="relative w-full h-20 z-30">
                <Navbar />
            </div>

            {/* Main content grid */}
            <div className="relative z-20 mx-auto grid max-w-7xl grid-cols-1 items-center px-6 pb-32 pt-16 md:grid-cols-2 md:gap-10 md:pb-40 md:pt-24 w-full">
                <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start">
                    <h1 className="mb-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl leading-tight">
                        {heroName}
                    </h1>
                    <p className="mb-8 max-w-lg text-base sm:text-lg leading-relaxed text-slate-300">
                        {heroBio}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start items-center gap-4">
                        <a
                            href="#Contact"
                            className="rounded-full bg-white px-8 py-3.5 font-bold text-slate-900 shadow-md transition-all duration-300 hover:bg-slate-100 hover:scale-105 active:scale-95"
                        >
                            Contact
                        </a>
                    </div>
                </div>

                <div className="relative flex justify-center md:justify-end mt-10 md:mt-0 z-0">
                    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md">
                        <img
                            src={heroImage}
                            alt="Khairullah"
                            className="mx-auto w-full max-h-[400px] md:max-h-[500px] object-cover rounded-t-2xl drop-shadow-[0_20px_35px_rgba(0,0,0,0.3)]"
                        />
                    </div>
                </div>
            </div>

            {/* SVG Wave Graphic at the Bottom */}
            <div className="absolute  bottom-0 left-0 w-full overflow-hidden leading-[0] z-10 pointer-events-none">
                <svg
                    viewBox="0 0 1440 220"
                    preserveAspectRatio="none"
                    className="relative  block w-full h-[60px] sm:h-[100px] md:h-[160px] fill-white"
                >
                    <path d="M0,120 C360,260 720,20 1080,100 C1260,140 1380,80 1440,60 L1440,220 L0,220 Z" />
                </svg>
            </div>
        </section>
    )
}

export default Hero
