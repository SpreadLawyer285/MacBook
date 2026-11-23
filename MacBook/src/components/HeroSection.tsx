import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section className="hero-section" id="top">
      <div className="landing-hero-seal" aria-hidden="true">
        <span>MB</span>
        <i />
        <small>PRO</small>
        <b />
      </div>
      <div className="landing-coordinate landing-coordinate-left" aria-hidden="true">
        <span />
        <small>37.3318° N</small>
      </div>
      <div className="landing-coordinate landing-coordinate-right" aria-hidden="true">
        <small>122.0305° W</small>
        <span />
      </div>
      <motion.div
        className="hero-copy"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.05, delay: 0.05, ease: "easeOut" }}
      >
        <div className="story-glass" aria-hidden="true" />
        <p className="eyebrow">
          <span className="eyebrow-dot" /> The MacBook experience
        </p>
        <h1>
          Designed
          <br />
          to do more.
        </h1>
        <p className="hero-text">
          Thoughtful design meets the freedom to create, work, and go wherever
          inspiration takes you.
        </p>
        <div className="hero-actions">
          <a className="scroll-cue" href="#design">
            <span className="scroll-cue-icon" aria-hidden="true">
              ↓
            </span>
            <span>Discover the details</span>
          </a>
          <Link className="nav-cta" to="/order">
            Configure yours <span aria-hidden="true">→</span>
          </Link>
        </div>
      </motion.div>
      <div className="hero-caption" aria-hidden="true">
        <span>Lightness, in every dimension.</span>
        <span className="caption-line" />
      </div>
    </section>
  );
}
