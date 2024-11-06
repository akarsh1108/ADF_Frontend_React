import { use } from "framer-motion/client";
import { useEffect, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Handle, NodeProps, Position } from "reactflow";

type Files = {
  id: number;
  filename: string;
  content: string;
  fileType: string;
  databaseId: number;
};

type MLRegressionData = {
  files: Files[] | [];
  targetColumn: string;
  title: string;
  onRunNode?: (inputData: any) => void;
  onUpdate?: (updatedData: any) => void;
  status: "idle" | "success" | "error";
};

const MLRegressionActivity: React.FC<NodeProps<MLRegressionData>> = ({
  data,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const [title, setTitle] = useState(data.title || "");
  const [text, setText] = useState(data.targetColumn || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    data.onUpdate &&
      data.onUpdate({
        files: file ? [{ filename: fileName, content: fileContent }] : [],
        targetColumn: text,
        title,
        filename: title,
        fileContent,
      });
  }, [file, fileContent, text, title, fileName]);

  // Handle file upload and read content
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      setFileName(uploadedFile.name);

      const reader = new FileReader();
      reader.onload = () => {
        setFileContent(reader.result as string); // Save content for preview
      };
      reader.readAsText(uploadedFile); // Read file as text (for CSV)
    }
  };

  const handleRunNode = () => {
    const inputData = {
      fileName,
      fileContent,
      fileFormat: "csv",
      targetColumn: text,
      title,
      file: file,
    };
    data.onRunNode && data.onRunNode(inputData);
  };

  const handlePreview = () => {
    if (fileContent) {
      setIsDialogOpen(true);
    }
  };

  return (
    <div
      style={{
        border: "1px solid rgba(252, 3, 211, 1)",
        background: "rgba(252, 3, 211, 0.1)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 10px rgba(219, 60, 48, 0.2)",
        borderRadius: "15px",
        padding: "15px",
        width: "300px",
        position: "relative",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        margin: "20px auto",
        transition: "transform 0.3s ease-in-out",
        animation: "glowBorder 3s infinite",
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
          color: "rgba(255, 255, 255)",
          textAlign: "center",
        }}
      >
        ML Regression Activity
      </h4>

      {/* Title input */}
      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        Title:
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          data.onUpdate && data.onUpdate({ ...data, title: e.target.value });
        }}
        placeholder="Enter Regression Image Title"
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(252, 3, 211, 0.8)",
          borderRadius: "8px",
          background: "rgba(252, 3, 211, 0.1)",
          color: "#fff",
        }}
      />

      {/* File Upload */}
      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        Upload File:
      </label>
      <input
        type="file"
        multiple={false}
        onChange={handleFileUpload}
        accept=".csv"
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(252, 3, 211, 0.8)",
          borderRadius: "8px",
          background: "rgba(252, 3, 211, 0.1)",
          color: "#fff",
        }}
      />

      {/* Target Column input */}
      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        Target Column:
      </label>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          data.onUpdate &&
            data.onUpdate({ ...data, targetColumn: e.target.value });
        }}
        placeholder="Enter target column"
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(252, 3, 211, 0.8)",
          borderRadius: "8px",
          background: "rgba(252, 3, 211, 0.1)",
          color: "#fff",
        }}
      />

      {/* Run Button */}
      <button
        onClick={handleRunNode}
        style={{
          padding: "10px",
          backgroundColor: "rgba(252, 3, 211, 0.6)",
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
            "rgba(252, 3, 211, 0.8)")
        }
        onMouseOut={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundColor =
            "rgba(252, 3, 211, 0.6)")
        }
      >
        Run Notebook
      </button>

      {/* Preview Button */}
      {fileContent && (
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={handlePreview}
            style={{
              padding: "10px",
              backgroundColor: "rgba(252, 3, 211, 0.6)",
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
                "rgba(252, 3, 211, 0.8)")
            }
            onMouseOut={(e) =>
              ((e.target as HTMLButtonElement).style.backgroundColor =
                "rgba(252, 3, 211, 0.6)")
            }
          >
            Preview File
          </button>
        </div>
      )}

      {/* Status Icon */}
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

      {/* Modal for File Preview */}
      {isDialogOpen && fileContent && (
        <div className="modal">
          <div className="modal-content m-2">
            <pre
              style={{
                maxHeight: "500px",
                overflow: "auto",
                padding: "10px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
                color: "#333",
              }}
            >
              {fileContent}
            </pre>

            <button
              onClick={() => setIsDialogOpen(false)}
              style={{
                padding: "10px",
                backgroundColor: "rgba(255, 100, 100, 0.6)",
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
    </div>
  );
};

export default MLRegressionActivity;
