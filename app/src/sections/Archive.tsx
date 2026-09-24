import ArchiveRow from '../components/ArchiveRow'
import CtaBanner from '../components/CtaBanner'
import SectionEyebrow from '../components/SectionEyebrow'
import { images } from '../assets/images'
import './Archive.css'

// Real row data recovered from the Archive "List" instantiation in the Home
// page chunk (name/year props on each "Experience Card").
const rows = [
  { title: 'Outside', year: '2025', image: images.asset3emr1n },
  { title: 'Juvede', year: '2024', image: images.assetJvelfw },
  { title: 'Zaine', year: '2025', image: images.assetF4esjy },
  { title: 'Wall Out', year: '2024', image: images.assetU6lqqg },
  { title: 'Geaton', year: '2019', image: images.bgImageYiiumx },
  { title: 'Skate', year: '2020', image: images.assetCjbuf1 },
]

export default function Archive() {
  return (
    <section className="archive">
      <SectionEyebrow index="06" title="Archive" />

      <div className="archive__list">
        {rows.map((r) => (
          <ArchiveRow key={r.title} {...r} />
        ))}
      </div>

      <CtaBanner />
    </section>
  )
}
