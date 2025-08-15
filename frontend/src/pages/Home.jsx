import { useEffect, useState } from "react";
import { fetchTopics } from "../api";
import { Link } from "react-router-dom";


export default function Home() {
    const [topics, setTopics] = useState([]);
    const [error, setError] = useState("");
    
    useEffect( ()=>{
        fetchTopics()
            .then(setTopics)
            .catch( e => setError(e.message))
    },[])

    return(
        <section className="grid gap-8">
            <div className="text-center">
                <h1 className="text-3xl font-extrabold tracking-tight">Learn anything in 60 Seconds</h1>
                <p className="mt-3 text-slate-600 dark:text-slate-400">
                    Bitesized cards with a crisp overview and a tiny code snippet. Click a topic, pick a level and start.
                </p>
                <div className="mt-4 flex items-center justify-center gap-3">
                    <Link to="/suggest"  className="rounded-md border px-4 py-2 text-sm">Suggest a topic</Link>
                </div>
            </div>
            <div>
                <h2 className="text-xl font-semibold mb-3">Available Topics</h2>
                {error && <p className="text-red-600">{error}</p>}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {topics.map( topic =>(
                        <Link key={topic.slug} to={`/learn/${topic.slug}`}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-sm"
                        >
                            <div className="text-lg font-semibold">{topic.name}</div>
                            <div className="text-sm text-slate-500">{topic.levels?.join(" • ")}</div>
                        </Link>
                    ))}
                </div>
            </div>
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-semibold">How to use 60SecLearn</h3>
                <ol className="list-decimal ml-5 mt-2 space-y-1 text-sm">
                    <li>Choose a topic (e.g., Python, C++,...).</li>
                    <li>Pick a level in the left panel: Basics, Intermediate, Advanced.</li>
                    <li>Skim the Cards (title + short summary) - Click one to open the 60-seconds read.</li>
                    <li>Glance the timer and code snippet - copy/paste to try immediately.</li>
                    <li>Use search to filter cards and keyboard to move quickly</li>
                </ol>
            </div>

        </section>
    )
};
