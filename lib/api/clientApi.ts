import axios from "axios";
import { Tool } from "@/types/tool";

interface Tools {
  data: {
    tools: Tool[];
  };
}

export const getTools = async () => {
  const res = await axios.get<Tools>(
    "https://project-group-6-backend.onrender.com/api/tools"
  );
  return res.data;
};
