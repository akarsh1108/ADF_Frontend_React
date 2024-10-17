import React from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import DatabaseConnectionNode from "../components/nodes/DatabaseConnectionNode";
import FileManagementNode from "../components/nodes/FileManangementNode";
import initialNodes from "../data/initialNodes";
import initialEdges from "../data/initialEdges";
import { runNode } from "./nodeRuner";
import DestinationConnectionNode from "../components/nodes/DestinationConnectionNode";
import APICallNode from "../components/nodes/ApiCallNode";
import JupyterNotebookExecuteNode from "../components/nodes/JupyterNotebookNode";
import FolderUploadNode from "../components/nodes/UploadeNode";
import ToggleNode from "../components/nodes/CopySchedulers";

const nodeTypes = {
  databaseConnection: DatabaseConnectionNode,
  fileManagement: FileManagementNode,
  destinationConnection: DestinationConnectionNode,
  apiCall: APICallNode,
  jupyterNotebookExecute: JupyterNotebookExecuteNode,
  folderUploadNode: FolderUploadNode,
  toggleNode: ToggleNode,
};

const CustomFlow: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { getNode } = useReactFlow();

  const onConnect = (params: Edge | Connection) =>
    setEdges((eds) => addEdge(params, eds));

  const handleRunNode = async (nodeId: string, inputResult: any) => {
    const visitedNodes = new Set<string>();

    const runPreviousNodes = async (
      currentNodeId: string
    ): Promise<boolean> => {
      const incomingEdges = edges.filter(
        (edge) => edge.target === currentNodeId
      );

      for (const edge of incomingEdges) {
        const sourceNodeId = edge.source;
        if (visitedNodes.has(sourceNodeId)) continue;

        visitedNodes.add(sourceNodeId);
        const success = await runPreviousNodes(sourceNodeId);
        if (!success) return false;

        const successCurrentNode = await executeNode(sourceNodeId);
        if (!successCurrentNode) return false;
      }

      return true;
    };

    const executeNode = async (currentNodeId: string) => {
      try {
        const currentNode = getNode(currentNodeId);
        if (!currentNode) return false;

        await runNode(
          currentNodeId,
          nodes,
          edges,
          getNode,
          (nextNodeId, newInputData) => {
            console.log("Running next node:", nextNodeId, newInputData);
            setNodes((nds) =>
              nds.map((node) =>
                node.id === nextNodeId
                  ? {
                      ...node,
                      data: {
                        ...node.data,
                        ...newInputData,
                      },
                    }
                  : node
              )
            );
          },
          inputResult
        );

        // Update node status to success after successful execution
        updateNodeStatus(currentNodeId, "success");
        return true;
      } catch (error) {
        // Update node status to error if execution fails

        updateNodeStatus(currentNodeId, "error");
        console.error(`Error executing node ${currentNodeId}:`, error);
        return false;
      }
    };

    // Function to update node status
    const updateNodeStatus = (nodeId: string, status: "success" | "error") => {
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  status,
                },
              }
            : node
        )
      );
    };
    const success = await runPreviousNodes(nodeId);
    if (success) {
      await executeNode(nodeId);
    }
  };
  const nodesWithRunHandler = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onRunNode: (inputResult: any) => {
        return handleRunNode(node.id, inputResult);
      },
      onUpdate: (updatedData: any) => {
        setNodes((nds) =>
          nds.map((n) =>
            n.id === node.id
              ? {
                  ...n,
                  data: {
                    ...n.data,
                    ...updatedData,
                  },
                }
              : n
          )
        );
      },
    },
  }));

  return (
    <div style={{ height: "65vh", backgroundColor: "#000000" }}>
      <ReactFlow
        nodes={nodesWithRunHandler}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default CustomFlow;
