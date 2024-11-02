import { Edge } from "reactflow";
import {
  ApiCall,
  ConnectionString,
  data,
  DestinationConnection,
  FileManagement,
  Scheduling,
} from "../schemas/connection";
import {
  fetchDatabaseConnectionApi,
  fetchDatabaseConnectionApiUrl,
  fetchDestinationConnectionApi,
  fetchFileConvertApi,
  postApiCall,
  schedulingActivity,
  uploadFiles,
  uploadJupyterNotebookApi,
} from "../api/nodeApis";
import { input, u } from "framer-motion/client";

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
    let resp;
    try {
      if (currentNode.data.url === "") {
        const req: ConnectionString = {
          database: currentNode.data.selectedDatabase,
          databaseId: currentNode.data.databaseId,
          location: currentNode.data.location || "Source",
        };
        resp = await fetchDatabaseConnectionApi(req);
      } else {
        const req: ConnectionString = {
          database: currentNode.data.selectedDatabase,
          location: currentNode.data.location || "Source",
          databaseId: 0,
          url: currentNode.data.url,
        };
        console.log("Request to fetch database connection API:", req.url);
        resp = await fetchDatabaseConnectionApiUrl(req);
      }

      if (resp) {
        responseData = {
          databaseId: currentNode.data.databaseId,
          url: currentNode.data.url,
          files: resp.map((file: Files) => ({
            id: file.id,
            filename: file.filename,
            content: file.content,
            fileType: file.fileType,
            databaseId: currentNode.data.databaseId,
            url: currentNode.data.url,
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
      url: currentNode.data.url,
    };
    console.log("Request to destination connection API:", req);
    const resp = await fetchDestinationConnectionApi(req);
    console.log("Response from destination connection API:", resp.content1);
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
  } else if (currentNode.type === "apiCall") {
    const headers = currentNode.data.headers.reduce(
      (
        acc: { [key: string]: string },
        header: { key: string; value: string }
      ) => {
        acc[header.key] = header.value;
        return acc;
      },
      {}
    );
    const data =
      currentNode.data.data.length > 0
        ? currentNode.data.data.reduce(
            (
              acc: { [key: string]: string },
              header: { key: string; value: string }
            ) => {
              acc[header.key] = header.value;
              return acc;
            }
          )
        : {};

    const req = {
      title: currentNode.data.title,
      method: currentNode.data.method,
      url: currentNode.data.url,
      headers: headers,
      data: data,
    };
    console.log("Request to API:", req);
    const resp = await postApiCall(req);
    console.log("Response from API:", JSON.stringify(resp.data, null, 2));
    if (resp) {
      responseData = {
        ...inputData,
        status: "success",
        file: {
          filename: resp.data.filename,
          filetype: resp.data.filetype,
          content: JSON.stringify(resp.data, null, 2),
        },
      };
    } else {
      responseData = {
        ...inputData,
        status: "error",
      };
    }
  } else if (currentNode.type === "jupyterNotebookExecute") {
    // Handle Jupyter Notebook Execute node
    console.log(
      "Running Jupyter Notebook Execute node. Input data:",
      inputData
    );
    const req = {
      source: currentNode.data.source,
      filename: inputData.fileName,
      fileformat: inputData.fileformat,
      content: inputData.fileContent,
      File: inputData.file,
    };

    console.log("Request to Jupyter Notebook Execute API:", req);
    const resp = await uploadJupyterNotebookApi(req.File);
    console.log("Response from Jupyter Notebook Execute API:", resp);
    if (resp) {
      responseData = {
        ...inputData,
        status: resp.error_details ? "error" : "success",
        file: {
          message: resp.message,
          successful: resp.last_successful_cell,
          errorDetails: resp.error_details,
        },
      };
    } else {
      responseData = {
        ...inputData,
        status: "error",
      };
    }
  } else if (currentNode.type === "folderUploadNode") {
    console.log("Folder Upload ", inputData);
    if (inputData.files && inputData.files.length > 0) {
      const file = inputData.files[0];

      const req = {
        // filename: file.filename,
        // filetype: file.format,
        // content: file.content,
        databaseId: file.databaseId,
        file: file.file,
      };
      console.log("Request to upload file API:", req);
      const resp = await uploadFiles(req.databaseId, req.file);
      console.log("Response from upload file API:", resp);
      responseData = {
        ...inputData,
        status: "success",
        file: {
          filename: file.filename,
          filetype: file.filetype,
          content: file.content,
        },
      };
    } else {
      responseData = {
        ...inputData,
        status: "error",
      };
    }
  } else if (currentNode.type === "toggleNode") {
    console.log("Toggle Node ", inputData);
    const req: Scheduling = {
      destination: inputData.databaseId,
      source: inputData.databaseId === 1 ? 2 : 1,
      label: inputData.selectedOption,
      interval: inputData.copyCount == null ? 1000000 : inputData.copyCount,
      schedular:
        inputData.schedulerTime == null ? 1000000 : inputData.schedulerTime,
    };
    console.log("Request to Scheduling API:", req);
    const res = await schedulingActivity(req);
    console.log("Response from Scheduling API:", res);
    responseData = {
      ...inputData,
      status: "success",
    };
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
