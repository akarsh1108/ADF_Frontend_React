import React, { useState, useEffect } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { NodeProps, Handle, Position } from "reactflow";

type ToggleNodeData = {
  selectedOption: "event" | "tumbling" | "scheduler";
  schedulerTime: number | null;
  copyCount: number | null; // Add copyCount to data type
  onRunNode?: (inputData: any) => void;
  onUpdate?: (updatedData: any) => void;
  status: "idle" | "success" | "error";
};

const ToggleNode: React.FC<NodeProps<ToggleNodeData>> = ({ data }) => {
  const [selectedOption, setSelectedOption] = useState(
    data.selectedOption || "event"
  );
  const [schedulerTime, setSchedulerTime] = useState<number | null>(
    data.schedulerTime || null
  );
  const [copyCount, setCopyCount] = useState<number | null>(
    data.copyCount || null
  ); // Initialize copyCount state

  // Updating the parent component when the state changes
  useEffect(() => {
    data.onUpdate &&
      data.onUpdate({ selectedOption, schedulerTime, copyCount });
  }, [selectedOption, schedulerTime, copyCount]); // Include copyCount in dependency array

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedValue = e.target.value;
    setSelectedOption(selectedValue as "event" | "tumbling" | "scheduler");

    if (selectedValue !== "scheduler") {
      setSchedulerTime(null);
    }
    if (selectedValue !== "tumbling") {
      setCopyCount(null);
    }
  };

  const handleRunNode = () => {
    const inputData = {
      selectedOption,
      schedulerTime,
      copyCount, // Include copyCount in the data sent to the parent
    };
    data.onRunNode && data.onRunNode(inputData);
  };

  return (
    <div
      style={{
        border: "1px solid #ddd",
        padding: "10px",
        position: "relative",
        width: "300px",
      }}
    >
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />

      <h4>Copy Activity</h4>

      {/* Radio buttons for event, tumbling window, scheduler */}
      <div>
        <label>
          <input
            type="radio"
            name="option"
            value="event"
            checked={selectedOption === "event"}
            onChange={handleOptionChange}
          />
          Event Based
        </label>
        <br />

        <label>
          <input
            type="radio"
            name="option"
            value="tumbling"
            checked={selectedOption === "tumbling"}
            onChange={handleOptionChange}
          />
          Tumbling Window
        </label>
        <br />

        <label>
          <input
            type="radio"
            name="option"
            value="scheduler"
            checked={selectedOption === "scheduler"}
            onChange={handleOptionChange}
          />
          Scheduler
        </label>
        <br />

        {/* Show time input when scheduler is selected */}
        {selectedOption === "scheduler" && (
          <>
            <label>
              Time (seconds):
              <input
                type="number"
                value={schedulerTime || ""}
                onChange={(e) => setSchedulerTime(Number(e.target.value))}
                placeholder="Enter time in seconds"
                style={{ marginLeft: "10px" }}
              />
            </label>
            <br />
          </>
        )}

        {/* Show copy count input when tumbling is selected */}
        {selectedOption === "tumbling" && (
          <>
            <label>
              Count to copy:
              <input
                type="number"
                value={copyCount || ""}
                onChange={(e) => setCopyCount(Number(e.target.value))}
                placeholder="Enter count"
                style={{ marginLeft: "10px" }}
              />
            </label>
            <br />
          </>
        )}
      </div>

      {/* Run button */}
      <button onClick={handleRunNode} style={{ marginTop: "10px" }}>
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
    </div>
  );
};

export default ToggleNode;
