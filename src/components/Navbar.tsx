import { Link, useLocation } from 'react-router'
import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function Navbar() {
    const location = useLocation()
    const [darkMode, setDarkMode] = useState(true)

    // Cambia clases al <html> para aplicar modo dark/light
    useEffect(() => {
        const html = document.documentElement
        if (darkMode) {
            html.classList.add('dark')
        } else {
            html.classList.remove('dark')
        }
    }, [darkMode])

    const isActive = (path: string) =>
        location.pathname === path
            ? 'text-secondary dark:text-secondary-dark border-b-2 border-blue-400'
            : 'text-text dark:text-text-dark hover:text-primary dark:hover:text-primary-dark'

    return (
        <nav className="bg-light-contrast dark:bg-dark-contrast text-text dark:text-text-dark px-6 py-4 shadow flex items-center justify-between">
            <div className="text-xl font-bold text-accent dark:text-accent-dark">
                Reporte JSON Builder
            </div>

            <div className="flex items-center space-x-6">
                <Link to="/" className={isActive('/')}>
                    Inicio
                </Link>
                <Link to="/configurar-reporte" className={isActive('/configurar-reporte')}>
                    Configurar
                </Link>

                <button
                    onClick={() => setDarkMode((prev) => !prev)}
                    className="p-2 rounded hover:bg-[#2c2c40] transition"
                    title="Cambiar modo"
                >
                    {darkMode ? (
                        <Sun className="w-5 h-5 text-yellow-400" />
                    ) : (
                        <Moon className="w-5 h-5 text-blue-500" />
                    )}
                </button>
            </div>
        </nav>
    )
}
