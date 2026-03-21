export default function OutputPanel({ output }) {

  const renderContent = () => {
    if (!output) return "Waiting for response...";

    if (typeof output === "string") return output;

    if (typeof output === "object") {
      return JSON.stringify(output, null, 2);
    }

    return String(output);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-4 text-indigo-400">
        Output
      </h3>

      <pre className="text-sm whitespace-pre-wrap">
        {renderContent()}
      </pre>
    </div>
  );
}
