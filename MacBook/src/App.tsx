import { ExplorerSection } from './components/ExplorerSection'
import { HeroSection } from './components/HeroSection'
import { Navigation } from './components/Navigation'
import { ProductDetailsPage } from './components/ProductDetailsPage'
import { ProductScene } from './components/ProductScene'
import { StorySection } from './components/StorySection'

function App() {
  const isProductPage = window.location.pathname.replace(/\/$/, '') === '/product'

  return (
    <div className="page-shell">
      <Navigation productPage={isProductPage} />

      {isProductPage ? (
        <ProductDetailsPage />
      ) : (
        <main>
          <div className="product-story" id="product-story">
            <div className="landing-lines" aria-hidden="true">
              <span className="landing-line landing-line--1" />
              <span className="landing-line landing-line--2" />
              <span className="landing-line landing-line--3" />
              <span className="landing-line landing-line--4" />
              <span className="landing-line landing-line--5" />
              <span className="landing-line landing-line--6" />
              <span className="landing-line landing-line--7" />
              <span className="landing-line landing-line--8" />
            </div>
            <ProductScene />
            <HeroSection />
            <StorySection
              id="design"
              number="01"
              eyebrow="A new perspective"
              title="Precision in every detail."
              description="A considered form, crafted from edge to edge. Open the lid and discover a workspace made to feel effortless."
            />
            <StorySection
              id="keyboard"
              number="02"
              eyebrow="Made to move with you"
              title="Every keystroke. Perfectly considered."
              description="A comfortable, responsive typing experience brings every idea a little closer."
            />
            <StorySection
              id="trackpad"
              number="03"
              eyebrow="Intuitive by design"
              title="Your ideas, at your fingertips."
              description="A generous, precise surface makes every gesture feel natural."
            />
            <StorySection
              id="ports"
              number="04"
              eyebrow="Ready for what’s next"
              title="More room to connect."
              description="Thoughtful connectivity keeps your everyday essentials within reach."
            />
            <StorySection
              id="rotation"
              number="05"
              eyebrow="The complete picture"
              title="Beautiful from every side."
              description="A closer look at the details, materials, and shape that make the MacBook feel at home anywhere."
              interactive
            />
            <StorySection
              id="pro-line"
              number="06"
              eyebrow="For your biggest ideas"
              title="Meet the MacBook Pro line."
              description="A closer look at the design of MacBook Pro, made for ambitious projects and the people who bring them to life."
              interactive
            />
          </div>

          <ExplorerSection />
        </main>
      )}
    </div>
  )
}

export default App
