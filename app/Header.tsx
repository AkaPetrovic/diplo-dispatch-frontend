import Navigation from "./Navigation";
import Profile from "./Profile";

const Header = () => {
  return (
    <nav className="absolute z-10 flex h-20 w-full flex-row justify-between text-gray-950">
      <Navigation />
      <div className="h-full flex-grow bg-[rgba(255,255,255,0.5)] backdrop-blur-md"></div>
      <Profile />
    </nav>
  );
};

export default Header;
