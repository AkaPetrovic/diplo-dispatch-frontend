import { cookies } from "next/headers";
import Navigation from "./Navigation";
import Profile from "./Profile";
import { decodeToken } from "./utility/auth";

const Header = () => {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;
  const decodedToken = decodeToken(token);

  return (
    <nav className="absolute z-10 flex h-20 w-full flex-row justify-between text-gray-950">
      <Navigation />
      <div className="h-full flex-grow bg-[rgba(255,255,255,0.5)] backdrop-blur-md"></div>
      <Profile decodedToken={decodedToken} />
    </nav>
  );
};

export default Header;
