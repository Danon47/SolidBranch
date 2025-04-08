import { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { FaCloudSun, FaTasks, FaChartBar, FaNewspaper, FaCalendarAlt, FaComments } from "react-icons/fa"; // импорт иконок
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const initialWidgets = [
  { i: "1", x: 0, y: 0, w: 3, h: 2 },
  { i: "2", x: 3, y: 0, w: 3, h: 2 },
];

const allWidgetOptions = [
  { id: "1", name: "Weather", icon: <FaCloudSun /> },
  { id: "2", name: "Tasks", icon: <FaTasks /> },
  { id: "3", name: "Stats", icon: <FaChartBar /> },
  { id: "4", name: "News", icon: <FaNewspaper /> },
  { id: "5", name: "Calendar", icon: <FaCalendarAlt /> },
  { id: "6", name: "Messages", icon: <FaComments /> },
];

export default function Dashboard() {
  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem("widget-layout");
    return saved ? JSON.parse(saved) : initialWidgets;
  });
  const [editing, setEditing] = useState(false);
  const [widgets, setWidgets] = useState(() => layout.map((w) => w.i));
  const [gridWidth, setGridWidth] = useState(() => window.innerWidth - 240);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    localStorage.setItem("widget-layout", JSON.stringify(layout));
  }, [layout]);

  const addWidget = (type) => {
    if (getWidgetCountByType(type) >= 3) return;
    const id = `${type}-${counter}`;
    setCounter(counter + 1);
    setWidgets([...widgets, id]);
    setLayout([
      ...layout,
      {
        i: id,
        x: 0,
        y: Infinity,
        w: 3,
        h: 2,
      },
    ]);
  };

  const removeWidget = (id) => {
    setWidgets(widgets.filter((w) => w !== id));
    setLayout(layout.filter((l) => l.i !== id));
  };
  return (
    <div className="w-full h-screen bg-gray-100 p-[120px]">
      <div className="flex justify-between items-center mb-4">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">LIQN Dashboard</h1>
        <Button onClick={() => setEditing(!editing)} className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition">
          {editing ? "Cancel" : "Edit Dashboard"}
        </Button>
      </div>

      {editing && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
          {allWidgetOptions.map((w) => (
            <div key={w.id} className="border rounded-lg bg-white p-4 shadow-md hover:shadow-lg transition">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xl">{w.icon}</span>
                <p className="text-sm font-medium text-gray-700">{w.name}</p>
              </div>
              <Button
                onClick={() => toggleWidget(w.id)}
                variant={widgets.includes(w.id) ? "destructive" : "default"}
                className="w-full"
              >
                {widgets.includes(w.id) ? "Remove" : "Add"}
              </Button>
            </div>
          ))}
        </div>
      )}

      <Card className="w-full h-[80%] overflow-auto">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={40}
          width={gridWidth}
          onLayoutChange={(l) => setLayout(l)}
          isDraggable={editing}
          isResizable={editing}
        >
          {widgets.map((id) => (
            <div key={id} className="bg-white border rounded-lg shadow-md p-4 overflow-hidden">
              <p className="text-sm text-gray-700 font-semibold">{allWidgetOptions.find((w) => w.id === id)?.name}</p>
              <div className="mt-1 text-xs text-gray-500">
                Placeholder content for widget #{id}
              </div>
            </div>
          ))}
        </GridLayout>
      </Card>
    </div>
  );
}