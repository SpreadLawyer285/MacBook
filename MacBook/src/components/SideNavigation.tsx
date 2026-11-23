import { useEffect, useState } from 'react'

type SideNavigationProps = {
  productPage?: boolean
  orderPage?: boolean
}

const landingSections = [
  { id: 'top', label: 'Introduction', marker: '01' },
  { id: 'design', label: 'Design', marker: '02' },
  { id: 'keyboard', label: 'Keyboard', marker: '03' },
  { id: 'trackpad', label: 'Trackpad', marker: '04' },
  { id: 'ports', label: 'Connectivity', marker: '05' },
  { id: 'rotation', label: 'Every angle', marker: '06' },
  { id: 'pro-line', label: 'MacBook Pro', marker: '07' },
  { id: 'explore', label: 'Explore', marker: '08' },
]

const productSections = [
  { id: 'details-top', label: 'Overview', marker: '01' },
  { id: 'details-design', label: 'Design', marker: '02' },
  { id: 'details-highlights', label: 'Highlights', marker: '03' },
  { id: 'details-model', label: 'Explore the model', marker: '04' },
]

const orderSections = [
  { id: 'order-top', label: 'Overview', marker: '01' },
  { id: 'order-options', label: 'Options', marker: '02' },
  { id: 'order-summary', label: 'Summary', marker: '03' },
]

export function SideNavigation({
  productPage = false,
  orderPage = false,
}: SideNavigationProps) {
  const sections = orderPage
    ? orderSections
    : productPage
      ? productSections
      : landingSections
  const variant = orderPage ? 'order' : productPage ? 'product' : 'landing'
  const [activeSection, setActiveSection] = useState(sections[0].id)

  useEffect(() => {
    const observedSections = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null)

    const observer = new IntersectionObserver(
      (entries) => {
        const currentSection = entries.find((entry) => entry.isIntersecting)
        if (currentSection) setActiveSection(currentSection.target.id)
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    )

    observedSections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [sections])

  return (
    <nav
      className={`side-nav side-nav--${variant}`}
      aria-label={orderPage ? 'Order page sections' : productPage ? 'Product page sections' : 'Page sections'}
    >
      {sections.map((section) => {
        const isActive = activeSection === section.id

        return (
          <a
            className={`side-nav-link${isActive ? ' side-nav-link--active' : ''}`}
            href={`#${section.id}`}
            key={section.id}
            aria-label={section.label}
            aria-current={isActive ? 'location' : undefined}
            onClick={() => setActiveSection(section.id)}
          >
            <span className="side-nav-marker" aria-hidden="true">
              {section.marker}
            </span>
            <span className="side-nav-label" aria-hidden="true">
              {section.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}
