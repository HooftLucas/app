import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function OefeningDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [oefening, setOefening] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOefening = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/oefeningen/${id}`);
        if (!res.ok) throw new Error('Oefening niet gevonden');
        const data = await res.json();
        setOefening(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOefening();
  }, [id]);

  if (loading) return <div className="p-4">Laden...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;
  if (!oefening) return <div className="p-4">Oefening niet gevonden</div>;

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-4">
        <button 
          onClick={() => navigate('/')}
          className="text-blue-500 hover:text-blue-700 mr-4"
        >
          ← Terug naar overzicht
        </button>
        <button
          onClick={() => navigate(`/oefening/${id}/edit`)}
          className="text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
        >
          Edit
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">{oefening.titel}</h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Algemene Info</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Categorie:</span> {oefening.categorie || '-'} </p>
            <p><span className="font-medium">Leeftijdsgroep:</span> {oefening.doelgroep}</p>
            <p><span className="font-medium">Duur:</span> {oefening.duur} minuten</p>
            <p><span className="font-medium">Topics:</span> {oefening.topics && oefening.topics.length ? oefening.topics.join(', ') : '-'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Teaching Points</h2>
          <ul className="list-disc pl-5 space-y-2">
            {oefening.teaching_points && oefening.teaching_points.length ? (
              oefening.teaching_points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))
            ) : (
              <li>Geen teaching points opgegeven</li>
            )}
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Beschrijving</h2>
          <p className="whitespace-pre-wrap">{oefening.beschrijving}</p>

          {oefening.diagram && oefening.diagram.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium">Diagram</h3>
              <p className="text-sm text-gray-600">Diagram met {oefening.diagram.length} elementen (wordt niet visueel weergegeven)</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OefeningDetail;