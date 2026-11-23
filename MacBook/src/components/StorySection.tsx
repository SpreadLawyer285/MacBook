type StorySectionProps = {
  id: string
  number: string
  eyebrow: string
  title: string
  description: string
  inverted?: boolean
}

export function StorySection({
  id,
  number,
  eyebrow,
  title,
  description,
  inverted = false,
}: StorySectionProps) {
  return (
    <section
      className={`story-section${inverted ? ' story-section--inverted' : ''}`}
      id={id}
    >
      <div className="story-seal" aria-hidden="true">
        <span>{number}</span>
        <i />
        <b />
      </div>
      <div className="story-ticks" aria-hidden="true">
        {Array.from({ length: 7 }, (_, index) => (
          <i key={index} />
        ))}
      </div>
      <div className="story-copy">
        <p className="story-number">{number}<span /></p>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="story-description">{description}</p>
      </div>
    </section>
  )
}
