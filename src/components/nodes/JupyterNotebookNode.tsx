import React, { useEffect, useState } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

type Files = {
  id: number;
  filename: string;
  content: string;
  fileType: string;
  databaseId: number;
};

type JupyterNotebookData = {
  selectedFile: string;
  fileName: string;
  nameToConnect: string;
  files: Files[] | [];
  status: "idle" | "success" | "error";
  onRunNode?: (inputData: any) => void;
  onUpdate?: (updatedData: any) => void;
};

const JupyterNotebookExecuteNode: React.FC<NodeProps<JupyterNotebookData>> = ({
  data,
}) => {
  const [fileName, setFileName] = useState(data.fileName || "");
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileMode, setFileMode] = useState<"upload" | "dropdown">("dropdown");
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    data.onUpdate &&
      data.onUpdate({
        fileName,
        selectedFileId,
        fileContent,
        isDialogOpen,
      });
  }, [fileName, selectedFileId, fileContent, isDialogOpen]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = e.target.value;
    const selectedFileObj = data.files.find(
      (file) => file.id === Number(selectedId)
    );

    if (selectedFileObj) {
      setFileName(selectedFileObj.filename);
      setSelectedFileId(selectedId);
      setFileContent(atob(selectedFileObj.content)); // Convert base64 to string
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
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
      fileName,
      fileContent,
    };
    data.onRunNode && data.onRunNode(inputData);
  };

  const handlePreviewFile = () => {
    if (fileContent) {
      setIsDialogOpen(true); // Open the dialog
    } else {
      alert("No file content to preview!");
    }
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
      <Handle type="target" position={Position.Left} />

      <h4>Jupyter Notebook Execute Node</h4>

      {/* Mode Selection */}
      <label>Input Mode: </label>
      <select
        value={fileMode}
        onChange={(e) => setFileMode(e.target.value as "upload" | "dropdown")}
      >
        <option value="dropdown">Select from JSON</option>
        <option value="upload">Upload from Device</option>
      </select>
      <br />

      {/* File Selection Dropdown */}
      {fileMode === "dropdown" && (
        <>
          <label>Select Notebook File: </label>
          <select value={selectedFileId || ""} onChange={handleFileSelect}>
            {data.files.length > 0 ? (
              data.files.map((file: Files) => (
                <option key={file.id} value={file.id}>
                  {file.filename}
                </option>
              ))
            ) : (
              <option value="">No files available</option>
            )}
          </select>
          <br />
        </>
      )}

      {/* File Upload */}
      {fileMode === "upload" && (
        <>
          <label>Upload Notebook File: </label>
          <input type="file" onChange={handleFileUpload} accept=".ipynb" />
          <br />
        </>
      )}

      {/* Run and Preview Buttons */}
      <button onClick={handleRunNode}>Run Notebook</button>
      <button onClick={handlePreviewFile}>Preview Notebook</button>

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

      {/* Preview Dialog */}
      {isDialogOpen && fileContent && (
        <div className="modal">
          <div className="modal-content">
            <h4>Preview: {fileName}</h4>
            <pre>{fileContent}</pre>

            <button onClick={() => setIsDialogOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JupyterNotebookExecuteNode;
