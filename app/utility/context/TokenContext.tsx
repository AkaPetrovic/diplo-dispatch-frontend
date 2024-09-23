"use client";

import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { decodeToken } from "../auth";
import CustomJwtPayload from "@/app/types/CustomJwtPayload";

interface Props {
  children: React.ReactNode;
}

interface TokenContext {
  tokenValue: CustomJwtPayload | null;
  setTokenValue: Dispatch<SetStateAction<CustomJwtPayload | null>>;
}

export const TokenContext = createContext<TokenContext>({} as TokenContext);

export function TokenContextProvider({ children }: Props) {
  const [tokenValue, setTokenValue] = useState<CustomJwtPayload | null>(null);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token !== undefined) {
      setTokenValue(decodeToken(token));
    }
  }, []);

  const context = {
    tokenValue: tokenValue,
    setTokenValue: setTokenValue,
  };

  return (
    <TokenContext.Provider value={context}>{children}</TokenContext.Provider>
  );
}
