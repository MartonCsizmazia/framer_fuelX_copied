import { motion } from 'framer-motion'
import WorkCard from '../components/WorkCard'
import SectionEyebrow from '../components/SectionEyebrow'
import { images } from '../assets/images'
import './Article.css'

// Real article data recovered from the SSR HTML for the Article CMS grid
// (the Home page chunk only carries the query template, not resolved data).
const articles = [
  { rollNo: '001', title: 'Velocity Becomes', category: 'Art Direction', slug: 'velocity-becomes', image: images.womanCloseUpVsmr1z },
  { rollNo: '002', title: 'Way To Clearance', category: 'Books', slug: 'way-to-clearance', image: images.assetTgpbpk },
  { rollNo: '003', title: 'All Grapples', category: 'Automotive', slug: 'all-grapples', image: images.manMotionBlur1d2ldl },
  { rollNo: '004', title: 'Flowers Love', category: 'Gardening', slug: 'flowers-love', image: images.womanFlowersUjmih3 },
]

export default function Article() {
  return (
    <section className="article">
      <SectionEyebrow index="08" title="Article" />

      <div className="article__grid">
        {articles.map((a, i) => (
          <motion.div
            className="article__slot"
            key={a.slug}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1, transition: { duration: 0.6, delay: (i % 2) * 0.15, ease: [0.44, 0, 0.34, 0.98] } }}
            viewport={{ once: true, amount: 0.01 }}
          >
            <WorkCard
              title={a.title}
              category={a.category}
              rollNo={a.rollNo}
              href={`/blog/${a.slug}`}
              image={a.image}
              flat
            />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
