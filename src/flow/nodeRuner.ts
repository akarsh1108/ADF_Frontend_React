import { Edge } from "reactflow";
import {
  ConnectionString,
  DestinationConnection,
  FileManagement,
} from "../schemas/connection";
import {
  fetchDatabaseConnectionApi,
  fetchDestinationConnectionApi,
  fetchFileConvertApi,
} from "../api/nodeApis";

type Files = {
  id: number;
  filename: string;
  content: string;
  fileType: string;
};

export const runNode = async (
  nodeId: string,
  nodes: any[],
  edges: Edge[],
  getNode: (id: string) => any,
  runNextNode: (nextNodeId: string, inputData: any) => void,
  inputData: any
) => {
  const currentNode = getNode(nodeId);
  if (!currentNode) return;

  let responseData = {};

  if (currentNode.type === "databaseConnection") {
    // Make sure the inputData is properly formatted
    const req: ConnectionString = {
      database: currentNode.data.selectedDatabase,
      databaseId: currentNode.data.databaseId,
      location: currentNode.data.location,
    };
    try {
      //   console.log("Making API request with req:", req);
      const resp = await fetchDatabaseConnectionApi(req);

      if (resp) {
        responseData = {
          files: resp.map((file: Files) => ({
            id: file.id,
            filename: file.filename,
            content: file.content,
            fileType: file.fileType,
            databaseId: req.databaseId,
          })),
        };
        console.log("Files received from API:", responseData);
      }
    } catch (error) {
      console.error("Error running node:", error);
      return;
    }
  } else if (currentNode.type === "fileManagement") {
    // Handle file management node
    // console.log("Running file management node. Input data:", inputData);
    const req: FileManagement = {
      id: currentNode.data.selectedFileId,
      source: currentNode.data.databaseId,
      fileName: currentNode.data.fileName,
      format: currentNode.data.format,
    };

    // console.log("Request to file convert API:", req);
    // console.log("Request to file convert API:", req);
    const resp = await fetchFileConvertApi(req);
    const response = resp.data;

    if (resp) {
      responseData = {
        ...inputData,
        status: "success",
        file: {
          filename: resp.data[0].filename,
          filetype: resp.data[0].filetype,
          content: resp.data[0].content,
        },
      };
    } else {
      responseData = {
        ...inputData,
        status: "error",
      };
    }
  } else if (currentNode.type === "destinationConnection") {
    if (inputData.files && inputData.files.length > 0) {
      const file = inputData.files[0];
      console.log("File to be copied:", file);
      responseData = {
        file: {
          filename: file.filename,
          filetype: file.fileType,
          content: file.content,
        },
        selectedDatabase: currentNode.data.selectedDatabase,
        databaseId: currentNode.data.databaseId,
      };
    }
    console.log("Destination Connection Node", currentNode.data);
    const req: DestinationConnection = {
      filename: currentNode.data.file.filename,
      filetype: currentNode.data.file.filetype,
      content: currentNode.data.file.content,
      source: currentNode.data.databaseId,
    };
    console.log("Request to destination connection API:", req);
    const resp = await fetchDestinationConnectionApi(req);
    // console.log("Response from destination connection API:", resp.content1);
    if (resp) {
      responseData = {
        ...inputData,
        status: "success",
      };
    } else {
      responseData = {
        ...inputData,
        status: "error",
      };
    }
  }

  // Now pass the data to the next nodes
  const connectedEdges = edges.filter((edge) => edge.source === nodeId);

  connectedEdges.forEach((edge) => {
    runNextNode(edge.target, responseData);
  });
};

export const runAllNodes = (
  nodes: any[],
  edges: Edge[],
  runNodeFn: (nodeId: string, inputData: any) => void,
  initialInputData: any
) => {
  const startNodes = nodes.filter((node) =>
    edges.every((edge) => edge.target !== node.id)
  );

  startNodes.forEach((node) => {
    runNodeFn(node.id, initialInputData);
  });
};
