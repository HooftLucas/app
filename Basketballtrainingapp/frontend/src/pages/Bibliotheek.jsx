import React, { useEffect, useState } from "react";
import OefeningList from "../components/OefeningList";

export default function Bibliotheek() {
  const [oefeningen, setOefeningen] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/oefeningen")
      .then((res) => res.json())
      .then((data) => setOefeningen(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📚 Oefeningenbibliotheek</h1>
      <OefeningList oefeningen={oefeningen} />
    </div>
  );
}
