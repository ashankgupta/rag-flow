export default function Sidebar() {
  const nodes = [
    "pdf_loader",
    "text_splitter",
    "embedder",
    "vector_store",
    "retriever",
    "llm",
  ];

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <div className="w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 p-6 shadow-xl">

      <h2 className="text-xl font-bold mb-6 text-indigo-400">
        Components
      </h2>

      <div className="space-y-4">
        {nodes.map((node) => (
          <div
            key={node}
            draggable
            onDragStart={(event) => onDragStart(event, node)}
            className="p-4 bg-white/5 border border-white/10 rounded-2xl cursor-grab hover:bg-indigo-500/10 hover:border-indigo-400 transition-all duration-200"
          >
            {node}
          </div>
        ))}
      </div>
    </div>
  );
}
