import { useEffect, useState } from 'react'
import { AppleMark } from './AppleMark'

export function WelcomeIntro() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timeout = window.setTimeout(() => setVisible(false), 2400)
    return () => window.clearTimeout(timeout)
  }, [])

  if (!visible) return null

  return (
    <div className="welcome-intro" role="status" aria-label="Welcome to MacBook Pro">
      <div className="welcome-intro-orbit welcome-intro-orbit-outer" aria-hidden="true" />
      <div className="welcome-intro-orbit welcome-intro-orbit-inner" aria-hidden="true" />
      <div className="welcome-intro-content">
        <span className="welcome-intro-kicker">A new perspective</span>
        <AppleMark className="welcome-intro-logo" />
        <h1>MacBook Pro</h1>
        <span className="welcome-intro-caption">Designed for what’s next</span>
      </div>
      <span className="welcome-intro-spark welcome-intro-spark-one" aria-hidden="true" />
      <span className="welcome-intro-spark welcome-intro-spark-two" aria-hidden="true" />
    </div>
  )
}
