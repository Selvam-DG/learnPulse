export default function SearchBox({ value, onChange }) {
    return(
        <input
            value={value}
            onChange={ e => onChange(e.target.value)}
            placeholder="Search lessons...."
            className="w-full md:w-72 rounded-md border border-slate.300 dark:border-slate-600 px-3 py-2 text-sm"
            aria-label="Search lessons"
        />
    )
    
};
