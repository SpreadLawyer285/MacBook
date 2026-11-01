import { motion } from 'framer-motion'

const links = [
  { href: '#design', label: 'Design' },
  { href: '#keyboard', label: 'Keyboard' },
  { href: '#ports', label: 'Connectivity' },
  { href: '#pro-line', label: 'MacBook Pro' },
  { href: '#explore', label: 'Explore' },
]

export function Navigation() {
  return (
    <motion.header
      className="topbar"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <a className="brand-mark" href="#top" aria-label="MacBook home">
        <span className="brand-icon" aria-hidden="true">⌘</span>
        <span>MacBook Pro</span>
      </a>
      <nav className="top-links" aria-label="Main navigation">
        {links.map((link) => (
          <a key={link.href} href={link.href}>{link.label}</a>
        ))}
      </nav>
      <a className="nav-cta" href="#explore">Explore model</a>
    </motion.header>
  )
}
