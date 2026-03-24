export const runFlow = async (flow, onToken) => {
  const response = await fetch("http://127.0.0.1:8000/run-flow", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(flow),
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let done = false;

  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;

    const chunk = decoder.decode(value);
    onToken(chunk);
  }
};
export const getDocuments = async () => {
  const res = await fetch("http://127.0.0.1:8000/documents");
  return res.json();
};

export const deleteDocument = async (source) => {
  const res = await fetch(
    `http://127.0.0.1:8000/documents/${source}`,
    { method: "DELETE" }
  );

  return res.json();
};
