"use client";

const Navigation = () => {
  return (
    <ul className="flex h-full items-center">
      <li className="flex h-full cursor-pointer select-none items-center justify-center bg-[rgba(255,255,255,0.5)] px-10 backdrop-blur-md transition-all duration-300 hover:bg-[rgba(225,225,225,0.5)]">
        Item 1
      </li>
      <li className="flex h-full cursor-pointer select-none items-center justify-center bg-[rgba(255,255,255,0.5)] px-10 backdrop-blur-md transition-all duration-300 hover:bg-[rgba(225,225,225,0.5)]">
        Item 2
      </li>
      <li className="flex h-full cursor-pointer select-none items-center justify-center bg-[rgba(255,255,255,0.5)] px-10 backdrop-blur-md transition-all duration-300 hover:bg-[rgba(225,225,225,0.5)]">
        Item 3
      </li>
    </ul>
  );
};

export default Navigation;
