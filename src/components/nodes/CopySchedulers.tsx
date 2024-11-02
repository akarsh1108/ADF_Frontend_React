import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { NodeProps, Handle, Position } from "reactflow";

type ToggleNodeData = {
  selectedOption: "Event Based" | "Tumbling Window" | "Scheduler";
  schedulerTime: number | null;
  copyCount: number | null; // Add copyCount to data type
  onRunNode?: (inputData: any) => void;
  onUpdate?: (updatedData: any) => void;
  status: "idle" | "success" | "error";
};

const ToggleNode: React.FC<NodeProps<ToggleNodeData>> = ({ data }) => {
  const [selectedDatabase, setSelectedDatabase] = useState("SSMS");
  const [databaseId, setDatabaseId] = useState(1); // Initialize databaseId state'
  const [selectedOption, setSelectedOption] = useState(
    data.selectedOption || "Event Based"
  );
  const [schedulerTime, setSchedulerTime] = useState<number | null>(
    data.schedulerTime || null
  );
  const [copyCount, setCopyCount] = useState<number | null>(
    data.copyCount || null
  );

  useEffect(() => {
    data.onUpdate &&
      data.onUpdate({
        selectedDatabase,
        databaseId,
        selectedOption,
        schedulerTime,
        copyCount,
      });
  }, [selectedOption, schedulerTime, copyCount]); // Include copyCount in dependency array

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;
    setSelectedOption(
      selectedValue as "Event Based" | "Tumbling Window" | "Scheduler"
    );

    if (selectedValue !== "Scheduler") {
      setSchedulerTime(null);
    }
    if (selectedValue !== "Tumbling Window") {
      setCopyCount(null);
    }
  };

  const handleRunNode = () => {
    const inputData = {
      selectedDatabase,
      databaseId,
      selectedOption,
      schedulerTime,
      copyCount,
    };

    data.onRunNode && data.onRunNode(inputData);
  };

  return (
    <div
      style={{
        border: "1px solid rgba(0, 0, 0, 0)",
        background: "rgba(72,109,121,0.3)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 10px rgba(224, 183, 255, 0.2)",
        borderRadius: "15px",
        padding: "15px",
        width: "300px",
        position: "relative",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        margin: "20px auto",
        animation: "Border 3s infinite",
        transition: "transform 0.3s ease-in-out",
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
        Copy Activity
      </h4>
      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        Destination Database:
      </label>
      <select
        value={selectedDatabase}
        onChange={(e) => setSelectedDatabase(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(0, 0, 0, 0)",
          borderRadius: "8px",
          background: "rgba(224, 183, 255, 0.2)",
          color: "#fff",
        }}
      >
        <option value="SSMS">SSMS</option>
      </select>
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
          border: "1px solid rgba(0, 0, 0, 0)",
          borderRadius: "8px",
          background: "rgba(224, 183, 255, 0.2)",
          color: "#fff",
        }}
      >
        <option value={1}>DB1</option>
        <option value={2}>DB2</option>
      </select>
      <br />

      {/* Radio buttons for event, tumbling window, scheduler */}
      <div>
        <label>
          <input
            type="radio"
            name="option"
            value="Event Based"
            checked={selectedOption === "Event Based"}
            onChange={handleOptionChange}
          />
          Event Based
        </label>
        <br />

        <label>
          <input
            type="radio"
            name="option"
            value="Tumbling Window"
            checked={selectedOption === "Tumbling Window"}
            onChange={handleOptionChange}
          />
          Tumbling Window
        </label>
        <br />

        <label>
          <input
            type="radio"
            name="option"
            value="Scheduler"
            checked={selectedOption === "Scheduler"}
            onChange={handleOptionChange}
          />
          Scheduler
        </label>
        <br />

        {/* Show time input when scheduler is selected */}
        {selectedOption === "Scheduler" && (
          <>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Time (seconds):
              <input
                type="number"
                value={schedulerTime || ""}
                onChange={(e) => setSchedulerTime(Number(e.target.value))}
                placeholder="Enter time in seconds"
                style={{
                  width: "100%",
                  padding: "8px",
                  margin: "8px 0",
                  border: "1px solid rgba(0, 0, 0, 0)",
                  borderRadius: "8px",
                  background: "rgba(224, 183, 255, 0.2)",
                  color: "#fff",
                  marginLeft: "10px",
                }}
              />
            </label>
          </>
        )}

        {/* Show copy count input when tumbling is selected */}
        {selectedOption === "Tumbling Window" && (
          <>
            <label style={{ display: "block", marginBottom: "8px" }}>
              Count to copy:
              <input
                type="number"
                value={copyCount || ""}
                onChange={(e) => setCopyCount(Number(e.target.value))}
                placeholder="Enter count"
                style={{
                  width: "100%",
                  padding: "8px",
                  margin: "8px 0",
                  border: "1px solid rgba(0, 0, 0, 0)",
                  borderRadius: "8px",
                  background: "rgba(224, 183, 255, 0.2)",
                  color: "#fff",
                  marginLeft: "10px",
                }}
              />
            </label>
          </>
        )}
      </div>

      {/* Run button */}
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
      `}
      </style>
    </div>
  );
};

export default ToggleNode;
