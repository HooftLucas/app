import React, { useEffect, useState } from "react";
import OefeningList from "../components/OefeningList";

function Bibliotheek() {
  const [oefeningen, setOefeningen] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOefeningen = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/oefeningen");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setOefeningen(data.oefeningen || []);
      } catch (e) {
        setError("Kan oefeningen niet laden. Controleer of de backend server draait.");
        console.error("Error fetching oefeningen:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOefeningen();
  }, []);

  if (loading) return <div className="max-w-4xl mx-auto p-4">Laden...</div>;
  if (error) return <div className="max-w-4xl mx-auto p-4 text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl mb-4">Oefeningen Bibliotheek</h2>
      {oefeningen.length === 0 ? (
        <p>Geen oefeningen gevonden.</p>
      ) : (
        <OefeningList oefeningen={oefeningen} />
      )}
    </div>
  );
}

export default Bibliotheek;