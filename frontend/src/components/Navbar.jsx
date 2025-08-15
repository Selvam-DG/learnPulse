import { Link, NavLink } from "react-router-dom";

export default function Navbar({dark, setDark}) {

    return(
        <header className="border-b border-slate-200/50 dark:border-slate-700/50">
            <div  className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                <Link to="/" className="font-extrabold tracking-tight text-lg">60SecLearn</Link>
                <nav className="flex gap-4 items-center">
                    <NavLink to="/" className="hover:underline" >Home</NavLink>
                    <NavLink to="/suggest" className="hover:underline">Suggest a Topic</NavLink>
                    <button onClick={ () => setDark( d=> !d)}
                     className="rounded px-3 py-1 border border-slate-300 dark:border-slate-600 text-sm"
                     aria-label="Toggle dark mode"
                        >
                        {dark? 'Light_Mode' :'Dark_Mode'}
                    </button>

                </nav>
            </div>
        </header>
    )
    
};
