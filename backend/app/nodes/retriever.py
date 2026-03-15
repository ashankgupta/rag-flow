from app.engine.base_node import BaseNode
from app.engine.node_registry import register_node


class RetrieverNode(BaseNode):
    def run(self, input_data):
        vectordb = input_data
        query = self.config.get("query", "Explain the document")
        source_filter = self.config.get("source", None)
        if source_filter:
            retriever = vectordb.as_retriever(
                search_kwargs={"filter": {"source": source_filter}}
            )
        else:
            retriever = vectordb.as_retriever()

        docs = retriever.invoke(query)
        return {
            "query": query,
            "context_docs": docs
        }


register_node("retriever", RetrieverNode)
