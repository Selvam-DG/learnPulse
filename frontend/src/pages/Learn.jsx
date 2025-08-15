import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchTopics, fetchLessonsBy, fetchLesson } from '../api'
import TopicPills from '../components/TopicPills'
import LevelTabs from '../components/LevelTabs'
import SearchBox from '../components/SearchBox'
import LessonCard from '../components/LessonCard'
import LessonModal from '../components/LessonModal'

export default function Learn() {
  const { topicSlug } = useParams()
  const [topics, setTopics] = useState([])
  const [activeLevel, setActiveLevel] = useState('basics')
  const [items, setItems] = useState([])
  const [query, setQuery] = useState("")
  const [openSlug, setOpenSlug] = useState(null)
  const [err, setErr] = useState("")

  useEffect(() => { fetchTopics().then(setTopics).catch(e => setErr(e.message)) }, [])
  useEffect(() => {
    if (!topicSlug) return
    setErr(""); setItems([])
    fetchLessonsBy(topicSlug, activeLevel)
      .then(setItems)
       .catch(e => setErr(e.message))
  }, [topicSlug, activeLevel])

  const topic = topics.find(t => t.slug === topicSlug)
  const levels = topic?.levels || ['basics','intermediate','advanced']
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return items
    return items.filter(i => i.title.toLowerCase().includes(q) || (i.summary||'').toLowerCase().includes(q))
  }, [items, query])

  return (
    <section className="grid gap-4">
      <TopicPills topics={topics} />
      <div className="flex flex-col  gap-6">
        {/* Left rail */}
        <aside className="flex-shrink-0">
          <h2 className="font-semibold">Levels</h2>
          <LevelTabs levels={levels} active={activeLevel} onChange={setActiveLevel} />
          <div className="mt-6">
            <SearchBox value={query} onChange={setQuery} />
          </div>
        </aside>
        {/* Content */}
        <div className="flex-1">
          {err && <p className="text-red-600">{err}</p>}
          {filtered.length === 0 ? (
            <p className="text-slate-500 mt-6">No lessons found.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map(l => (
                <LessonCard key={l.slug} item={l} onOpen={setOpenSlug} />
              ))}
            </div>
          )}
        </div>
      </div>
      <LessonModal slug={openSlug} fetcher={fetchLesson} onClose={() => setOpenSlug(null)} />
    </section>

  )

}