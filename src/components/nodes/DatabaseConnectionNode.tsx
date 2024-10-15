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
        border: "1px solid #ddd",
        padding: "10px",
        position: "relative",
      }}
    >
      <Handle type="source" position={Position.Right} />
      <Handle type="source" position={Position.Top} />
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Bottom} />
      <h4>Connection Activity</h4>
      <label>Integration Database: </label>
      <select
        value={selectedDatabase}
        onChange={(e) => setSelectedDatabase(e.target.value)}
      >
        <option value="SSMS">SSMS</option>
      </select>
      <br />
      <label>Connection Url: </label>
      <select
        value={databaseId}
        onChange={(e) => setDatabaseId(Number(e.target.value))}
      >
        <option value={1}>DB1</option>
        <option value={2}>DB2</option>
      </select>
      <br />
      <label>Location : </label>
      <select value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="Source">Source</option>
        <option value="Destination">Destination</option>
      </select>
      <br />

      <button onClick={handleRunNode}>Run Activity</button>
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
