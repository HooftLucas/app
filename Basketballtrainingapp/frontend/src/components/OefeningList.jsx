import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function OefeningList({ oefeningen }) {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [doelgroepFilter, setDoelgroepFilter] = useState("");
  
  const leeftijdsGroepen = ["U8", "U10", "U12", "U14", "U16", "U18", "U19", "U21", "seniors"];

  const filteredOefeningen = oefeningen.filter(oef => {
    const matchesTitle = (oef.titel || '').toLowerCase().includes(filter.toLowerCase());
    const matchesDoelgroep = !doelgroepFilter || oef.doelgroep === doelgroepFilter;
    return matchesTitle && matchesDoelgroep;
  });

  return (
    <div className="w-full">
      <div className="mb-4 flex gap-4">
        <input
          type="text"
          placeholder="Zoek op titel..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border rounded"
        />
        <select
          value={doelgroepFilter}
          onChange={(e) => setDoelgroepFilter(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">Alle leeftijden</option>
          {leeftijdsGroepen.map(groep => (
            <option key={groep} value={groep}>{groep}</option>
          ))}
        </select>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titel</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categorie</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Leeftijdsgroep</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teaching Points</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredOefeningen.map((oefening) => (
            <tr
              key={oefening.id}
              onClick={() => navigate(`/oefening/${oefening.id}`)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{oefening.titel}</div></td>
              <td className="px-6 py-4"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">{oefening.categorie || '-'}</span></td>
              <td className="px-6 py-4"><span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{oefening.doelgroep}</span></td>
              <td className="px-6 py-4">
                <ul className="list-disc pl-5 text-sm text-gray-600">
                  {(oefening.teaching_points || []).slice(0,3).map((point, idx) => (
                    <li key={idx}>{point}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OefeningList;