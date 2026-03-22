import ReactFlow, {
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
} from "reactflow";
import { useCallback } from "react";
import "reactflow/dist/style.css";
import FlowNode from "./components/FlowNode";

const nodeTypes = {
  custom: FlowNode,
};

function FlowInner({
  nodes,
  edges,
  setNodes,
  setEdges,
  setSelectedNode,
}) {

  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );

  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();

      const type =
        event.dataTransfer.getData("application/reactflow");

      if (!type) return;

      const bounds =
        event.currentTarget.getBoundingClientRect();

      const position = {
        x: event.clientX - bounds.left,
        y: event.clientY - bounds.top,
      };

      const newNode = {
        id: `${type}-${Date.now()}-${Math.random()}`,
        type: "custom",
        position,
        data: { type, config: {} },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  const onNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  window.__FLOW_CONTEXT__ = {
    setNodes,
    setEdges,
  };

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      nodeTypes={nodeTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onNodesDelete={(deleted) => {
        setNodes((nds) =>
          nds.filter((n) => !deleted.some((d) => d.id === n.id))
        );

        setEdges((eds) =>
          eds.filter(
            (e) =>
              !deleted.some(
                (d) => d.id === e.source || d.id === e.target
              )
          )
        );
      }}
      fitView
    >
      <MiniMap />
      <Controls />
      <Background
        color="#3f3f46"
        gap={20}
        size={1}
      />
    </ReactFlow>
  );
}

export default function FlowCanvas(props) {
  return (
    <div className="h-full w-full">
      <ReactFlowProvider>
        <FlowInner {...props} />
      </ReactFlowProvider>
    </div>
  );
}
