"use client";

import { usePathname } from "next/navigation";
import NavigationMenuItem from "./NavigationMenuItem";
import CustomJwtPayload from "../types/CustomJwtPayload";
import React from "react";

interface Props {
  decodedToken: CustomJwtPayload | null;
}

const Navigation = ({ decodedToken }: Props) => {
  const pathname = usePathname();

  if (pathname !== "/")
    return (
      <ul className="flex h-full">
        <NavigationMenuItem item="Home" options={[]} isLink={true} link="/" />
        {decodedToken?.role === "MANAGER" ? (
          <>
            <NavigationMenuItem
              item="Driver"
              options={["Add", "Edit", "Delete", "Find"]}
              isLink={false}
            />
            <NavigationMenuItem
              item="Truck"
              options={["Add", "Edit", "Delete", "Find"]}
              isLink={false}
            />
          </>
        ) : (
          <NavigationMenuItem
            item="Truck Load"
            options={["Add", "Edit", "Delete", "Find"]}
            isLink={false}
          />
        )}
      </ul>
    );

  return null;
};

export default Navigation;
