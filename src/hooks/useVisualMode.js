import {useState} from 'react'

export default function useVisualMode(initialMode) {
  const [mode, setMode] = useState(initialMode)
  const [history, setHistory] = useState([initialMode])

  const transition = (newMode, replace) => {
    if (replace) {
      setHistory(prev => [...prev.slice(0, -1), newMode])
    } else {
      setHistory(prev => [...prev, newMode])
    }
    setMode(newMode)
  }

  const back = () => {
    if (history.length > 1) {
      setMode(history[history.length - 2])
      setHistory(history.slice(0, -1))
    }
  }

  return {mode, transition, back};
}