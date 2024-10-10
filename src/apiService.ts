import axios from "axios";

const Api_Url = "http://127.0.0.1:8000";

export const getFiles = async () => {
  try {
    const response = await axios.get(`${Api_Url}/getfileSource1/`);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
