import { Node } from "reactflow";

const initialNodes: Node[] = [
  {
    id: "1",
    type: "databaseConnection",
    position: { x: 0, y: 0 },
    data: {
      selectedDatabase: "SSMS",
      databaseId: 1,
      location: "Source",
      url: "",
      status: "idle", // Tracks success/error status
      onUpdate: (updatedData: any) => {
        console.log("Database connection updated: ", updatedData);
      },
      onRunNode: (inputData: any) => {
        console.log("Running database connection with: ", inputData);
      },
    },
  },
  {
    id: "2",
    type: "fileManagement",
    position: { x: 360, y: 0 },
    data: {
      selectedFileId: 1015,
      fileName: "Example.txt",
      format: "txt",
      status: "idle",
      databaseId: 1,
      onUpdate: (updatedData: any) => {
        console.log("File management updated: ", updatedData);
      },
      onRunNode: (inputData: any) => {
        console.log("Running file management with: ", inputData);
      },
    },
  },
  {
    id: "3",
    type: "destinationConnection",
    position: { x: 740, y: 0 },
    data: {
      file: {
        filename: "Example.txt",
        filetype: "txt",
        content: "Base64EncodedFileContent",
      },
      selectedDatabase: "SSMS",
      databaseId: 1,
      url: "",
      location: "Destination",
      status: "idle",
      onUpdate: (updatedData: any) => {
        console.log("Destination connection updated: ", updatedData);
      },
      onRunNode: (inputData: any) => {
        console.log("Running destination connection with: ", inputData);
      },
    },
  },
  {
    id: "4",
    type: "apiCall",
    position: { x: 360, y: 430 },
    data: {
      title: "Data1",
      url: "https://api.example.com/data",
      method: "POST",
      headers: [
        { key: "Authorization", value: "Bearer your-token" },
        { key: "Content-Type", value: "application/json" },
      ],
      data: [
        { key: "field1", value: "value1" },
        { key: "field2", value: "value2" },
      ],
      status: "idle",
      onUpdate: (updatedData: any) => {
        console.log("API Call updated: ", updatedData);
      },
      onRunNode: (inputData: any) => {
        console.log("Running API call with: ", inputData);
      },
    },
  },
  {
    id: "5",
    type: "jupyterNotebookExecute",
    position: { x: 740, y: 430 },
    data: {
      selectedFile: "",
      fileName: "",
      files: [
        {
          filename: "Notebook1.ipynb",
          content: "Base64EncodedNotebook1Content",
          fileType: "application/json",
          databaseId: 1,
        },
        {
          filename: "Notebook2.ipynb",
          content: "Base64EncodedNotebook2Content",
          fileType: "application/json",
          databaseId: 2,
        },
      ],
      status: "idle",
      onUpdate: (updatedData: any) => {
        console.log("Jupyter Notebook Execute updated: ", updatedData);
      },
      onRunNode: (inputData: any) => {
        console.log("Running Jupyter Notebook with: ", inputData);
      },
    },
  },
  {
    id: "6",
    type: "folderUploadNode",
    position: { x: 0, y: 430 },
    data: {
      filename: "",
      fileType: "",
      files: [],
      status: "idle",
      onUpdate: (updatedData: any) => {
        console.log("Folder upload node updated: ", updatedData);
      },
      onRunNode: (inputData: any) => {
        console.log("Running folder upload node with: ", inputData);
      },
    },
  },
  {
    id: "7",
    type: "toggleNode",
    position: { x: 1100, y: 300 },
    data: {
      selectedDatabase: "SSMS",
      databaseId: 1,
      selectedOption: "event",
      schedulerTime: null,
      copyCount: null,
      status: "idle",
      onUpdate: (updatedData: any) => {
        console.log("Toggle node updated: ", updatedData);
      },
      onRunNode: (inputData: any) => {
        console.log("Running toggle node with: ", inputData);
      },
    },
  },
];

export default initialNodes;
