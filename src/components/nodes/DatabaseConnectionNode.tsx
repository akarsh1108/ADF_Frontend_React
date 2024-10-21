import React, { useState, useEffect } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

type DatabaseConnectionData = {
  selectedDatabase: string;
  databaseId: number;
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

  useEffect(() => {
    data.onUpdate &&
      data.onUpdate({
        selectedDatabase,
        databaseId,
        location,
      });
  }, [selectedDatabase, databaseId, location, data]);

  const handleRunNode = () => {
    console.log("Running node...", data);
    const inputData = {
      database: selectedDatabase,
      databaseId: databaseId,
      location: location,
    };
    console.log("inputData", inputData);
    data.onRunNode && data.onRunNode(inputData); // Execute the run node action with inputData
  };

  return (
    <div
      style={{
        border: "1px solid rgba(196, 110, 255, 0.5)",
        background: "rgba(0, 0, 50, 0.3)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 10px rgba(224, 183, 255, 0.2)",
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
        className="custom-dropdown" // Add custom class
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(196, 110, 255, 0.5)",
          borderRadius: "8px",
          background: "rgba(224, 183, 255, 0.2)",
          color: "#fff",
        }}
        onMouseOver={(e) =>
          ((e.target as HTMLSelectElement).style.borderColor =
            "rgba(196, 110, 255, 1)")
        }
        onMouseOut={(e) =>
          ((e.target as HTMLSelectElement).style.borderColor =
            "rgba(196, 110, 255, 0.5)")
        }
      >
        <option value="SSMS">SSMS</option>
        <option value="SSMS2">SSMS2</option>
        <option value="SSMS3">SSMS3</option>
      </select>

      <style>
        {
          /* Custom dropdown styles */
          `.custom-dropdown {
  appearance: none; /* Hide default arrow */
  background-color: black; /* Dropdown background */
  border-color: rgba(196, 110, 255, 1); /* Purple border */
  color: white; /* Font color */
}


.custom-dropdown option {
  background-color: black;
  color: white;
  border: 1px solid rgba(196, 110, 255, 1);
}`
        }
      </style>

      <br />

      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        Connection URL:
      </label>
      <select
        value={databaseId}
        onChange={(e) => setDatabaseId(Number(e.target.value))}
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(196, 110, 255, 0.5)",
          borderRadius: "8px",
          background: "rgba(224, 183, 255, 0.2)",
          color: "#fff",
        }}
      >
        <option value={1}>DB1</option>
        <option value={2}>DB2</option>
      </select>
      <br />

      <button
        onClick={handleRunNode}
        style={{
          padding: "10px",
          backgroundColor: "rgba(0, 150, 255, 0.6)",
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
  
      @keyframes glowBorder {
        0% {
          border-color: rgba(196, 110, 255, 0.5);
          box-shadow: 0 0 5px rgba(196, 110, 255, 0.5);
        }
        50% {
          border-color: rgba(196, 110, 255, 1);
          box-shadow: 0 0 15px rgba(196, 110, 255, 1);
        }
        100% {
          border-color: rgba(196, 110, 255, 0.5);
          box-shadow: 0 0 5px rgba(196, 110, 255, 0.5);
        }
      }
    `}
      </style>
    </div>
  );
};

export default DatabaseConnectionNode;
