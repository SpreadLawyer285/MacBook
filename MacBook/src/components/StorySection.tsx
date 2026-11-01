type StorySectionProps = {
  id: string
  number: string
  eyebrow: string
  title: string
  description: string
}

export function StorySection({
  id,
  number,
  eyebrow,
  title,
  description,
}: StorySectionProps) {
  return (
    <section className="story-section" id={id}>
      <div className="story-copy">
        <p className="story-number">{number}<span /></p>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p className="story-description">{description}</p>
      </div>
    </section>
  )
}
