import React from "react";

export default function OefeningCard({ oefening }) {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 hover:shadow-lg transition">
      <h2 className="text-xl font-semibold mb-2">{oefening.titel}</h2>
      <p className="text-sm text-gray-500 mb-1">🎯 Doelgroep: {oefening.doelgroep}</p>
      <p className="text-sm text-gray-500 mb-1">⏱️ Duur: {oefening.duur}</p>
      <p className="text-sm text-gray-500 mb-3">🏷️ Thema: {oefening.thema}</p>
      <p className="text-gray-700">{oefening.beschrijving}</p>
    </div>
  );
}
