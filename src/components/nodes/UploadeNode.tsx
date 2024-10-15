import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { NodeProps, Handle, Position } from "reactflow";

type Files = {
  id: number;
  filename: string;
  content: string; // Ensure this is included
  fileType: string;
  databaseId: number;
};

type FolderUploadData = {
  status: "idle" | "success" | "error";
  files: Files[] | [];
  databaseId: number;
  onRunNode?: (inputData: any) => void;
  onUpdate?: (updatedData: any) => void;
};

const FolderUploadNode: React.FC<NodeProps<FolderUploadData>> = ({ data }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null); // To hold the file content
  const [fileName, setFileName] = useState<string>("");
  useEffect(() => {
    if (data.onUpdate && file) {
      const fileDetails = [file].map((file) => ({
        fileName: file.name,
        fileType: file.type,
        databaseId: data.databaseId,
        file: file,
        content: fileContent,
      }));
      data.onUpdate({
        files: fileDetails,
      });
    }
  }, [file, fileContent, data]);

  // Handle single folder upload and filter accepted file types
  // const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const uploadedFiles = e.target.files;

  //   if (uploadedFiles && uploadedFiles.length > 0) {
  //     const acceptedFiles = Array.from(uploadedFiles).filter((file) =>
  //       [
  //         "text/csv",
  //         "text/plain",
  //         "application/json",
  //         "application/x-ipynb+json",
  //       ].includes(file.type)
  //     );
  //     setFiles(acceptedFiles.slice(0, 1));

  //     // Read the content of the uploaded file
  //     const reader = new FileReader();
  //     reader.onload = (event) => {
  //       const content = event.target?.result;
  //       setFileContent(content as string); // Save the content
  //     };
  //     reader.readAsText(acceptedFiles[0]); // Read the first accepted file
  //   }
  // };

  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    setFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFileName(file.name);
        setFileContent(reader.result as string);
      };
      reader.readAsText(file); // Read the file as text
    }
  };

  const handleRunNode = () => {
    const inputData = {
      files: [
        {
          filename: file?.name,
          format: file?.type,
          file: file,
          content: fileContent, // Pass the file content
          databaseId: data.databaseId,
        },
      ],
    };
    data.onRunNode && data.onRunNode(inputData);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        position: "relative",
      }}
    >
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Bottom} />
      <h4>File Upload Activity</h4>

      <label>Upload File: </label>
      <input
        type="file"
        multiple={false} // Disable multiple uploads
        onChange={handleFolderUpload}
        accept=".csv,.txt,.json,.ipynb"
      />
      <br />

      <button onClick={handleRunNode} style={{ marginTop: "10px" }}>
        Run Activity
      </button>
      {data.status === "success" && (
        <FiCheckCircle
          style={{ color: "green", position: "absolute", top: 5, right: 5 }}
        />
      )}
      {data.status === "error" && (
        <FiXCircle
          style={{ color: "red", position: "absolute", top: 5, right: 5 }}
        />
      )}
    </div>
  );
};

export default FolderUploadNode;
