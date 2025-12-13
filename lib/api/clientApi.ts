import axios from "axios";

export const getCategories = async () => {
  const { data } = await axios.get("/api/categories");
  return data;
};

export const createTool = async (formData: FormData) => {
  const { data } = await axios.post("/api/tools", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};
