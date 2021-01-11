import React from 'react'
import Hud from './components/Hud'
import './styles.css'
import World from './World'
export default function App() {
  return (
    <div className="app-root">
      <Hud />
      <World />
    </div>
  )
}
