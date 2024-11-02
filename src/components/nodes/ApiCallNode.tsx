import React, { useEffect, useState } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

type APICallData = {
  title: string;
  url: string;
  method: string;
  headers: { key: string; value: string }[];
  data: { key: string; value: any }[];
  status: "idle" | "success" | "error";
  onRunNode?: (inputData: any) => void;
  onUpdate?: (updatedData: any) => void;
};

const APICallNode: React.FC<NodeProps<APICallData>> = ({ data }) => {
  const [apiUrl, setApiUrl] = useState(data.url || "");
  const [method, setMethod] = useState(data.method || "POST");
  const [headers, setHeaders] = useState(
    data.headers || [{ key: "", value: "" }]
  );
  const [fields, setFields] = useState(data.data || [{ key: "", value: "" }]);
  const [text, setText] = useState(data.title || "");

  useEffect(() => {
    data.onUpdate &&
      data.onUpdate({
        url: apiUrl,
        method,
        headers,
        fields,
        title: text,
      });
  }, [apiUrl, method, headers, fields, text]);

  const handleAddHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  // Add new data field
  const handleAddField = () => {
    setFields([...fields, { key: "", value: "" }]);
  };

  // Handle header change
  const handleHeaderChange = (index: number, key: string, value: string) => {
    const updatedHeaders = [...headers];
    updatedHeaders[index] = { key, value };
    setHeaders(updatedHeaders);
    data.onUpdate && data.onUpdate({ ...data, headers: updatedHeaders });
  };

  const removeLastHeader = () => {
    if (headers.length > 0) {
      const updatedHeaders = headers.slice(0, -1);
      setHeaders(updatedHeaders);
      data.onUpdate && data.onUpdate({ ...data, headers: updatedHeaders });
    }
  };

  // Handle data field change
  const handleFieldChange = (index: number, key: string, value: string) => {
    const updatedFields = [...fields];
    updatedFields[index] = { key, value };
    setFields(updatedFields);
    data.onUpdate && data.onUpdate({ ...data, data: updatedFields });
  };

  const removeLastDataField = () => {
    if (fields.length > 0) {
      const updatedFields = fields.slice(0, -1);
      setFields(updatedFields);
      data.onUpdate && data.onUpdate({ ...data, data: updatedFields });
    }
  };

  // Run API call
  const handleRunNode = () => {
    const inputData = {
      title: text,
      url: apiUrl,
      method: method,
      headers: headers,
      data: fields,
    };
    data.onRunNode && data.onRunNode(inputData);
  };

  return (
    <div
      style={{
        width: "300px",
        border: "1px solid rgba(26, 120, 194, 1)", // Border style with animation
        background: "rgba(26, 120, 194, 0.1)", // Soft blue background for glass effect
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 10px rgba(26, 120, 194, 0.2)", // Enhanced shadow effect
        borderRadius: "15px",
        padding: "15px",
        position: "relative",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
        margin: "20px auto", // Centered with some margin
        animation: "glowBorder 3s infinite, fadeIn 1s ease-in-out", // Combined animations
        transition: "transform 0.3s ease-in-out",
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
        API Call Activity
      </h4>

      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        Title:
      </label>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          data.onUpdate && data.onUpdate({ ...data, text: e.target.value });
        }}
        placeholder="Enter API Title"
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(26, 120, 194, 1)",
          borderRadius: "8px",
          background: "rgba(26, 120, 194, 0.2)",
          color: "#fff",
        }}
      />
      <br />

      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        API URL:
      </label>
      <input
        type="text"
        value={apiUrl}
        onChange={(e) => {
          setApiUrl(e.target.value);
          data.onUpdate && data.onUpdate({ ...data, apiUrl: e.target.value });
        }}
        placeholder="Enter API URL"
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(26, 120, 194, 1)",
          borderRadius: "8px",
          background: "rgba(26, 120, 194, 0.2)",
          color: "#fff",
        }}
      />
      <br />

      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        Method:
      </label>
      <select
        value={method}
        onChange={(e) => {
          setMethod(e.target.value);
          data.onUpdate && data.onUpdate({ ...data, method: e.target.value });
        }}
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(26, 120, 194, 1)",
          borderRadius: "8px",
          background: "rgba(26, 120, 194, 0.2)",
          color: "#fff",
        }}
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>
      <br />

      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        Headers:
      </label>
      {headers.map((header, index) => (
        <div
          key={index}
          style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
        >
          <input
            type="text"
            value={header.key}
            onChange={(e) =>
              handleHeaderChange(index, e.target.value, header.value)
            }
            placeholder="Key"
            style={{
              width: "50%",
              padding: "8px",
              border: "1px solid rgba(26, 120, 194, 1)",
              borderRadius: "8px",
              background: "rgba(26, 120, 194, 0.2)",
              color: "#fff",
            }}
          />
          <input
            type="text"
            value={header.value}
            onChange={(e) =>
              handleHeaderChange(index, header.key, e.target.value)
            }
            placeholder="Value"
            style={{
              width: "50%",
              padding: "8px",
              border: "1px solid rgba(26, 120, 194, 1)",
              borderRadius: "8px",
              background: "rgba(26, 120, 194, 0.2)",
              color: "#fff",
            }}
          />
        </div>
      ))}
      <button
        onClick={handleAddHeader}
        style={{
          padding: "8px",
          backgroundColor: "rgba(0, 200, 150, 0.6)",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Add Header
      </button>
      <button
        onClick={removeLastHeader}
        style={{
          padding: "8px",
          backgroundColor: "rgba(255, 100, 100, 0.6)",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          marginLeft: "8px",
        }}
      >
        Remove Header
      </button>
      <br />

      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        Data:
      </label>
      {fields.map((field, index) => (
        <div
          key={index}
          style={{ display: "flex", gap: "8px", marginBottom: "8px" }}
        >
          <input
            type="text"
            value={field.key}
            onChange={(e) =>
              handleFieldChange(index, e.target.value, field.value)
            }
            placeholder="Key"
            style={{
              width: "50%",
              padding: "8px",
              border: "1px solid rgba(26, 120, 194, 1)",
              borderRadius: "8px",
              background: "rgba(26, 120, 194, 0.2)",
              color: "#fff",
            }}
          />
          <input
            type="text"
            value={field.value}
            onChange={(e) =>
              handleFieldChange(index, field.key, e.target.value)
            }
            placeholder="Value"
            style={{
              width: "50%",
              padding: "8px",
              border: "1px solid rgba(26, 120, 194, 1)",
              borderRadius: "8px",
              background: "rgba(26, 120, 194, 0.2)",
              color: "#fff",
            }}
          />
        </div>
      ))}
      <button
        onClick={handleAddField}
        style={{
          padding: "8px",
          backgroundColor: "rgba(0, 200, 150, 0.6)",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
        }}
      >
        Add Data Field
      </button>
      <button
        onClick={removeLastDataField}
        style={{
          padding: "8px",
          backgroundColor: "rgba(255, 100, 100, 0.6)",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          marginLeft: "8px",
        }}
      >
        Remove Data Field
      </button>
      <br />

      <button
        onClick={handleRunNode}
        style={{
          padding: "10px",
          backgroundColor: "rgba(26, 120, 194, 0.6)",
          border: "none",
          borderRadius: "8px",
          color: "#fff",
          fontWeight: "bold",
          cursor: "pointer",
          width: "100%",
          marginTop: "10px",
        }}
      >
        Send API Request
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
      //     box-shadow: 0 0 1px rgba(26, 120, 194, 0.5), 0 0 2px rgba(26, 120, 194, 0.5), 0 0 3px rgba(26, 120, 194, 0.5);
      //   }
      //   50% {
      //     box-shadow: 0 0 4px rgba(26, 120, 194, 1), 0 0 6px rgba(26, 120, 194, 1), 0 0 8px rgba(26, 120, 194, 1);
      //   }
      //   100% {
      //     box-shadow: 0 0 1px rgba(26, 120, 194, 0.5), 0 0 2px rgba(26, 120, 194, 0.5), 0 0 3px rgba(26, 120, 194, 0.5);
      //   }
      // }
    `}
      </style>
    </div>
  );
};

export default APICallNode;
