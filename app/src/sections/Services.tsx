import { motion } from 'framer-motion'
import Button from '../components/Button'
import ServiceCard from '../components/ServiceCard'
import OverlapFiller from '../components/OverlapFiller'
import SectionEyebrow from '../components/SectionEyebrow'
import { images } from '../assets/images'
import './Services.css'

const cards = [
  {
    rollNo: '01',
    category: 'Art Direction',
    heading: 'Creative Oversight',
    bodyText:
      'Guiding visual identity through clarity and intentional design. Fuel shapes cohesive narratives that elevate brands beyond aesthetics, creating timeless expressions with edge.',
    image: images.assetGwbdxr, // "Woman Beach" — default image (no override for card 1 in the source)
  },
  {
    rollNo: '02',
    category: 'Photography',
    heading: 'Brand Imaging',
    bodyText:
      'Crafting imagery with mood, precision, and emotional depth. Fuel captures moments that feel curated and purposeful, transforming simple visuals into powerful brand stories.',
    image: images.womanStaircaseBchnf0,
  },
  {
    rollNo: '03',
    category: 'Strategy',
    heading: 'Concept Frameworks',
    bodyText:
      'Structuring ideas with insight, direction, and clarity. Fuel builds thoughtful frameworks that define positioning, strengthen identity, and move brands toward long-term impact.',
    image: images.womanBeach7ug4bh,
  },
]

export default function Services() {
  return (
    <section className="services">
      <OverlapFiller color="ink" />

      <div className="services__top">
        <SectionEyebrow index="03" title="Premium Services" dark />

        <div className="services__content">
          <div className="services__heading-wrap">
            {/* Original held an autoplaying looping video here; that distinct
                asset wasn't fetched during capture, so its poster frame is
                shown as a static image instead. Floated (not absolutely
                positioned) so the heading text that follows it in the DOM
                wraps around it instead of running underneath it. */}
            <img
              src={images.assetBk2irg.src}
              alt=""
              className="services__video-thumb"
              aria-hidden="true"
            />
            <motion.p
              className="services__heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.1 } }}
              viewport={{ once: true, amount: 0.01 }}
            >
              Design-driven studio delivering the structured visuals, refined digital system, and
              high-impact brand experiences shaped by aesthetics &amp; Fuel&reg;.
            </motion.p>
          </div>

          <div className="services__button-detail">
            <Button title="Explore More" href="/about" variant="light" />
            <div className="services__details" aria-hidden="true">
              <span className="services__plus" />
              <span className="services__plus" />
              <span className="services__plus" />
            </div>
          </div>
        </div>
      </div>

      <div className="services__bottom">
        {cards.map((c) => (
          <ServiceCard key={c.rollNo} {...c} />
        ))}
      </div>
    </section>
  )
}
