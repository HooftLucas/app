import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Bibliotheek from "./pages/Bibliotheek";
import UploadOefening from "./pages/UploadOefening";

export default function App() {
  return (
    <Router>
      <nav className="bg-gray-800 p-4 text-white flex gap-4">
        <Link to="/">Bibliotheek</Link>
        <Link to="/upload">Nieuwe oefening</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Bibliotheek />} />
        <Route path="/upload" element={<UploadOefening />} />
      </Routes>
    </Router>
  );
}
