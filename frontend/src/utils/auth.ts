import axios from "axios";

export interface User {
  fullName: string;
  id: number;
}

export const getUser = async (): Promise<User | null> => {
  try {
    const response = await axios.get("http://localhost/api/v1/me", {
      withCredentials: true
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user data", error);
    return null;
  }
};
