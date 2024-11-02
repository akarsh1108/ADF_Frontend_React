import React, { useEffect, useState } from "react";
import { NodeProps, Handle, Position, Background } from "reactflow";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

type Files = {
  id: number;
  filename: string;
  content: string;
  fileType: string;
  databaseId: number;
};

type FileManagementData = {
  selectedFile: string;
  fileName: string;
  nameToConnect: string;
  files: Files[] | [];
  status: "idle" | "success" | "error";
  onRunNode?: (inputData: any) => void;
  onUpdate?: (updatedData: any) => void;
};

const FileManagementNode: React.FC<NodeProps<FileManagementData>> = ({
  data,
}) => {
  const [fileName, setFileName] = useState(data.fileName || "Example.txt");
  const [fileFormat, setFileFormat] = useState(data.nameToConnect || "txt");
  const [selectedFile, setSelectedFile] = useState(data.selectedFile || "");
  const [fileContentUrl, setFileContentUrl] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [fileId, setFileId] = useState<number | null>(null);

  useEffect(() => {
    data.onUpdate &&
      data.onUpdate({
        fileName,
        format: fileFormat != undefined ? fileFormat : "txt",
        selectedFileId: fileId,
        databaseId:
          data.files && data.files.length > 0 && data.files[0].databaseId,
        fileContentUrl,
        isDialogOpen,
        fileId,
      });
  }, [
    fileName,
    fileFormat,
    selectedFile,
    fileContentUrl,
    isDialogOpen,
    fileId,
  ]);

  // Function to convert base64 to Blob
  const base64ToBlob = (base64: string, type: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type });
  };

  // Handle file selection and update state values
  const handleFileSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedFileId = Number(e.target.value);
    const selectedFileObj = data.files.find(
      (file) => file.id === selectedFileId
    );

    if (selectedFileObj) {
      setFileName(selectedFileObj.filename);
      setSelectedFile(selectedFileObj.id.toString());
      setFileFormat(selectedFileObj.fileType);
      setFileId(selectedFileObj.id);
      // Convert base64 content to Blob and create URL for preview
      const blob = base64ToBlob(
        selectedFileObj.content,
        selectedFileObj.fileType
      );
      const blobUrl = URL.createObjectURL(blob);
      setFileContentUrl(blobUrl);
    }
  };

  const handlePreview = () => {
    if (fileContentUrl) {
      setIsDialogOpen(true);
    }
  };

  // Download the selected file
  const handleDownload = () => {
    if (fileContentUrl) {
      const a = document.createElement("a");
      a.href = fileContentUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleRunNode = () => {
    console.log("Running File Management Node with: ", data);
    const inputData = {
      file: fileId,
      fileName,
      format: fileFormat,
      database:
        data.files && data.files.length > 0 && Number(data.files[0].databaseId),
    };
    data.onRunNode && data.onRunNode(inputData);
  };

  useEffect(() => {
    const selectElement = document.querySelector(".custom-select");
    if (selectElement) {
      const options = selectElement.querySelectorAll("option");
      options.forEach((option) => {
        option.style.backgroundColor = "rgba(80,202,168,0.2)";
        option.style.color = "#fff";
      });
    }
  }, [data.files]);

  return (
    <div
      style={{
        border: "1px solid rgba(80,202,168,0.5)",
        background: "rgba(80,202,168,0.2)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 10px rgba(80,202,168,0.2)",
        borderRadius: "15px",
        padding: "15px",
        width: "300px",
        position: "relative",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        margin: "20px auto", // Centered with some margin
        transition: "transform 0.3s ease-in-out",
        // animation: "Border 3s infinite", // ing border animation
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
        File Management Activity
      </h4>

      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        File:
      </label>
      <select
        value={selectedFile}
        onChange={handleFileSelect}
        className="custom-select"
        style={{
          appearance: "none" /* Hide default arrow */,
          border: "1px solid rgba(80,202,168,1)" /* New border color */,
          color: "white" /* Font color */,
          borderRadius: "8px",
          padding: "8px",
          width: "100%",
          margin: "8px 0",
          transition: "background 0.3s, border-color 0.3s",
        }}
      >
        {data.files && data.files.length > 0 ? (
          data.files.map((file: Files) => (
            <option
              key={file.id}
              value={file.id}
              style={{
                backgroundColor: "rgba(80,202,168,0.2)", // Updated background color
                color: "white",
                border: "1px solid rgba(80,202,168,1)",
              }}
            >
              {file.filename}
            </option>
          ))
        ) : (
          <option value="">No files</option>
        )}
      </select>

      <br />

      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        File New Name:
      </label>
      <input
        type="text"
        value={fileName.split(".")[0]}
        onChange={(e) => setFileName(e.target.value)}
        style={{
          width: "94%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(80,202,168,1)",
          borderRadius: "8px",
          background: "rgba(80,202,168,0.2)",
          color: "#fff",
        }}
      />
      <br />

      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        File Format:
      </label>
      <select
        value={fileFormat}
        onChange={(e) => setFileFormat(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(80,202,168,1)" /* New border color */,
          borderRadius: "8px",
          background: "rgba(80,202,168,0.2)",
          color: "#fff",
        }}
      >
        <option value="json">JSON</option>
        <option value="xml">XML</option>
        <option value="txt">txt</option>
        <option value="csv">CSV</option>
      </select>
      <br />

      <button
        onClick={handleRunNode}
        style={{
          padding: "10px",
          backgroundColor: "rgba(80,202,168,0.6)", // New background color for Run button
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
          ((e.target as HTMLElement).style.backgroundColor =
            "rgba(80,202,168,0.8)")
        }
        onMouseOut={(e) =>
          ((e.target as HTMLElement).style.backgroundColor =
            "rgba(80,202,168,0.6)")
        }
      >
        Run Activity
      </button>

      {fileContentUrl && (
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={handlePreview}
            style={{
              padding: "10px",
              backgroundColor: "rgba(80,202,168,0.6)", // New background color for Preview button
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              textDecorationColor: "#000",
              fontWeight: "bold",
              cursor: "pointer",
              marginRight: "10px",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) =>
              ((e.target as HTMLElement).style.backgroundColor =
                "rgba(80,202,168,0.8)")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLElement).style.backgroundColor =
                "rgba(80,202,168,0.6)")
            }
          >
            Preview File
          </button>

          <button
            onClick={handleDownload}
            style={{
              padding: "10px",
              backgroundColor: "rgba(80,202,168,0.6)", // New background color for Download button
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
            onMouseOver={(e) =>
              ((e.target as HTMLElement).style.backgroundColor =
                "rgba(80,202,168,0.8)")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLElement).style.backgroundColor =
                "rgba(80,202,168,0.6)")
            }
          >
            Download File
          </button>
        </div>
      )}

      {data.status === "success" && (
        <FiCheckCircle
          style={{ color: "green", position: "absolute", top: 5, right: 5 }}
        />
      )}
      {data.status === "error" ||
        (!data.files && (
          <FiXCircle
            style={{ color: "red", position: "absolute", top: 5, right: 5 }}
          />
        ))}

      {/* File Preview Dialog */}
      {isDialogOpen && fileContentUrl && (
        <div className="modal">
          <div className="modal-content m-2">
            <iframe
              src={fileContentUrl}
              style={{
                marginTop: "10px",
                width: "100%",
                height: "500px",
                border: "2px solid #ccc",
                backgroundColor: "rgba(80,202,168,0.6)",
                borderRadius: "8px",
              }}
              title="file-preview"
            />

            <button
              onClick={() => setIsDialogOpen(false)}
              style={{
                padding: "10px",
                backgroundColor: "rgba(255, 100, 100, 0.6)", // Red background for Close button
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
                marginTop: "10px",
                width: "100%",
                transition: "background 0.3s",
              }}
              onMouseOver={(e) =>
                ((e.target as HTMLElement).style.backgroundColor =
                  "rgba(255, 100, 100, 0.8)")
              }
              onMouseOut={(e) =>
                ((e.target as HTMLElement).style.backgroundColor =
                  "rgba(255, 100, 100, 0.6)")
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
      //     border-color: rgba(80,202,168,0.5);
      //     box-shadow: 0 0 5px rgba(80,202,168,0.5);
      //   }
      //   50% {
      //     border-color: rgba(80,202,168,1);
      //     box-shadow: 0 0 15px rgba(80,202,168,1);
      //   }
      //   100% {
      //     border-color: rgba(80,202,168,0.5);
      //     box-shadow: 0 0 5px rgba(80,202,168,0.5);
      //   }
      }
    `}
      </style>
    </div>
  );
};

export default FileManagementNode;
