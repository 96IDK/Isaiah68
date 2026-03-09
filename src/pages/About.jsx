import { useEffect, useState } from 'react'
import mePhoto from '../assets/me.jpeg'

const ABOUT_TEXT =
  'I am a self-motivated Help Desk Technician and Developer with a passion for bridging the gap between complex technical systems and seamless user experiences. With a solid foundation in Computer Science from Valdosta State University and a CompTIA A+ certification, I have cultivated a diverse skill set ranging from hands-on PC hardware optimization honed through building custom gaming rigs and Plex home labs to providing enterprise-level support for organizations like GE and the University of Georgia. My expertise spans cross-platform troubleshooting in Windows and macOS, asset management via ServiceNow, and a growing proficiency in full-stack development languages including SQL, Java, and JavaScript. I am driven by the belief that technology should be a tool for positive impact, and I am committed to delivering proactive, secure, and efficient technical solutions in every project I undertake.'

export default function About() {
  const [typedAbout, setTypedAbout] = useState('')

  useEffect(() => {
    setTypedAbout('')

    const fullText = `${ABOUT_TEXT} ${'Let’s build something that matters.'}`
    let i = 0
    const speed = 86

    const tick = () => {
      if (i <= fullText.length) {
        setTypedAbout(fullText.slice(0, i))
        i += 1
        setTimeout(tick, speed)
      }
    }

    tick()
  }, [])

  return (
    <section className="section">
      <div className="section-head">
        <h2>About Me</h2>
      </div>

      <div className="about-grid">
        <div className="about-photo">
          <img src={mePhoto} alt="Portrait" />
        </div>

        <div className="about-copy">
          <p className="typing-paragraph">
            <span className="typing-cursor">{typedAbout}</span>
          </p>

          <div className="callout">
            <strong>Focus areas:</strong>
            <ul>
              <li>Cross-platform troubleshooting (Windows/macOS)</li>
              <li>Hardware optimization + home lab builds</li>
              <li>ServiceNow asset management</li>
              <li>Full-stack foundations (SQL, Java, JavaScript)</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
