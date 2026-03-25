# RAG Flow

A visual, node-based RAG (Retrieval-Augmented Generation) pipeline builder that allows you to create, customize, and execute RAG workflows through an intuitive drag-and-drop interface.

## Overview

RAG Flow enables you to build complex document processing and question-answering pipelines by connecting different nodes in a visual graph. Each node performs a specific task—loading documents, splitting text, generating embeddings, storing vectors, retrieving relevant context, and generating AI responses.

## Architecture

```
┌─────────────┐     ┌───────────────┐     ┌─────────────┐
│  PDF Loader │ ──▶ │ Text Splitter │ ──▶ │  Embedder   │
└─────────────┘     └───────────────┘     └─────────────┘
                                                  │
                                                  ▼
┌─────────────┐     ┌───────────────┐     ┌─────────────┐
│ LLM Response │ ◀───│   Retriever   │ ◀───│ Vector Store│
└─────────────┘     └───────────────┘     └─────────────┘
```

## Tech Stack

| Component | Technology |
|-----------|------------|
| Backend | FastAPI, Python |
| Frontend | React + Vite + ReactFlow |
| Vector Store | ChromaDB |
| Embeddings | HuggingFace (sentence-transformers/all-MiniLM-L6-v2) |
| LLM | Ollama (llama3) |
| Graph Execution | NetworkX |

## Getting Started

### Prerequisites

- Python 3.9+
- Node.js 18+
- Ollama installed and running

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn app.main:app --reload
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Ollama Setup

Make sure Ollama is running with the llama3 model:

```bash
ollama pull llama3
ollama serve
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/run-flow` | Execute a RAG flow |
| GET | `/documents` | List all indexed documents |
| DELETE | `/documents/{source}` | Delete a document by source |

## Implemented Features

### Nodes

- **PDF Loader** - Load PDF documents from file paths
- **Text Splitter** - Split documents into overlapping chunks (default: 500 chars, 50 overlap)
- **Embedder** - Generate embeddings using HuggingFace sentence transformers
- **Vector Store** - Persist and query embeddings using ChromaDB
- **Retriever** - Retrieve relevant context from vector store based on query
- **LLM** - Generate responses using Ollama with RAG context (streaming support)

### Engine

- **Graph-based Execution** - Flows execute as directed acyclic graphs (DAG) using topological sort
- **Node Registry** - Dynamic node registration system for easy extensibility
- **Streaming Responses** - Real-time token streaming from LLM to client

### Visual Flow Editor

- **Drag-and-drop canvas** - Built with ReactFlow
- **Sidebar** - Add nodes (PDF Loader, Text Splitter, Embedder, Vector Store, Retriever, LLM)
- **Node configuration panel** - Configure node settings
- **Export/Import flows** - Save and load flow configurations as JSON files

### Document Management

- List all indexed documents with chunk counts
- Delete documents by source
- Persistent vector storage

## Future Goals

### High Priority

- [ ] **More Document Loaders** - Support for Word, CSV, TXT, HTML, and URLs
- [ ] **Multiple Embedding Models** - Support for OpenAI, Azure OpenAI, and other embedding providers
- [ ] **Multiple LLM Providers** - Support for OpenAI, Anthropic, Google Gemini, and local models

### Medium Priority

- [ ] **Flow Templates** - Pre-built templates for common RAG use cases
- [ ] **Conversation Memory** - Maintain chat history across interactions
- [ ] **Multi-document RAG** - Query across multiple document sources
- [ ] **Hybrid Search** - Combine semantic and keyword search
- [ ] **Re-ranking** - Add re-ranking nodes for improved retrieval

### Lower Priority

- [ ] **Flow Versioning** - Track and version flow changes
- [ ] **Analytics Dashboard** - Track query performance and metrics
- [ ] **API Key Management** - Secure storage for API keys
- [ ] **User Authentication** - Multi-user support with roles
- [ ] **Custom Nodes** - Plugin system for user-defined nodes

## Example Flow JSON

```json
{
  "nodes": [
    {
      "id": "loader",
      "data": {
        "type": "pdf_loader",
        "config": { "path": "./documents/sample.pdf" }
      }
    },
    {
      "id": "splitter",
      "data": { "type": "text_splitter", "config": {} }
    },
    {
      "id": "embedder",
      "data": { "type": "embedder", "config": {} }
    },
    {
      "id": "vectorstore",
      "data": { "type": "vector_store", "config": {} }
    },
    {
      "id": "retriever",
      "data": {
        "type": "retriever",
        "config": { "query": "What is this document about?" }
      }
    },
    {
      "id": "llm",
      "data": { "type": "llm", "config": { "model": "llama3" } }
    }
  ],
  "edges": [
    { "source": "loader", "target": "splitter" },
    { "source": "splitter", "target": "embedder" },
    { "source": "embedder", "target": "vectorstore" },
    { "source": "vectorstore", "target": "retriever" },
    { "source": "retriever", "target": "llm" }
  ]
}
```

## License

MIT
