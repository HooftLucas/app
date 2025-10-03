import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Bibliotheek from "./pages/Bibliotheek";
import UploadOefening from "./pages/UploadOefening";
import OefeningDetail from "./pages/OefeningDetail";

function App() {
  return (
    <Router>
      <nav className="bg-gray-800 p-4 text-white">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Link to="/" className="hover:text-gray-300">Bibliotheek</Link>
          <Link to="/upload" className="hover:text-gray-300">Nieuwe oefening</Link>
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Bibliotheek />} />
        <Route path="/upload" element={<UploadOefening />} />
        <Route path="/oefening/:id" element={<OefeningDetail />} />
        <Route path="/oefening/:id/edit" element={<UploadOefening />} />
      </Routes>
    </Router>
  );
}

export default App;