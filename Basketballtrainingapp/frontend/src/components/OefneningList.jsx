import React from "react";
import OefeningCard from "./OefeningCard";

export default function OefeningList({ oefeningen }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {oefeningen.map((o, index) => (
        <OefeningCard key={index} oefening={o} />
      ))}
    </div>
  );
}
