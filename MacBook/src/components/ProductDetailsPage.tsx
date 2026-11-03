const productHighlights = [
  {
    number: '01',
    eyebrow: 'A form with purpose',
    title: 'Made to feel at home anywhere.',
    description:
      'A clean silhouette, carefully considered edges, and a finish that feels just as at home on your desk as it does on the move.',
    image: '/Macbook1.png',
    alt: 'MacBook Pro closed, showing its slim profile and clean aluminum finish',
    className: 'details-feature-closed',
  },
  {
    number: '02',
    eyebrow: 'A view into your work',
    title: 'Open up to more possibility.',
    description:
      'The display, keyboard, and spacious trackpad come together in a workspace that makes it easy to settle in and get going.',
    image: '/Macbook6.png',
    alt: 'Open MacBook Pro showing its display, keyboard, and trackpad',
    className: 'details-feature-open',
  },
  {
    number: '03',
    eyebrow: 'Thoughtful from every angle',
    title: 'The details make the difference.',
    description:
      'From the hinge to the ports along the edge, every part of the design feels considered, cohesive, and ready for everyday use.',
    image: '/Macbook3.png',
    alt: 'MacBook Pro viewed from behind, with its display open',
    className: 'details-feature-back',
  },
]

export function ProductDetailsPage() {
  return (
    <main className="product-details">
      <section className="details-hero">
        <p className="eyebrow"><span className="eyebrow-dot" /> Meet MacBook Pro</p>
        <h1>A closer look<br />at what moves you.</h1>
        <p className="details-intro">
          Thoughtful in every detail. Ready for the way you work, create, and move through your day.
        </p>
        <a className="details-scroll-cue" href="#details-design">
          <span className="scroll-cue-icon" aria-hidden="true">↓</span>
          <span>Get to know your MacBook</span>
        </a>
        <div className="details-hero-image">
          <img src="/Macbook6.png" alt="MacBook Pro open and ready to use" />
        </div>
      </section>

      <section className="details-introduction" id="details-design">
        <p className="eyebrow">Designed around you</p>
        <h2>Everyday essentials,<br />beautifully brought together.</h2>
        <p>
          MacBook Pro brings a considered design and a comfortable workspace together in one
          familiar, capable companion. Take a closer look at the little things that make it yours.
        </p>
      </section>

      <section className="details-highlights" aria-label="MacBook Pro design highlights">
        {productHighlights.map((highlight) => (
          <article className={`details-feature ${highlight.className}`} key={highlight.number}>
            <div className="details-feature-image">
              <img src={highlight.image} alt={highlight.alt} loading="lazy" />
            </div>
            <div className="details-feature-copy">
              <p className="details-feature-number">{highlight.number}</p>
              <p className="eyebrow">{highlight.eyebrow}</p>
              <h2>{highlight.title}</h2>
              <p>{highlight.description}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="details-bottom">
        <p className="eyebrow">Make it yours</p>
        <h2>See every angle for yourself.</h2>
        <p>Rotate the model, explore the details, and find the view that feels right to you.</p>
        <a className="nav-cta" href="/#explore">Explore the model <span aria-hidden="true">→</span></a>
      </section>

      <footer className="site-footer details-footer">
        <a href="/">MacBook Pro</a>
        <span>Designed for your next big idea.</span>
      </footer>
    </main>
  )
}
