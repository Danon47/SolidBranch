import { useState, useEffect } from "react";
import GridLayout from "react-grid-layout";
import { Button } from "./components/ui/button";
import { Card } from "./components/ui/card";
import { FaCloudSun, FaTasks, FaChartBar, FaNewspaper, FaCalendarAlt, FaComments } from "react-icons/fa";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";

const initialWidgets = [
  { i: "1-0", x: 0, y: 0, w: 3, h: 2 },
  { i: "2-0", x: 3, y: 0, w: 3, h: 2 },
];

const allWidgetOptions = [
  { id: "1", name: "Weather", icon: <FaCloudSun />, maxCount: 3 },
  { id: "2", name: "Tasks", icon: <FaTasks />, maxCount: 3 },
  { id: "3", name: "Stats", icon: <FaChartBar />, maxCount: 3 },
  { id: "4", name: "News", icon: <FaNewspaper />, maxCount: 3 },
  { id: "5", name: "Calendar", icon: <FaCalendarAlt />, maxCount: 3 },
  { id: "6", name: "Messages", icon: <FaComments />, maxCount: 3 },
];

export default function Dashboard() {
  const [layout, setLayout] = useState(() => {
    const saved = localStorage.getItem("widget-layout");
    return saved ? JSON.parse(saved) : initialWidgets;
  });
  const [editing, setEditing] = useState(false);
  const [nextId, setNextId] = useState(1);

  useEffect(() => {
    localStorage.setItem("widget-layout", JSON.stringify(layout));
  }, [layout]);

  const getWidgetCount = (widgetId) => {
    return layout.filter(w => w.i.split('-')[0] === widgetId).length;
  };

  const addWidget = (widgetId) => {
    const count = getWidgetCount(widgetId);
    const widgetType = allWidgetOptions.find(w => w.id === widgetId);
    
    if (count >= widgetType.maxCount) return;
    
    const newWidget = {
      i: `${widgetId}-${nextId}`,
      x: 0,
      y: Infinity,
      w: 3,
      h: 2,
    };
    setLayout([...layout, newWidget]);
    setNextId(nextId + 1);
  };

  const removeAllWidgets = (widgetId) => {
    setLayout(layout.filter(w => w.i.split('-')[0] !== widgetId));
  };

  const removeWidget = (widgetFullId) => {
    setLayout(layout.filter(w => w.i !== widgetFullId));
  };

  const handleRemoveClick = (e, widgetId) => {
    e.stopPropagation();
    e.preventDefault();
    removeWidget(widgetId);
  };

  return (
    <div className="w-full h-screen bg-gray-100 p-[120px]">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">LIQN Dashboard</h1>
        <Button 
          onClick={() => setEditing(!editing)} 
          className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600 transition"
        >
          {editing ? "Cancel" : "Edit Dashboard"}
        </Button>
      </div>

      {editing && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-4">
          {allWidgetOptions.map((w) => {
            const count = getWidgetCount(w.id);
            const canAddMore = count < w.maxCount;
            
            return (
              <div key={w.id} className="border rounded-lg bg-white p-4 shadow-md hover:shadow-lg transition">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xl">{w.icon}</span>
                  <p className="text-sm font-medium text-gray-700">{w.name}</p>
                  <span className="text-xs bg-gray-200 rounded-full px-2 py-1">
                    {count}/{w.maxCount}
                  </span>
                </div>
                
                <Button
                  onClick={() => addWidget(w.id)}
                  disabled={!canAddMore}
                  className="w-full mb-1"
                >
                  Add
                </Button>
                
                {count > 0 && (
                  <Button
                    onClick={() => removeAllWidgets(w.id)}
                    variant="destructive"
                    className="w-full"
                  >
                    Remove All
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Card className="w-full h-[80%] overflow-auto">
        <GridLayout
          className="layout"
          layout={layout}
          cols={12}
          rowHeight={40}
          width={window.innerWidth - 240}
          onLayoutChange={(newLayout) => setLayout(newLayout)}
          isDraggable={editing}
          isResizable={editing}
        >
          {layout.map((item) => {
            const widgetType = allWidgetOptions.find(w => w.id === item.i.split('-')[0]);
            return (
              <div key={item.i} className="bg-white border rounded-lg shadow-md p-4 overflow-hidden">
                <div className="flex justify-between items-start">
                  <p className="text-sm text-gray-700 font-semibold">
                    {widgetType?.name} #{item.i.split('-')[1]}
                  </p>
                  {editing && (
                    <button 
                      onClick={(e) => handleRemoveClick(e, item.i)}
                      onMouseDown={(e) => e.stopPropagation()}
                      className="text-red-500 hover:text-red-700 text-lg font-bold z-10 relative"
                      title="Remove widget"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Content for {widgetType?.name} widget
                </div>
              </div>
            );
          })}
        </GridLayout>
      </Card>
    </div>
  );
}