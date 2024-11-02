import React, { useEffect, useState } from "react";
import { NodeProps, Handle, Position } from "reactflow";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { connectionString } from "../../schemas/connection";

type File = {
  filename: string;
  filetype: string;
  content: string;
  contentBytes: Uint8Array;
};

type DestinationConnectionData = {
  file: File;
  selectedDatabase: string;
  databaseId: number;
  url: string;
  location: string;
  status: "idle" | "success" | "error";
  onRunNode?: (inputData: any) => void;
  onUpdate?: (updatedData: any) => void;
};

const DestinationConnectionNode: React.FC<
  NodeProps<DestinationConnectionData>
> = ({ data }) => {
  const [selectedDatabase, setSelectedDatabase] = useState(
    data.selectedDatabase || "SSMS"
  );
  const [databaseId, setDatabaseId] = useState(data.databaseId || 1);
  const [location, setLocation] = useState(data.location || "Destination");
  const [fileContentUrl, setFileContentUrl] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [connectionType, setConnectionType] = useState("Dropdown");
  // Function to convert base64 to Blob
  const base64ToBlob = (base: string, fileType: string) => {
    try {
      let base64 = base;
      // console.log("Base", base);
      if (fileType === "application/json") {
        base64 = btoa(unescape(encodeURIComponent(base))); // Ensure the base64 string is correctly encoded
        // console.log("Base633333333334", base);
      } else if (fileType === "text/plain") {
        base64 = btoa(unescape(encodeURIComponent(base))); // Ensure the base64 string is correctly encoded
      } else if (fileType === "application/xml" || fileType === "text/xml") {
        base64 = btoa(unescape(encodeURIComponent(base))); // Ensure the base64 string is correctly encoded
      } else if (fileType === "text/csv") {
        base64 = btoa(unescape(encodeURIComponent(base))); // Ensure the base64 string is correctly encoded
      }
      // Check if the string contains a base64 prefix (e.g., "data:<filetype>;base64,") and remove it
      const cleanedBase64 = base64.includes("base64,")
        ? base64.split("base64,")[1]
        : base64;

      // Ensure the cleaned base64 string has no invalid characters
      const isBase64Valid = /^[A-Za-z0-9+/=]*$/.test(cleanedBase64);
      if (!isBase64Valid) {
        throw new Error("Invalid characters found in the Base64 string.");
      }

      // Base64 strings should be a multiple of 4
      if (cleanedBase64.length % 4 !== 0) {
        throw new Error("Invalid Base64 string length.");
      }

      // Remove any newlines, spaces, or invalid characters
      const sanitizedBase64 = cleanedBase64
        .replace(/(\r\n|\n|\r)/gm, "")
        .trim();

      // Decode Base64 to binary
      const byteCharacters = atob(sanitizedBase64); // Decoding base64
      const byteNumbers = new Uint8Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      // Create the Blob object
      return new Blob([byteNumbers], { type: fileType });
    } catch (error) {
      console.error("Failed to convert base64 to Blob:", error);
      return null;
    }
  };

  useEffect(() => {
    data.onUpdate &&
      data.onUpdate({
        databaseId,
        url: urlInput,
      });
    if (data.file?.content && data.file.filetype) {
      const blob = base64ToBlob(data.file.content, data.file.filetype);
      if (blob) {
        const file1 = new File([blob], data.file.filename, {
          type: data.file.filetype,
        });
        console.log("File1", file1);
      }

      if (blob) {
        const url = URL.createObjectURL(blob);
        setFileContentUrl(url);
      } else {
        console.error("Failed to create Blob URL.");
      }
    } else {
      console.error("Invalid file content or filetype:", data.file);
    }
  }, [data.file, databaseId, urlInput]);

  const handlePreview = () => {
    if (fileContentUrl) {
      setIsDialogOpen(true);
    }
  };

  const handleDownload = () => {
    if (fileContentUrl) {
      const a = document.createElement("a");
      a.href = fileContentUrl;
      a.download =
        data.file.filetype === "application/json"
          ? `${data.file.filename.split(".")[0]}.json`
          : data.file.filetype === "application/xml"
          ? `${data.file.filetype.split(".")[0]}.xml`
          : data.file.filetype === "text/plain"
          ? `${data.file.filename.split(".")[0]}.txt`
          : `${data.file.filename.split(".")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  const handleRunNode = () => {
    const inputData = {
      source: connectionType === "Dropdown" ? databaseId : 0,
      filename: data.file.filename,
      fileformat: data.file.filetype,
      connectionType,
      url: urlInput,
      content: data.file.content,
    };

    // console.log("Running Destination Connection Node with: ", inputData);
    data.onRunNode && data.onRunNode(inputData);
  };

  return (
    <div
      style={{
        width: "300px",
        border: "1px solid rgba(173, 6, 229, 1)",
        background: "rgba(173, 6, 229, 0.1)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 4px 10px rgba(173, 6, 229, 0.2)",
        borderRadius: "15px",
        padding: "15px",
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
        Destination Connection Activity
      </h4>

      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        File Name: {data.file.filename}
      </label>
      <label
        style={{ display: "block", marginBottom: "8px", fontSize: "14px" }}
      >
        File Format: {data.file.filetype}
      </label>

      <label>Integration Database:</label>
      <select
        value={selectedDatabase}
        onChange={(e) => setSelectedDatabase(e.target.value)}
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(173, 6, 229, 1)",
          borderRadius: "8px",
          background: "rgba(173, 6, 229, 0.2)",
          color: "#fff",
        }}
      >
        <option value="SSMS">SSMS</option>
        <option value="MongoDb">MongoDb</option>
      </select>

      {/* <label>Connection Url:</label>
      <select
        value={databaseId}
        onChange={(e) => setDatabaseId(Number(e.target.value))}
        style={{
          width: "100%",
          padding: "8px",
          margin: "8px 0",
          border: "1px solid rgba(173, 6, 229, 1)",
          borderRadius: "8px",
          background: "rgba(173, 6, 229, 0.2)",
          color: "#fff",
        }}
      >
        <option value={1}>DB1</option>
        <option value={2}>DB2</option>
      </select> */}
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
          border: "1px solid rgba(173, 6, 229, 1)",
          borderRadius: "8px",
          background: "rgba(173, 6, 229, 0.2)",
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
              border: "1px solid rgba(173, 6, 229, 1)",
              borderRadius: "8px",
              background: "rgba(173, 6, 229, 0.2)",
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
              border: "1px solid rgba(173, 6, 229, 1)",
              borderRadius: "8px",
              background: "rgba(173, 6, 229, 0.2)",
              color: "#fff",
            }}
          />
        </>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        <button
          onClick={handleRunNode}
          style={{
            flex: "1",
            marginRight: "5px",
            padding: "10px",
            backgroundColor: "rgba(173, 6, 229, 0.6)",
            border: "none",
            borderRadius: "8px",
            color: "#fff",
            fontWeight: "bold",
            cursor: "pointer",
            transition: "background 0.3s",
          }}
          onMouseOver={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor =
              "rgba(173, 6, 229, 0.8)")
          }
          onMouseOut={(e) =>
            ((e.target as HTMLButtonElement).style.backgroundColor =
              "rgba(173, 6, 229, 0.6)")
          }
        >
          Run Activity
        </button>

        {fileContentUrl && (
          <>
            <button
              onClick={handlePreview}
              style={{
                flex: "1",
                marginRight: "5px",
                padding: "10px",
                backgroundColor: "rgba(173, 6, 229, 0.6)", // Light blue for Preview
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Preview
            </button>

            <button
              onClick={handleDownload}
              style={{
                flex: "1",
                padding: "10px",
                backgroundColor: "rgba(173, 6, 229, 0.6)", // Light blue for Download
                border: "none",
                borderRadius: "8px",
                color: "#fff",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Download
            </button>
          </>
        )}
      </div>

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
                backgroundColor: "rgba(173, 6, 229, 0.6)",
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
      //     box-shadow: 0 0 1px rgba(173, 6, 229, 0.5), 0 0 2px rgba(173, 6, 229, 0.5), 0 0 3px rgba(173, 6, 229, 0.5);
      //   }
      //   50% {
      //     box-shadow: 0 0 4px rgba(173, 6, 229, 1), 0 0 6px rgba(173, 6, 229, 1), 0 0 8px rgba(173, 6, 229, 1);
      //   }
      //   100% {
      //     box-shadow: 0 0 1px rgba(173, 6, 229, 0.5), 0 0 2px rgba(173, 6, 229, 0.5), 0 0 3px rgba(173, 6, 229, 0.5);
      //   }
      // }
    `}
      </style>
    </div>
  );
};

