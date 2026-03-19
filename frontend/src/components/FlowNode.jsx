import { Handle, Position } from "reactflow";

const colors = {
  pdf_loader: "from-blue-500 to-blue-700",
  text_splitter: "from-purple-500 to-purple-700",
  embedder: "from-green-500 to-green-700",
  vector_store: "from-yellow-500 to-yellow-600",
  retriever: "from-orange-500 to-orange-700",
  llm: "from-red-500 to-red-700",
};

export default function FlowNode({ id, data }) {

  const { setNodes, setEdges } = window.__FLOW_CONTEXT__;

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
    setEdges((eds) =>
      eds.filter((e) => e.source !== id && e.target !== id)
    );
  };

  return (
    <div
      className={`rounded-2xl shadow-xl bg-zinc-900 border border-zinc-800 min-w-[200px] transition duration-300 ${
        data.running ? "ring-4 ring-indigo-500 scale-105" : ""
      }`}
    >
      <div
        className={`px-4 py-2 rounded-t-2xl bg-gradient-to-r ${
          colors[data.type] || "from-indigo-500 to-indigo-700"
        } text-sm font-semibold flex justify-between items-center`}
      >
        {data.type}

        <button
          onClick={handleDelete}
          className="text-xs text-red-300 hover:text-red-500"
        >
          ✕
        </button>
      </div>

      <div className="p-4 text-xs text-zinc-400">
        {data.running
          ? "Running..."
          : Object.keys(data.config || {}).length === 0
          ? "Not configured"
          : "Configured ✔"}
      </div>

      <Handle type="target" position={Position.Left} className="!bg-indigo-500" />
      <Handle type="source" position={Position.Right} className="!bg-indigo-500" />
    </div>
  );
}
