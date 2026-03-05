import { Link } from 'react-router-dom'

const base = import.meta.env.BASE_URL;

const projects = [
  {
    title: 'Tic Tac Toe',
    description: 'Play the classic game with clean logic and smooth UI.',
    image: `${base}images/tic-tac-toe.jpeg`,
    link: '/projects/tic-tac-toe',
  },
  {
    title: 'Weather App',
    description: 'Search a city and view current weather instantly.',
    image: `${base}images/weather-app.jpeg`,
    link: '/projects/weather',
  },
  {
    title: 'Calculator',
    description: 'Minimalist calculator with keyboard support.',
    image: `${base}images/calculator.jpeg`,
    link: '/projects/calculator',
  },
]

export default function Projects() {
  return (
    <section className="section">
      <div className="section-head projects-head">
        <h2>Projects</h2>
        <p>Click a project to try it live.</p>
      </div>
      <div className="grid">
        {projects.map((project) => (
          <article key={project.title} className="card">
            <div className="image-wrap">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="card-body">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <Link className="button" to={project.link}>
                Open
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
