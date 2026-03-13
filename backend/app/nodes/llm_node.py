from langchain_ollama import OllamaLLM
from app.engine.base_node import BaseNode
from app.engine.node_registry import register_node


class LLMNode(BaseNode):

    def run(self, input_data):

        query = input_data["query"]
        docs = input_data["context_docs"]

        context = "\n\n".join([doc.page_content for doc in docs])

        model_name = self.config.get("model", "llama3")

        llm = OllamaLLM(model=model_name)

        prompt = f"""
        Answer the question based on the context below.

        Context:
        {context}

        Question:
        {query}
        """

        # 🔥 STREAM TOKENS
        for chunk in llm.stream(prompt):
            yield chunk


register_node("llm", LLMNode)
