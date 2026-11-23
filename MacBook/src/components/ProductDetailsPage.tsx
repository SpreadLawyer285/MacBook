import { Link } from "react-router-dom";

const productHighlights = [
  {
    number: "01",
    eyebrow: "A form with purpose",
    title: "Made to feel at home anywhere.",
    description:
      "A clean silhouette, carefully considered edges, and a finish that feels just as at home on your desk as it does on the move.",
    details: ["Precision aluminum", "Quietly portable", "Four finishes"],
    seal: "CRAFTED",
    image: "/Macbook1.png",
    alt: "MacBook Pro closed, showing its slim profile and clean aluminum finish",
    className: "details-feature-closed",
  },
  {
    number: "02",
    eyebrow: "A view into your work",
    title: "Open up to more possibility.",
    description:
      "The display, keyboard, and spacious trackpad come together in a workspace that makes it easy to settle in and get going.",
    details: ["Immersive display", "Comfortable keys", "Force Touch trackpad"],
    image: "/Macbook6.png",
    alt: "Open MacBook Pro showing its display, keyboard, and trackpad",
    className: "details-feature-open",
  },
  {
    number: "03",
    eyebrow: "Thoughtful from every angle",
    title: "The details make the difference.",
    description:
      "From the hinge to the ports along the edge, every part of the design feels considered, cohesive, and ready for everyday use.",
    details: ["Balanced hinge", "Studio-quality camera", "Essential ports"],
    seal: "PRECISE",
    image: "/Macbook3.png",
    alt: "MacBook Pro viewed from behind, with its display open",
    className: "details-feature-back",
  },
];

const designDetails = [
  { value: '13.6"', label: "Liquid Retina display" },
  { value: "4", label: "Refined finishes" },
  { value: "2.7", label: "Pounds of possibility" },
  { value: "Up to", label: "All-day battery life" },
];

export function ProductDetailsPage() {
  return (
    <main className="product-details">
      <section className="details-hero" id="details-top">
        <div className="details-hero-seal details-hero-seal-left" aria-hidden="true">
          <span>MP</span>
          <i />
          <small>01</small>
        </div>
        <div className="details-hero-seal details-hero-seal-right" aria-hidden="true">
          <small>EST.</small>
          <i />
          <span>∞</span>
        </div>
        <div
          className="details-hero-ornament details-hero-ornament-left"
          aria-hidden="true"
        >
          <span>Precision</span>
          <i />
        </div>
        <div
          className="details-hero-ornament details-hero-ornament-right"
          aria-hidden="true"
        >
          <i />
          <span>Performance</span>
        </div>
        <p className="eyebrow">
          <span className="eyebrow-dot" /> Meet MacBook Pro
        </p>
        <h1>
          A closer look
          <br />
          at what moves you.
        </h1>
        <p className="details-intro">
          Thoughtful in every detail. Ready for the way you work, create, and
          move through your day.
        </p>
        <a className="details-scroll-cue" href="#details-design">
          <span className="scroll-cue-icon" aria-hidden="true">
            ↓
          </span>
          <span>Get to know your MacBook</span>
        </a>
        <Link className="nav-cta details-order-cta" to="/order">
          Configure your MacBook <span aria-hidden="true">→</span>
        </Link>
        <br />
        <div className="details-hero-image">
          <img src="/Macbook6.png" alt="MacBook Pro open and ready to use" />
        </div>
      </section>

      <section className="details-introduction" id="details-design">
        <div className="details-section-seal" aria-hidden="true">
          <span>DESIGN</span>
          <i />
          <span>DETAIL</span>
        </div>
        <p className="eyebrow">Designed around you</p>
        <h2>
          Everyday essentials,
          <br />
          beautifully brought together.
        </h2>
        <br />
        <p>
          MacBook Pro brings a considered design and a comfortable workspace
          together in one familiar, capable companion. Take a closer look at the
          little things that make it yours.
        </p>
        <div className="details-spec-rail" aria-label="Key design details">
          {designDetails.map((detail) => (
            <div className="details-spec" key={detail.label}>
              <strong>{detail.value}</strong>
              <span>{detail.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section
        className="details-highlights"
        id="details-highlights"
        aria-label="MacBook Pro design highlights"
      >
        <div className="details-highlights-rule" aria-hidden="true">
          <span />
          <i>PRO</i>
          <span />
        </div>
        {productHighlights.map((highlight) => (
          <article
            className={`details-feature ${highlight.className}`}
            key={highlight.number}
          >
            <div className="details-feature-image">
              <img src={highlight.image} alt={highlight.alt} loading="lazy" />
              <span className="details-image-marker" aria-hidden="true">
                <span />
              </span>
              <span className="details-image-index" aria-hidden="true">
                {highlight.number}
              </span>
            </div>
            {highlight.seal && (
              <span className="details-feature-seal" aria-hidden="true">
                <span>✦</span>
                <strong>{highlight.seal}</strong>
                <small>MACBOOK PRO</small>
              </span>
            )}
            <div className="details-feature-copy">
              <p className="details-feature-number">{highlight.number}</p>
              <p className="eyebrow">{highlight.eyebrow}</p>
              <h2>{highlight.title}</h2>
              <br />
              <p>{highlight.description}</p>
              <ul className="details-feature-tags" aria-label="Feature details">
                {highlight.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </section>

      <section className="details-bottom" id="details-model">
        <div className="details-bottom-orbit" aria-hidden="true">
          <span />
          <i />
          <b className="details-orbit-cross details-orbit-cross-top" />
          <b className="details-orbit-cross details-orbit-cross-right" />
          <b className="details-orbit-cross details-orbit-cross-bottom" />
          <b className="details-orbit-cross details-orbit-cross-left" />
        </div>
        <div className="details-bottom-content">
          <p className="eyebrow">Make it yours</p>
          <h2>See every angle for yourself.</h2>
          <br />
          <p>
            Rotate the model, explore the details, and find the view that feels
            right to you.
          </p>
          <br />
          <div className="details-action-row">
            <a className="nav-cta" href="/#explore">
              Explore the model <span aria-hidden="true">→</span>
            </a>
            <Link className="nav-cta order-secondary-cta" to="/order">
              Configure yours <span aria-hidden="true">→</span>
            </Link>
            <span className="details-action-note">
              <i aria-hidden="true" />
              Interactive 360° view
            </span>
          </div>
        </div>
      </section>

      <footer className="site-footer details-footer">
        <a href="/">MacBook Pro</a>
        <span>Designed for your next big idea.</span>
      </footer>
    </main>
  );
}
