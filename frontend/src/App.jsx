import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:5000/api/topics")
      .then((response) => {
        setTopics(response.data);
        console.log("Fetched topics:", response.data);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl text-blue-600 mb-4">Hello World</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topics.map((topic, index) => (
          <div key={index} className="bg-white p-4 shadow rounded">
            <h2 className="text-xl font-bold">{topic.title}</h2>
            <p className="text-gray-700">{topic.content}</p>

            <div className="mt-2">
              {topic.code_snippets?.map((snippet, i) => (
                <pre
                  key={i}
                  className="bg-gray-100 p-2 rounded text-sm overflow-x-auto"
                >
                  {snippet}
                </pre>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
