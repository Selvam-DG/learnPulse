export default function LessonCard({ item, onOpen }) {
    return (
        <article className="group rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow-sm transition">
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 line-clamp-3">{item.summary}</p>
            <div className="mt-3">
                <button onClick={ () => onOpen(item.slug)}
                    className="text-sm underline underline-offset-4"    
                >
                    Read in 60Sec
                </button>
            </div>

        </article>
    )
    
};
