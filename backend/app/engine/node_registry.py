from typing import Dict, Type
from .base_node import BaseNode

NODE_REGISTRY: Dict[str, Type[BaseNode]] = {}

def register_node(name: str, node_class: Type[BaseNode]):
    NODE_REGISTRY[name] = node_class

def get_node(name: str):
    return NODE_REGISTRY.get(name)
