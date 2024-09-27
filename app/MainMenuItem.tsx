"use client";

import Link from "next/link";

interface Props {
  action: String;
  link: String;
}

const MainMenuItem = ({ action, link }: Props) => {
  const handleMouseDown = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
  ) => {
    e.preventDefault(); // Prevents the focus from moving to the link, therefore keeps the parent list item focused and the inner menu stays open after clicking the link
  };

  return (
    <Link
      href={`${link}`}
      onMouseDown={handleMouseDown}
      className="block rounded-md px-2 py-1 transition-all duration-300 hover:bg-[rgba(0,0,0,0.1)]"
    >
      {action}
    </Link>
  );
};

export default MainMenuItem;
