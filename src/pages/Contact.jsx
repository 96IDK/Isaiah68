export default function Contact() {
  return (
    <section className="section">
      <div className="section-head contact-head">
        <h2>Contact</h2>
        <p>Let’s connect. I’m quick to respond.</p>
      </div>

      <div className="contact-stack">
        <a className="contact-card stack-one" href="mailto:id.kangalee@gmail.com">
          <span className="contact-icon" aria-hidden="true">✉️</span>
          <span className="contact-label">Email</span>
          <span className="contact-value">id.kangalee@gmail.com</span>
          <span className="contact-cta">Send an email →</span>
        </a>

        <a className="contact-card stack-two" href="tel:4704220503">
          <span className="contact-icon" aria-hidden="true">📱</span>
          <span className="contact-label">Phone</span>
          <span className="contact-value">(470) 422-0503</span>
          <span className="contact-cta">Call or text →</span>
        </a>

        <a
          className="contact-card stack-three"
          href="https://www.linkedin.com/in/isaiah-kangalee-ab466b21a/"
          target="_blank"
          rel="noreferrer"
        >
          <span className="contact-icon" aria-hidden="true">💼</span>
          <span className="contact-label">LinkedIn</span>
          <span className="contact-value">isaiah-kangalee</span>
          <span className="contact-cta">View profile →</span>
        </a>

        <a
          className="contact-card stack-four"
          href="https://github.com/96IDK"
          target="_blank"
          rel="noreferrer"
        >
          <span className="contact-icon" aria-hidden="true">
            <svg viewBox="0 0 16 16" width="28" height="28" fill="currentColor" aria-hidden="true">
              <path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.65 7.65 0 0 1 2-.27c.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8Z"/>
            </svg>
          </span>
          <span className="contact-label">GitHub</span>
          <span className="contact-value">96IDK</span>
          <span className="contact-cta">View profile →</span>
        </a>
      </div>
    </section>
  )
}
