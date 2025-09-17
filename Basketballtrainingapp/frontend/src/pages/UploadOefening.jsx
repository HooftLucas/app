import React, { useState } from "react";

export default function UploadOefening() {
  const [formData, setFormData] = useState({
    titel: "",
    doelgroep: "",
    duur: "",
    thema: "",
    beschrijving: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://127.0.0.1:5000/oefeningen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Oefening toegevoegd!");
        setFormData({ titel: "", doelgroep: "", duur: "", thema: "", beschrijving: "" });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">➕ Nieuwe Oefening</h1>
      <form onSubmit={handleSubmit} className="grid gap-4 max-w-md">
        <input name="titel" placeholder="Titel" value={formData.titel} onChange={handleChange} className="p-2 border rounded" required />
        <input name="doelgroep" placeholder="Doelgroep (bv. U12)" value={formData.doelgroep} onChange={handleChange} className="p-2 border rounded" required />
        <input name="duur" placeholder="Duur (bv. 10 min)" value={formData.duur} onChange={handleChange} className="p-2 border rounded" required />
        <input name="thema" placeholder="Thema (bv. Dribbel)" value={formData.thema} onChange={handleChange} className="p-2 border rounded" required />
        <textarea name="beschrijving" placeholder="Beschrijving" value={formData.beschrijving} onChange={handleChange} className="p-2 border rounded" required />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">Oefening opslaan</button>
      </form>
    </div>
  );
}
