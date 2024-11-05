import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import DashboardLayoutBasic from './Pages/Compiler'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <DashboardLayoutBasic />
    </>
  )
}

export default App
