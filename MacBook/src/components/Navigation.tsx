import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const links = [
  { href: '#design', label: 'Design' },
  { href: '#keyboard', label: 'Keyboard' },
  { href: '#ports', label: 'Connectivity' },
  { href: '#pro-line', label: 'MacBook Pro' },
  { href: '#explore', label: 'Explore' },
  { href: '/product', label: 'Product details' },
]

type NavigationProps = {
  productPage?: boolean
  orderPage?: boolean
}

export function Navigation({
  productPage = false,
  orderPage = false,
}: NavigationProps) {
  const pageLinks = orderPage
    ? [
        { href: '/product', label: 'Product details' },
        { href: '#order-options', label: 'Configuration' },
      ]
    : productPage
    ? [
        { href: '/#design', label: 'Design' },
        { href: '/#explore', label: 'Explore' },
        { href: '/order', label: 'Order' },
      ]
    : links

  return (
    <motion.header
      className="topbar"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <a className="brand-mark" href={productPage || orderPage ? '/' : '#top'} aria-label="MacBook home">
        <span className="brand-icon" aria-hidden="true">⌘</span>
        <span>MacBook Pro</span>
      </a>
      <nav className="top-links" aria-label="Main navigation">
        {pageLinks.map((link) =>
          link.href.startsWith('#') || link.href.includes('/#') ? (
            <a key={link.href} href={link.href}>{link.label}</a>
          ) : (
            <Link key={link.href} to={link.href}>{link.label}</Link>
          ),
        )}
      </nav>
      {orderPage ? (
        <a className="nav-cta" href="#order-options">Review options</a>
      ) : (
        <Link className="nav-cta" to="/order">
          {productPage ? 'Configure yours' : 'Order yours'}
        </Link>
      )}
    </motion.header>
  )
}
