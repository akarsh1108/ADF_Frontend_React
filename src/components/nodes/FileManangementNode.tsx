import React, { useEffect, useState } from "react";
import { NodeProps, Handle, Position } from "reactflow";
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
    const inputData = {
      file: fileId,
      fileName,
      format: fileFormat,
      database:
        data.files && data.files.length > 0 && Number(data.files[0].databaseId),
    };
    data.onRunNode && data.onRunNode(inputData);
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
      <h4>File Management Node</h4>

      <label>File: </label>
      <select value={selectedFile} onChange={handleFileSelect}>
        {data.files && data.files.length > 0 ? (
          data.files.map((file: Files) => (
            <option key={file.id} value={file.id}>
              {file.filename}
            </option>
          ))
        ) : (
          <option value="">No files</option>
        )}
      </select>
      <br />

      <label>File New Name: </label>
      <input
        type="text"
        value={fileName.split(".")[0]}
        onChange={(e) => setFileName(e.target.value)}
      />
      <br />

      <label>File Format: </label>
      <select
        value={fileFormat}
        onChange={(e) => setFileFormat(e.target.value)}
      >
        <option value="json">JSON</option>
        <option value="xml">XML</option>
        <option value="txt">txt</option>
        <option value="csv">CSV</option>
      </select>
      <br />

      <button onClick={handleRunNode}>Run Activity</button>

      {fileContentUrl && (
        <>
          <button onClick={handlePreview}>Preview File</button>
          <button onClick={handleDownload}>Download File</button>
        </>
      )}

      {data.status === "success" && data.files && (
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
          <div className="modal-content">
            <h4>Preview: {fileName}</h4>
            <iframe
              src={fileContentUrl}
              style={{ width: "100%", height: "500px" }}
              title="file-preview"
            />
            <button onClick={() => setIsDialogOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManagementNode;
