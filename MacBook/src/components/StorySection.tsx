type StorySectionProps = {
  id: string
  number: string
  eyebrow: string
  title: string
  description: string
  interactive?: boolean
}

export function StorySection({
  id,
  number,
  eyebrow,
  title,
  description,
  interactive = false,
}: StorySectionProps) {
  return (
    <section
      className={`story-section${interactive ? ' story-section--interactive' : ''}`}
      id={id}
    >
      <div className="story-copy">
        <p className="story-number">{number}<span /></p>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="story-description">{description}</p>
        {interactive && (
          <p className="story-interaction-hint">
            <span aria-hidden="true">↔</span>
            Drag to rotate
          </p>
        )}
      </div>
    </section>
  )
}
