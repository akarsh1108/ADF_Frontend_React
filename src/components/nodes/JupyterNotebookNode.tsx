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
  const [file, setFile] = useState<File | null>(null);

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
    const selectOne = data.files.find((file) => file.id === Number(selectedId));
    if (selectOne) {
      data.files = [selectOne]; // Select only one file from the list
    }

    if (selectedFileObj) {
      setFileName(selectedFileObj.filename);
      setSelectedFileId(selectedId);
      setFileContent(atob(selectedFileObj.content));
      // setFile(
      //   new File([atob(selectedFileObj.content)], selectedFileObj.filename)
      // );
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      fileName,
      fileContent,
      fileFormat: "ipynb",
      file: file,
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
        border: "1px solid rgba(219, 60, 48, 1)", // Animated border
        background: "rgba(219, 60, 48, 0.1)", // Glass effect background
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 10px rgba(219, 60, 48, 0.2)", // Enhanced shadow
        borderRadius: "15px",
        padding: "15px",
        width: "300px",
        position: "relative",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        margin: "20px auto", // Centered with some margin
        transition: "transform 0.3s ease-in-out",
        animation: "glowBorder 3s infinite", // Glowing border animation
      }}
      onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
      onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
      <h4
        style={{
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        Jupyter Notebook Execute Activity
      </h4>
      {/* Mode Selection */}
      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        Input Mode:
      </label>
      <select
        value={fileMode}
        onChange={(e) => setFileMode(e.target.value as "upload" | "dropdown")}
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(219, 60, 48, 1)",
          borderRadius: "8px",
          background: "rgba(219, 60, 48, 0.2)",
          color: "#fff",
        }}
      >
        <option value="dropdown">Select from JSON</option>
        <option value="upload">Upload from Device</option>
      </select>
      <br />
      {/* File Selection Dropdown */}
      {fileMode === "dropdown" && (
        <>
          <label
            style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
          >
            Select Notebook File:
          </label>
          <select
            value={selectedFileId || ""}
            onChange={handleFileSelect}
            style={{
              width: "100%",
              padding: "8px",
              margin: "8px 0",
              border: "1px solid rgba(219, 60, 48, 1)",
              borderRadius: "8px",
              background: "rgba(219, 60, 48, 0.2)",
              color: "#fff",
            }}
          >
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
          <label
            style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
          >
            Upload Notebook File:
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            accept=".ipynb"
            style={{
              width: "100%",
              padding: "8px",
              margin: "8px 0",
              border: "1px solid rgba(219, 60, 48, 1)",
              borderRadius: "8px",
              background: "rgba(219, 60, 48, 0.2)",
              color: "#fff",
            }}
          />
          <br />
        </>
      )}
      {/* Run and Preview Buttons */}
      <button
        onClick={handleRunNode}
        style={{
          padding: "10px",
          backgroundColor: "rgba(219, 60, 48, 0.6)",
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
            "rgba(219, 60, 48, 0.8)")
        }
        onMouseOut={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundColor =
            "rgba(219, 60, 48, 0.6)")
        }
      >
        Run Notebook
      </button>
      <button
        onClick={handlePreviewFile}
        style={{
          padding: "10px",
          backgroundColor: "rgba(219, 60, 48, 0.6)",
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
            "rgba(219, 60, 48, 0.8)")
        }
        onMouseOut={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundColor =
            "rgba(219, 60, 48, 0.6)")
        }
      >
        Preview Notebook
      </button>
      {/* Status Icons */}
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
      {/* preview dialog */}
      {isDialogOpen && fileContent && (
        <div className="modal">
          <div className="modal-content">
            <h4 style={{ color: "#fff" }}>Preview: {fileName}</h4>
            <pre style={{ color: "#fff" }}>{fileContent}</pre>

            <button
              onClick={() => setIsDialogOpen(false)}
              style={{
                padding: "10px",
                backgroundColor: "rgba(219, 60, 48, 0.6)",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "10px",
                width: "80%",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  "rgba(219, 60, 48, 0.8)")
              }
              onMouseOut={(e) =>
                ((e.target as HTMLButtonElement).style.backgroundColor =
                  "rgba(219, 60, 48, 0.6)")
              }
            >
              Close
            </button>
          </div>
        </div>
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

// @keyframes glowBorder {
//   0% {
//     box-shadow: 0 0 1px rgba(219, 60, 48, 0.5), 0 0 2px rgba(219, 60, 48, 0.5), 0 0 3px rgba(219, 60, 48, 0.5);
//   }
//   50% {
//     box-shadow: 0 0 4px rgba(219, 60, 48, 1), 0 0 6px rgba(219, 60, 48, 1), 0 0 8px rgba(219, 60, 48, 1);
//   }
//   100% {
//     box-shadow: 0 0 1px rgba(219, 60, 48, 0.5), 0 0 2px rgba(219, 60, 48, 0.5), 0 0 3px rgba(219, 60, 48, 0.5);
//   }
// }
`}
      </style>
    </div>
  );
};

export default JupyterNotebookExecuteNode;
