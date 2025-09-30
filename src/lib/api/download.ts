import { nextAPI } from "./internal-api";

export const downloadAPI = {
  downMac: async () => {
    const response = await nextAPI.get("/electron/download/mac");
    console.log(response.data);
    return response.data;
  },
  downRas: async () => {
    const response = await nextAPI.get("/electron/download/linux");
    console.log(response.data);
    return response.data;
  },
};
