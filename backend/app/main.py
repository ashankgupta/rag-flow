from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from app.engine.flow_executor import FlowExecutor
import app.nodes  # ensure nodes register
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
import os

app = FastAPI()

# ✅ ADD THIS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/run-flow")
async def run_flow(flow: dict):
    executor = FlowExecutor(flow)
    executor.build_graph()
    result = executor.execute()
    if hasattr(result, "__iter__") and not isinstance(result, dict):
        def token_stream():
            for chunk in result:
                yield chunk
        return StreamingResponse(token_stream(), media_type="text/plain")
    return result

@app.get("/documents")
async def list_documents():

    persist_directory = "./chroma_db"

    if not os.path.exists(persist_directory):
        return {"documents": []}

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectordb = Chroma(
        persist_directory=persist_directory,
        embedding_function=embeddings
    )

    collection = vectordb._collection.get()

    sources = {}

    for meta in collection["metadatas"]:
        source = meta.get("source")
        if source:
            sources[source] = sources.get(source, 0) + 1

    docs = [
        {"source": k, "chunks": v}
        for k, v in sources.items()
    ]

    return {"documents": docs}

@app.delete("/documents/{source}")
async def delete_document(source: str):

    embeddings = HuggingFaceEmbeddings(
        model_name="sentence-transformers/all-MiniLM-L6-v2"
    )

    vectordb = Chroma(
        persist_directory="./chroma_db",
        embedding_function=embeddings
    )

    vectordb._collection.delete(
        where={"source": source}
    )

    return {"message": f"{source} deleted"}
