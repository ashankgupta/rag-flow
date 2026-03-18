import { useEffect, useState } from "react";
import { getDocuments, deleteDocument } from "../api";

export default function DocumentManager({
  selectedDoc,
  setSelectedDoc
}) {
  const [docs, setDocs] = useState([]);

  const loadDocs = async () => {
    const res = await getDocuments();
    setDocs(res.documents);
  };

  useEffect(() => {
    loadDocs();
  }, []);

  const handleDelete = async (source) => {
    await deleteDocument(source);
    if (selectedDoc === source) {
      setSelectedDoc(null);
    }
    loadDocs();
  };

  return (
    <div className="p-4 border-b border-white/10">
      <h3 className="text-lg font-semibold mb-4 text-indigo-400">
        📚 Indexed Documents
      </h3>

      <div
        onClick={() => setSelectedDoc(null)}
        className={`p-2 rounded mb-2 cursor-pointer ${
          selectedDoc === null
            ? "bg-indigo-600"
            : "bg-white/5"
        }`}
      >
        🔍 Query All Documents
      </div>

      {docs.map((doc) => (
        <div
          key={doc.source}
          className={`flex justify-between items-center p-3 rounded-xl mb-2 cursor-pointer ${
            selectedDoc === doc.source
              ? "bg-indigo-600"
              : "bg-white/5"
          }`}
          onClick={() => setSelectedDoc(doc.source)}
        >
          <div>
            <div className="text-sm font-medium">
              {doc.source}
            </div>
            <div className="text-xs text-zinc-400">
              {doc.chunks} chunks
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(doc.source);
            }}
            className="text-red-400 hover:text-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
