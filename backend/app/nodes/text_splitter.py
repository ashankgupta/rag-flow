from langchain_text_splitters import RecursiveCharacterTextSplitter
from app.engine.base_node import BaseNode
from app.engine.node_registry import register_node

class TextSplitterNode(BaseNode):

    def run(self, input_data):
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )
        return splitter.split_documents(input_data)

register_node("text_splitter", TextSplitterNode)
