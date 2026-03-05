import { useState } from 'react'

const standardKeys = [
  '7',
  '8',
  '9',
  '÷',
  '4',
  '5',
  '6',
  '×',
  '1',
  '2',
  '3',
  '-',
  '0',
  '.',
  '=',
  '+',
]

const scientificKeys = [
  'sin',
  'cos',
  'tan',
  'ln',
  'log',
  '√',
  'π',
  'e',
  '^',
  '(',
  ')',
]

export default function Calculator() {
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState('')
  const [isScientific, setIsScientific] = useState(false)
  const [workSteps, setWorkSteps] = useState([])

  const normalizeExpression = (raw) => {
    return raw
      .replaceAll('×', '*')
      .replaceAll('÷', '/')
      .replaceAll('√', 'Math.sqrt')
      .replaceAll('sin', 'Math.sin')
      .replaceAll('cos', 'Math.cos')
      .replaceAll('tan', 'Math.tan')
      .replaceAll('ln', 'Math.log')
      .replaceAll('log', 'Math.log10')
      .replaceAll('π', 'Math.PI')
      .replaceAll('e', 'Math.E')
      .replaceAll('^', '**')
  }

  const append = (value) => {
    if (value === '=') {
      try {
        const normalized = normalizeExpression(expression)
        const next = Function(`"use strict"; return (${normalized})`)()
        setResult(String(next))
        setWorkSteps((prev) => [...prev, `= ${next}`])
      } catch {
        setResult('Error')
        setWorkSteps((prev) => [...prev, 'Error'])
      }
      return
    }

    if (['sin', 'cos', 'tan', 'ln', 'log', '√'].includes(value)) {
      const nextExpression = `${expression}${value}(`
      setExpression(nextExpression)
      setWorkSteps((prev) => [...prev, nextExpression])
      return
    }

    const nextExpression = `${expression}${value}`
    setExpression(nextExpression)
    setWorkSteps((prev) => [...prev, nextExpression])
  }

  const clear = () => {
    setExpression('')
    setResult('')
    setWorkSteps([])
  }

  const backspace = () => {
    const nextExpression = expression.slice(0, -1)
    setExpression(nextExpression)
    if (nextExpression) {
      setWorkSteps((prev) => [...prev, nextExpression])
    }
  }

  const visibleKeys = isScientific
    ? [...scientificKeys, ...standardKeys]
    : standardKeys

  return (
    <section className="section calculator-section">
      <div className="calculator-head">
        <h2>Calculator</h2>
        <div className="calculator-toggle">
          <span className="muted">Scientific</span>
          <label className="switch">
            <input
              type="checkbox"
              onChange={() => setIsScientific((prev) => !prev)}
              checked={isScientific}
              aria-label="Toggle scientific mode"
            />
            <span className="slider" />
          </label>
        </div>
      </div>
      <p>Type or click to calculate.</p>
      <div className="calculator-layout">
        <div className={`calculator ${isScientific ? 'calculator-scientific' : ''}`}>
        <div className="calculator-display">
          <span className="muted">{expression || '0'}</span>
          <strong>{result}</strong>
        </div>
        <div className="calculator-actions">
          <button className="button ghost" onClick={clear}>
            Clear
          </button>
          <button className="button ghost" onClick={backspace}>
            Delete
          </button>
        </div>
        <div className="calculator-grid">
          {visibleKeys.map((key) => (
            <button
              key={key}
              className={`calc-key ${key === '=' ? 'equals' : ''}`}
              onClick={() => append(key)}
            >
              {key}
            </button>
          ))}
        </div>
        </div>

        <aside className="work-card">
          <h3>Work shown</h3>
          <p className="muted">Every step appears here.</p>
          {workSteps.length === 0 ? (
            <p className="muted">Start calculating to see steps.</p>
          ) : (
            <ul className="work-list">
              {workSteps.map((step, index) => (
                <li key={`${step}-${index}`}>{step}</li>
              ))}
            </ul>
          )}
        </aside>

        <details className="work-card work-card-mobile">
          <summary>Work shown</summary>
          {workSteps.length === 0 ? (
            <p className="muted">Start calculating to see steps.</p>
          ) : (
            <ul className="work-list">
              {workSteps.map((step, index) => (
                <li key={`mobile-${step}-${index}`}>{step}</li>
              ))}
            </ul>
          )}
        </details>
      </div>
    </section>
  )
}
