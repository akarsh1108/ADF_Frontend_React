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
      // console.log(data);
      const fileDetails = [file].map((file) => ({
        fileName: file.name,
        fileType: file.type,
        databaseId: data.databaseId,
        file: file,
        content: fileContent,
      }));
      data.onUpdate({
        files: [fileDetails],
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
    console.log("Running Folder Upload Node with: ", data);
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
        border: "1px solid rgba(0, 0, 0, 0)",
        background: "rgba(0, 0, 50, 0.3)", // Glass effect background
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 10px rgba(224, 183, 255, 0.2)", // Enhanced shadow
        borderRadius: "15px",
        padding: "15px",
        width: "300px",
        position: "relative",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        margin: "20px auto",
        transition: "transform 0.3s ease-in-out",
        animation: "Border 3s infinite, fadeIn 1s ease-in-out", // Combined animations
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Bottom} />

      <h4
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        File Upload Activity
      </h4>

      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        Upload File:
      </label>
      <input
        type="file"
        multiple={false} // Disable multiple uploads
        onChange={handleFolderUpload}
        accept=".csv,.txt,.json,.ipynb"
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(0, 0, 0, 0)",
          borderRadius: "8px",
          background: "rgba(224, 183, 255, 0.2)",
          color: "#fff",
        }}
      />
      <br />

      <button
        onClick={handleRunNode}
        style={{
          padding: "10px",
          backgroundColor: "rgba(0, 150, 255, 0.6)", // Blue background for Run button
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          width: "100%",
          marginTop: "10px",
          transition: "background 0.3s",
        }}
        onMouseOver={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundColor =
            "rgba(0, 150, 255, 0.8)")
        }
        onMouseOut={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundColor =
            "rgba(0, 150, 255, 0.6)")
        }
      >
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
      <style>
        {`
      @keyframes fadeIn {
        from {
          opacity: 0;
          transform: translateY(-20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
  
      @keyframes Border {
        0% {
          border-color: rgba(0, 0, 0, 0);
          box-shadow: 0 0 5px rgba(0, 0, 0, 0);
        }
        50% {
          border-color: rgba(255, 255, 255, 1);
          box-shadow: 0 0 15px rgba(255, 255, 255, 1);
        }
        100% {
          border-color: rgba(0, 0, 0, 0);
          box-shadow: 0 0 5px rgba(0, 0, 0, 0);
        }
      }
    `}
      </style>
    </div>
  );
};

export default FolderUploadNode;
