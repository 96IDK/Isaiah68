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
      </div>
    </section>
  )
}
