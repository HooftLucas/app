import React, { useState } from "react";
import {
  Stage,
  Layer,
  Rect,
  Circle,
  Line,
  Text,
  RegularPolygon,
  Arrow,
  Image as KonvaImage,
} from "react-konva";
import useImage from "use-image";

function CourtDiagram({ onSave }) {
  const [elements, setElements] = useState([]);
  const [selectedTool, setSelectedTool] = useState("player");
  const [courtType, setCourtType] = useState("half"); // "half" or "full"

  // Load backgrounds
  const [halfCourtImage] = useImage("/images/halfcourt_basketball_court.png");
  const [fullCourtImage] = useImage("/images/fullcourt_basketball_court.png");

  const tools = [
    { id: "player", label: "Aanvaller (O)", icon: "🔵" },
    { id: "defender", label: "Verdediger (X)", icon: "🔴" },
    { id: "ball", label: "Basketbal", icon: "🏀" },
    { id: "cone", label: "Kegel", icon: "🔺" },
    { id: "pass", label: "Pas", icon: "➡️" },
    { id: "dribble", label: "Dribbel", icon: "➰" },
    { id: "movement", label: "Looplijn", icon: "⬆️" },
  ];

  const handleCanvasClick = (e) => {
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();

    const newElement = {
      id: elements.length + 1,
      type: selectedTool,
      x: pointerPosition.x,
      y: pointerPosition.y,
    };

    setElements([...elements, newElement]);
  };

  const renderElement = (element) => {
    switch (element.type) {
      case "player":
        return (
          <Circle
            key={element.id}
            x={element.x}
            y={element.y}
            radius={12}
            stroke="blue"
            strokeWidth={3}
          />
        );
      case "defender":
        return (
          <Text
            key={element.id}
            x={element.x - 8}
            y={element.y - 12}
            text="X"
            fontSize={24}
            fill="red"
            fontStyle="bold"
          />
        );
      case "ball":
        return (
          <Circle
            key={element.id}
            x={element.x}
            y={element.y}
            radius={8}
            fill="orange"
            stroke="black"
          />
        );
      case "cone":
        return (
          <RegularPolygon
            key={element.id}
            x={element.x}
            y={element.y}
            sides={3}
            radius={10}
            fill="red"
          />
        );
      case "pass":
        return (
          <Arrow
            key={element.id}
            points={[element.x, element.y, element.x + 60, element.y - 40]}
            stroke="green"
            fill="green"
            strokeWidth={2}
            dash={[10, 5]}
          />
        );
      case "dribble":
        return (
          <Line
            key={element.id}
            points={[element.x, element.y, element.x + 40, element.y + 40]}
            stroke="purple"
            strokeWidth={2}
            dash={[6, 6]}
            tension={0.5}
            bezier
          />
        );
      case "movement":
        return (
          <Arrow
            key={element.id}
            points={[element.x, element.y, element.x + 60, element.y]}
            stroke="black"
            fill="black"
            strokeWidth={2}
          />
        );
      default:
        return null;
    }
  };

  // Court size depending on type
  const courtWidth = courtType === "half" ? 600 : 900;
  const courtHeight = courtType === "half" ? 400 : 500;
  const courtImage = courtType === "half" ? halfCourtImage : fullCourtImage;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow-lg w-full max-w-6xl">
        <h2 className="text-xl font-bold mb-4">Basketbalveld Diagram</h2>
        <div className="flex gap-4">
          {/* Tools */}
          <div className="w-52 bg-gray-100 p-2 rounded">
            <h3 className="font-semibold mb-2">Gereedschap</h3>
            <div className="space-y-2">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`w-full p-2 text-left rounded flex items-center gap-2 ${
                    selectedTool === tool.id
                      ? "bg-blue-100"
                      : "hover:bg-gray-200"
                  }`}
                >
                  <span>{tool.icon}</span>
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>

            {/* Court switch */}
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Veldtype</h3>
              <button
                onClick={() =>
                  setCourtType(courtType === "half" ? "full" : "half")
                }
                className="w-full p-2 bg-yellow-200 rounded hover:bg-yellow-300"
              >
                Wissel naar {courtType === "half" ? "Full Court" : "Half Court"}
              </button>
            </div>
          </div>

          {/* Basketball Court */}
          <div className="flex-1 border rounded p-4 overflow-auto">
            <Stage
              width={courtWidth}
              height={courtHeight}
              onClick={handleCanvasClick}
              style={{ backgroundColor: "#f0f0f0", border: "2px solid #000" }}
            >
              <Layer>
                {courtImage && (
                  <KonvaImage
                    image={courtImage}
                    x={0}
                    y={0}
                    width={courtWidth}
                    height={courtHeight}
                  />
                )}
              </Layer>
              <Layer>
                {elements.map((element) => renderElement(element))}
              </Layer>
            </Stage>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => onSave(null)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Annuleren
          </button>
          <button
            onClick={() => onSave(elements)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Opslaan
          </button>
        </div>
      </div>
    </div>
  );
}

export default CourtDiagram;
