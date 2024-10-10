import React, { useEffect, useState } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";

type APICallData = {
  title: string;
  apiUrl: string;
  method: string;
  headers: { key: string; value: string }[];
  data: { key: string; value: string }[];
  status: "idle" | "success" | "error";
  onRunNode?: (inputData: any) => void;
  onUpdate?: (updatedData: any) => void;
};

const APICallNode: React.FC<NodeProps<APICallData>> = ({ data }) => {
  const [apiUrl, setApiUrl] = useState(data.apiUrl || "");
  const [method, setMethod] = useState(data.method || "POST");
  const [headers, setHeaders] = useState(
    data.headers || [{ key: "", value: "" }]
  );
  const [fields, setFields] = useState(data.data || [{ key: "", value: "" }]);
  const [text, setText] = useState(data.title || "");

  // Add new header field
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
  const handleRunNode = async () => {
    // const headersObj = headers.reduce((acc, header) => {
    //   if (header.key) acc[header.key] = header.value;
    //   return acc;
    // }, {});
    // const dataObj = fields.reduce((acc, field) => {
    //   if (field.key) acc[field.key] = field.value;
    //   return acc;
    // }, {});
    // const inputData = { apiUrl, method, headers: headersObj, data: dataObj };
    // try {
    //   const response = await axios({
    //     method: method,
    //     url: apiUrl,
    //     headers: headersObj,
    //     data: dataObj,
    //   });
    //   console.log("API Response:", response.data);
    //   data.onRunNode && data.onRunNode(response.data);
    // } catch (error) {
    //   console.error("API Request Error:", error);
    // }
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

      <h4>API Call Node</h4>

      <label>Title: </label>
      <input
        type="text"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          data.onUpdate && data.onUpdate({ ...data, text: e.target.value });
        }}
        placeholder="Enter API URL"
      />
      <br />

      <label>API URL: </label>
      <input
        type="text"
        value={apiUrl}
        onChange={(e) => {
          setApiUrl(e.target.value);
          data.onUpdate && data.onUpdate({ ...data, apiUrl: e.target.value });
        }}
        placeholder="Enter API URL"
      />
      <br />

      <label>Method: </label>
      <select
        value={method}
        onChange={(e) => {
          setMethod(e.target.value);
          data.onUpdate && data.onUpdate({ ...data, method: e.target.value });
        }}
      >
        <option value="GET">GET</option>
        <option value="POST">POST</option>
        <option value="PUT">PUT</option>
        <option value="DELETE">DELETE</option>
      </select>
      <br />

      <label>Headers:</label>
      {headers.map((header, index) => (
        <div key={index}>
          <input
            type="text"
            value={header.key}
            onChange={(e) =>
              handleHeaderChange(index, e.target.value, header.value)
            }
            placeholder="Key"
          />
          <input
            type="text"
            value={header.value}
            onChange={(e) =>
              handleHeaderChange(index, header.key, e.target.value)
            }
            placeholder="Value"
          />
        </div>
      ))}
      <button onClick={handleAddHeader}>Add Header</button>
      <button onClick={removeLastHeader}>Remove Header</button>
      <br />

      <label>Data:</label>
      {fields.map((field, index) => (
        <div key={index}>
          <input
            type="text"
            value={field.key}
            onChange={(e) =>
              handleFieldChange(index, e.target.value, field.value)
            }
            placeholder="Key"
          />
          <input
            type="text"
            value={field.value}
            onChange={(e) =>
              handleFieldChange(index, field.key, e.target.value)
            }
            placeholder="Value"
          />
        </div>
      ))}
      <button onClick={handleAddField}>Add Data Field</button>
      <button onClick={removeLastDataField}>Remove Data Feild</button>
      <br />

      <button onClick={handleRunNode}>Send API Request</button>

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

export default APICallNode;
