import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import Prism from 'prismjs'
import 'prismjs/components/prism-python'
// import 'prismjs/components/prism-cpp'
import 'prismjs/themes/prism.css'

export default function LessonModal({ slug, fetcher, onClose }) {
  const [data, setData] = useState(null)
  const [err, setErr] = useState("")
  const [elapsed, setElapsed] = useState(0)
  useEffect(() => {
    let t
    if (slug) {
      setElapsed(0)
      t = setInterval(() => setElapsed(e => e + 1), 1000)
      fetcher(slug).then(setData).catch(e => setErr(e.message))

    }
    return () => clearInterval(t)
  }, [slug])
  useEffect(() => { Prism.highlightAll() }, [data])
  if (!slug) return null
  return (
    <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4" role="dialog" aria-modal>
      <div className="max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-4">
        <div className="flex justify-between items-center gap-4">
          <h2 className="text-lg font-semibold">{data?.title || 'Loading...'}</h2>
          <button onClick={onClose} className="rounded px-2 py-1 border text-sm">Close</button>
        </div>
        <p className="mt-1 text-xs text-slate-500">⏱️ {elapsed}s · target ~60s</p>
        {err && <p className="text-red-600 mt-2">{err}</p>}
        {data && (
          <>
            <div className="prose dark:prose-invert max-w-none mt-4">
              <ReactMarkdown>{data.content_markdown}</ReactMarkdown>
            </div>
            {Array.isArray(data.code_blocks) && data.code_blocks.map((b, i) => (
              <pre className={`language-${b.language}`} key={i}><code className={`language-${b.language}`}>{b.snippet}</code></pre>
            ))}
          </>
        )}
      </div>
    </div>
  )
}