export default DestinationConnectionNode;

// import React, { useEffect, useState } from "react";
// import { NodeProps, Handle, Position } from "reactflow";
// import { FiCheckCircle, FiXCircle } from "react-icons/fi";

// type File = {
//   filename: string;
//   filetype: string;
//   content: string;
//   contentBytes: Uint8Array;
// };

// type DestinationConnectionData = {
//   file: File;
//   selectedDatabase: string;
//   databaseId: number;
//   location: string;
//   status: "idle" | "success" | "error";
//   onRunNode?: (inputData: any) => void;
//   onUpdate?: (updatedData: any) => void;
// };

// const DestinationConnectionNode: React.FC<
//   NodeProps<DestinationConnectionData>
// > = ({ data }) => {
//   const [selectedDatabase, setSelectedDatabase] = useState(
//     data.selectedDatabase || "SSMS"
//   );
//   const [databaseId, setDatabaseId] = useState(data.databaseId || 1);
//   const [location, setLocation] = useState(data.location || "Destination");
//   const [fileContentUrl, setFileContentUrl] = useState<string | null>(null);
//   const [isDialogOpen, setIsDialogOpen] = useState(false);

//   const [connectionType, setConnectionType] = useState("existing");
//   const [customDatabaseUrl, setCustomDatabaseUrl] = useState("");

