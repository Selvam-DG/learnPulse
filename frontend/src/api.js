const BASEURI = import.meta.env.VITE_API_URI ||"";

export async function fetchTopics(){
    const response = await fetch(`${BASEURI}/api/topics`);
    if(!response.ok) throw new Error('Failed to load topics');
    return response.json();
}

export async function fetchLessonsBy(slug, level) {
    const url = new URL(`${BASEURI}/api/topics/${slug}/lessons`);
    if(level) url.searchParams.set('level', level);
    const res = await fetch(url);
    if (!res.ok) throw new Error('Failed to load lessons');
    const data  = await res.json()

    return Array.isArray(data) ? data : (data.items ?? []);
}

export async function fetchLesson(slug) {
    const response = await fetch(`${BASEURI}/api/lessons/${slug}`);
    if (!response.ok) throw new Error('Lesson Not Found');
    return response.json();
    
}

export async function sendFeedback(payLoad){
    const response = await fetch(`${BASEURI}/api/feedback`,{
        method: 'POST',
        headers:{'Content-Type':'application/json'},
        body : JSON.stringify(payLoad),
    });
    if (!response.ok) throw new Error ('Failed to send');
    return response.json();
}