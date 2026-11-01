import { useState } from 'react'
import { ExplorerCanvas } from './ProductScene'

export function ExplorerSection() {
  const [resetToken, setResetToken] = useState(0)
  const [lidOpen, setLidOpen] = useState(true)

  return (
    <section className="explorer-section" id="explore">
      <div className="explorer-heading">
        <p className="eyebrow">Take a closer look</p>
        <h2>Explore MacBook Pro.</h2>
        <p>Move around the details. Find your own angle.</p>
      </div>
      <div className="explorer-card">
        <div className="explorer-canvas">
          <ExplorerCanvas resetToken={resetToken} lidOpen={lidOpen ? 1 : 0} />
        </div>
        <div className="explorer-controls">
          <div className="interaction-hint">
            <span className="drag-icon" aria-hidden="true">↔</span>
            <span>Drag to rotate <i>·</i> Scroll to zoom</span>
          </div>
          <div className="explorer-actions">
            <button
              className="reset-view"
              type="button"
              aria-pressed={!lidOpen}
              onClick={() => setLidOpen((open) => !open)}
            >
              <span aria-hidden="true">{lidOpen ? '⌄' : '⌃'}</span>
              {lidOpen ? 'Close laptop' : 'Open laptop'}
            </button>
            <button
              className="reset-view"
              type="button"
              onClick={() => setResetToken((token) => token + 1)}
            >
              <span aria-hidden="true">↺</span>
              Reset view
            </button>
          </div>
        </div>
      </div>
      <footer className="site-footer">
        <span>MacBook Pro</span>
        <span>Designed for your next big idea.</span>
      </footer>
    </section>
  )
}
