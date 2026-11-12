import { motion } from "framer-motion";

export function HeroSection() {
  return (
    <section className="hero-section" id="top">
      <motion.div
        className="hero-copy"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.05, delay: 0.05, ease: "easeOut" }}
      >
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
        <a className="scroll-cue" href="#design">
          <span className="scroll-cue-icon" aria-hidden="true">
            ↓
          </span>
          <span>Discover the details</span>
        </a>
      </motion.div>
      <div className="hero-caption" aria-hidden="true">
        <span>Lightness, in every dimension.</span>
        <span className="caption-line" />
      </div>
    </section>
  );
}
