import { useState } from 'react'
import { sendFeedback } from '../api'

export default function Suggest(){

  const [form, setForm] = useState({ name:"", email:"", topic:"", message:"" })

  const [status, setStatus] = useState("idle")

  const [err, setErr] = useState("")



  function upd(k,v){ setForm(f => ({...f, [k]: v})) }



  async function onSubmit(e){

    e.preventDefault()

    setErr("")

    if (!form.email || !form.topic) { setErr("Email and topic are required."); return }

    try {

      setStatus("sending")

      await sendFeedback({ ...form, source: "web" })

      setStatus("sent")

      setForm({ name:"", email:"", topic:"", message:"" })

    } catch (e) {

      setErr(e.message); setStatus("idle")

    }

  }



  return (

    <section className="max-w-xl">

      <h1 className="text-2xl font-bold">Suggest a Topic</h1>

      <p className="mt-2 text-slate-600 dark:text-slate-400 text-sm">

        Tell us what you want to learn in 60 seconds — we’ll add it to the roadmap or email you back.

      </p>



      <form onSubmit={onSubmit} className="mt-6 grid gap-4">

        <div>

          <label className="block text-sm mb-1">Name</label>

          <input className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2"

            value={form.name} onChange={e=>upd('name', e.target.value)} />

        </div>

        <div>

          <label className="block text-sm mb-1">Email *</label>

          <input type="email" required className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2"

            value={form.email} onChange={e=>upd('email', e.target.value)} />

        </div>

        <div>

          <label className="block text-sm mb-1">Topic (e.g., “SQL Joins”, “Django Basics”) *</label>

          <input required className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2"

            value={form.topic} onChange={e=>upd('topic', e.target.value)} />

        </div>

        <div>

          <label className="block text-sm mb-1">Message (what should we cover?)</label>

          <textarea rows={5} className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2"

            value={form.message} onChange={e=>upd('message', e.target.value)} />

        </div>



        {err && <p className="text-red-600">{err}</p>}

        <button disabled={status==='sending'}

          className="rounded-md bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-2">

          {status === 'sending' ? 'Sending…' : status === 'sent' ? 'Sent!' : 'Send'}

        </button>

      </form>

    </section>

  )

}