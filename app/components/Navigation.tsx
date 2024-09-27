"use client";

import { usePathname } from "next/navigation";
import NavigationMenuItem from "./NavigationMenuItem";

const Navigation = () => {
  const pathname = usePathname();

  if (pathname !== "/")
    return (
      <ul className="flex h-full">
        <NavigationMenuItem item="Driver" />
        <NavigationMenuItem item="Truck" />
        <NavigationMenuItem item="Truck Load" />
      </ul>
    );

  return null;
};

export default Navigation;
