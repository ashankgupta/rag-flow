import os
from langchain_community.vectorstores import Chroma
from langchain_community.embeddings import HuggingFaceEmbeddings
from app.engine.base_node import BaseNode
from app.engine.node_registry import register_node


class VectorStoreNode(BaseNode):

    def run(self, input_data):

        persist_directory = self.config.get("persist_dir", "./chroma_db")

        model_name = "sentence-transformers/all-MiniLM-L6-v2"

        # If embedder was used
        if input_data and isinstance(input_data, dict):
            model_name = input_data.get(
                "embedding_model_name",
                model_name
            )

        embeddings = HuggingFaceEmbeddings(model_name=model_name)

        vectordb = Chroma(
            persist_directory=persist_directory,
            embedding_function=embeddings
        )

        # If documents exist → add them
        if input_data and isinstance(input_data, dict) and "documents" in input_data:
            print("Adding documents to DB...")
            vectordb.add_documents(input_data["documents"])
            vectordb.persist()

        # Otherwise → just load DB
        else:
            print("Loading existing DB for querying...")

        return vectordb


register_node("vector_store", VectorStoreNode)
