import {useState} from 'react'

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode)
  const [history, setHistory] = useState([initialMode])

  const transition = (newMode) => {
    setMode(newMode)
    setHistory(prev => [...prev, newMode])
  }

  const back = () => {
    if (history.length > 1) {
      setMode(history[history.length - 2])
      setHistory(history.slice(0, -1))
    }
  }

  return {mode, transition, back};
}