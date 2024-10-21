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

export const isTokenExpired = (token: string | undefined) => {
  const decodedToken = decodeToken(token);
  if (!decodedToken || !decodedToken.exp) {
    return true;
  }

  const currentTime = Date.now() / 1000; // Convert to seconds
  return decodedToken.exp < currentTime;
};

export const isAuthenticated = (token: string | undefined) => {
  return !!(token && !isTokenExpired(token)); //!! converts to a boolean value but preserves the 'truthiness'
};

export const extractUserRole = (token: string | undefined) => {
  const decodedToken = decodeToken(token);
  if (decodedToken) {
    const role = decodedToken.role;
    return role ? role : null;
  }
  return null;
};
