import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import './App.css'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import TicTacToe from './pages/TicTacToe'
import Weather from './pages/Weather'
import Calculator from './pages/Calculator'

function App() {
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved) setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
    document.body.classList.remove('theme-flash')
    // restart animation
    void document.body.offsetWidth
    document.body.classList.add('theme-flash')
    setTimeout(() => document.body.classList.remove('theme-flash'), 700)
  }

  const themeLabel = useMemo(
    () => (theme === 'dark' ? 'Switch to light' : 'Switch to dark'),
    [theme]
  )

  return (
    <BrowserRouter>
      <div className="page">
        <header className="header header-centered">
          <div className="header-copy">
            <h1 className="title">Showcasing my skills</h1>
            <p className="subtitle">
              Minimalist, playful, and focused on what matters: clean UI and solid code.
            </p>
          </div>
          <div className="header-actions">
            <nav className="nav">
              <Link to="/">About</Link>
              <Link to="/projects">Projects</Link>
              <Link to="/contact">Contact</Link>
            </nav>
            <button
              type="button"
              className={`mode-slider ${theme === 'light' ? 'is-light' : ''}`}
              onClick={toggleTheme}
              aria-label={themeLabel}
            >
              <span className="mode-thumb" aria-hidden="true" />
            </button>
          </div>
        </header>

        <main className="content">
          <Routes>
            <Route path="/" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/projects/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/projects/weather" element={<Weather />} />
            <Route path="/projects/calculator" element={<Calculator />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  )
}

export default App
