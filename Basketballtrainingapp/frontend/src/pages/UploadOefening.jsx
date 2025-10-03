import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CourtDiagram from "./Courtdiagram";

function UploadOefening() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [showDiagram, setShowDiagram] = useState(false);
  const [diagram, setDiagram] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const categorieOptions = ["defence", "offense", "warming up", "games"];
  const leeftijdsGroepen = ["U8", "U10", "U12", "U14", "U16", "U18", "U19", "U21", "seniors"];
  const topicOptions = [
    "Balhandling",
    "Passing",
    "Rebounding",
    "Shooting",
    "Screens",
    "Offensieve transitie",
    "Defensieve transitie",
    "Individual position skills",
    "Half court defense",
    "1on1 defense",
    "Finishing",
  ];
  const positionOptions = ["Guard", "Forward", "Center"];

  const [formData, setFormData] = useState({
    titel: "",
    categorie: categorieOptions[0],
    doelgroep: leeftijdsGroepen[0],
    duur: "",
    topics: [], // array of strings
    teaching_point: "",
    uitleg: "",
    diagram: null,
    positions: [], // for individual position sub-selection
  });

  const [melding, setMelding] = useState("");

  useEffect(() => {
    // If an id param is present, fetch the oefening and prefill form (edit mode)
    if (id) {
      setIsEdit(true);
      fetch(`http://localhost:5000/api/oefeningen/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error('Oefening niet gevonden');
          return res.json();
        })
        .then((data) => {
          // Map backend fields to formData structure
          setFormData((prev) => ({
            ...prev,
            titel: data.titel || '',
            categorie: data.categorie || prev.categorie,
            doelgroep: data.doelgroep || prev.doelgroep,
            duur: data.duur || '',
            topics: data.topics || [],
            positions: data.positions || [],
            teaching_point: (data.teaching_points && data.teaching_points.join('\n')) || (data.teaching_point || ''),
            uitleg: data.beschrijving || data.uitleg || '',
            diagram: data.diagram || null,
          }));
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }, []);

  const handleDiagramSave = (diagramData) => {
    setShowDiagram(false);
    if (diagramData) {
      setDiagram(diagramData);
      setFormData((prev) => ({ ...prev, diagram: diagramData }));
    }
  };

  const toggleTopic = (topic) => {
    setFormData((prev) => {
      const topics = prev.topics.includes(topic)
        ? prev.topics.filter((t) => t !== topic)
        : [...prev.topics, topic];
      return { ...prev, topics };
    });
  };

  const togglePosition = (pos) => {
    setFormData((prev) => {
      const positions = prev.positions.includes(pos)
        ? prev.positions.filter((p) => p !== pos)
        : [...prev.positions, pos];
      return { ...prev, positions };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Build payload mapping to backend fields (backwards compatible)
      const payload = {
        titel: formData.titel,
        categorie: formData.categorie,
        doelgroep: formData.doelgroep,
        duur: Number(formData.duur),
        topics: formData.topics,
        positions: formData.positions,
        teaching_points: formData.teaching_point ? formData.teaching_point.split('\n').filter(Boolean) : [],
        beschrijving: formData.uitleg,
        diagram: formData.diagram,
      };

      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `http://localhost:5000/api/oefeningen/${id}` : 'http://localhost:5000/api/oefeningen';
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => null);
        throw new Error(err && err.error ? err.error : "Er ging iets mis bij het toevoegen van de oefening.");
      }

      setMelding("Oefening succesvol toegevoegd!");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      console.error(error);
      setMelding(error.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl mb-4">Maak een nieuwe oefening</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Titel bovenaan */}
        <div>
          <label className="block mb-1 font-medium">Titel van de oefening</label>
          <input
            name="titel"
            type="text"
            value={formData.titel}
            onChange={(e) => setFormData({ ...formData, titel: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Grote 3-koloms layout voor meerdere tabellen naast elkaar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Kolom 1: Algemene info */}
          <div className="bg-white border rounded p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Algemene info</h3>
            <div className="space-y-4">
              <div>
                <label className="block mb-1">Categorie</label>
                <select
                  value={formData.categorie}
                  onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  {categorieOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Leeftijd</label>
                <select
                  value={formData.doelgroep}
                  onChange={(e) => setFormData({ ...formData, doelgroep: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  {leeftijdsGroepen.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1">Duur (minuten)</label>
                <input
                  name="duur"
                  type="number"
                  value={formData.duur}
                  onChange={(e) => setFormData({ ...formData, duur: e.target.value })}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>
          </div>

          {/* Kolom 2: Topics */}
          <div className="bg-white border rounded p-4 shadow-sm">
            <h3 className="font-semibold mb-3">Topics</h3>
            <div className="grid grid-cols-1 gap-2 max-h-64 overflow-auto">
              {topicOptions.map((topic) => (
                <label key={topic} className="flex items-center gap-2 p-1">
                  <input
                    id={`topic-${topic}`}
                    type="checkbox"
                    checked={formData.topics.includes(topic)}
                    onChange={() => toggleTopic(topic)}
                  />
                  <span>{topic}</span>
                </label>
              ))}
            </div>

            {formData.topics.includes("Individual position skills") && (
              <div className="mt-3 border p-3 rounded bg-gray-50">
                <div className="font-medium mb-2">Individual position skills - kies posities</div>
                <div className="flex gap-4">
                  {positionOptions.map((pos) => (
                    <label key={pos} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.positions.includes(pos)}
                        onChange={() => togglePosition(pos)}
                      />
                      {pos}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Kolom 3: Teaching / Uitleg / Diagram */}
          <div className="bg-white border rounded p-4 shadow-sm flex flex-col">
            <h3 className="font-semibold mb-3">Teaching / Uitleg / Tekening</h3>

            <div className="mb-3 flex-1">
              <label className="block mb-1">Teaching point</label>
              <textarea
                name="teaching_point"
                value={formData.teaching_point}
                onChange={(e) => setFormData({ ...formData, teaching_point: e.target.value })}
                className="w-full p-2 border rounded h-28"
              />
            </div>

            <div className="mb-3">
              <label className="block mb-1">Uitleg</label>
              <textarea
                name="uitleg"
                value={formData.uitleg}
                onChange={(e) => setFormData({ ...formData, uitleg: e.target.value })}
                className="w-full p-2 border rounded h-28"
              />
            </div>

            <div>
              <label className="block mb-1">Tekening (diagram)</label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowDiagram(true)}
                  className="p-2 border rounded bg-gray-50 hover:bg-gray-100"
                >
                  {formData.diagram ? "Diagram bewerken" : "Diagram toevoegen"}
                </button>

                {formData.diagram && (
                  <div className="text-sm text-gray-600">Diagram aanwezig ({formData.diagram.length} items)</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actieknoppen onderaan, full width */}
        <div className="pt-4 border-t flex justify-end gap-3">
          <button type="button" onClick={() => navigate('/')} className="px-4 py-2 bg-gray-200 rounded">Annuleren</button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">Opslaan oefening</button>
        </div>
      </form>

      {melding && (
        <div className={`mt-4 p-4 rounded ${melding.includes("succesvol") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {melding}
        </div>
      )}

      {showDiagram && <CourtDiagram onSave={handleDiagramSave} />}
    </div>
  );
}

export default UploadOefening;