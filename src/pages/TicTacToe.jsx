import { useEffect, useMemo, useState } from 'react'

const SCORE_KEY = 'ttt-score'

const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

const difficultyOptions = ['easy', 'medium', 'hard']

function calculateWinner(squares) {
  for (const [a, b, c] of winningLines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function getAvailableMoves(squares) {
  return squares
    .map((value, index) => (value ? null : index))
    .filter((value) => value !== null)
}

function findWinningMove(squares, player) {
  for (const [a, b, c] of winningLines) {
    const line = [squares[a], squares[b], squares[c]]
    const count = line.filter((v) => v === player).length
    const emptyIndex = [a, b, c].find((idx) => !squares[idx])
    if (count === 2 && emptyIndex !== undefined) return emptyIndex
  }
  return null
}

function minimax(squares, player) {
  const winner = calculateWinner(squares)
  if (winner === 'O') return { score: 10 }
  if (winner === 'X') return { score: -10 }
  if (squares.every(Boolean)) return { score: 0 }

  const moves = []
  const available = getAvailableMoves(squares)

  for (const index of available) {
    const next = squares.slice()
    next[index] = player
    const result = minimax(next, player === 'O' ? 'X' : 'O')
    moves.push({ index, score: result.score })
  }

  if (player === 'O') {
    return moves.reduce((best, move) => (move.score > best.score ? move : best))
  }

  return moves.reduce((best, move) => (move.score < best.score ? move : best))
}

function getComputerMove(squares, difficulty) {
  const available = getAvailableMoves(squares)
  if (!available.length) return null

  if (difficulty === 'easy') {
    return available[Math.floor(Math.random() * available.length)]
  }

  const winMove = findWinningMove(squares, 'O')
  const blockMove = findWinningMove(squares, 'X')

  if (difficulty === 'medium') {
    if (winMove !== null) return winMove
    if (blockMove !== null) return blockMove
    return available[Math.floor(Math.random() * available.length)]
  }

  if (winMove !== null) return winMove
  if (blockMove !== null) return blockMove

  return minimax(squares, 'O').index
}

export default function TicTacToe() {
  const [squares, setSquares] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [difficulty, setDifficulty] = useState('easy')
  const [score, setScore] = useState({ you: 0, computer: 0, draws: 0 })

  const winner = calculateWinner(squares)
  const isDraw = !winner && squares.every(Boolean)
  const isPlayerTurn = isXNext

  useEffect(() => {
    const saved = localStorage.getItem(SCORE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setScore(parsed)
      } catch {
        // ignore
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem(SCORE_KEY, JSON.stringify(score))
  }, [score])

  useEffect(() => {
    if (winner) {
      setScore((prev) => ({
        ...prev,
        you: prev.you + (winner === 'X' ? 1 : 0),
        computer: prev.computer + (winner === 'O' ? 1 : 0),
      }))
      return
    }
    if (isDraw) {
      setScore((prev) => ({ ...prev, draws: prev.draws + 1 }))
    }
  }, [isDraw, winner])

  useEffect(() => {
    if (winner || isDraw || isPlayerTurn) return

    const move = getComputerMove(squares, difficulty)
    if (move === null || move === undefined) return

    const timeout = setTimeout(() => {
      setSquares((prev) => {
        const next = prev.slice()
        if (!next[move]) next[move] = 'O'
        return next
      })
      setIsXNext(true)
    }, 300)

    return () => clearTimeout(timeout)
  }, [difficulty, isDraw, isPlayerTurn, squares, winner])

  const handleClick = (index) => {
    if (squares[index] || winner || isDraw || !isPlayerTurn) return
    const nextSquares = squares.slice()
    nextSquares[index] = 'X'
    setSquares(nextSquares)
    setIsXNext(false)
  }

  const reset = () => {
    setSquares(Array(9).fill(null))
    setIsXNext(true)
  }

  const status = useMemo(() => {
    if (winner === 'X') return { text: 'YOU WIN!', emoji: '👑', tone: 'win' }
    if (winner === 'O') return { text: 'YOU LOSE!', emoji: '👎', tone: 'lose' }
    if (isDraw) return { text: 'Draw — run it back?', emoji: '🤝', tone: 'draw' }
    return { text: isPlayerTurn ? 'Your move' : 'Computer thinking…', emoji: '🎮' }
  }, [isDraw, isPlayerTurn, winner])

  return (
    <section className="section">
      <h2>Tic Tac Toe</h2>
      <p>Play against the computer. Aim for three in a row.</p>
      <div className="difficulty">
        <p className="muted">Difficulty</p>
        <div className="difficulty-buttons">
          {difficultyOptions.map((level) => (
            <button
              key={level}
              className={`button ghost ${difficulty === level ? 'active' : ''}`}
              onClick={() => setDifficulty(level)}
            >
              {level}
            </button>
          ))}
        </div>
      </div>
      <div className="game">
        <div className="board-wrap">
          <div className="board">
            {squares.map((value, index) => (
              <button
                key={index}
                className={`square ${value ? 'filled' : ''}`}
                onClick={() => handleClick(index)}
                aria-label={`Square ${index + 1}`}
              >
                {value && (
                  <span className={`mark ${value === 'X' ? 'mark-x' : 'mark-o'}`}>
                    {value === 'X' ? '✖' : '◯'}
                  </span>
                )}
              </button>
            ))}
          </div>
          {(winner || isDraw) && (
            <div className={`board-overlay ${status.tone || ''}`}>
              <span className="result-emoji">{status.emoji}</span>
              <span className="result-text">{status.text}</span>
            </div>
          )}
          <button className="button reset-button" onClick={reset}>
            Reset ✨
          </button>
        </div>

        <div className="scoreboard">
          <h3>Score</h3>
          <div className="score-row">
            <span>You</span>
            <span>{score.you}</span>
          </div>
          <div className="score-row">
            <span>Computer</span>
            <span>{score.computer}</span>
          </div>
          <div className="score-row">
            <span>Draws</span>
            <span>{score.draws}</span>
          </div>
          <p className="muted score-note">Score stays until browser reset.</p>
        </div>
      </div>
    </section>
  )
}
