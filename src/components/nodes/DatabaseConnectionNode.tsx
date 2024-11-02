import React, { useState, useEffect } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

type DatabaseConnectionData = {
  selectedDatabase: string;
  databaseId: number;
  url: string;
  location: string;
  status: "idle" | "success" | "error";
  onRunNode?: (inputData: any) => void;
  onUpdate?: (updatedData: any) => void;
};

const DatabaseConnectionNode: React.FC<NodeProps<DatabaseConnectionData>> = ({
  data,
}) => {
  const [selectedDatabase, setSelectedDatabase] = useState(
    data.selectedDatabase || "SSMS"
  );
  const [databaseId, setDatabaseId] = useState(data.databaseId || 1);
  const [location, setLocation] = useState(data.location || "Source");
  const [connectionType, setConnectionType] = useState("Dropdown"); // New state for connection type
  const [urlInput, setUrlInput] = useState(""); // State to store text input when URL is selected

  useEffect(() => {
    data.onUpdate &&
      data.onUpdate({ selectedDatabase, databaseId, location, url: urlInput });
  }, [selectedDatabase, databaseId, location, urlInput, data]);

  const handleRunNode = () => {
    const inputData = {
      database: selectedDatabase,
      databaseId: connectionType === "Dropdown" ? databaseId : 0,
      connectionType,
      url: urlInput,
      location,
    };
    data.onRunNode && data.onRunNode(inputData);
  };

  return (
    <div
      style={{
        border: "0.5px solid rgba(255, 152, 0, 1)",
        background: "rgba(255, 152, 0, 0.1)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 6px rgba(255, 152, 0, 0.)",
        borderRadius: "15px",
        padding: "15px",
        width: "300px",
        position: "relative",
        color: "white",
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
          marginBottom: "15px",
          textAlign: "center",
        }}
      >
        Connection Activity
      </h4>

      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        Integration Database:
      </label>
      <select
        value={selectedDatabase}
        onChange={(e) => setSelectedDatabase(e.target.value)}
        className="custom-dropdown"
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(255, 152, 0, 1)",
          borderRadius: "8px",
          background: "rgba(255, 152, 0, 0.2)",
          color: "#fff",
        }}
        onMouseOver={(e) =>
          ((e.target as HTMLSelectElement).style.borderColor =
            "rgba(255, 152, 0, 0.6)")
        }
        onMouseOut={(e) =>
          ((e.target as HTMLSelectElement).style.borderColor =
            "rgba(255, 152, 0, 0.8)")
        }
      >
        <option value="SSMS">SSMS</option>
        <option value="SSMS2">SSMS2</option>
        <option value="SSMS3">SSMS3</option>
      </select>

      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        Connection Type:
      </label>
      <select
        value={connectionType}
        onChange={(e) => setConnectionType(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(255, 152, 0, 1)",
          borderRadius: "8px",
          background: "rgba(255, 152, 0, 0.2)",
          color: "#fff",
        }}
      >
        <option value="Dropdown">Dropdown</option>
        <option value="URL">URL</option>
      </select>

      {connectionType === "Dropdown" ? (
        <>
          <label
            style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
          >
            Connection URL:
          </label>
          <select
            value={databaseId}
            onChange={(e) => {
              setDatabaseId(Number(e.target.value));
              setUrlInput("");
            }}
            style={{
              width: "100%",
              padding: "8px",
              margin: "8px 0",
              border: "1px solid rgba(255, 152, 0, 1)",
              borderRadius: "8px",
              background: "rgba(255, 152, 0, 0.2)",
              color: "#fff",
            }}
          >
            <option value={1}>DB1</option>
            <option value={2}>DB2</option>
          </select>
        </>
      ) : (
        <>
          <label
            style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
          >
            Enter URL:
          </label>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            style={{
              width: "100%",
              padding: "8px",
              margin: "8px 0",
              border: "1px solid rgba(255, 152, 0, 1)",
              borderRadius: "8px",
              background: "rgba(255, 152, 0, 0.2)",
              color: "#fff",
            }}
          />
        </>
      )}

      <button
        onClick={handleRunNode}
        style={{
          padding: "10px",
          backgroundColor: "rgba(255, 152, 0, 1)",
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
            "rgba(255, 152, 0, 0.6)")
        }
        onMouseOut={(e) =>
          ((e.target as HTMLButtonElement).style.backgroundColor =
            "rgba(255, 152, 0, 0.8)")
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
    </div>
  );
};

export default DatabaseConnectionNode;
