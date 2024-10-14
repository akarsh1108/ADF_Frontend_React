import React, { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { NodeProps, Handle, Position } from "reactflow";

type FolderUploadData = {
  status: "idle" | "success" | "error";
  onRunNode?: (inputData: any) => void;
  onUpdate?: (updatedData: any) => void;
};

const FolderUploadNode: React.FC<NodeProps<FolderUploadData>> = ({ data }) => {
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (data.onUpdate) {
      const fileDetails = files.map((file) => ({
        fileName: file.name,
        fileType: file.type,
        file: file,
      }));

      data.onUpdate({
        files: fileDetails,
      });
    }
  }, [files, data]);

  // Handle single folder upload and filter accepted file types
  const handleFolderUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (uploadedFiles && uploadedFiles.length > 0) {
      const acceptedFiles = Array.from(uploadedFiles).filter((file) =>
        [
          "text/csv",
          "text/plain",
          "application/json",
          "application/x-ipynb+json",
        ].includes(file.type)
      );
      setFiles(acceptedFiles.slice(0, 1));
    }
  };

  const handleRunNode = () => {
    const inputData = {
      files: files.map((file) => ({
        filename: file.name,
        format: file.type,
        file: file,
      })),
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
      <h4>File Upload Node</h4>

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