//   // Function to convert base64 to Blob (your existing code)
//   const base64ToBlob = (base: string, fileType: string) => {
//     try {
//       let base64 = base;
//       // console.log("Base", base);
//       if (fileType === "application/json") {
//         base64 = btoa(unescape(encodeURIComponent(base))); // Ensure the base64 string is correctly encoded
//         // console.log("Base633333333334", base);
//       } else if (fileType === "text/plain") {
//         base64 = btoa(unescape(encodeURIComponent(base))); // Ensure the base64 string is correctly encoded
//       } else if (fileType === "application/xml" || fileType === "text/xml") {
//         base64 = btoa(unescape(encodeURIComponent(base))); // Ensure the base64 string is correctly encoded
//       } else if (fileType === "text/csv") {
//         base64 = btoa(unescape(encodeURIComponent(base))); // Ensure the base64 string is correctly encoded
//       }
//       // Check if the string contains a base64 prefix (e.g., "data:<filetype>;base64,") and remove it
//       const cleanedBase64 = base64.includes("base64,")
//         ? base64.split("base64,")[1]
//         : base64;

//       // Ensure the cleaned base64 string has no invalid characters
//       const isBase64Valid = /^[A-Za-z0-9+/=]*$/.test(cleanedBase64);
//       if (!isBase64Valid) {
//         throw new Error("Invalid characters found in the Base64 string.");
//       }

//       // Base64 strings should be a multiple of 4
//       if (cleanedBase64.length % 4 !== 0) {
//         throw new Error("Invalid Base64 string length.");
//       }

//       // Remove any newlines, spaces, or invalid characters
//       const sanitizedBase64 = cleanedBase64
//         .replace(/(\r\n|\n|\r)/gm, "")
//         .trim();

//       // Decode Base64 to binary
//       const byteCharacters = atob(sanitizedBase64); // Decoding base64
//       const byteNumbers = new Uint8Array(byteCharacters.length);

//       for (let i = 0; i < byteCharacters.length; i++) {
//         byteNumbers[i] = byteCharacters.charCodeAt(i);
//       }

//       // Create the Blob object
//       return new Blob([byteNumbers], { type: fileType });
//     } catch (error) {
//       console.error("Failed to convert base64 to Blob:", error);
//       return null;
//     }
//   };

//   useEffect(() => {
//     data.onUpdate &&
//       data.onUpdate({
//         databaseId,
//       });
//     if (data.file?.content && data.file.filetype) {
//       const blob = base64ToBlob(data.file.content, data.file.filetype);
//       if (blob) {
//         const url = URL.createObjectURL(blob);
//         setFileContentUrl(url);
//       } else {
//         console.error("Failed to create Blob URL.");
//       }
//     }
//   }, [data.file, databaseId]);

//   const handleRunNode = () => {
//     const inputData = {
//       source: databaseId,
//       filename: data.file.filename,
//       fileformat: data.file.filetype,
//       content: data.file.content,
//       customDatabaseUrl,
//     };
//     data.onRunNode && data.onRunNode(inputData);
//   };

//   return (
//     <div
//       style={{
//         width: "300px",
//         border: "1px solid rgba(173, 6, 229, 1)",
//         background: "rgba(173, 6, 229, 0.1)",
//         padding: "15px",
//         borderRadius: "15px",
//         color: "#fff",
//         margin: "20px auto",
//       }}
//     >
//       <Handle type="source" position={Position.Right} />
//       <Handle type="target" position={Position.Left} />

//       <h4 style={{ textAlign: "center", marginBottom: "15px" }}>
//         Destination Connection Activity
//       </h4>

//       <label>Connection Type:</label>
//       <select
//         value={connectionType}
//         onChange={(e) => setConnectionType(e.target.value)}
//         style={{ width: "100%", padding: "8px", margin: "8px 0" }}
//       >
//         <option value="existing">Existing</option>
//         <option value="new">New</option>
//       </select>

//       {connectionType === "existing" ? (
//         <>
//           <label>Connection URL:</label>
//           <select
//             value={databaseId}
//             onChange={(e) => setDatabaseId(Number(e.target.value))}
//             style={{ width: "100%", padding: "8px", margin: "8px 0" }}
//           >
//             <option value={1}>DB1</option>
//             <option value={2}>DB2</option>
//           </select>
//         </>
//       ) : (
//         <>
//           <label>Custom Database URL:</label>
//           <input
//             type="text"
//             value={customDatabaseUrl}
//             onChange={(e) => setCustomDatabaseUrl(e.target.value)}
//             placeholder="Enter custom DB URL"
//             style={{ width: "100%", padding: "8px", margin: "8px 0" }}
//           />
//         </>
//       )}

//       <div style={{ display: "flex", justifyContent: "space-between" }}>
//         <button onClick={handleRunNode} style={{ flex: 1, marginRight: "5px" }}>
//           Run Activity
//         </button>
//       </div>

//       {data.status === "success" && (
//         <FiCheckCircle
//           style={{ color: "green", position: "absolute", top: 5, right: 5 }}
//         />
//       )}
//       {data.status === "error" && (
//         <FiXCircle
//           style={{ color: "red", position: "absolute", top: 5, right: 5 }}
//         />
//       )}
//     </div>
//   );
// };

// export default DestinationConnectionNode;
