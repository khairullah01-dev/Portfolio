
const Navbar = () => {
    const Navlinks = [
        {id:1 , name:'Home', link:'#Home'},
        {id:3 , name:'Skills', link:'#Skills'},
        {id:4 , name:'Experience', link:'#Experience'},
        {id:5 , name:'My projects', link:'#Projects'},
        {id:6 , name:'Contact', link:'#Contact'},
    ]

    return (
        <header className="absolute top-0 left-0 w-full z-20">
            <div className="mx-auto max-w-7xl flex w-full items-center justify-between px-6 py-4">
                
                <a href="#Home" className="text-xl font-bold text-white transition-all duration-300 hover:text-white/80">
                    Portfolio
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-white/80 font-medium">
                    {/* Removed .slice(0, 4) since you want to map all items in the array anyway */}
                    {Navlinks.map((link) => (
                        <a key={link.id} href={link.link} className="transition-all duration-300 hover:text-white">
                            {link.name}
                        </a>
                    ))}
                    <a
                        href="#Contact"
                        className="rounded-full bg-white px-5 py-2 font-semibold text-slate-900 transition-all duration-300 hover:bg-slate-100"
                    >
                        Contact
                    </a>
                </nav>

                {/* Mobile Contact Button (Shows only on mobile instead of full menu) */}
                <a
                    href="#Contact"
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 transition-all duration-300 hover:bg-slate-100 md:hidden"
                >
                    Contact
                </a>
            </div>
        </header>
    )
}

export default Navbar
