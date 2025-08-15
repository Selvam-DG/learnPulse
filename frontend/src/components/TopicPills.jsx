import {Link, useParams} from 'react-router-dom';

export default function TopicPills( {topics}) {
    const {topicSlug} = useParams();

    return (
        <div className="flex flex-wrap gap-2">
            {topics.map( topic =>(
                <Link
                key = {topic.slug} to={`/learn/${topic.slug}`}
                className={"px-3 py-1 rounded-full border text-sm" +
                    (topic.slug === topicSlug ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900" :"border-slate-300 dark:border-slate-600")
                }
                >
                {topic.name}</Link>
            ))}
        </div>
    )
    
};
