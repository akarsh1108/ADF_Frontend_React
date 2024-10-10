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
    position: { x: 300, y: 0 },
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
    position: { x: 800, y: 0 },
    data: {
      file: {
        filename: "Example.txt",
        filetype: "txt",
        content: "Base64EncodedFileContent",
      },
      selectedDatabase: "SSMS",
      databaseId: 1,
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
    position: { x: 400, y: 300 },
    data: {
      title: "Data1",
      apiUrl: "https://api.example.com/data",
      method: "POST",
      headers: [
        { key: "Authorization", value: "Bearer your-token" },
        { key: "Content-Type", value: "application/json" },
      ],
      data: [
        { key: "field1", value: "value1" },
        { key: "field2", value: "value2" },
      ],
      status: "idle", // Tracks success/error status
      onUpdate: (updatedData: any) => {
        console.log("API Call updated: ", updatedData);
      },
      onRunNode: (inputData: any) => {
        console.log("Running API call with: ", inputData);
      },
    },
  },
];

export default initialNodes;
