import networkx as nx
from .node_registry import get_node

class FlowExecutor:

    def __init__(self, flow_data):
        self.flow_data = flow_data
        self.graph = nx.DiGraph()

    def build_graph(self):
        for node in self.flow_data["nodes"]:
            self.graph.add_node(node["id"], data=node)

        for edge in self.flow_data["edges"]:
            self.graph.add_edge(edge["source"], edge["target"])

    def execute(self):
        execution_order = list(nx.topological_sort(self.graph))
        outputs = {}

        edge_sequence = []


        for i in range(len(execution_order) - 1):
            source = execution_order[i]
            target = execution_order[i + 1]
            if self.graph.has_edge(source, target):
                edge_sequence.append({"source": source, "target": target})

        for node_id in execution_order:
            node_data = self.graph.nodes[node_id]["data"]
            node_type = node_data["data"]["type"]
            config = node_data["data"].get("config", {})

            node_class = get_node(node_type)

            if node_class is None:
                raise ValueError(f"Node type '{node_type}' is not registered.")

            node_instance = node_class(config)

            # Get input from predecessors
            inputs = [
                outputs[pred]
                for pred in self.graph.predecessors(node_id)
            ]

            input_data = inputs[0] if inputs else None
            result = node_instance.run(input_data)

            if hasattr(result, "__iter__") and not isinstance(result, dict):
                return result  # Streaming generator

            outputs[node_id] = result

        last_node = execution_order[-1]
        return {
            "result": outputs[last_node],
            "execution_order": execution_order,
            "edge_sequence": edge_sequence
        }
