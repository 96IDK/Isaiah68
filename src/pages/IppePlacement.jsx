import { Link } from 'react-router-dom'

// Images live in /public/images, so they need the site's base path (/Isaiah68/)
const base = import.meta.env.BASE_URL

// Quick facts shown in the stat strip at the top of the page
const stats = [
  { value: '~150', label: 'students placed each semester' },
  { value: 'Spring 2027', label: 'first semester placed with the app' },
  { value: '80+', label: 'automated tests' },
]

// What the app does, one card per feature
const features = [
  {
    title: 'Upload two spreadsheets',
    text: 'Staff drop in the student survey export and the preceptor availability report. The app detects which column is which, even when the export format changes, and remembers layouts it has seen before.',
  },
  {
    title: 'Match by real drive time',
    text: 'Every student is matched to the nearest open site in their preferred region using real road drive times, not straight-line distance. Contested sites go to the closest student.',
  },
  {
    title: 'Explain every exception',
    text: 'Students who can’t be auto-placed are labeled as a data issue (like a missing zip) or a true site shortage, so staff know whether to fix the data or recruit a new site.',
  },
  {
    title: 'Review, swap, export',
    text: 'Staff approve, override or undo each placement, preview a swap between two students before confirming it, and export the final list to Excel.',
  },
]

// Tech used, shown as pills
const stack = ['Python', 'Flask', 'pandas', 'OpenRouteService API', 'pgeocode', 'Jinja', 'JavaScript', 'pytest', 'Git + SSH deploys']

export default function IppePlacement() {
  return (
    <section className="section case-study">
      <Link className="back-link" to="/projects">← All projects</Link>

      {/* Header: what it is and who it's for */}
      <div className="case-hero">
        <span className="case-tag">In production · UGA College of Pharmacy</span>
        <h2>IPPE Placement App</h2>
        <p className="case-lede">
          An internal web app that matches pharmacy students to community rotation sites across Georgia,
          replacing a manual spreadsheet process for the college’s experiential education team.
        </p>
      </div>

      <div className="case-stats">
        {stats.map((s) => (
          <div key={s.label} className="case-stat">
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      <figure className="case-shot">
        <img src={`${base}images/ippe-dashboard.jpeg`} alt="IPPE Placement App review dashboard with placement totals and region supply table" />
        <figcaption>Review dashboard after a matching run. Shown with made-up demo students.</figcaption>
      </figure>

      {/* The story: problem → approach */}
      <div className="case-columns">
        <div>
          <h3>The problem</h3>
          <p>
            Every semester, staff placed roughly 150 students at community pharmacies by hand, cross-checking
            survey answers against a list of available preceptors and estimating drive times one student at a time.
          </p>
        </div>
        <div>
          <h3>My role</h3>
          <p>
            I built it solo, from gathering requirements with the stakeholder to designing the matching rules,
            writing the code and tests, deploying it to university hosting, and training staff to use it.
          </p>
        </div>
      </div>

      <h3 className="case-subhead">What it does</h3>
      <div className="case-features">
        {features.map((f, i) => (
          <article key={f.title} className="case-feature">
            <span className="case-step">{String(i + 1).padStart(2, '0')}</span>
            <h4>{f.title}</h4>
            <p>{f.text}</p>
          </article>
        ))}
      </div>

      <figure className="case-shot">
        <img src={`${base}images/ippe-swap.jpeg`} alt="Site picker showing closer sites held by other students and a swap preview" />
        <figcaption>Fixing a missing zip, then previewing a swap. Nothing changes until staff confirm.</figcaption>
      </figure>

      <div className="case-columns">
        <div>
          <h3>Challenges I solved</h3>
          <ul className="case-list">
            <li>Real survey exports changed format between semesters, so I built column detection that adapts instead of breaking.</li>
            <li>The routing API allows 500 requests a day, so I batched calls and cached drive times so reruns cost nothing.</li>
            <li>Testing showed some regions simply don’t have enough sites. The app now reports that supply gap instead of hiding it.</li>
          </ul>
        </div>
        <div>
          <h3>Built with</h3>
          <div className="pill-row">
            {stack.map((t) => (
              <span key={t} className="pill">{t}</span>
            ))}
          </div>
          <h3 className="case-next">Next up</h3>
          <p>Google Maps integration and a pharmacy finder to help recruit new sites where supply is short.</p>
        </div>
      </div>

      <p className="case-note">
        This is an internal university tool with student data, so there’s no public demo or source code.
        Screenshots use made-up students and pharmacies.
      </p>
    </section>
  )
}
