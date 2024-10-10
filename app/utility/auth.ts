import { jwtDecode } from "jwt-decode";
import CustomJwtPayload from "../types/CustomJwtPayload";

export const decodeToken = (token: string | undefined) => {
  try {
    return token ? jwtDecode<CustomJwtPayload>(token) : null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const getTokenClientSide = () => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];
};
