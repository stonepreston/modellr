import axios, { AxiosInstance } from "axios";

const csApiClient: AxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_CS_URL,
    headers: {
      "Content-type": "application/json",
    },
});

export default csApiClient;