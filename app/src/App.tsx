import { useLenis } from './hooks/useLenis'
import Hero from './sections/Hero'
import About from './sections/About'
import ClientLogos from './sections/ClientLogos'
import Portfolio from './sections/Portfolio'
import Services from './sections/Services'
import Pricing from './sections/Pricing'
import Testimonial from './sections/Testimonial'
import Archive from './sections/Archive'
import Stats from './sections/Stats'
import Article from './sections/Article'

export default function App() {
  useLenis()

  return (
    <main style={{ background: 'var(--color-ink)', minHeight: '550vh' }}>
      <Hero />
      <About />
      <ClientLogos />
      <Portfolio />
      <Services />
      <Pricing />
      <Testimonial />
      <Archive />
      <Stats />
      <Article />
    </main>
  )
}
