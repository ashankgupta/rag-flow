from langchain_community.embeddings import HuggingFaceEmbeddings
from app.engine.base_node import BaseNode
from app.engine.node_registry import register_node


class EmbedderNode(BaseNode):

    def run(self, input_data):
        model_name = self.config.get(
            "model",
            "sentence-transformers/all-MiniLM-L6-v2"
        )

        embeddings = HuggingFaceEmbeddings(model_name=model_name)

        return {
            "documents": input_data,
            "embedding_model_name": model_name
        }


register_node("embedder", EmbedderNode)
