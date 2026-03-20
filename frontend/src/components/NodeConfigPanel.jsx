import { useEffect, useState } from "react";

export default function NodeConfigPanel({ selectedNode, setNodes }) {
  const [config, setConfig] = useState({});

  useEffect(() => {
    if (selectedNode) {
      setConfig(selectedNode.data.config || {});
    }
  }, [selectedNode]);

  if (!selectedNode) {
    return (
      <div className="p-4 text-zinc-500">
        Select a node to configure
      </div>
    );
  }

  const updateField = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);

    setNodes((nds) =>
      nds.map((node) =>
        node.id === selectedNode.id
          ? { ...node, data: { ...node.data, config: newConfig } }
          : node
      )
    );
  };

  const type = selectedNode.data.type;

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-indigo-400">
        {type} Config
      </h3>

      {type === "pdf_loader" && (
        <Input
          label="PDF Absolute Path"
          value={config.path || ""}
          onChange={(v) => updateField("path", v)}
        />
      )}

      {type === "text_splitter" && (
        <>
          <Input
            label="Chunk Size"
            value={config.chunk_size || 500}
            onChange={(v) => updateField("chunk_size", Number(v))}
          />
          <Input
            label="Chunk Overlap"
            value={config.chunk_overlap || 50}
            onChange={(v) => updateField("chunk_overlap", Number(v))}
          />
        </>
      )}

      {type === "embedder" && (
        <Input
          label="Embedding Model"
          value={config.model || "sentence-transformers/all-MiniLM-L6-v2"}
          onChange={(v) => updateField("model", v)}
        />
      )}

      {type === "vector_store" && (
        <Input
          label="Persist Directory"
          value={config.persist_dir || "./chroma_db"}
          onChange={(v) => updateField("persist_dir", v)}
        />
      )}

      {type === "retriever" && (
        <Input
          label="Query"
          value={config.query || ""}
          onChange={(v) => updateField("query", v)}
        />
      )}

      {type === "llm" && (
        <Input
          label="Model Name"
          value={config.model || "llama3"}
          onChange={(v) => updateField("model", v)}
        />
      )}
    </div>
  );
}

function Input({ label, value, onChange }) {
  return (
    <div className="mb-4">
      <label className="block text-sm mb-1 text-zinc-400">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 bg-zinc-800 rounded border border-zinc-700"
      />
    </div>
  );
}
