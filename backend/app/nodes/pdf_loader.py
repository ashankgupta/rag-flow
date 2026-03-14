from langchain_community.document_loaders import PyPDFLoader
import os
from app.engine.base_node import BaseNode
from app.engine.node_registry import register_node


class PDFLoaderNode(BaseNode):
    def run(self, input_data):
        path = self.config.get("path")
        loader = PyPDFLoader(path)
        docs = loader.load()
        filename = os.path.basename(path)
        for doc in docs:
            doc.metadata["source"] = filename
            doc.metadata["doc_id"] = filename  # simple unique ID

        return docs


register_node("pdf_loader", PDFLoaderNode)
