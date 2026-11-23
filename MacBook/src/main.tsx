import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const decorationColorVariables = [
  '--landing-seal-color',
  '--landing-line-color',
  '--story-seal-color',
  '--story-ring-color',
  '--details-seal-color',
  '--details-rule-color',
  '--details-feature-color',
  '--details-orbit-color',
]

for (const variable of decorationColorVariables) {
  const color = Math.random() < 0.5 ? '#1769e0' : '#21845d'
  document.documentElement.style.setProperty(variable, color)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App/>
  </StrictMode>,
)