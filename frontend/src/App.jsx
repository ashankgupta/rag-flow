import { useState, useRef } from "react";
import FlowCanvas from "./FlowCanvas";
import Sidebar from "./Sidebar";
import OutputPanel from "./components/OutputPanel";
import NodeConfigPanel from "./components/NodeConfigPanel";
import DocumentManager from "./components/DocumentManager";
import { runFlow } from "./api";

export default function App() {
  const fileInputRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

const handleExport = () => {
  const flowData = { nodes, edges };

  const blob = new Blob(
    [JSON.stringify(flowData, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "rag-flow.json";
  a.click();

  URL.revokeObjectURL(url);
};

const handleImport = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const flowData = JSON.parse(e.target.result);

      if (flowData.nodes && flowData.edges) {
        setNodes(flowData.nodes);
        setEdges(flowData.edges);
      } else {
        alert("Invalid flow file");
      }
    } catch {
      alert("Invalid JSON file");
    }
  };

  reader.readAsText(file);
};

const handleRun = async () => {
  setOutput("");
  setLoading(true);

  const updatedNodes = nodes.map((node) => {
    if (node.data.type === "retriever") {
      return {
        ...node,
        data: {
          ...node.data,
          config: {
            ...node.data.config,
            source: selectedDoc || undefined,
          },
        },
      };
    }
    return node;
  });

  try {
    await runFlow({ nodes: updatedNodes, edges }, (token) => {
      setOutput((prev) => (prev || "") + token);
    });
  } catch (err) {
    setOutput("Execution Failed");
  }

  setLoading(false);
};
  return (
    <div className="h-full flex">

      {/* LEFT SIDEBAR */}
      <Sidebar />

      {/* CENTER CANVAS AREA */}
      <div className="flex-1 relative">

        {/* HEADER BAR */}
        <div className="absolute top-0 left-0 right-0 h-14 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-between px-6 shadow-lg z-10">
          <div className="text-lg font-semibold tracking-wide">
            rag-flow
          </div>

          <div className="flex gap-3">

            <button
              onClick={handleExport}
              className="px-4 py-2 bg-white/20 rounded-xl hover:scale-105 transition"
            >
              ⬇ Export
            </button>

            <button
              onClick={() => fileInputRef.current.click()}
              className="px-4 py-2 bg-white/20 rounded-xl hover:scale-105 transition"
            >
              ⬆ Import
            </button>

            <button
              onClick={handleRun}
              className="px-6 py-2 bg-black/30 backdrop-blur-md border border-white/20 rounded-xl hover:scale-105 transition"
            >
              {loading ? "Running..." : "▶ Run Flow"}
            </button>

            </div>
        </div>

          <input
            type="file"
            accept="application/json"
            ref={fileInputRef}
            onChange={handleImport}
            style={{ display: "none" }}
          />

        {/* FLOW CANVAS */}
        <div className="absolute top-14 bottom-0 left-0 right-0">
          <FlowCanvas
            nodes={nodes}
            edges={edges}
            setNodes={setNodes}
            setEdges={setEdges}
            setSelectedNode={setSelectedNode}
          />
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="w-96 bg-white/5 backdrop-blur-xl border-l border-white/10 flex flex-col shadow-xl">
        <div className="overflow-auto">
          <DocumentManager
            selectedDoc={selectedDoc}
            setSelectedDoc={setSelectedDoc}
          />
        </div>
        <div className="flex-1 border-b border-white/10 overflow-auto">
          <NodeConfigPanel
            selectedNode={selectedNode}
            setNodes={setNodes}
          />
        </div>

        <div className="flex-1 overflow-auto">
          <OutputPanel output={output} />
        </div>
      </div>
    </div>
  );
}
