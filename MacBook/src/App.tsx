import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { AppleMark } from './components/AppleMark'
import { ExplorerSection } from './components/ExplorerSection'
import { HeroSection } from './components/HeroSection'
import { Navigation } from './components/Navigation'
import { OrderPage } from './components/OrderPage'
import { ProductDetailsPage } from './components/ProductDetailsPage'
import { ProductScene } from './components/ProductScene'
import { SideNavigation } from './components/SideNavigation'
import { StorySection } from './components/StorySection'
import { WelcomeIntro } from './components/WelcomeIntro'

function LandingPage() {
  return (
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
          seal="CRAFTED"
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
          seal="FOCUS"
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
          inverted
        />
        <StorySection
          id="pro-line"
          number="06"
          eyebrow="For your biggest ideas"
          title="Meet the MacBook Pro line."
          description="A closer look at the design of MacBook Pro, made for ambitious projects and the people who bring them to life."
          seal="PRO LINE"
          inverted
        />
      </div>
      <ExplorerSection />
    </main>
  )
}

function App() {
  const pathname = useLocation().pathname.replace(/\/$/, '') || '/'
  const productPage = pathname === '/product'
  const orderPage = pathname === '/order'
  const pageType = orderPage ? 'order' : productPage ? 'details' : 'landing'

  return (
    <div className={`page-shell page-shell--${pageType}`}>
      <WelcomeIntro key={pathname} />
      <div className="apple-page-seal" aria-hidden="true">
        <AppleMark />
      </div>
      <Navigation productPage={productPage} orderPage={orderPage} />
      <SideNavigation productPage={productPage} orderPage={orderPage} />

      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/product" element={<ProductDetailsPage />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
