import { motion } from 'framer-motion'
import PricingCard from '../components/PricingCard'
import OverlapFiller from '../components/OverlapFiller'
import SectionEyebrow from '../components/SectionEyebrow'
import './Pricing.css'

// Real tier content recovered from the "Pricing Card" instances in the Home
// page chunk — feature order matches the source's point1..point8 mapping.
const tiers = [
  {
    title: 'Starter',
    description: 'Essential design support for new brands taking the first step.',
    price: '999',
    features: [
      'Custom-crafted visual identity',
      'Responsive, modern website design',
      'High-quality imagery and production',
    ],
    dark: false,
  },
  {
    title: 'Professional',
    description: 'Ideal for brands seeking refined systems and digital presence.',
    price: '7299',
    features: [
      'Custom-crafted visual identity',
      'Responsive, modern website design',
      'High-quality imagery and production',
      'Structured layouts with clean typography',
      'Conversion-focused page strategy',
      'Fast, optimized performance setup',
    ],
    dark: false,
  },
  {
    title: 'Elite',
    description: 'High-touch and a fully crafted brand experience by Fuel.',
    price: '10999',
    features: [
      'Custom-crafted visual identity',
      'Responsive, modern website design',
      'High-quality imagery and production',
      'Structured layouts with clean typography',
      'Conversion-focused page strategy',
      'Fast, optimized performance setup',
      'Seamless CMS and organization',
      'Dedicated support for revisions',
    ],
    dark: true,
  },
]

export default function Pricing() {
  return (
    <section className="pricing">
      <OverlapFiller color="paper" />

      <SectionEyebrow index="04" title="Pricing" />

      <div className="pricing__bottom">
        {tiers.map((t) => (
          <motion.div
            className="pricing__card-slot"
            key={t.title}
            initial={{ opacity: 0.001, y: -100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            <PricingCard {...t} href="/contact" />
          </motion.div>
        ))}
      </div>
    </section>
  )
}
