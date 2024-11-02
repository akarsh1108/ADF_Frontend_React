import axios from "axios";
import {
  ApiCall,
  ConnectionString,
  DestinationConnection,
  FileManagement,
  Scheduling,
} from "../schemas/connection";

const API_URL = "http://127.0.0.1:8000";
export const fetchDatabaseConnectionApi = async (req: ConnectionString) => {
  try {
    console.log(req);
    const response = await axios.get(
      `${API_URL}/getfileSource1/${req.databaseId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching database connection:", error);
  }
};

export const fetchDatabaseConnectionApiUrl = async (req: ConnectionString) => {
  try {
    const formData = new FormData();
    if (req.url) formData.append("s", req.url);
    else throw new Error("URL is empty");

    const response = await axios.post(`${API_URL}/fileSourceUrl/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching database connection URL:", error);
  }
};
export const fetchFileConvertApi = async (file: FileManagement) => {
  try {
    const response = await axios.post(`${API_URL}/FileConvert/`, file, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error converting file:", error);
  }
};

export const fetchDestinationConnectionApi = async (
  req: DestinationConnection
) => {
  try {
    const formData = new FormData();

    const base64ToBlob = (base: string, fileType: string) => {
      try {
        let base64 = base;
        if (fileType === "application/json") {
          base64 = btoa(unescape(encodeURIComponent(base)));
        } else if (fileType === "text/plain") {
          base64 = btoa(unescape(encodeURIComponent(base)));
        } else if (fileType === "application/xml" || fileType === "text/xml") {
          base64 = btoa(unescape(encodeURIComponent(base)));
          base64 = btoa(unescape(encodeURIComponent(base)));
        } else if (fileType === "text/csv") {
          base64 = btoa(unescape(encodeURIComponent(base)));
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

    const file = base64ToBlob(req.content, req.filetype);

    // Append necessary fields to formData
    formData.append("source", req.source.toString());
    formData.append("filename", req.filename);
    formData.append("filetype", req.filetype);
    if (file) {
      formData.append("file", file, req.filename); // Attach the file
    } else {
      throw new Error("Failed to convert base64 to Blob.");
    }

    if (req.url && req.url.length > 0) {
      formData.append("url", req.url);
    } else {
      formData.append("url", "");
    }

    const response = await axios.post(`${API_URL}/copy-data/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching destination connection:", error);
  }
};

export const postApiCall = async (req: any) => {
  try {
    console.log(req);
    const response = await axios.post(`${API_URL}/executeApi/`, req);
    return response.data;
  } catch (error) {
    console.error("Error fetching API call:", error);
  }
};

export const uploadJupyterNotebookApi = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(`${API_URL}/compileNotebook/`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading Jupyter notebook:", error);
  }
};

export const termialLogs = async (req: any) => {
  try {
    const response = await axios.post(`${API_URL}/catching-logs/`, req);
    return response.data;
  } catch (error) {
    console.error("Error fetching terminal logs:", error);
  }
};

export const uploadFiles = async (id: number, file: File) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      `${API_URL}/upload-file/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error uploading file:", error);
  }
};

export const schedulingActivity = async (req: Scheduling) => {
  try {
    const response = await axios.post(`${API_URL}/scheduling/`, req);
    return response.data;
  } catch (error) {
    console.error("Error fetching terminal logs:", error);
  }
};
